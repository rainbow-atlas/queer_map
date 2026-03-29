export type Locale = 'de' | 'en';

export const STORAGE_KEY = 'queer-map-locale';

/** Shared keys — keep `de` and `en` in sync. */
export type MessageKey = keyof typeof messagesDe;

const messagesDe = {
  appTitle: 'queer_map',
  logoAlt: 'Queer Map Logo',
  loadingLocations: 'Orte werden geladen…',
  loadError: 'Fehler beim Laden der Orte',
  tryAgain: 'Erneut versuchen',
  openMenu: 'Menü öffnen',
  hideSidebar: 'Seitenleiste ausblenden',
  showSidebar: 'Seitenleiste einblenden',

  legalPrivacy: 'DSGVO',
  legalImprint: 'Impressum',
  legalPrivacyModalTitle: 'Datenschutzerklärung (DSGVO)',
  legalImprintModalTitle: 'Impressum',
  legalDsgvoNoteEn:
    'Der folgende Text der Datenschutzerklärung ist in deutscher Sprache abgebildet (rechtlich maßgeblich).',

  languageMenu: 'Sprache',
  languageDe: 'Deutsch',
  languageEn: 'English',

  cookieTitle: 'Cookie-Einstellungen',
  cookieBodyBefore: 'Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. Weitere Informationen finden Sie in unserer',
  cookiePrivacyLink: 'Datenschutzerklärung',
  cookieBodyAfter: '.',
  cookieReject: 'Ablehnen',
  cookieAccept: 'Akzeptieren',

  sidebarAllCategories: 'Alle Kategorien',
  sidebarSearchPlaceholder: 'Orte durchsuchen…',
  sidebarFilterAria: 'Filter ein- oder ausblenden',
  sidebarDisplaySettings: 'Anzeige',
  sidebarShowDescriptions: 'Beschreibungen anzeigen',
  sidebarShowTags: 'Tags anzeigen',
  sidebarFilterByTags: 'Nach Tags filtern',
  sidebarClearAll: 'Alle löschen',
  sidebarNoLocations: 'Keine Orte gefunden',
  sidebarClearFilters: 'Filter zurücksetzen',
  sidebarViewOnMap: 'Auf Karte zeigen',
  sidebarWebsite: 'Webseite',

  mapZoomIn: 'Hineinzoomen',
  mapZoomOut: 'Herauszoomen',
  mapSettings: 'Karteneinstellungen',
  mapStyle: 'Kartenstil',
  mapLayerMinimalName: 'Minimal',
  mapLayerMinimalDesc: 'Schlichte, reduzierte Karte',
  mapLayerSatelliteName: 'Satellit',
  mapLayerSatelliteDesc: 'Satellitenbild',
  mapOverlayBrightness: 'Overlay-Helligkeit',
  mapMyLocation: 'Mein Standort',
  mapYourLocation: 'Ihr Standort',
  mapTooltipDetails: 'Klicken für Details',
  mapDetailContact: 'Kontakt',
  mapDetailAddress: 'Adresse',
  mapDetailUpdatedAt: 'Zuletzt aktualisiert',
  mapVisitWebsite: 'Webseite besuchen',
} as const;

const messagesEn: Record<MessageKey, string> = {
  appTitle: 'queer_map',
  logoAlt: 'Queer Map Logo',
  loadingLocations: 'Loading places…',
  loadError: 'Failed to load places',
  tryAgain: 'Try again',
  openMenu: 'Open menu',
  hideSidebar: 'Hide sidebar',
  showSidebar: 'Show sidebar',

  legalPrivacy: 'Privacy',
  legalImprint: 'Imprint',
  legalPrivacyModalTitle: 'Privacy policy (GDPR)',
  legalImprintModalTitle: 'Imprint',
  legalDsgvoNoteEn:
    'The privacy policy below is shown in German (legally binding version).',

  languageMenu: 'Language',
  languageDe: 'Deutsch',
  languageEn: 'English',

  cookieTitle: 'Cookie settings',
  cookieBodyBefore: 'We use cookies to give you the best experience on our site. For more information, see our',
  cookiePrivacyLink: 'privacy policy',
  cookieBodyAfter: '.',
  cookieReject: 'Decline',
  cookieAccept: 'Accept',

  sidebarAllCategories: 'All categories',
  sidebarSearchPlaceholder: 'Search places…',
  sidebarFilterAria: 'Toggle filters',
  sidebarDisplaySettings: 'Display',
  sidebarShowDescriptions: 'Show descriptions',
  sidebarShowTags: 'Show tags',
  sidebarFilterByTags: 'Filter by tags',
  sidebarClearAll: 'Clear all',
  sidebarNoLocations: 'No places found',
  sidebarClearFilters: 'Clear all filters',
  sidebarViewOnMap: 'View on map',
  sidebarWebsite: 'Website',

  mapZoomIn: 'Zoom in',
  mapZoomOut: 'Zoom out',
  mapSettings: 'Map settings',
  mapStyle: 'Map style',
  mapLayerMinimalName: 'Minimal',
  mapLayerMinimalDesc: 'Clean, minimal map style',
  mapLayerSatelliteName: 'Satellite',
  mapLayerSatelliteDesc: 'Detailed satellite imagery',
  mapOverlayBrightness: 'Overlay brightness',
  mapMyLocation: 'My location',
  mapYourLocation: 'Your location',
  mapTooltipDetails: 'Click for details',
  mapDetailContact: 'Contact',
  mapDetailAddress: 'Address',
  mapDetailUpdatedAt: 'Last updated',
  mapVisitWebsite: 'Visit website',
};

/** Impressum — UI chrome only; placeholder company data (same in both locales, labels translated). */
export type ImpressumKey =
  | 'stand'
  | 'tmgHeading'
  | 'addressBlock'
  | 'contactHeading'
  | 'phoneLabel'
  | 'emailLabel'
  | 'representedHeading'
  | 'representedBody'
  | 'registerHeading'
  | 'registerBody'
  | 'vatHeading'
  | 'vatBody'
  | 'contentRespHeading'
  | 'contentRespBody'
  | 'disputeHeading'
  | 'disputeBodyBefore'
  | 'disputeBodyAfter'
  | 'liabilityHeading'
  | 'liabilityBody'
  | 'copyrightHeading'
  | 'copyrightBody';

const impressumDe: Record<ImpressumKey, string> = {
  stand: 'Stand: März 2024',
  tmgHeading: 'Angaben gemäß § 5 TMG',
  addressBlock:
    'Musterfirma GmbH\nMusterstraße 123\n12345 Musterstadt\nDeutschland',
  contactHeading: 'Kontakt',
  phoneLabel: 'Telefon',
  emailLabel: 'E-Mail',
  representedHeading: 'Vertreten durch',
  representedBody: 'Max Mustermann\nGeschäftsführer',
  registerHeading: 'Registereintrag',
  registerBody:
    'Eintragung im Handelsregister.\nRegistergericht: Amtsgericht Musterstadt\nRegisternummer: HRB 12345',
  vatHeading: 'Umsatzsteuer-ID',
  vatBody:
    'Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:\nDE 123 456 789',
  contentRespHeading: 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV',
  contentRespBody: 'Max Mustermann\nMusterstraße 123\n12345 Musterstadt',
  disputeHeading: 'Streitschlichtung',
  disputeBodyBefore:
    'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:',
  disputeBodyAfter: '. Unsere E-Mail-Adresse finden Sie oben im Impressum.',
  liabilityHeading: 'Haftung für Inhalte',
  liabilityBody:
    'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.',
  copyrightHeading: 'Urheberrecht',
  copyrightBody:
    'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.',
};

const impressumEn: Record<ImpressumKey, string> = {
  stand: 'As of: March 2024',
  tmgHeading: 'Information pursuant to § 5 TMG',
  addressBlock:
    'Musterfirma GmbH\nMusterstraße 123\n12345 Musterstadt\nGermany',
  contactHeading: 'Contact',
  phoneLabel: 'Phone',
  emailLabel: 'Email',
  representedHeading: 'Represented by',
  representedBody: 'Max Mustermann\nManaging Director',
  registerHeading: 'Register entry',
  registerBody:
    'Entry in the Commercial Register.\nRegister court: Amtsgericht Musterstadt\nRegistration number: HRB 12345',
  vatHeading: 'VAT ID',
  vatBody:
    'VAT identification number pursuant to §27 a of the German VAT Act:\nDE 123 456 789',
  contentRespHeading: 'Responsible for content under § 55 (2) RStV',
  contentRespBody: 'Max Mustermann\nMusterstraße 123\n12345 Musterstadt',
  disputeHeading: 'Dispute resolution',
  disputeBodyBefore:
    'The European Commission provides a platform for online dispute resolution (ODR):',
  disputeBodyAfter: '. You can find our email address in the imprint above.',
  liabilityHeading: 'Liability for content',
  liabilityBody:
    'As a service provider, we are responsible for our own content on these pages under general law pursuant to § 7 (1) TMG.',
  copyrightHeading: 'Copyright',
  copyrightBody:
    'Content and works created by the site operators on these pages are subject to German copyright law.',
};

export function impressumLine(locale: Locale, key: ImpressumKey): string {
  return locale === 'de' ? impressumDe[key] : impressumEn[key];
}

export function impressumLines(locale: Locale, key: ImpressumKey): string[] {
  return impressumLine(locale, key).split('\n');
}

export const messages: Record<Locale, Record<MessageKey, string>> = {
  de: messagesDe,
  en: messagesEn,
};
