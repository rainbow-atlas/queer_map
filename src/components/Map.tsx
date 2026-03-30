import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon, type Icon as LeafletIcon } from 'leaflet';
import { 
  X, Globe, Navigation, MapPin, Phone, Mail, 
  Map as MapIcon, Satellite, Locate, Plus, Minus, Settings,
  Building, Info, ExternalLink, Instagram, Facebook, Link as LinkIcon
} from 'lucide-react';
import logo from '../assets/logo.svg';
import { useI18n } from '../i18n/I18nContext';
import type { Locale } from '../i18n/translations';

// Create marker icons with different styles (encodeURIComponent so hsl() fills work reliably in data URLs)
const createMarkerIcon = (fillColor: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill="${fillColor}"
        stroke="#000000"
        stroke-width="0.5"
        stroke-linejoin="round"
      />
    </svg>`;
  return icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    /** From the pin tip (iconAnchor): vector to top-centre of the 32×32 image — centres the tooltip on the pin */
    tooltipAnchor: [0, -32],
  });
};

// Create a special marker for current location
const createCurrentLocationIcon = () => icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#4F46E5" fill-opacity="0.2" />
      <circle cx="12" cy="12" r="6" fill="#4F46E5" fill-opacity="0.4" />
      <circle cx="12" cy="12" r="3" fill="#4F46E5" />
    </svg>
  `)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: 'pulse-animation',
});

const currentLocationIcon = createCurrentLocationIcon();

/** Use globalThis.Map — a React component below is named `Map`, which shadows the built-in. */
const markerIconCache = new globalThis.Map<string, LeafletIcon>();
function getCachedMarkerIcon(fillColor: string): LeafletIcon {
  if (!markerIconCache.has(fillColor)) {
    markerIconCache.set(fillColor, createMarkerIcon(fillColor));
  }
  return markerIconCache.get(fillColor)!;
}

// Function to generate random pastel colors
const getRandomPastelGradient = () => {
  const hue1 = Math.floor(Math.random() * 360);
  const hue2 = (hue1 + 180) % 360; // Complementary color
  return `linear-gradient(135deg, 
    hsl(${hue1}, 100%, 92%) 0%, 
    hsl(${hue2}, 100%, 92%) 100%
  )`;
};

// Rainbow colors for tags - Much lighter pastels with black text
const rainbowColors = [
  { bg: '#FFF5F5', text: '#1A1A1A' }, // Super light red
  { bg: '#FFFAF0', text: '#1A1A1A' }, // Super light orange
  { bg: '#FEFFF0', text: '#1A1A1A' }, // Super light yellow
  { bg: '#F0FFF4', text: '#1A1A1A' }, // Super light green
  { bg: '#F0F7FF', text: '#1A1A1A' }, // Super light blue
  { bg: '#FAF5FF', text: '#1A1A1A' }, // Super light purple
];

// Component to handle map center and zoom updates
function MapUpdater({ 
  center, 
  zoom, 
  initialBounds, 
  centerTimestamp,
  sidebarCollapsed,
  skipInitialFitBounds,
}: { 
  center: [number, number]; 
  zoom: number;
  initialBounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  centerTimestamp: number;
  sidebarCollapsed: boolean;
  /** When true, use `center`/`zoom` instead of fitting all markers (e.g. ?location= deep link). */
  skipInitialFitBounds?: boolean;
}) {
  const map = useMap();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    if (isInitialLoad && initialBounds) {
      if (skipInitialFitBounds) {
        map.setView(center, zoom, { animate: false });
      } else {
        map.fitBounds([
          [initialBounds.minLat, initialBounds.minLng],
          [initialBounds.maxLat, initialBounds.maxLng]
        ], {
          padding: [20, 20],
          duration: 1
        });
      }
      setIsInitialLoad(false);
    } else if (centerTimestamp) {
      map.flyTo(center, zoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map, initialBounds, isInitialLoad, centerTimestamp, skipInitialFitBounds]);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize({ animate: true, pan: true });
      
      if (!isInitialLoad) {
        map.setView(center, zoom, { 
          animate: true,
          duration: 0.3,
          easeLinearity: 0.25
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [sidebarCollapsed, map, center, zoom, isInitialLoad]);

  return null;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: () => {
      onMapClick();
    },
  });
  return null;
}

// Custom map controls component
const MapControls: React.FC<{
  onLayerChange: (type: 'minimal' | 'satellite') => void;
  activeLayer: string;
  onLocate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  /** Hide +/- zoom buttons (embed URL: hideMapZoom=true). */
  hideMapZoom?: boolean;
  /** Hide settings gear, layer panel, and locate (embed URL: hideMapSettings=true). */
  hideMapSettings?: boolean;
}> = ({
  onLayerChange,
  activeLayer,
  onLocate,
  onZoomIn,
  onZoomOut,
  hideMapZoom = false,
  hideMapSettings = false,
}) => {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.1);

  const layers = {
    minimal: {
      name: t('mapLayerMinimalName'),
      icon: MapIcon,
      description: t('mapLayerMinimalDesc'),
    },
    satellite: {
      name: t('mapLayerSatelliteName'),
      icon: Satellite,
      description: t('mapLayerSatelliteDesc'),
    },
  };

  // Update CSS variable when opacity changes
  useEffect(() => {
    document.documentElement.style.setProperty('--overlay-opacity', overlayOpacity.toString());
  }, [overlayOpacity]);

  if (hideMapZoom && hideMapSettings) {
    return null;
  }

  const showDivider = !hideMapZoom && !hideMapSettings;

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      <div className="relative">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center gap-1">
              {!hideMapZoom && (
                <>
                  <button
                    onClick={onZoomOut}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    aria-label={t('mapZoomOut')}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onZoomIn}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    aria-label={t('mapZoomIn')}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </>
              )}
              {showDivider && <div className="w-px h-6 bg-gray-200 mx-1" />}
              {!hideMapSettings && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`
                  h-8 w-8 flex items-center justify-center rounded-lg
                  ${isExpanded 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  transition-colors
                `}
                  aria-pressed={isExpanded}
                  aria-expanded={isExpanded}
                  aria-label={t('mapSettings')}
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {!hideMapSettings && isExpanded && (
          <div 
            className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50"
          >
            {/* Layer Selector */}
            <div className="mb-4 border-b border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-2">{t('mapStyle')}</div>
              <div className="space-y-1">
                {Object.entries(layers).map(([key, layer]) => {
                  const Icon = layer.icon;
                  const isActive = activeLayer === key;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => onLayerChange(key as 'minimal' | 'satellite')}
                      className={`
                        w-full px-2 py-2 rounded-lg flex items-center gap-3 transition-all
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className={`
                        p-1.5 rounded-md
                        ${isActive ? 'bg-blue-100' : 'bg-gray-100'}
                      `}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{layer.name}</div>
                        <div className="text-xs text-gray-500">{layer.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Overlay Opacity Slider (only visible in satellite mode) */}
            {activeLayer === 'satellite' && (
              <div className="mb-4 border-b border-gray-200 pb-4">
                <div className="text-xs font-medium text-gray-500 mb-2">{t('mapOverlayBrightness')}</div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 w-8">
                    {Math.round(overlayOpacity * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Location Button */}
            <button
              onClick={onLocate}
              className="w-full px-4 py-2 flex items-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Locate className="w-4 h-4" />
              <span className="text-sm">{t('mapMyLocation')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface Location {
  id: number;
  name: string;
  position: [number, number];
  categories: string[];
  description?: string;
  website: string;
  image: string;
  tags?: string[];
  address?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  additionalWebLinks?: string | string[];
  additionalInfo?: string;
  /** ISO 8601 date or datetime — when this location’s data was last changed */
  updatedAt?: string;
}

const markdownLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const plainUrlPattern = /(https?:\/\/[^\s<]+)/g;

function renderTextWithLinks(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let nodeIndex = 0;
  const markdownMatches = Array.from(text.matchAll(markdownLinkPattern));

  const pushPlainTextWithUrls = (plainText: string) => {
    const lines = plainText.split('\n');
    lines.forEach((line, lineIndex) => {
      let lineLastIndex = 0;
      for (const match of line.matchAll(plainUrlPattern)) {
        const urlStart = match.index ?? 0;
        const url = match[0];
        if (urlStart > lineLastIndex) {
          nodes.push(line.slice(lineLastIndex, urlStart));
        }
        nodes.push(
          <a
            key={`url-${nodeIndex++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-800 underline break-words"
          >
            {url}
          </a>
        );
        lineLastIndex = urlStart + url.length;
      }

      if (lineLastIndex < line.length) {
        nodes.push(line.slice(lineLastIndex));
      }
      if (lineIndex < lines.length - 1) {
        nodes.push(<br key={`br-${nodeIndex++}`} />);
      }
    });
  };

  for (const match of markdownMatches) {
    const [fullMatch, label, url] = match;
    const start = match.index ?? 0;
    if (start > lastIndex) {
      pushPlainTextWithUrls(text.slice(lastIndex, start));
    }

    nodes.push(
      <a
        key={`md-${nodeIndex++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:text-blue-800 underline break-words"
      >
        {label}
      </a>
    );
    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < text.length) {
    pushPlainTextWithUrls(text.slice(lastIndex));
  }

  if (nodes.length === 0) {
    return [text];
  }
  return nodes;
}

function formatLocationUpdatedAt(iso: string, locale: Locale): string {
  const trimmed = iso.trim();
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-AT' : 'en-GB', {
    dateStyle: 'medium',
  }).format(d);
}

function normalizeExternalUrl(value?: string): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function parseAdditionalWebLinks(value?: string | string[]): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeExternalUrl(entry))
      .filter(Boolean);
  }
  if (typeof value !== 'string') return [];
  return value
    .split('\n')
    .map((entry) => normalizeExternalUrl(entry))
    .filter(Boolean);
}

function formatAddressForDisplay(address?: string): string {
  if (!address) return '';
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length <= 2) return parts.join(', ');
  const leading = parts.slice(0, -2);
  const cityCountry = parts.slice(-2).join(', ');
  return [...leading, cityCountry].join(',\n');
}

function formatPhoneDisplay(phone?: string): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('+')) return trimmed;
  return `+${trimmed}`;
}

interface MapProps {
  center: [number, number];
  zoom: number;
  markers?: Location[];
  initialBounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  centerTimestamp: number;
  sidebarCollapsed: boolean;
  skipInitialFitBounds?: boolean;
  /** Open this location’s detail once markers are available (embed deep link). */
  autoOpenLocationId?: number | null;
  /** With deep link: `modal` opens full-screen detail; `preview` only selects the pin (map tooltip). */
  autoOpenLocationDetail?: 'modal' | 'preview';
  /** Pin fill colour per category name (main category = `categories[0]`). */
  categoryPinColors: Record<string, string>;
  /** Sidebar selection: keep the small preview tooltip open until the map is clicked. */
  pinnedTooltipLocationId?: number | null;
  onPinnedTooltipDismiss?: () => void;
  /** Embed: hide +/- zoom buttons (`?hideMapZoom=true`). */
  hideMapZoom?: boolean;
  /** Embed: hide settings (layer, overlay, locate) (`?hideMapSettings=true`). */
  hideMapSettings?: boolean;
}

// Function to check if an image URL exists
const checkImageExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

const Map: React.FC<MapProps> = ({ 
  center, 
  zoom, 
  markers = [], 
  initialBounds, 
  centerTimestamp,
  sidebarCollapsed,
  skipInitialFitBounds,
  autoOpenLocationId,
  autoOpenLocationDetail = 'modal',
  categoryPinColors = {},
  pinnedTooltipLocationId = null,
  onPinnedTooltipDismiss,
  hideMapZoom = false,
  hideMapSettings = false,
}) => {
  const { t, locale } = useI18n();
  const [activeLayer, setActiveLayer] = useState<'minimal' | 'satellite'>('minimal');
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const [gradient, setGradient] = useState<string>('');
  const [imageValid, setImageValid] = useState<boolean>(true);
  const [map, setMap] = useState<L.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.1);

  const layers = {
    minimal: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }
  };

  const handleLocate = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const newLocation: [number, number] = [latitude, longitude];
        setCurrentLocation(newLocation);
        setMapCenter(newLocation);
        setMapZoom(15);
      }, (error) => {
        console.error('Error getting location:', error);
      });
    }
  };

  useLayoutEffect(() => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, [center, zoom]);

  useEffect(() => {
    if (selectedLocation) {
      setGradient(getRandomPastelGradient());
      checkImageExists(selectedLocation.image).then(valid => setImageValid(valid));
    }
  }, [selectedLocation]);

  const handleMarkerClick = (location: Location) => {
    setMapCenter(location.position);
    setMapZoom(16);
    setSelectedLocation(location);
    setHoveredMarkerId(location.id);
    onPinnedTooltipDismiss?.();
  };

  const didAutoOpenDeepLink = useRef(false);
  useEffect(() => {
    if (didAutoOpenDeepLink.current || autoOpenLocationId == null) return;
    const m = markers.find((x) => x.id === autoOpenLocationId);
    if (m) {
      didAutoOpenDeepLink.current = true;
      setMapCenter(m.position);
      setMapZoom(16);
      if (autoOpenLocationDetail === 'modal') {
        setSelectedLocation(m);
      } else {
        setSelectedLocation(null);
      }
      setHoveredMarkerId(m.id);
    }
  }, [markers, autoOpenLocationId, autoOpenLocationDetail]);

  const handleCloseModal = () => {
    setSelectedLocation(null);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMapClick = () => {
    setHoveredMarkerId(null);
    onPinnedTooltipDismiss?.();
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const pinColorForLocation = (loc: Location) => {
    const main = loc.categories?.[0] ?? 'Other';
    const colors = categoryPinColors ?? {};
    return colors[main] ?? 'hsl(220, 25%, 78%)';
  };

  const isTooltipOpen = (markerId: number) =>
    pinnedTooltipLocationId === markerId || hoveredMarkerId === markerId;

  const socialLinks = selectedLocation
    ? [
        { id: 'instagram', label: 'Instagram', href: normalizeExternalUrl(selectedLocation.instagram), Icon: Instagram },
        { id: 'facebook', label: 'Facebook', href: normalizeExternalUrl(selectedLocation.facebook), Icon: Facebook },
      ].filter((item) => item.href)
    : [];
  const additionalWebLinks = selectedLocation
    ? parseAdditionalWebLinks(selectedLocation.additionalWebLinks)
    : [];

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
          :root {
            --overlay-opacity: 0.1;
          }
          .map-overlay {
            position: absolute;
            inset: 0;
            background-color: rgba(255, 255, 255, var(--overlay-opacity));
            pointer-events: none;
            z-index: 401;
          }
        `}
      </style>
      <div className="relative w-full h-full">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          className="w-full h-full"
          zoomControl={false}
          ref={setMap}
        >
          {/* Use prop center/zoom so flyTo matches App state on the same render; internal mapCenter lags one effect behind props. */}
          <MapUpdater 
            center={center} 
            zoom={zoom} 
            initialBounds={initialBounds} 
            centerTimestamp={centerTimestamp}
            sidebarCollapsed={sidebarCollapsed}
            skipInitialFitBounds={skipInitialFitBounds}
          />
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* Satellite layer (behind) */}
          {activeLayer === 'satellite' && (
            <TileLayer 
              url={layers.satellite.url}
              attribution={layers.satellite.attribution}
              maxZoom={19}
              className="z-[400]"
            />
          )}

          {/* White overlay */}
          {activeLayer === 'satellite' && (
            <div className="map-overlay" />
          )}
          
          {/* Street layer (on top) */}
          <TileLayer 
            url={layers.minimal.url}
            attribution={layers.minimal.attribution}
            maxZoom={19}
            opacity={activeLayer === 'satellite' ? 0.7 : 1}
            className={activeLayer === 'minimal' ? '' : 'z-[402]'}
          />
          
          <MapControls 
            onLayerChange={setActiveLayer} 
            activeLayer={activeLayer}
            onLocate={handleLocate}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            hideMapZoom={hideMapZoom}
            hideMapSettings={hideMapSettings}
          />
          
          {currentLocation && (
            <Marker 
              position={currentLocation}
              icon={currentLocationIcon}
            >
              <Tooltip 
                permanent={true}
                direction="top" 
                offset={[0, -16]}
                className="custom-tooltip"
              >
                <div className="px-2 py-1 text-xs font-medium text-gray-700">
                  {t('mapYourLocation')}
                </div>
              </Tooltip>
            </Marker>
          )}

          {markers.map((marker) => (
            <Marker 
              key={marker.id} 
              position={marker.position}
              icon={getCachedMarkerIcon(pinColorForLocation(marker))}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(marker);
                },
                mouseover: () => setHoveredMarkerId(marker.id),
                mouseout: (e) => {
                  if (pinnedTooltipLocationId === marker.id) return;
                  if (
                    !(marker.position[0] === center[0] && 
                      marker.position[1] === center[1] && 
                      zoom > 14)
                  ) {
                    const tooltipEl = e.target.getTooltip()?.getElement();
                    if (tooltipEl && !tooltipEl.matches(':hover')) {
                      setHoveredMarkerId(null);
                    }
                  }
                }
              }}
            >
              {isTooltipOpen(marker.id) && (
                <Tooltip 
                  permanent={true}
                  direction="top" 
                  offset={[0, -36]}
                  className="custom-tooltip custom-tooltip--pin"
                  interactive={true}
                >
                  <div 
                    className="p-3 md:p-4 w-[min(240px,calc(100vw-2.5rem))] max-w-full min-w-0 cursor-pointer flex flex-col items-center text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkerClick(marker);
                    }}
                    onMouseLeave={() => {
                      if (pinnedTooltipLocationId === marker.id) return;
                      if (
                        !(marker.position[0] === center[0] && 
                          marker.position[1] === center[1] && 
                          zoom > 14)
                      ) {
                        setHoveredMarkerId(null);
                      }
                    }}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden mb-3 border border-gray-200">
                      <img 
                        src={marker.image} 
                        alt={marker.name}
                        className="w-full h-full object-contain p-0.5"
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.parentElement!.style.backgroundColor = '#f3f4f6';
                          img.src = logo;
                          img.onerror = null; // Prevent infinite error loop
                        }}
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 break-words">{marker.name}</h3>
                    {marker.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2 w-full min-w-0 break-words">{marker.description}</p>
                    )}
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{t('mapTooltipDetails')}</span>
                    </div>
                  </div>
                </Tooltip>
              )}
            </Marker>
          ))}
        </MapContainer>

        {selectedLocation && (
          <div 
            className="fixed inset-0 z-[1002] flex items-start md:items-center justify-center p-2 md:p-8"
            onClick={handleCloseModal}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <div 
              className="relative bg-white w-full max-w-full md:max-w-4xl max-h-[calc(100dvh-1rem)] md:max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="relative h-40 md:h-48 flex-none"
                style={{ background: gradient }}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseModal();
                  }}
                  className="absolute top-3 right-3 md:top-8 md:right-8 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors z-[1001] cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>

                <div className="absolute inset-0 flex items-center">
                  <div className="flex items-center gap-3 md:gap-6 px-4 md:px-8">
                    <div className="flex-shrink-0 w-16 h-16 md:w-28 md:h-28 rounded-xl shadow-lg overflow-hidden">
                      <img 
                        src={selectedLocation.image}
                        alt={selectedLocation.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.parentElement!.style.backgroundColor = '#f3f4f6';
                          img.src = logo;
                          img.onerror = null; // Prevent infinite error loop
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 break-words">
                        {selectedLocation.name}
                      </h2>
                      {selectedLocation.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {selectedLocation.categories.map((cat, idx) => (
                            <span
                              key={`${cat}-${idx}`}
                              className="inline-block px-2 py-0.5 text-xs rounded-md bg-white/80 text-gray-800 border border-gray-200/90 shadow-sm"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      {selectedLocation.description && (
                        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base line-clamp-2 md:line-clamp-none">{selectedLocation.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative flex-1 overflow-y-auto px-4 py-4 pb-6 md:px-8 md:py-8 md:pb-8">
                {selectedLocation.additionalInfo && (
                  <p className="text-gray-600 mb-6 md:mb-10 text-sm md:text-base">
                    {renderTextWithLinks(selectedLocation.additionalInfo)}
                  </p>
                )}

                {(socialLinks.length > 0 || additionalWebLinks.length > 0) && (
                  <div className={`${selectedLocation.additionalInfo ? 'mb-6 md:mb-10' : 'mb-6'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-2xl">
                    {socialLinks.map(({ id, label, href, Icon }) => (
                      <a
                        key={id}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-14 w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                      >
                        <Icon className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="font-semibold">{label}</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-auto text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                      </a>
                    ))}
                    {additionalWebLinks.map((href, index) => (
                      <a
                        key={`additional-link-${index}`}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-14 w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                      >
                        <LinkIcon className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="font-medium break-all">{href}</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-auto text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                      </a>
                    ))}
                    </div>
                  </div>
                )}

                <div className="space-y-5 md:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                    {(selectedLocation.phone || selectedLocation.email) && (
                      <div className="rounded-xl border border-gray-100 p-4 md:p-5 min-h-[144px]">
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                          <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase leading-none">{t('mapDetailContact')}</h3>
                        </div>
                        <div className="mt-3.5 pl-6 space-y-1">
                            {selectedLocation.phone && (
                              <a 
                                href={`tel:${selectedLocation.phone}`}
                                className="block text-gray-700 leading-relaxed hover:text-blue-700 underline-offset-2 hover:underline transition-colors break-words"
                              >
                                {formatPhoneDisplay(selectedLocation.phone)}
                              </a>
                            )}
                            {selectedLocation.email && (
                              <a 
                                href={`mailto:${selectedLocation.email}`}
                                className="block text-gray-700 leading-relaxed hover:text-blue-700 underline-offset-2 hover:underline transition-colors break-all"
                              >
                                {selectedLocation.email}
                              </a>
                            )}
                        </div>
                      </div>
                    )}

                    {selectedLocation.address && (
                      <div className="rounded-xl border border-gray-100 p-4 md:p-5 min-h-[144px]">
                        <div className="flex items-center gap-2.5">
                          <Building className="w-4 h-4 text-gray-400 shrink-0" />
                          <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase leading-none">{t('mapDetailAddress')}</h3>
                        </div>
                        <p className="mt-3.5 pl-6 text-gray-700 leading-relaxed whitespace-pre-line break-words">{formatAddressForDisplay(selectedLocation.address)}</p>
                        </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 md:mt-10">
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.tags?.map((tag, index) => {
                      const colorIndex = index % rainbowColors.length;
                      const { bg, text } = rainbowColors[colorIndex];
                      
                      return (
                        <span 
                          key={tag}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105"
                          style={{ 
                            backgroundColor: bg,
                            color: text
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 md:mt-8 pr-40 md:pr-56">
                  {(() => {
                    if (!selectedLocation.updatedAt) return null;
                    const formatted = formatLocationUpdatedAt(
                      selectedLocation.updatedAt,
                      locale
                    );
                    if (!formatted) return null;
                    return (
                      <p className="text-xs text-gray-500 text-left">
                        {t('mapDetailUpdatedAt')}: {formatted}
                      </p>
                    );
                  })()}
                </div>
              </div>

              <a
                href={selectedLocation.website}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-4 bottom-4 md:right-8 md:bottom-6 inline-flex items-center gap-2 px-4 py-2.5 text-blue-700 rounded-lg border border-blue-200 hover:border-blue-300 hover:text-blue-800 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{t('mapVisitWebsite')}</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Export only once
export { Map };