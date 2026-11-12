import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FoodListing, Organization, CommunityHotspot, CommunityHub } from '../../types';

// Fix Leaflet's default icon paths in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG markers for high visual contrast
const createColoredIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="
          background-color: ${color}; 
          color: white; 
          width: 32px; 
          height: 32px; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid white;
        ">
          <span style="transform: rotate(45deg); font-size: 13px; font-weight: bold;">${label}</span>
        </div>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -36]
  });
};

const ICONS = {
  donor: createColoredIcon('#2E6B3F', '🍲'),
  food: createColoredIcon('#F28C28', '📦'),
  ngo: createColoredIcon('#1E40AF', '🤝'),
  hub: createColoredIcon('#7C3AED', '❄️'),
  emergency: createColoredIcon('#D92243', '🚨'),
  hotspot: createColoredIcon('#EAB308', '⚠️')
};

interface TamilNaduMapProps {
  listings?: FoodListing[];
  organizations?: Organization[];
  hotspots?: CommunityHotspot[];
  hubs?: CommunityHub[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  selectedCity?: string;
}

export const TAMIL_NADU_CITIES: Record<string, [number, number]> = {
  'Coimbatore': [11.0168, 76.9558],
  'Salem': [11.6643, 78.1460],
  'Erode': [11.3410, 77.7172],
  'Tiruppur': [11.1085, 77.3411],
  'Chennai': [13.0827, 80.2707],
  'Madurai': [9.9252, 78.1198],
  'Tiruchirappalli': [10.7905, 78.7047],
  'Vellore': [12.9165, 79.1325],
  'Thanjavur': [10.7870, 79.1378],
  'Dindigul': [10.3673, 77.9803],
  'Namakkal': [11.2189, 78.1674]
};

export const TamilNaduMap: React.FC<TamilNaduMapProps> = ({
  listings = [],
  organizations = [],
  hotspots = [],
  hubs = [],
  center = [11.0168, 76.9558], // Coimbatore default
  zoom = 12,
  height = '500px',
  onLocationSelect,
  selectedCity = 'Coimbatore'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'ngo' | 'hubs' | 'hotspots' | 'emergency'>('all');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      scrollWheelZoom: true
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Handle user map clicks for coordinate selection
    if (onLocationSelect) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map view on city filter change
  useEffect(() => {
    if (mapInstanceRef.current && TAMIL_NADU_CITIES[selectedCity]) {
      const cityCoords = TAMIL_NADU_CITIES[selectedCity];
      mapInstanceRef.current.flyTo(cityCoords, 12, { duration: 1.2 });
    }
  }, [selectedCity]);

  // Render Markers based on Active Filter
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const layer = layerGroupRef.current;
    layer.clearLayers();

    // 1. Food Listings (Orange or Red for Emergency)
    if (activeFilter === 'all' || activeFilter === 'food' || activeFilter === 'emergency') {
      listings.forEach(item => {
        if (activeFilter === 'emergency' && !item.is_emergency) return;

        const icon = item.is_emergency ? ICONS.emergency : ICONS.food;
        const marker = L.marker([item.latitude, item.longitude], { icon });

        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 13px; max-width: 240px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="background: ${item.is_emergency ? '#D92243' : '#F28C28'}; color: white; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;">
                ${item.is_emergency ? 'EMERGENCY SURPLUS' : item.dietary_category}
              </span>
              <span style="font-weight: 700; color: #2E6B3F;">${item.batch_id}</span>
            </div>
            <h4 style="font-size: 14px; font-weight: 700; margin: 4px 0; color: #26332B;">${item.food_name}</h4>
            <p style="margin: 2px 0; color: #68736C;"><strong>Quantity:</strong> ${item.quantity} ${item.unit} (${item.estimated_portions} portions)</p>
            <p style="margin: 2px 0; color: #68736C;"><strong>Pickup:</strong> ${item.pickup_location}</p>
            <p style="margin: 2px 0; color: #2E6B3F; font-weight: 600;">Safe window: ${new Date(item.permitted_handling_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        `);
        layer.addLayer(marker);
      });
    }

    // 2. Verified NGOs (Blue)
    if (activeFilter === 'all' || activeFilter === 'ngo') {
      organizations.filter(o => o.organisation_type.includes('NGO') || o.organisation_type.includes('Shelter')).forEach(ngo => {
        const marker = L.marker([ngo.latitude, ngo.longitude], { icon: ICONS.ngo });
        marker.bindPopup(`
          <div style="font-size: 13px; max-width: 240px;">
            <span style="background: #1E40AF; color: white; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;">VERIFIED RECIPIENT</span>
            <h4 style="font-size: 14px; font-weight: 700; margin: 4px 0; color: #26332B;">${ngo.organisation_name}</h4>
            <p style="margin: 2px 0; color: #68736C;">${ngo.address}</p>
            <p style="margin: 2px 0; color: #1E40AF; font-weight: 600;">Capacity: ${ngo.receiving_capacity_kg} kg</p>
          </div>
        `);
        layer.addLayer(marker);
      });
    }

    // 3. Community Fridges / Hubs (Purple)
    if (activeFilter === 'all' || activeFilter === 'hubs') {
      hubs.forEach(hub => {
        const marker = L.marker([hub.latitude, hub.longitude], { icon: ICONS.hub });
        marker.bindPopup(`
          <div style="font-size: 13px; max-width: 240px;">
            <span style="background: #7C3AED; color: white; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;">COMMUNITY FRIDGE</span>
            <h4 style="font-size: 14px; font-weight: 700; margin: 4px 0; color: #26332B;">${hub.name}</h4>
            <p style="margin: 2px 0; color: #68736C;">${hub.address}</p>
            <p style="margin: 2px 0; color: #7C3AED; font-weight: 600;">Available Now: ${hub.current_availability_kg} / ${hub.capacity_kg} kg</p>
          </div>
        `);
        layer.addLayer(marker);
      });
    }

    // 4. Community Hotspots (Yellow)
    if (activeFilter === 'all' || activeFilter === 'hotspots') {
      hotspots.forEach(spot => {
        const marker = L.marker([spot.latitude, spot.longitude], { icon: ICONS.hotspot });
        marker.bindPopup(`
          <div style="font-size: 13px; max-width: 240px;">
            <span style="background: #EAB308; color: black; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;">${spot.severity} NEED HOTSPOT</span>
            <h4 style="font-size: 14px; font-weight: 700; margin: 4px 0; color: #26332B;">${spot.name}</h4>
            <p style="margin: 2px 0; color: #68736C;">${spot.location}, ${spot.city}</p>
            <p style="margin: 2px 0; color: #B45309; font-weight: 600;">Category: ${spot.category}</p>
          </div>
        `);
        layer.addLayer(marker);
      });
    }

  }, [listings, organizations, hotspots, hubs, activeFilter]);

  return (
    <div className="relative rounded-card overflow-hidden shadow-soft border border-sage bg-white">
      {/* Interactive Map Filter Bar */}
      <div className="p-3 bg-white/95 backdrop-blur-md border-b border-sage flex flex-wrap items-center justify-between gap-2 z-[1000] relative">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-muted mr-1">Tamil Nadu Layer:</span>
          {(['all', 'food', 'emergency', 'ngo', 'hubs', 'hotspots'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                activeFilter === tab
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-cream text-charcoal hover:bg-sage/40'
              }`}
            >
              {tab === 'all' && 'All Locations'}
              {tab === 'food' && 'Available Food (🍲)'}
              {tab === 'emergency' && 'Emergency Surplus (🚨)'}
              {tab === 'ngo' && 'Verified NGOs (🤝)'}
              {tab === 'hubs' && 'Community Fridges (❄️)'}
              {tab === 'hotspots' && 'Need Hotspots (⚠️)'}
            </button>
          ))}
        </div>

        <div className="text-xs text-muted flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
          <span>Live OpenStreetMap • Tamil Nadu</span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-0" />
    </div>
  );
};
