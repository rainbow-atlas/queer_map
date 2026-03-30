import React, { useState, useEffect, useMemo } from 'react';
import { Map } from './components/Map';
import { Sidebar } from './components/Sidebar';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ChevronLeft, X, Shield, Scale, Cookie, Menu } from 'lucide-react';
import logo from './assets/logo.svg';
import { useI18n } from './i18n/I18nContext';
import { impressumLine } from './i18n/translations';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function buildFallbackImpressumMarkdown(locale: 'de' | 'en'): string {
  const line = (key: Parameters<typeof impressumLine>[1]) => impressumLine(locale, key);
  return [
    line('stand'),
    '',
    `## ${line('tmgHeading')}`,
    line('addressBlock'),
    '',
    `## ${line('contactHeading')}`,
    `${line('phoneLabel')}: +49 (0) 123 456 789`,
    `${line('emailLabel')}: info@musterfirma.de`,
    '',
    `## ${line('representedHeading')}`,
    line('representedBody'),
    '',
    `## ${line('registerHeading')}`,
    line('registerBody'),
    '',
    `## ${line('vatHeading')}`,
    line('vatBody'),
    '',
    `## ${line('contentRespHeading')}`,
    line('contentRespBody'),
    '',
    `## ${line('disputeHeading')}`,
    `${line('disputeBodyBefore')} [ec.europa.eu/consumers/odr](https://ec.europa.eu/consumers/odr)${line('disputeBodyAfter')}`,
    '',
    `## ${line('liabilityHeading')}`,
    line('liabilityBody'),
    '',
    `## ${line('copyrightHeading')}`,
    line('copyrightBody'),
  ].join('\n');
}

function normalizeImpressumToMarkdown(raw: string): string {
  const input = raw.trim();
  if (!input) return '';

  // If it already looks like markdown/plain text, keep it as-is.
  if (!/<[a-z][\s\S]*>/i.test(input)) {
    return input;
  }

  return input
    .replace(/\r\n/g, '\n')
    .replace(/<div>\s*(<br\s*\/?>)?\s*<\/div>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\s*(b|strong)\s*>([\s\S]*?)<\s*\/\s*(b|strong)\s*>/gi, '**$2**')
    .replace(/<\s*(i|em)\s*>([\s\S]*?)<\s*\/\s*(i|em)\s*>/gi, '*$2*')
    .replace(/<\s*div\s*>/gi, '')
    .replace(/<\s*\/\s*div\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Legal Modal Component
const LegalModal: React.FC<{
  onClose: () => void;
  type: 'dsgvo' | 'impressum';
  impressumContent?: string;
}> = ({ onClose, type, impressumContent }) => {
  const { t, locale } = useI18n();
  const title =
    type === 'dsgvo' ? t('legalPrivacyModalTitle') : t('legalImprintModalTitle');
  const fallbackImpressumMarkdown = buildFallbackImpressumMarkdown(locale);
  const resolvedImpressumMarkdown = normalizeImpressumToMarkdown(
    impressumContent || fallbackImpressumMarkdown
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-full md:max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-1rem)] md:h-[90vh] animate-modal">
        <div className="flex-none flex items-center justify-between px-4 py-3 md:p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {type === 'dsgvo' ? (
              <Shield className="w-6 h-6 text-pink-600" />
            ) : (
              <Scale className="w-6 h-6 text-pink-600" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white/40 backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="prose prose-sm max-w-none">
            {type === 'dsgvo' ? (
              <>
                {locale === 'en' && (
                  <div className="not-prose max-w-[65ch] mx-auto px-4 mb-4">
                    <p className="text-sm text-gray-600 border-l-4 border-pink-200 pl-3 py-1 leading-relaxed">
                      {t('legalDsgvoNoteEn')}
                    </p>
                  </div>
                )}
                <div className="prose prose-sm max-w-none overflow-y-auto px-4" dangerouslySetInnerHTML={{ __html: `
                <style>
                  .dsgvo-content { max-width: 65ch; margin: 0 auto; }
                  .dsgvo-content h1 { 
                    font-size: 2rem; 
                    font-weight: 700; 
                    margin-top: 2rem; 
                    margin-bottom: 1.5rem;
                    color: #111827;
                    letter-spacing: -0.025em;
                  }
                  .dsgvo-content h2 { 
                    font-size: 1.5rem; 
                    font-weight: 600; 
                    margin-top: 2rem; 
                    margin-bottom: 1rem;
                    color: #1f2937;
                    letter-spacing: -0.025em;
                  }
                  .dsgvo-content h3 { 
                    font-size: 1.25rem; 
                    font-weight: 600; 
                    margin-top: 1.5rem; 
                    margin-bottom: 0.75rem;
                    color: #374151;
                  }
                  .dsgvo-content p { 
                    margin-bottom: 1rem; 
                    line-height: 1.7; 
                    color: #4b5563;
                  }
                  .dsgvo-content ul { 
                    list-style-type: disc; 
                    padding-left: 1.5rem; 
                    margin-bottom: 1rem;
                    color: #4b5563;
                  }
                  .dsgvo-content ol { 
                    list-style-type: decimal; 
                    padding-left: 1.5rem; 
                    margin-bottom: 1rem;
                    color: #4b5563;
                  }
                  .dsgvo-content a { 
                    color: #ec4899; 
                    text-decoration: none;
                    transition: all 0.2s;
                    border-bottom: 1px solid transparent;
                  }
                  .dsgvo-content a:hover { 
                    color: #be185d;
                    border-bottom-color: currentColor;
                  }
                  .dsgvo-content table { 
                    width: 100%; 
                    margin: 1.5rem 0; 
                    border-collapse: collapse;
                    font-size: 0.875rem;
                  }
                  .dsgvo-content td { 
                    border: 1px solid #e5e7eb; 
                    padding: 0.75rem;
                    color: #4b5563;
                  }
                  .dsgvo-content img { 
                    max-width: 100%; 
                    height: auto; 
                    margin: 1.5rem 0;
                    border-radius: 0.5rem;
                  }
                  .dsgvo-content blockquote { 
                    border-left: 4px solid #ec4899; 
                    padding: 1rem 0 1rem 1.5rem;
                    margin: 1.5rem 0; 
                    font-style: italic;
                    color: #6b7280;
                    background-color: #fdf2f8;
                    border-radius: 0.5rem;
                  }
                  .dsgvo-content strong { 
                    font-weight: 600;
                    color: #111827;
                  }
                  .dsgvo-content .adsimple-112955695 { 
                    font-weight: inherit;
                  }
                  .dsgvo-content li + li {
                    margin-top: 0.5rem;
                  }
                  .dsgvo-content li {
                    line-height: 1.7;
                  }
                </style>
                <div class="dsgvo-content">
                  <h1 class="adsimple-112955695">Datenschutzerklärung</h1>
                  <h2>Inhaltsverzeichnis</h2>
                  <ul>
                    <li><a href="#einleitung-ueberblick">Einleitung und Überblick</a></li>
                    <li><a href="#anwendungsbereich">Anwendungsbereich</a></li>
                    <li><a href="#rechtsgrundlagen">Rechtsgrundlagen</a></li>
                    <li><a href="#speicherdauer">Speicherdauer</a></li>
                    <li><a href="#rechte-dsgvo">Rechte laut Datenschutz-Grundverordnung</a></li>
                    <li><a href="#cookies">Cookies</a></li>
                    <li><a href="#web-analytics-einleitung">Web Analytics Einleitung</a></li>
                    <li><a href="#erklaerung-verwendeter-begriffe">Erklärung verwendeter Begriffe</a></li>
                    <li><a href="#schlusswort">Schlusswort</a></li>
                  </ul>

                  <h2 id="einleitung-ueberblick" class="adsimple-112955695">Einleitung und Überblick</h2>
                  <p>Wir haben diese Datenschutzerklärung (Fassung 26.02.2025-112955695) verfasst, um Ihnen gemäß der Vorgaben der <a class="adsimple-112955695" href="https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&amp;from=DE&amp;tid=112955695#d1e2269-1-1" target="_blank" rel="noopener">Datenschutz-Grundverordnung (EU) 2016/679</a> und anwendbaren nationalen Gesetzen zu erklären, welche personenbezogenen Daten (kurz Daten) wir als Verantwortliche &#8211; und die von uns beauftragten Auftragsverarbeiter (z. B. Provider) &#8211; verarbeiten, zukünftig verarbeiten werden und welche rechtmäßigen Möglichkeiten Sie haben.</p>
                  
                  <h2 id="anwendungsbereich" class="adsimple-112955695">Anwendungsbereich</h2>
                  <p>Diese Datenschutzerklärung gilt für alle von uns im Unternehmen verarbeiteten personenbezogenen Daten und für alle personenbezogenen Daten, die von uns beauftragte Firmen (Auftragsverarbeiter) verarbeiten. Mit personenbezogenen Daten meinen wir Informationen im Sinne des Art. 4 Nr. 1 DSGVO wie zum Beispiel Name, E-Mail-Adresse und postalische Anschrift einer Person. Die Verarbeitung personenbezogener Daten sorgt dafür, dass wir unsere Dienstleistungen und Produkte anbieten und abrechnen können, sei es online oder offline. Der Anwendungsbereich dieser Datenschutzerklärung umfasst:</p>
                  <ul class="adsimple-112955695">
                    <li class="adsimple-112955695">alle Onlineauftritte (Websites, Onlineshops), die wir betreiben</li>
                    <li class="adsimple-112955695">Social Media Auftritte und E-Mail-Kommunikation</li>
                    <li class="adsimple-112955695">mobile Apps für Smartphones und andere Geräte</li>
                  </ul>

                  <h2 id="rechtsgrundlagen" class="adsimple-112955695">Rechtsgrundlagen</h2>
                  <p>In der folgenden Datenschutzerklärung geben wir Ihnen transparente Informationen zu den rechtlichen Grundsätzen und Vorschriften, also den Rechtsgrundlagen der Datenschutz-Grundverordnung, die uns ermöglichen, personenbezogene Daten zu verarbeiten.</p>
                  <p>Wir verarbeiten Ihre Daten nur, wenn mindestens eine der folgenden Bedingungen zutrifft:</p>
                  <ol>
                    <li class="adsimple-112955695"><strong class="adsimple-112955695">Einwilligung</strong> (Artikel 6 Absatz 1 lit. a DSGVO): Sie haben uns Ihre Einwilligung gegeben, Daten zu einem bestimmten Zweck zu verarbeiten. Ein Beispiel wäre die Speicherung Ihrer eingegebenen Daten eines Kontaktformulars.</li>
                    <li class="adsimple-112955695"><strong class="adsimple-112955695">Vertrag</strong> (Artikel 6 Absatz 1 lit. b DSGVO): Um einen Vertrag oder vorvertragliche Verpflichtungen mit Ihnen zu erfüllen, verarbeiten wir Ihre Daten. Wenn wir zum Beispiel einen Kaufvertrag mit Ihnen abschließen, benötigen wir vorab personenbezogene Informationen.</li>
                    <li class="adsimple-112955695"><strong class="adsimple-112955695">Rechtliche Verpflichtung</strong> (Artikel 6 Absatz 1 lit. c DSGVO): Wenn wir einer rechtlichen Verpflichtung unterliegen, verarbeiten wir Ihre Daten. Zum Beispiel sind wir gesetzlich verpflichtet Rechnungen für die Buchhaltung aufzuheben. Diese enthalten in der Regel personenbezogene Daten.</li>
                    <li class="adsimple-112955695"><strong class="adsimple-112955695">Berechtigte Interessen</strong> (Artikel 6 Absatz 1 lit. f DSGVO): Im Falle berechtigter Interessen, die Ihre Grundrechte nicht einschränken, behalten wir uns die Verarbeitung personenbezogener Daten vor. Wir müssen zum Beispiel gewisse Daten verarbeiten, um unsere Website sicher und wirtschaftlich effizient betreiben zu können. Diese Verarbeitung ist somit ein berechtigtes Interesse.</li>
                  </ol>

                  <h2 id="speicherdauer" class="adsimple-112955695">Speicherdauer</h2>
                  <p>Dass wir personenbezogene Daten nur so lange speichern, wie es für die Bereitstellung unserer Dienstleistungen und Produkte unbedingt notwendig ist, gilt als generelles Kriterium bei uns. Das bedeutet, dass wir personenbezogene Daten löschen, sobald der Grund für die Datenverarbeitung nicht mehr vorhanden ist. In einigen Fällen sind wir gesetzlich dazu verpflichtet, bestimmte Daten auch nach Wegfall des ursprüngliches Zwecks zu speichern, zum Beispiel zu Zwecken der Buchführung.</p>
                  <p>Sollten Sie die Löschung Ihrer Daten wünschen oder die Einwilligung zur Datenverarbeitung widerrufen, werden die Daten so rasch wie möglich und soweit keine Pflicht zur Speicherung besteht, gelöscht.</p>

                  <h2 id="rechte-dsgvo" class="adsimple-112955695">Rechte laut Datenschutz-Grundverordnung</h2>
                  <p>Gemäß Artikel 13, 14 DSGVO informieren wir Sie über die folgenden Rechte, die Ihnen zustehen, damit es zu einer fairen und transparenten Verarbeitung von Daten kommt:</p>
                  <ul class="adsimple-112955695">
                    <li class="adsimple-112955695">Sie haben laut Artikel 15 DSGVO ein Auskunftsrecht darüber, ob wir Daten von Ihnen verarbeiten. Sollte das zutreffen, haben Sie Recht darauf eine Kopie der Daten zu erhalten und die folgenden Informationen zu erfahren:
                      <ul class="adsimple-112955695">
                        <li class="adsimple-112955695">zu welchem Zweck wir die Verarbeitung durchführen;</li>
                        <li class="adsimple-112955695">die Kategorien, also die Arten von Daten, die verarbeitet werden;</li>
                        <li class="adsimple-112955695">wer diese Daten erhält und wenn die Daten an Drittländer übermittelt werden, wie die Sicherheit garantiert werden kann;</li>
                        <li class="adsimple-112955695">wie lange die Daten gespeichert werden;</li>
                        <li class="adsimple-112955695">das Bestehen des Rechts auf Berichtigung, Löschung oder Einschränkung der Verarbeitung und dem Widerspruchsrecht gegen die Verarbeitung;</li>
                        <li class="adsimple-112955695">dass Sie sich bei einer Aufsichtsbehörde beschweren können;</li>
                        <li class="adsimple-112955695">die Herkunft der Daten, wenn wir sie nicht bei Ihnen erhoben haben;</li>
                        <li class="adsimple-112955695">ob Profiling durchgeführt wird, ob also Daten automatisch ausgewertet werden, um zu einem persönlichen Profil von Ihnen zu gelangen.</li>
                      </ul>
                    </li>
                    <li class="adsimple-112955695">Sie haben laut Artikel 16 DSGVO ein Recht auf Berichtigung der Daten, was bedeutet, dass wir Daten richtig stellen müssen, falls Sie Fehler finden.</li>
                    <li class="adsimple-112955695">Sie haben laut Artikel 17 DSGVO das Recht auf Löschung („Recht auf Vergessenwerden"), was konkret bedeutet, dass Sie die Löschung Ihrer Daten verlangen dürfen.</li>
                    <li class="adsimple-112955695">Sie haben laut Artikel 18 DSGVO das Recht auf Einschränkung der Verarbeitung, was bedeutet, dass wir die Daten nur mehr speichern dürfen aber nicht weiter verwenden.</li>
                    <li class="adsimple-112955695">Sie haben laut Artikel 20 DSGVO das Recht auf Datenübertragbarkeit, was bedeutet, dass wir Ihnen auf Anfrage Ihre Daten in einem gängigen Format zur Verfügung stellen.</li>
                    <li class="adsimple-112955695">Sie haben laut Artikel 21 DSGVO ein Widerspruchsrecht, welches nach Durchsetzung eine Änderung der Verarbeitung mit sich bringt.</li>
                  </ul>

                  <h2 id="cookies" class="adsimple-112955695">Cookies</h2>
                  <p>Unsere Website verwendet HTTP-Cookies, um nutzerspezifische Daten zu speichern. Ein Cookie ist ein kurzes Datenpaket, welches zwischen Webbrowser und Webserver ausgetauscht wird, aber dabei vollkommen bedeutungslos für den Webserver ist und nur für die Webanwendung von Bedeutung ist, z. B. um sich zu merken, ob Sie angemeldet sind oder nicht.</p>
                  <p>Es gibt zwei Arten von Cookies:</p>
                  <ul class="adsimple-112955695">
                    <li class="adsimple-112955695">Erstanbieter-Cookies: werden von unserer Website erstellt</li>
                    <li class="adsimple-112955695">Drittanbieter-Cookies: werden von anderen Websites erstellt</li>
                  </ul>

                  <h2 id="web-analytics-einleitung" class="adsimple-112955695">Web Analytics</h2>
                  <p>Wir verwenden auf unserer Website Software zur Auswertung des Verhaltens der Website-Besucher, kurz Web Analytics oder Web-Analyse genannt. Dabei werden Daten gesammelt und analysiert, um unsere Website für Sie zu optimieren.</p>

                </div>
              ` }} />
              </>
            ) : (
              <div className="max-w-[65ch] mx-auto px-4 text-gray-700">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700 underline-offset-2 hover:underline break-all sm:break-normal"
                        />
                      ),
                    }}
                  >
                    {resolvedImpressumMarkdown}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Cookie Banner Component
const CookieBanner: React.FC<{
  onAccept: () => void;
  onReject: () => void;
  onOpenPrivacy: () => void;
}> = ({ onAccept, onReject, onOpenPrivacy }) => {
  const { t } = useI18n();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Cookie className="w-5 h-5 text-pink-600" />
          <span className="font-medium">{t('cookieTitle')}</span>
        </div>
        <p className="text-sm text-gray-600 flex-grow">
          {t('cookieBodyBefore')}{' '}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            {t('cookiePrivacyLink')}
          </button>
          {t('cookieBodyAfter')}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onReject}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {t('cookieReject')}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
          >
            {t('cookieAccept')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface AppLocation {
  id: number;
  name: string;
  position: [number, number];
  categories: string[];
  description?: string;
  website: string;
  tags?: string[];
  image: string;
  address?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  additionalWebLinks?: string | string[];
  additionalInfo?: string;
  updatedAt?: string;
}

interface LegalContent {
  impressum?: {
    de?: string;
    en?: string;
  };
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function normalizeCategoryNameAndColor(
  category: unknown
): { name: string; color?: string } | null {
  if (isNonEmptyString(category)) {
    return { name: category };
  }
  if (!category || typeof category !== 'object') {
    return null;
  }
  const c = category as Record<string, unknown>;
  const name = isNonEmptyString(c.name)
    ? c.name
    : isNonEmptyString(c.label)
      ? c.label
      : isNonEmptyString(c.title)
        ? c.title
        : null;
  if (!name) return null;
  const color = isNonEmptyString(c.color) ? c.color : undefined;
  return { name, color };
}

/** New format: `{ locations: [...], categories?: [...] }`. Legacy: `{ "Category": [ {...} ], ... }`. */
function normalizeLocationsJson(
  raw: unknown
): {
  locations: AppLocation[];
  categoryColors: Record<string, string>;
  legalContent: LegalContent;
} {
  if (!raw || typeof raw !== 'object') {
    return { locations: [], categoryColors: {}, legalContent: {} };
  }
  const categoryColors: Record<string, string> = {};
  const o = raw as Record<string, unknown>;
  const legalContent: LegalContent = {};
  const legal = o.legal as Record<string, unknown> | undefined;
  const legalImpressum =
    legal && typeof legal.impressum === 'object'
      ? (legal.impressum as Record<string, unknown>)
      : undefined;
  const topImpressum =
    o.impressum && typeof o.impressum === 'object'
      ? (o.impressum as Record<string, unknown>)
      : undefined;
  const impressumDe =
    (typeof legalImpressum?.de === 'string' ? legalImpressum.de : undefined) ??
    (typeof topImpressum?.de === 'string' ? topImpressum.de : undefined) ??
    (typeof o.impressumDe === 'string' ? o.impressumDe : undefined);
  const impressumEn =
    (typeof legalImpressum?.en === 'string' ? legalImpressum.en : undefined) ??
    (typeof topImpressum?.en === 'string' ? topImpressum.en : undefined) ??
    (typeof o.impressumEn === 'string' ? o.impressumEn : undefined);
  if (impressumDe || impressumEn) {
    legalContent.impressum = {
      ...(impressumDe ? { de: impressumDe } : {}),
      ...(impressumEn ? { en: impressumEn } : {}),
    };
  }
  const topCategories = o.categories;

  if (Array.isArray(topCategories)) {
    for (const cat of topCategories) {
      const parsed = normalizeCategoryNameAndColor(cat);
      if (parsed?.color) categoryColors[parsed.name] = parsed.color;
    }
  } else if (topCategories && typeof topCategories === 'object') {
    for (const [name, color] of Object.entries(topCategories as Record<string, unknown>)) {
      if (isNonEmptyString(name) && isNonEmptyString(color)) {
        categoryColors[name] = color;
      }
    }
  }

  if (Array.isArray(o.locations)) {
    const list = (o.locations as Record<string, unknown>[]).map((loc) => ({
      ...(loc as unknown as AppLocation),
      categories: (() => {
        if (!Array.isArray(loc.categories)) return ['Other'];
        const parsed = loc.categories
          .map((entry) => normalizeCategoryNameAndColor(entry))
          .filter((entry): entry is { name: string; color?: string } => entry !== null);
        for (const entry of parsed) {
          if (entry.color) categoryColors[entry.name] = entry.color;
        }
        return parsed.length > 0 ? parsed.map((entry) => entry.name) : ['Other'];
      })(),
      instagram: isNonEmptyString(loc.instagram) ? loc.instagram : undefined,
      facebook: isNonEmptyString(loc.facebook) ? loc.facebook : undefined,
      additionalWebLinks:
        isNonEmptyString(loc.additionalWebLinks)
          ? loc.additionalWebLinks
          : isNonEmptyString(loc.additional_web_links)
            ? loc.additional_web_links
            : Array.isArray(loc.additionalWebLinks)
              ? (loc.additionalWebLinks as string[])
              : Array.isArray(loc.additional_web_links)
                ? (loc.additional_web_links as string[])
                : undefined,
    }));
    return { locations: list, categoryColors, legalContent };
  }

  const locations: AppLocation[] = [];
  for (const [bucketKey, locs] of Object.entries(o)) {
    if (!Array.isArray(locs)) continue;
    for (const loc of locs) {
      if (!loc || typeof loc !== 'object') continue;
      const L = loc as Record<string, unknown>;
      const legacyCats = L.categories;
      const categories = Array.isArray(legacyCats)
        ? legacyCats
            .map((entry) => normalizeCategoryNameAndColor(entry))
            .filter((entry): entry is { name: string; color?: string } => entry !== null)
        : [{ name: bucketKey }];
      for (const entry of categories) {
        if (entry.color) categoryColors[entry.name] = entry.color;
      }
      locations.push({
        ...(L as unknown as AppLocation),
        categories: categories.length > 0 ? categories.map((entry) => entry.name) : [bucketKey],
        instagram: isNonEmptyString(L.instagram) ? L.instagram : undefined,
        facebook: isNonEmptyString(L.facebook) ? L.facebook : undefined,
        additionalWebLinks:
          isNonEmptyString(L.additionalWebLinks)
            ? L.additionalWebLinks
            : isNonEmptyString(L.additional_web_links)
              ? L.additional_web_links
              : Array.isArray(L.additionalWebLinks)
                ? (L.additionalWebLinks as string[])
                : Array.isArray(L.additional_web_links)
                  ? (L.additional_web_links as string[])
                  : undefined,
      });
    }
  }
  return { locations, categoryColors, legalContent };
}

/** Same rules as the sidebar list: category, tags (OR), and search text. */
function filterLocationsBySidebarFilters(
  list: AppLocation[],
  selectedCategory: string | null,
  selectedTags: string[],
  searchTerm: string
): AppLocation[] {
  const q = searchTerm.trim().toLowerCase();
  return list.filter((location) => {
    if (selectedCategory && !location.categories.includes(selectedCategory)) {
      return false;
    }
    const matchesSearch =
      q === '' ||
      location.name.toLowerCase().includes(q) ||
      location.description?.toLowerCase().includes(q) ||
      location.categories.some((c) => c.toLowerCase().includes(q));
    const matchesTags =
      selectedTags.length === 0 ||
      location.tags?.some((tag) => selectedTags.includes(tag));
    return matchesSearch && matchesTags;
  });
}

function fitMapBoundsToLocations(
  locs: AppLocation[],
  setMapCenter: (c: [number, number]) => void,
  setMapZoom: (z: number) => void,
  setCenterTimestamp: (t: number) => void
): void {
  if (locs.length === 0) return;
  if (locs.length === 1) {
    const [lat, lng] = locs[0].position;
    setMapCenter([lat, lng]);
    setMapZoom(15);
    setCenterTimestamp(Date.now());
    return;
  }
  const bounds = locs.reduce(
    (acc, location) => {
      const [lat, lng] = location.position;
      return {
        minLat: Math.min(acc.minLat, lat),
        maxLat: Math.max(acc.maxLat, lat),
        minLng: Math.min(acc.minLng, lng),
        maxLng: Math.max(acc.maxLng, lng),
      };
    },
    {
      minLat: Infinity,
      maxLat: -Infinity,
      minLng: Infinity,
      maxLng: -Infinity,
    }
  );
  const centerLat = (bounds.minLat + bounds.maxLat) / 2;
  const centerLng = (bounds.minLng + bounds.maxLng) / 2;
  const latDiff = bounds.maxLat - bounds.minLat;
  const lngDiff = bounds.maxLng - bounds.minLng;
  const maxDiff = Math.max(latDiff, lngDiff);
  const zoom = Math.min(15, Math.max(5, Math.floor(15.5 - Math.log2(maxDiff * 111))));
  setMapCenter([centerLat, centerLng]);
  setMapZoom(zoom);
  setCenterTimestamp(Date.now());
}

function App() {
  const { t, locale } = useI18n();
  const [locations, setLocations] = useState<AppLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hideLegal, setHideLegal] = useState(false);
  const [hideMapZoom, setHideMapZoom] = useState(false);
  const [hideMapSettings, setHideMapSettings] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [dbCategoryColors, setDbCategoryColors] = useState<Record<string, string>>({});
  const [dbLegalContent, setDbLegalContent] = useState<LegalContent>({});
  /** Set when URL contains ?location=&lt;id&gt; so the map skips fit-all and opens the pin. */
  const [deepLinkLocationId, setDeepLinkLocationId] = useState<number | null>(null);
  const [deepLinkLocationDetail, setDeepLinkLocationDetail] = useState<'modal' | 'preview'>('modal');
  /** True when load used ?category / ?tags (embed preview) so MapUpdater does not fit all pins over the filtered view. */
  const [urlHadFilterParams, setUrlHadFilterParams] = useState(false);

  // Check if in iframe
  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      // If we can't access window.top due to security restrictions, we're in an iframe
      setIsInIframe(true);
    }
  }, []);

  // Handle category change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    if (!isInitialLoad) {
      updateUrl(category, selectedTags, isFullscreen, hideLegal);
    }

    const visible = filterLocationsBySidebarFilters(
      locations,
      category,
      selectedTags,
      searchTerm
    );
    fitMapBoundsToLocations(visible, setMapCenter, setMapZoom, setCenterTimestamp);
  };

  // Handle tags change
  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    if (!isInitialLoad) {
      updateUrl(selectedCategory, tags, isFullscreen, hideLegal);
    }
    const visible = filterLocationsBySidebarFilters(
      locations,
      selectedCategory,
      tags,
      searchTerm
    );
    fitMapBoundsToLocations(visible, setMapCenter, setMapZoom, setCenterTimestamp);
  };

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    if (!isInitialLoad) {
      updateUrl(selectedCategory, selectedTags, newFullscreenState, hideLegal);
    }
  };

  // Handle legal visibility toggle
  const handleLegalVisibilityToggle = () => {
    const newHideLegalState = !hideLegal;
    setHideLegal(newHideLegalState);
    if (!isInitialLoad) {
      updateUrl(selectedCategory, selectedTags, isFullscreen, newHideLegalState);
    }
  };

  // Update URL function
  const updateUrl = (category: string | null, tags: string[], fullscreen: boolean, hideLegal: boolean) => {
    const params = new URLSearchParams(window.location.search);
    params.delete('location');
    params.delete('locationDetail');

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    if (tags.length > 0) {
      params.set('tags', tags.join(','));
    } else {
      params.delete('tags');
    }

    if (fullscreen) {
      params.set('fullscreen', 'true');
    } else {
      params.delete('fullscreen');
    }

    if (hideLegal) {
      params.set('hideLegal', 'true');
    } else {
      params.delete('hideLegal');
    }
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Load prebuilt static location data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Use Vite base URL so it works both locally and on GitHub Pages
        const base = (import.meta as any).env.BASE_URL || '/';
        const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
        const url = `${normalizedBase}/locations.json`;

        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error('Failed to load locations.json');
        }
        const raw = await response.json();
        const { locations: next, categoryColors, legalContent } = normalizeLocationsJson(raw);
        setLocations(next);
        setDbCategoryColors(categoryColors);
        setDbLegalContent(legalContent);

        // After data is loaded, set the category from URL if it exists
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        const tagsRaw = params.get('tags')?.split(',') || [];
        const tags = tagsRaw.map((t) => t.trim()).filter(Boolean);
        const fullscreen = params.get('fullscreen') === 'true';
        const hideLegal = params.get('hideLegal') === 'true';
        const hideMapZoomParam = params.get('hideMapZoom') === 'true';
        const hideMapSettingsParam = params.get('hideMapSettings') === 'true';

        const names = new Set<string>();
        for (const loc of next) {
          for (const c of loc.categories ?? []) names.add(c);
        }

        const locationParam = params.get('location');
        let deepLinked: AppLocation | null = null;
        if (locationParam) {
          const idNum = parseInt(locationParam, 10);
          if (Number.isFinite(idNum)) {
            deepLinked = next.find((l) => l.id === idNum) ?? null;
          }
        }

        if (deepLinked) {
          const cat = deepLinked.categories[0];
          if (cat) setSelectedCategory(cat);
          setMapCenter(deepLinked.position);
          setMapZoom(16);
          setCenterTimestamp(Date.now());
          setDeepLinkLocationId(deepLinked.id);
          setDeepLinkLocationDetail(params.get('locationDetail') === 'preview' ? 'preview' : 'modal');
          if (tags.length > 0) {
            const tagMatch = deepLinked.tags?.some((t) => tags.includes(t));
            setSelectedTags(tagMatch ? tags : []);
          }
        } else {
          const urlCategory = category && names.has(category) ? category : null;
          if (urlCategory) {
            setSelectedCategory(urlCategory);
          }
          if (tags.length > 0) {
            setSelectedTags(tags);
          }
          const hadUrlFilters = Boolean(urlCategory) || tags.length > 0;
          if (hadUrlFilters) {
            const visible = filterLocationsBySidebarFilters(next, urlCategory, tags, '');
            if (visible.length > 0) {
              setUrlHadFilterParams(true);
              fitMapBoundsToLocations(visible, setMapCenter, setMapZoom, setCenterTimestamp);
            }
          }
        }
        // Only set fullscreen if explicitly requested in URL params
        setIsFullscreen(fullscreen);
        setHideLegal(hideLegal);
        setHideMapZoom(hideMapZoomParam);
        setHideMapSettings(hideMapSettingsParam);

        setLoading(false);
        setIsInitialLoad(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'GENERIC_LOAD');
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchLocations();
  }, []);

  const allCategories = useMemo(() => {
    const s = new Set<string>();
    for (const loc of locations) {
      for (const c of loc.categories ?? []) {
        s.add(c);
      }
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [locations]);

  const categoryPinColors = useMemo(() => {
    const n = Math.max(allCategories.length, 1);
    return allCategories.reduce((acc, category, index) => {
      const dbColor = dbCategoryColors[category];
      if (isNonEmptyString(dbColor)) {
        acc[category] = dbColor;
        return acc;
      }
      const hue = (index / n) * 360;
      acc[category] = `hsl(${hue}, 38%, 72%)`;
      return acc;
    }, {} as Record<string, string>);
  }, [allCategories, dbCategoryColors]);

  // Calculate initial map center and bounds
  const allLocations = locations;
  const initialBounds = allLocations.reduce(
    (bounds, location) => {
      const [lat, lng] = location.position;
      return {
        minLat: Math.min(bounds.minLat, lat),
        maxLat: Math.max(bounds.maxLat, lat),
        minLng: Math.min(bounds.minLng, lng),
        maxLng: Math.max(bounds.maxLng, lng),
      };
    },
    {
      minLat: Infinity,
      maxLat: -Infinity,
      minLng: Infinity,
      maxLng: -Infinity,
    }
  );

  // Calculate center point
  const initialCenter: [number, number] = allLocations.length > 0 
    ? [
        (initialBounds.minLat + initialBounds.maxLat) / 2,
        (initialBounds.minLng + initialBounds.maxLng) / 2,
      ]
    : [51.5074, -0.1278]; // Default to London center if no locations

  // Calculate initial zoom
  const latDiff = initialBounds.maxLat - initialBounds.minLat;
  const lngDiff = initialBounds.maxLng - initialBounds.minLng;
  const maxDiff = Math.max(latDiff, lngDiff);
  const initialZoom = allLocations.length > 0
    ? Math.floor(15.5 - Math.log2(maxDiff * 111))
    : 13; // Default zoom if no locations

  const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter);
  const [mapZoom, setMapZoom] = useState(initialZoom);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [centerTimestamp, setCenterTimestamp] = useState(Date.now());
  const [legalModal, setLegalModal] = useState<'dsgvo' | 'impressum' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<AppLocation | null>(null);
  const [sidebarPinnedTooltipId, setSidebarPinnedTooltipId] = useState<number | null>(null);

  const handleLocationSelect = (loc: AppLocation) => {
    setMapCenter(loc.position);
    setMapZoom(16);
    setCenterTimestamp(Date.now());
    setSidebarPinnedTooltipId(loc.id);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const allTags = useMemo(
    () =>
      Array.from(
        new Set(locations.flatMap((location) => location.tags || []))
      ).sort(),
    [locations]
  );

  const filteredLocations = useMemo(() => {
    return filterLocationsBySidebarFilters(
      locations,
      selectedCategory,
      selectedTags,
      searchTerm
    ).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [locations, selectedCategory, searchTerm, selectedTags]);

  useEffect(() => {
    if (selectedCategory && !allCategories.includes(selectedCategory)) {
      setSelectedCategory(null);
    }
  }, [selectedCategory, allCategories]);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when location is selected
  const handleMobileLocationSelect = (loc: AppLocation) => {
    handleLocationSelect(loc);
    setIsMobileMenuOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
  };

  // Check cookie consent on mount
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowCookieBanner(false);
    // Here you would initialize your analytics and other cookie-dependent features
  };

  const handleCookieReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowCookieBanner(false);
    // Here you would ensure no optional cookies are set
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingLocations')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error === 'GENERIC_LOAD' ? t('loadError') : error}</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  const dbImpressum =
    (locale === 'de'
      ? dbLegalContent.impressum?.de || dbLegalContent.impressum?.en
      : dbLegalContent.impressum?.en || dbLegalContent.impressum?.de) || undefined;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Header */}
      {!isMobileView && (
        <div className="fixed top-6 left-6 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center gap-5 p-4 w-[340px]">
          <img src={logo} alt={t('logoAlt')} className="w-10 h-10" />
          <span className="text-xl font-semibold text-gray-900">{t('appTitle')}</span>
          {/* Debugging indicator - only show when a special parameter is present */}
          {new URLSearchParams(window.location.search).get('debug') === 'true' && (
            <div className="text-xs text-gray-600 ml-2">
              {isInIframe ? 'In iframe' : 'Not in iframe'} | 
              {isFullscreen ? 'Fullscreen' : 'With sidebar'}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Button + Floating Logo */}
      {isMobileView && !isFullscreen && (
        <>
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label={t('openMenu')}
          >
            <Menu className="w-5 h-5 text-gray-800" />
          </button>
          <div className="floating-logo">
            <img src={logo} alt={t('logoAlt')} className="w-6 h-6" />
            <span className="text-sm font-semibold text-gray-900">{t('appTitle')}</span>
            {new URLSearchParams(window.location.search).get('debug') === 'true' && (
              <span className="text-[10px] text-gray-500">
                {isInIframe ? 'In iframe' : 'Not in iframe'} | 
                {isFullscreen ? 'Fullscreen' : 'With sidebar'}
              </span>
            )}
          </div>
        </>
      )}

      {/* Legal Links - Only show when not hidden and in fullscreen mode */}
      {!hideLegal && isFullscreen && (
        <div className="fixed bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-visible">
          <div className="p-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLegalModal('dsgvo')}
                className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors min-w-0"
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span className="text-sm truncate">{t('legalPrivacy')}</span>
              </button>
              <div className="w-px h-6 bg-gray-200 shrink-0" />
              <button
                type="button"
                onClick={() => setLegalModal('impressum')}
                className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors min-w-0"
              >
                <Scale className="w-4 h-4 shrink-0" />
                <span className="text-sm truncate">{t('legalImprint')}</span>
              </button>
              <div className="w-px h-6 bg-gray-200 shrink-0" />
              <div className="flex-1 min-w-[4.5rem] max-w-[6rem]">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Side Elements Container - Only show when not in fullscreen */}
      {!isFullscreen && (
        <div className={`
          ${isMobileView 
            ? `mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`
            : 'fixed left-6 top-24 bottom-6 z-[999] flex flex-col'
          } w-[340px]
        `}>
          {isMobileView ? (
            <div className="mobile-sidebar-content">
              {/* Mobile Header */}
              <div className="mobile-sidebar-header">
                <div className="flex items-center gap-3">
                  <img src={logo} alt={t('logoAlt')} className="w-10 h-10" />
                  <span className="text-xl font-semibold text-gray-900">{t('appTitle')}</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-hidden">
                <Sidebar 
                  locations={filteredLocations}
                  allCategories={allCategories}
                  onLocationSelect={handleMobileLocationSelect}
                  isCollapsed={isSidebarCollapsed}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  allTags={allTags}
                  selectedTags={selectedTags}
                  onTagsChange={handleTagsChange}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  categoryColors={categoryPinColors}
                />
              </div>

              {/* Legal Links - Only show when not hidden */}
              {!hideLegal && (
                <div className="flex-none bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-visible mt-4">
                  <div className="p-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setLegalModal('dsgvo')}
                        className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors min-w-0"
                      >
                        <Shield className="w-4 h-4 shrink-0" />
                        <span className="text-sm truncate">{t('legalPrivacy')}</span>
                      </button>
                      <div className="w-px h-6 bg-gray-200 shrink-0" />
                      <button
                        type="button"
                        onClick={() => setLegalModal('impressum')}
                        className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors min-w-0"
                      >
                        <Scale className="w-4 h-4 shrink-0" />
                        <span className="text-sm truncate">{t('legalImprint')}</span>
                      </button>
                      <div className="w-px h-6 bg-gray-200 shrink-0" />
                      <div className="flex-1 min-w-[4.5rem] max-w-[6rem]">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Layout */}
              <div className={`
                my-4 flex-1 min-h-0 transition-all duration-300 ease-in-out
                ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-[340px] opacity-100'}
              `}>
                <div className={`
                  bg-white/90 backdrop-blur-sm rounded-lg shadow-lg
                  h-full overflow-hidden transition-all duration-300
                  ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}
                `}>
                  <Sidebar 
                    locations={filteredLocations}
                    allCategories={allCategories}
                    onLocationSelect={handleLocationSelect}
                    isCollapsed={isSidebarCollapsed}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    allTags={allTags}
                    selectedTags={selectedTags}
                    onTagsChange={handleTagsChange}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    categoryColors={categoryPinColors}
                  />
                </div>
              </div>

              {/* Legal Links - Only show when not hidden */}
              {!hideLegal && (
                <div className="flex-none bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-visible">
                  <div className="p-2 space-y-2">
                    <button
                      type="button"
                      onClick={toggleSidebar}
                      className="w-full flex items-center justify-center gap-2 h-8 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <ChevronLeft 
                        className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : 'rotate-0'}`}
                      />
                      <span className="text-sm">
                        {isSidebarCollapsed ? t('showSidebar') : t('hideSidebar')}
                      </span>
                    </button>
                    <div className="border-t border-gray-100" />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setLegalModal('dsgvo')}
                        className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors min-w-0"
                      >
                        <Shield className="w-4 h-4 shrink-0" />
                        <span className="text-sm truncate">{t('legalPrivacy')}</span>
                      </button>
                      <div className="w-px h-6 bg-gray-200 shrink-0" />
                      <button
                        type="button"
                        onClick={() => setLegalModal('impressum')}
                        className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors min-w-0"
                      >
                        <Scale className="w-4 h-4 shrink-0" />
                        <span className="text-sm truncate">{t('legalImprint')}</span>
                      </button>
                      <div className="w-px h-6 bg-gray-200 shrink-0" />
                      <div className="flex-1 min-w-[4.5rem] max-w-[6rem]">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Main Map Area */}
      <div className={`flex-1 relative ${isFullscreen ? 'w-full' : ''}`}>
        <Map 
          center={mapCenter}
          zoom={mapZoom}
          markers={filteredLocations}
          initialBounds={allLocations.length > 0 ? {
            minLat: initialBounds.minLat,
            maxLat: initialBounds.maxLat,
            minLng: initialBounds.minLng,
            maxLng: initialBounds.maxLng,
          } : undefined}
          centerTimestamp={centerTimestamp}
          sidebarCollapsed={!isMobileView && isSidebarCollapsed}
          skipInitialFitBounds={deepLinkLocationId != null || urlHadFilterParams}
          autoOpenLocationId={deepLinkLocationId}
          autoOpenLocationDetail={deepLinkLocationId != null ? deepLinkLocationDetail : 'modal'}
          categoryPinColors={categoryPinColors}
          pinnedTooltipLocationId={sidebarPinnedTooltipId}
          onPinnedTooltipDismiss={() => setSidebarPinnedTooltipId(null)}
          hideMapZoom={hideMapZoom}
          hideMapSettings={hideMapSettings}
        />
      </div>

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div 
          className="fixed inset-0 z-[1003] flex items-center justify-center p-8"
          onClick={handleCloseModal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div 
            className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Location Detail Content */}
          </div>
        </div>
      )}

      {/* Legal Modals */}
      {legalModal === 'dsgvo' && (
        <LegalModal type="dsgvo" onClose={() => setLegalModal(null)} />
      )}
      {legalModal === 'impressum' && (
        <LegalModal
          type="impressum"
          onClose={() => setLegalModal(null)}
          impressumContent={dbImpressum}
        />
      )}

      {/* Cookie Banner */}
      {showCookieBanner && (
        <CookieBanner
          onAccept={handleCookieAccept}
          onReject={handleCookieReject}
          onOpenPrivacy={() => setLegalModal('dsgvo')}
        />
      )}
    </div>
  );
}

export default App;