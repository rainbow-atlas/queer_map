import React, { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { Sidebar } from './components/Sidebar';
import { ChevronLeft, X, Shield, Scale } from 'lucide-react';
import logo from './assets/logo.svg';

// Pride flag colors in a wave pattern
const QueerMapLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 7C2 7 4.5 5 7 5C9.5 5 11 7 13.5 7C16 7 18 5 18 5" stroke="#FF0018" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 10C2 10 4.5 8 7 8C9.5 8 11 10 13.5 10C16 10 18 8 18 8" stroke="#FFA52C" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 13C2 13 4.5 11 7 11C9.5 11 11 13 13.5 13C16 13 18 11 18 11" stroke="#FFFF41" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 16C2 16 4.5 14 7 14C9.5 14 11 16 13.5 16C16 16 18 14 18 14" stroke="#008018" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 19C2 19 4.5 17 7 17C9.5 17 11 19 13.5 19C16 19 18 17 18 17" stroke="#0000F9" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

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
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        <div className="flex-none flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {type === 'dsgvo' ? (
              <Shield className="w-6 h-6 text-blue-600" />
            ) : (
              <Scale className="w-6 h-6 text-blue-600" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="prose prose-sm max-w-none">
            {type === 'dsgvo' ? (
              <>
                <h3>Datenschutzerklärung</h3>
                <p>Stand: März 2024</p>
                
                <h4>1. Datenschutz auf einen Blick</h4>
                <p>
                  Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>

                <h4>2. Datenerfassung auf unserer Website</h4>
                <p>
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                </p>

                <h4>3. Ihre Rechte</h4>
                <p>
                  Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.
                </p>

                <h4>4. Analyse-Tools und Tools von Drittanbietern</h4>
                <p>
                  Beim Besuch unserer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit Cookies und mit sogenannten Analyseprogrammen.
                </p>

                <h4>5. Hosting</h4>
                <p>
                  Unser Hoster erhebt in sog. Logfiles folgende Daten, die Ihr Browser übermittelt:
                </p>
                <ul>
                  <li>IP-Adresse</li>
                  <li>Browsertyp und Browserversion</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                </ul>

                <h4>6. Datenschutzbeauftragter</h4>
                <p>
                  Wir haben für unser Unternehmen einen Datenschutzbeauftragten bestellt.
                </p>

                <h4>7. Datenverarbeitung in der EU</h4>
                <p>
                  Die Verarbeitung Ihrer personenbezogenen Daten erfolgt in der Regel in Deutschland und der Europäischen Union. Eine Datenübermittlung in Drittstaaten findet nur statt, soweit dies gesetzlich vorgeschrieben ist.
                </p>

                <h4>8. Verschlüsselung</h4>
                <p>
                  Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL-bzw. TLS-Verschlüsselung.
                </p>

                <h4>9. Cookies</h4>
                <p>
                  Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert.
                </p>

                <h4>10. Server-Log-Dateien</h4>
                <p>
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
                </p>
              </>
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
    </div>
  );
}

export default App;