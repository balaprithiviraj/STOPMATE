import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAppStore } from '../store';
import { Bell, Navigation, Settings2, Bus, Train, Bike, X, Search, MapPin, Loader2, LocateFixed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/2.0.2/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapEvents() {
  const setDestination = useAppStore(state => state.setDestination);
  const isTracking = useAppStore(state => state.isTracking);

  useMapEvents({
    click(e) {
      if (!isTracking) {
        setDestination({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

function MapController({ center }: { center: { lat: number, lng: number } | null }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 15, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

function LocateControl() {
  const map = useMap();
  const setCurrentLocation = useAppStore(state => state.setCurrentLocation);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentLocation(newLoc);
        map.flyTo([newLoc.lat, newLoc.lng], 15, { duration: 1.5 });
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
        alert("Could not get accurate location. Please check your device permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="absolute top-24 right-4 z-[400]">
      <button 
        onClick={handleLocate}
        className="bg-[#1a1a1a]/90 backdrop-blur-xl text-blue-500 p-3 rounded-2xl hover:bg-[#2a2a2a] transition-colors border border-white/10 shadow-lg flex items-center justify-center"
        title="Locate Me"
      >
        {isLocating ? <Loader2 size={24} className="animate-spin" /> : <LocateFixed size={24} />}
      </button>
    </div>
  );
}

export default function AlarmPage() {
  const { 
    currentLocation, 
    destination, 
    alarmDistance, 
    isTracking, 
    transportMode,
    setAlarmDistance, 
    setIsTracking, 
    setCurrentLocation,
    setTransportMode,
    setDestination
  } = useAppStore();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showTransportSelect, setShowTransportSelect] = useState(false);
  const [eta, setEta] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error(err);
        setCurrentLocation({ lat: 40.7128, lng: -74.0060 }); // Fallback to NYC
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    let watchId: number;
    if (isTracking) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          if (destination) {
            const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, destination.lat, destination.lng);
            if (dist <= alarmDistance) {
              triggerAlarm();
            }
          }
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, destination, alarmDistance]);

  useEffect(() => {
    if (destination && currentLocation && isTracking) {
      const dist = calculateDistance(currentLocation.lat, currentLocation.lng, destination.lat, destination.lng);
      
      let speedKmH = 30; 
      if (transportMode === 'train') speedKmH = 60;
      if (transportMode === 'bike') speedKmH = 15;
      
      const timeHours = (dist / 1000) / speedKmH;
      const timeMins = Math.round(timeHours * 60);
      setEta(`${timeMins} min`);
    } else {
      setEta(null);
    }
  }, [destination, currentLocation, isTracking, transportMode]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const triggerAlarm = () => {
    setIsTracking(false);
    if (navigator.vibrate) {
      navigator.vibrate([1000, 500, 1000, 500, 2000]);
    }
    try {
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
      audio.play();
    } catch (e) {
      console.error("Audio play failed", e);
    }
    alert("WAKE UP! You are approaching your stop!");
  };

  const handleStartJourney = () => {
    if (!transportMode) {
      setShowTransportSelect(true);
    } else {
      setIsTracking(true);
    }
  };

  const selectTransportAndStart = (mode: 'bus' | 'train' | 'bike') => {
    setTransportMode(mode);
    setShowTransportSelect(false);
    setIsTracking(true);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setDestination({ lat, lng });
    setSearchQuery(result.display_name.split(',')[0]);
    setSearchResults([]);
  };

  return (
    <div className="relative h-full w-full bg-[#050505]">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        {currentLocation ? (
          <MapContainer 
            center={[currentLocation.lat, currentLocation.lng]} 
            zoom={14} 
            className="h-full w-full"
            zoomControl={false}
          >
            {/* Premium Dark Map Tiles (CartoDB Dark Matter) */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            <MapEvents />
            <MapController center={destination} />
            <LocateControl />
            
            {/* Current Location Marker */}
            <Marker position={[currentLocation.lat, currentLocation.lng]} />
            
            {/* Destination Marker & Circle */}
            {destination && (
              <>
                <Marker position={[destination.lat, destination.lng]} icon={customIcon} />
                <Circle 
                  center={[destination.lat, destination.lng]} 
                  radius={alarmDistance} 
                  pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 2 }} 
                />
              </>
            )}
          </MapContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[#666]">
            <div className="animate-pulse flex flex-col items-center gap-3">
              <Navigation size={32} className="animate-bounce" />
              <span className="font-medium">Initializing Map...</span>
            </div>
          </div>
        )}
      </div>

      {/* Top Search Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-[400] pt-safe bg-gradient-to-b from-[#050505]/80 to-transparent">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search bus stop, station, or area..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-lg"
            disabled={isTracking}
          />
          {isSearching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={20} />
          )}
          
          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchResults.length > 0 && !isTracking && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              >
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSearchResult(result)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                  >
                    <p className="text-white text-sm font-medium truncate">{result.display_name.split(',')[0]}</p>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{result.display_name.split(',').slice(1).join(',')}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Transport Selection Modal */}
      <AnimatePresence>
        {showTransportSelect && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[500] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Select Transport</h2>
                <button onClick={() => setShowTransportSelect(false)} className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => selectTransportAndStart('bus')} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-white group">
                  <Bus size={28} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Bus</span>
                </button>
                <button onClick={() => selectTransportAndStart('train')} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-white group">
                  <Train size={28} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Train</span>
                </button>
                <button onClick={() => selectTransportAndStart('bike')} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-white group">
                  <Bike size={28} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Bike</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Control Panel */}
      <div className="absolute bottom-6 left-4 right-4 z-[400]">
        <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl">
          
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1 pr-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                Destination
              </h3>
              <p className="text-sm text-gray-400 mt-1 truncate">
                {destination ? (searchQuery || "Pinned on map") : "Search or tap map to pin"}
              </p>
              {isTracking && eta && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  ETA: {eta}
                </div>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              {destination && !isTracking && (
                <button 
                  onClick={() => {
                    setDestination(null);
                    setSearchQuery('');
                  }}
                  className="p-3 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                <Settings2 size={20} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-5"
              >
                <div className="pt-4 pb-2 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-3 font-medium">Alert me before:</p>
                  <div className="flex gap-2">
                    {[500, 1000, 2000].map(dist => (
                      <button
                        key={dist}
                        onClick={() => setAlarmDistance(dist)}
                        className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          alarmDistance === dist 
                            ? 'bg-white text-black' 
                            : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {dist >= 1000 ? `${dist/1000}km` : `${dist}m`}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={isTracking ? () => setIsTracking(false) : handleStartJourney}
            disabled={!destination}
            className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
              !destination 
                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                : isTracking
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20'
            }`}
          >
            {isTracking ? (
              <>
                <Bell className="animate-pulse" size={20} />
                Stop Tracking
              </>
            ) : (
              <>
                <Navigation size={20} />
                Start Journey
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
