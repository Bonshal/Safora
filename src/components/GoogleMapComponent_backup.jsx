import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { AlertTriangle } from 'lucide-react';

const MapComponent = ({ 
  center, 
  zoom, 
  sensitiveZones = [], 
  onZoneClick, 
  selectedZone,
  userLocations = [],
  onMapClick,
  onUserLocationDrag,
  draggableUsers = false
}) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [circles, setCircles] = useState([]);
  const [markers, setMarkers] = useState([]);

  // Function to check if a point is inside any sensitive zone
  const checkZoneViolation = (lat, lng, userId, userName) => {
    // Check if geometry library is loaded
    if (!window.google?.maps?.geometry?.spherical) {
      console.warn('Google Maps Geometry library not loaded');
      return;
    }

    const violatedZones = sensitiveZones.filter(zone => {
      if (zone.level !== 'high') return false; // Only check red zones
      
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(lat, lng),
        new google.maps.LatLng(zone.center.lat, zone.center.lng)
      );
      
      return distance <= zone.radius;
    });

    if (violatedZones.length > 0) {
      // Trigger alert for zone violation
      violatedZones.forEach(zone => {
        if (onUserLocationDrag) {
          onUserLocationDrag({
            userId,
            userName,
            zone,
            violation: true,
            coordinates: { lat, lng }
          });
        }
      });
    }
  };

  // Initialize the map
  useEffect(() => {
    if (ref.current && !map) {
      try {
        // Check if Google Maps API is loaded
        if (typeof google === 'undefined' || !google.maps) {
          console.error('Google Maps API not loaded');
          return;
        }

        console.log('Initializing Google Map...');
        const newMap = new google.maps.Map(ref.current, {
          center,
          zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Add click listener for adding new zones
        newMap.addListener('click', (event) => {
          if (onMapClick) {
            onMapClick({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
          }
        });

        console.log('Google Map initialized successfully');
        setMap(newMap);
      } catch (error) {
        console.error('Error initializing Google Map:', error);
      }
    }
  }, [ref, map, center, zoom, onMapClick]);

  // Update sensitive zones
  useEffect(() => {
    if (!map) return;

    // Clear existing circles
    circles.forEach(circle => circle.setMap(null));
    
    // Create new circles for sensitive zones
    const newCircles = sensitiveZones.map(zone => {
      const color = zone.level === 'high' ? '#ef4444' : 
                   zone.level === 'medium' ? '#f97316' : '#eab308';
      
      const circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.2,
        map,
        center: zone.center,
        radius: zone.radius,
        clickable: true
      });

      // Add click listener for zone selection
      circle.addListener('click', () => {
        if (onZoneClick) {
          onZoneClick(zone);
        }
      });

      // Highlight selected zone
      if (selectedZone && selectedZone.id === zone.id) {
        circle.setOptions({
          strokeWeight: 4,
          fillOpacity: 0.4
        });
      }

      return circle;
    });

    setCircles(newCircles);
  }, [map, sensitiveZones, selectedZone, onZoneClick]);

  // Update user markers
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    // Create new markers for user locations
    const newMarkers = userLocations.map(user => {
      const marker = new google.maps.Marker({
        position: { lat: user.lat, lng: user.lng },
        map,
        title: user.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff'
        },
        draggable: draggableUsers
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${user.name}</h3>
            <p class="text-sm text-gray-600">Status: ${user.status}</p>
            <p class="text-sm text-gray-500">Last updated: ${user.lastSeen}</p>
          </div>
        `
      });

      // Add click listener to show info window
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Add drag listener if draggable
      if (draggableUsers) {
        marker.addListener('dragend', (event) => {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          
          // Check for zone violations
          checkZoneViolation(newLat, newLng, user.id, user.name);
        });
      }

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, userLocations, draggableUsers, onUserLocationDrag, sensitiveZones]);

  return (
    <div 
      ref={ref} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '300px'
      }} 
    />
  );
};

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full bg-red-50 border border-red-200">
          <div className="text-center text-red-800 p-4">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium mb-2">Failed to Load Google Maps</p>
            <p className="text-sm mb-3">Please check your configuration:</p>
            <div className="text-xs text-left bg-white p-3 rounded border space-y-1">
              <div>
                <strong>API Key:</strong> {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 
                  '✓ Present (' + import.meta.env.VITE_GOOGLE_MAPS_API_KEY.substring(0, 10) + '...)' : 
                  '✗ NOT SET'
                }
              </div>
              <div>
                <strong>Required APIs:</strong> Maps JavaScript API, Geometry Library
              </div>
              <div>
                <strong>Status:</strong> {status}
              </div>
            </div>
            <p className="text-xs mt-3 text-gray-500">
              Configure API key in <code>.env.local</code> file
            </p>
          </div>
        </div>
      );
    case Status.SUCCESS:
      return (
        <MapComponent
          center={center}
          zoom={zoom}
          sensitiveZones={sensitiveZones}
          onZoneClick={onZoneClick}
          selectedZone={selectedZone}
          userLocations={userLocations}
          onMapClick={onMapClick}
          onUserLocationDrag={onUserLocationDrag}
          draggableUsers={draggableUsers}
        />
      );
    default:
      return null;
  }
};

const GoogleMapComponent = ({ 
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  center = { lat: 25.2677, lng: 91.8833 }, // Mawsynram, Meghalaya
  zoom = 13,
  sensitiveZones = [],
  onZoneClick,
  selectedZone,
  userLocations = [],
  onMapClick,
  onUserLocationDrag,
  draggableUsers = false,
  className = ""
}) => {
  console.log('GoogleMapComponent rendering with:', { 
    apiKeyPresent: !!apiKey, 
    center, 
    zoom, 
    sensitiveZonesCount: sensitiveZones.length
  });

  // If no API key is provided, show a fallback
  if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-center h-full bg-yellow-50 border border-yellow-200">
          <div className="text-center text-yellow-800 p-4">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium mb-2">Google Maps API Key Required</p>
            <p className="text-sm mb-2">Please configure your Google Maps API key</p>
            <p className="text-xs">Add VITE_GOOGLE_MAPS_API_KEY to your .env.local file</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      <Wrapper apiKey={apiKey} render={render} libraries={['geometry']}>
        <MapComponent
          center={center}
          zoom={zoom}
          sensitiveZones={sensitiveZones}
          onZoneClick={onZoneClick}
          selectedZone={selectedZone}
          userLocations={userLocations}
          onMapClick={onMapClick}
          onUserLocationDrag={onUserLocationDrag}
          draggableUsers={draggableUsers}
        />
      </Wrapper>
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-sm border p-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Map Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full opacity-60"></div>
              <span>High Risk Zone</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-orange-500 rounded-full opacity-60"></div>
              <span>Medium Risk Zone</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-60"></div>
              <span>Low Risk Zone</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Tourist Location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapComponent;