import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  const legalTable = process.env.SUPABASE_LEGAL_TABLE || 'app_settings';

  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const { data: rows, error: locError } = await supabase.from('locations').select('*');

  if (locError) {
    console.error('Failed to fetch locations from Supabase:', locError.message);
    process.exit(1);
  }

  const { data: linkRows, error: linkError } = await supabase
    .from('location_categories')
    .select(
      `
      location_id,
      created_at,
      categories ( name, color )
    `
    );

  if (linkError) {
    console.error('Failed to fetch location_categories from Supabase:', linkError.message);
    process.exit(1);
  }

  // Optional legal/imprint content from DB (if table is exposed to the anon key)
  let impressumDe = '';
  let impressumEn = '';
  const { data: settingsRows, error: settingsError } = await supabase
    .from(legalTable)
    .select('*')
    .limit(200);
  if (settingsError) {
    console.warn(`Skipping legal import from "${legalTable}": ${settingsError.message}`);
  }
  if (!settingsError && Array.isArray(settingsRows)) {
    for (const row of settingsRows) {
      const obj = row && typeof row === 'object' ? row : {};
      const key =
        typeof obj.key === 'string'
          ? obj.key.trim().toLowerCase()
          : typeof obj.name === 'string'
            ? obj.name.trim().toLowerCase()
            : typeof obj.slug === 'string'
              ? obj.slug.trim().toLowerCase()
              : '';
      const value =
        typeof obj.value === 'string'
          ? obj.value
          : typeof obj.content === 'string'
            ? obj.content
            : typeof obj.text === 'string'
              ? obj.text
              : '';
      const locale =
        typeof obj.locale === 'string'
          ? obj.locale.trim().toLowerCase()
          : typeof obj.lang === 'string'
            ? obj.lang.trim().toLowerCase()
            : '';

      if (!impressumDe && typeof obj.impressum_de === 'string' && obj.impressum_de.trim()) {
        impressumDe = obj.impressum_de;
      }
      if (!impressumEn && typeof obj.impressum_en === 'string' && obj.impressum_en.trim()) {
        impressumEn = obj.impressum_en;
      }

      if (!value || !key) continue;

      const isImpressumKey =
        key.includes('impressum') || key.includes('imprint') || key === 'legal_imprint';
      if (!isImpressumKey) continue;

      if (!impressumDe && (key.endsWith('_de') || key.includes('.de') || locale === 'de')) {
        impressumDe = value;
      } else if (!impressumEn && (key.endsWith('_en') || key.includes('.en') || locale === 'en')) {
        impressumEn = value;
      } else if (!impressumDe) {
        impressumDe = value;
      }
    }
  }

  /** @type {Map<number, string[]>} */
  const categoriesByLocation = new Map();
  /** @type {Record<string, string>} */
  const categoryColors = {};

  const sortedLinks = [...(linkRows ?? [])].sort((a, b) => {
    if (a.location_id !== b.location_id) {
      return a.location_id - b.location_id;
    }
    const ta = new Date(a.created_at).getTime();
    const tb = new Date(b.created_at).getTime();
    return ta - tb;
  });

  for (const link of sortedLinks) {
    const rawName = link.categories?.name;
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (!name) continue;
    const rawColor = link.categories?.color;
    const color = typeof rawColor === 'string' ? rawColor.trim() : '';
    if (color) {
      categoryColors[name] = color;
    }
    const list = categoriesByLocation.get(link.location_id) ?? [];
    list.push(name);
    categoriesByLocation.set(link.location_id, list);
  }

  const locations = [];

  for (const row of rows) {
    const tags =
      Array.isArray(row.tags)
        ? row.tags
        : typeof row.tags === 'string' && row.tags.trim() !== ''
          ? row.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : undefined;

    let updatedAt;
    if (row.last_checked != null && String(row.last_checked).trim() !== '') {
      const d = new Date(row.last_checked);
      if (!Number.isNaN(d.getTime())) {
        updatedAt = d.toISOString();
      }
    }

    let categories = categoriesByLocation.get(row.id) ?? [];
    if (categories.length === 0) {
      const legacy = typeof row.category === 'string' ? row.category.trim() : '';
      categories = legacy ? [legacy] : ['Other'];
    }

    locations.push({
      id: row.id,
      name: row.name,
      position: [row.latitude, row.longitude],
      categories,
      description: row.description ?? undefined,
      website: row.website,
      tags,
      image: row.image,
      address: row.address ?? undefined,
      phone: row.phone ?? undefined,
      email: row.email ?? undefined,
      instagram: row.instagram ?? undefined,
      facebook: row.facebook ?? undefined,
      additionalWebLinks:
        row.additional_web_links ??
        row.additional_weblinks ??
        row.additional_links ??
        row.web_links ??
        undefined,
      additionalInfo: row.additional_info ?? undefined,
      ...(updatedAt ? { updatedAt } : {}),
    });
  }

  const outputDir = path.resolve(__dirname, '..', 'public');
  const outputFile = path.join(outputDir, 'locations.json');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    outputFile,
    JSON.stringify(
      {
        categories: categoryColors,
        legal:
          impressumDe || impressumEn
            ? {
                impressum: {
                  ...(impressumDe ? { de: impressumDe } : {}),
                  ...(impressumEn ? { en: impressumEn } : {}),
                },
              }
            : undefined,
        locations,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`Wrote ${locations.length} locations to ${outputFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
