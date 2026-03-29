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

  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const { data: rows, error: locError } = await supabase.from('locations').select(
    `
        id,
        name,
        latitude,
        longitude,
        description,
        website,
        tags,
        image,
        address,
        phone,
        email,
        category,
        additional_info,
        last_checked
      `
  );

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
      categories ( name )
    `
    );

  if (linkError) {
    console.error('Failed to fetch location_categories from Supabase:', linkError.message);
    process.exit(1);
  }

  /** @type {Map<number, string[]>} */
  const categoriesByLocation = new Map();

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
      additionalInfo: row.additional_info ?? undefined,
      ...(updatedAt ? { updatedAt } : {}),
    });
  }

  const outputDir = path.resolve(__dirname, '..', 'public');
  const outputFile = path.join(outputDir, 'locations.json');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify({ locations }, null, 2), 'utf8');

  console.log(`Wrote ${locations.length} locations to ${outputFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
