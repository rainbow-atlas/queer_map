import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import { 
  X, Globe, Navigation, Clock, MapPin, Phone, Mail, 
  Map as MapIcon, Satellite, Locate, Plus, Minus, Settings,
  Building, Info, ExternalLink
} from 'lucide-react';

// Create marker icons with different styles
const createMarkerIcon = (color: string) => icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}"/>
    </svg>
  `)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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

const defaultIcon = createMarkerIcon('#000000');
const satelliteIcon = createMarkerIcon('#ffd1dc');
const currentLocationIcon = createCurrentLocationIcon();

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
  sidebarCollapsed 
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
}) {
  const map = useMap();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    if (isInitialLoad && initialBounds) {
      map.fitBounds([
        [initialBounds.minLat, initialBounds.minLng],
        [initialBounds.maxLat, initialBounds.maxLng]
      ], {
        padding: [20, 20],
        duration: 1
      });
      setIsInitialLoad(false);
    } else if (centerTimestamp) {
      map.flyTo(center, zoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map, initialBounds, isInitialLoad, centerTimestamp]);

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
}> = ({ onLayerChange, activeLayer, onLocate, onZoomIn, onZoomOut }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const layers = {
    minimal: {
      name: 'Minimal',
      icon: MapIcon,
      description: 'Clean, minimal style map'
    },
    satellite: {
      name: 'Satellite',
      icon: Satellite,
      description: 'Detailed satellite imagery'
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      <div className="relative">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center gap-1">
              <button
                onClick={onZoomOut}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                aria-label="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={onZoomIn}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                aria-label="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1" />
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
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {isExpanded && (
          <div 
            className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50"
          >
            {/* Layer Selector */}
            <div className="mb-4 border-b border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-2">Map Style</div>
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

            {/* Location Button */}
            <button
              onClick={onLocate}
              className="w-full px-4 py-2 flex items-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Locate className="w-4 h-4" />
              <span className="text-sm">My Location</span>
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
  description?: string;
  website: string;
  image: string;
  tags?: string[];
  address?: string;
  phone?: string;
  email?: string;
  additionalInfo?: string;
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
  sidebarCollapsed
}) => {
  const [activeLayer, setActiveLayer] = useState<'minimal' | 'satellite'>('minimal');
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const [gradient, setGradient] = useState<string>('');
  const [imageValid, setImageValid] = useState<boolean>(true);
  const [map, setMap] = useState<L.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

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

  useEffect(() => {
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
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMapClick = () => {
    setHoveredMarkerId(null);
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

  const getMarkerIcon = () => {
    return activeLayer === 'satellite' ? satelliteIcon : defaultIcon;
  };

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
        `}
      </style>
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        className="w-full h-full"
        zoomControl={false}
        ref={setMap}
      >
        <MapUpdater 
          center={mapCenter} 
          zoom={mapZoom} 
          initialBounds={initialBounds} 
          centerTimestamp={centerTimestamp}
          sidebarCollapsed={sidebarCollapsed}
        />
        <MapClickHandler onMapClick={handleMapClick} />
        <TileLayer 
          url={layers[activeLayer].url}
          attribution={layers[activeLayer].attribution}
          maxZoom={19}
        />
        <MapControls 
          onLayerChange={setActiveLayer} 
          activeLayer={activeLayer}
          onLocate={handleLocate}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
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
                Your Location
              </div>
            </Tooltip>
          </Marker>
        )}

        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={marker.position}
            icon={getMarkerIcon()}
            eventHandlers={{
              click: (e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(marker);
              },
              mouseover: () => setHoveredMarkerId(marker.id),
              mouseout: (e) => {
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
            {hoveredMarkerId === marker.id && (
              <Tooltip 
                permanent={true}
                direction="top" 
                offset={[0, -48]}
                className="custom-tooltip"
                interactive={true}
              >
                <div 
                  className="p-4 min-w-[200px] max-w-[240px] cursor-pointer flex flex-col items-center text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkerClick(marker);
                  }}
                  onMouseLeave={() => {
                    if (
                      !(marker.position[0] === center[0] && 
                        marker.position[1] === center[1] && 
                        zoom > 14)
                    ) {
                      setHoveredMarkerId(null);
                    }
                  }}
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden mb-3 border border-gray-200">
                    <img 
                      src={marker.image} 
                      alt={marker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{marker.name}</h3>
                  {marker.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{marker.description}</p>
                  )}
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>Click for more details</span>
                  </div>
                </div>
              </Tooltip>
            )}
          </Marker>
        ))}
      </MapContainer>

      {selectedLocation && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-8"
          onClick={handleCloseModal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div 
            className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="relative h-48"
              style={{ background: gradient }}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseModal();
                }}
                className="absolute top-8 right-8 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors z-[1001] cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              <div className="absolute inset-0 flex items-center">
                <div className="flex items-center gap-6 px-8">
                  <div className="flex-shrink-0 w-28 h-28 rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={selectedLocation.image}
                      alt={selectedLocation.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedLocation.name}
                    </h2>
                    {selectedLocation.description && (
                      <p className="text-gray-600 mt-2 text-base">{selectedLocation.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative px-8 py-8">
              {selectedLocation.additionalInfo && (
                <p className="text-gray-600 mb-10 text-base">
                  {selectedLocation.additionalInfo}
                </p>
              )}

              <div className="space-y-8">
                {(selectedLocation.phone || selectedLocation.email) && (
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Contact</h3>
                      <div className="mt-2 space-y-2">
                        {selectedLocation.phone && (
                          <a 
                            href={`tel:${selectedLocation.phone}`}
                            className="block text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            {selectedLocation.phone}
                          </a>
                        )}
                        {selectedLocation.email && (
                          <a 
                            href={`mailto:${selectedLocation.email}`}
                            className="block text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            {selectedLocation.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedLocation.address && (
                  <div className="flex items-start gap-4">
                    <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Address</h3>
                      <p className="mt-2 text-gray-600">{selectedLocation.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between">
                <div className="flex-1 flex flex-wrap gap-2">
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

                <a
                  href={selectedLocation.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors ml-6"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Export only once
export { Map };