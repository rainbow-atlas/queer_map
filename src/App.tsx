import React, { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { Sidebar } from './components/Sidebar';
import { ChevronLeft, X, Shield, Scale, Cookie } from 'lucide-react';
import logo from './assets/logo.svg';

// Legal Modal Component
const LegalModal: React.FC<{
  title: string;
  onClose: () => void;
  type: 'dsgvo' | 'impressum';
}> = ({ title, onClose, type }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] animate-modal">
        <div className="flex-none flex items-center justify-between p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
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
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white/40 backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="prose prose-sm max-w-none">
            {type === 'dsgvo' ? (
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

                  <h2 id="schlusswort" class="adsimple-112955695">Schlusswort</h2>
                  <p>Herzlichen Glückwunsch! Wenn Sie diese Zeilen lesen, haben Sie sich wirklich durch unsere gesamte Datenschutzerklärung gekämpft. Wie Sie am Umfang unserer Datenschutzerklärung sehen, nehmen wir den Schutz Ihrer persönlichen Daten, alles andere als auf die leichte Schulter.</p>
                </div>
              ` }} />
            ) : (
              <>
                <h3>Impressum</h3>
                <p>Stand: März 2024</p>

                <h4>Angaben gemäß § 5 TMG</h4>
                <p>
                  Musterfirma GmbH<br />
                  Musterstraße 123<br />
                  12345 Musterstadt<br />
                  Deutschland
                </p>

                <h4>Kontakt</h4>
                <p>
                  Telefon: +49 (0) 123 456 789<br />
                  E-Mail: info@musterfirma.de
                </p>

                <h4>Vertreten durch</h4>
                <p>
                  Max Mustermann<br />
                  Geschäftsführer
                </p>

                <h4>Registereintrag</h4>
                <p>
                  Eintragung im Handelsregister.<br />
                  Registergericht: Amtsgericht Musterstadt<br />
                  Registernummer: HRB 12345
                </p>

                <h4>Umsatzsteuer-ID</h4>
                <p>
                  Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                  DE 123 456 789
                </p>

                <h4>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h4>
                <p>
                  Max Mustermann<br />
                  Musterstraße 123<br />
                  12345 Musterstadt
                </p>

                <h4>Streitschlichtung</h4>
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/.
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>

                <h4>Haftung für Inhalte</h4>
                <p>
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
                </p>

                <h4>Urheberrecht</h4>
                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
                </p>
              </>
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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Cookie className="w-5 h-5 text-pink-600" />
          <span className="font-medium">Cookie-Einstellungen</span>
        </div>
        <p className="text-sm text-gray-600 flex-grow">
          Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
          Weitere Informationen finden Sie in unserer{' '}
          <button 
            onClick={onOpenPrivacy}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            Datenschutzerklärung
          </button>.
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onReject}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Ablehnen
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
};

interface LocationData {
  [category: string]: Array<{
    id: number;
    name: string;
    position: [number, number];
    description?: string;
    website: string;
    tags?: string[];
    image: string;
    address?: string;
    phone?: string;
    email?: string;
    additionalInfo?: string;
  }>;
}

function App() {
  const [locationData, setLocationData] = useState<LocationData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

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

  // Fetch location data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwozMLiNs3aWHsGkfP7nlAE92a0HZ4WMKQqARIMoTAxUx8ad8YcLPUADaebjNqrJiBL/exec');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        setLocationData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Calculate initial map center and bounds
  const allLocations = Object.values(locationData).flat();
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [centerTimestamp, setCenterTimestamp] = useState(Date.now());
  const [legalModal, setLegalModal] = useState<'dsgvo' | 'impressum' | null>(null);

  const handleLocationSelect = (coordinates: [number, number]) => {
    setMapCenter(coordinates);
    setMapZoom(16);
    setCenterTimestamp(Date.now());
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      Object.values(locationData)
        .flat()
        .flatMap(location => location.tags || [])
    )
  ).sort();

  // Filter locations based on search term and selected tags (OR logic)
  const filteredLocations = Object.entries(locationData).reduce((acc, [category, locations]) => {
    const filtered = locations.filter(location => {
      const matchesSearch = searchTerm === '' || 
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        location.tags?.some(tag => selectedTags.includes(tag));

      return matchesSearch && matchesTags;
    });

    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as LocationData);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side Elements Container */}
      <div className="fixed left-6 top-6 bottom-6 z-[999] flex flex-col w-[340px]">
        {/* Logo */}
        <div className="flex-none bg-white/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center gap-5 p-4">
          <img src={logo} alt="Queer Map Logo" className="w-10 h-10" />
          <span className="text-xl font-semibold text-gray-900">queer_map</span>
        </div>

        {/* Floating Sidebar Container */}
        <div 
          className={`
            my-4 flex-1 min-h-0 transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-[340px] opacity-100'}
          `}
        >
          {/* Sidebar Background with Blur */}
          <div 
            className={`
              bg-white/90 backdrop-blur-sm rounded-lg shadow-lg
              h-full overflow-hidden
              transition-all duration-300
              ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}
            `}
          >
            {/* Sidebar Content */}
            <Sidebar 
              locationData={filteredLocations}
              onLocationSelect={handleLocationSelect}
              isCollapsed={isSidebarCollapsed}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              allTags={allTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          </div>
        </div>

        {/* Legal Links and Controls */}
        <div className="flex-none bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-2 space-y-2">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center gap-2 h-8 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <ChevronLeft 
                className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : 'rotate-0'}`}
              />
              <span className="text-sm">{isSidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}</span>
            </button>
            <div className="border-t border-gray-100" />
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLegalModal('dsgvo')}
                className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm">DSGVO</span>
              </button>
              <div className="w-px h-6 bg-gray-200" />
              <button
                onClick={() => setLegalModal('impressum')}
                className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <Scale className="w-4 h-4" />
                <span className="text-sm">Impressum</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <Map 
          center={mapCenter}
          zoom={mapZoom}
          markers={Object.values(filteredLocations).flat()}
          initialBounds={allLocations.length > 0 ? {
            minLat: initialBounds.minLat,
            maxLat: initialBounds.maxLat,
            minLng: initialBounds.minLng,
            maxLng: initialBounds.maxLng,
          } : undefined}
          centerTimestamp={centerTimestamp}
          sidebarCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* Legal Modals */}
      {legalModal === 'dsgvo' && (
        <LegalModal
          title="Datenschutzerklärung (DSGVO)"
          type="dsgvo"
          onClose={() => setLegalModal(null)}
        />
      )}
      {legalModal === 'impressum' && (
        <LegalModal
          title="Impressum"
          type="impressum"
          onClose={() => setLegalModal(null)}
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