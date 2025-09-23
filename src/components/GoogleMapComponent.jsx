import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

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
      const newMap = new google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        libraries: ['geometry'], // Add geometry library for distance calculations
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

      setMap(newMap);
    }
  }, [ref, map, center, zoom, onMapClick]);

  // Update sensitive zones
  useEffect(() => {
    if (!map) return;

    // Clear existing circles
    circles.forEach(circle => circle.setMap(null));

    // Create new circles for sensitive zones
    const newCircles = sensitiveZones.map(zone => {
      const getZoneColor = (level) => {
        switch (level) {
          case 'high': return '#ef4444';
          case 'medium': return '#f97316';
          case 'low': return '#eab308';
          default: return '#ef4444';
        }
      };

      const circle = new google.maps.Circle({
        strokeColor: getZoneColor(zone.level),
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: getZoneColor(zone.level),
        fillOpacity: selectedZone?.id === zone.id ? 0.4 : 0.2,
        map,
        center: zone.center,
        radius: zone.radius,
        clickable: true
      });

      // Add click listener to the circle
      circle.addListener('click', () => {
        if (onZoneClick) {
          onZoneClick(zone);
        }
      });

      // Add info window for zone details
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: ${getZoneColor(zone.level)};">
              ${zone.name}
            </h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
              ${zone.description}
            </p>
            <div style="font-size: 11px; color: #888;">
              <div>Radius: ${zone.radius}m</div>
              <div>Risk Level: ${zone.level.toUpperCase()}</div>
              ${zone.activeAlerts > 0 ? `<div style="color: #ef4444; font-weight: bold;">⚠️ ${zone.activeAlerts} Active Alerts</div>` : ''}
            </div>
          </div>
        `
      });

      circle.addListener('mouseover', () => {
        infoWindow.setPosition(zone.center);
        infoWindow.open(map);
      });

      circle.addListener('mouseout', () => {
        infoWindow.close();
      });

      return circle;
    });

    setCircles(newCircles);

    return () => {
      newCircles.forEach(circle => circle.setMap(null));
    };
  }, [map, sensitiveZones, selectedZone, onZoneClick]);

  // Update user location markers
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
        draggable: draggableUsers, // Make markers draggable if enabled
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: user.inDangerZone ? '#ef4444' : '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        },
        animation: google.maps.Animation.DROP
      });

      // Add drag listener for draggable markers
      if (draggableUsers) {
        marker.addListener('dragend', (event) => {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          
          // Check for zone violations when marker is dragged
          checkZoneViolation(newLat, newLng, user.id, user.name);
        });
      }

      // Add info window for user details
      const userInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">
              ${user.name}
            </h3>
            <p style="margin: 0; font-size: 12px; color: #666;">
              ${user.status || 'Active'}
            </p>
            ${user.inDangerZone ? '<div style="color: #ef4444; font-size: 11px; margin-top: 4px;">⚠️ In Sensitive Zone</div>' : ''}
            ${draggableUsers ? '<div style="color: #10b981; font-size: 11px; margin-top: 4px;">📍 Draggable</div>' : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        userInfoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, userLocations, draggableUsers, checkZoneViolation]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};

const render = (status) => {
  console.log('Google Maps API Status:', status);
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full bg-red-50 border border-red-200">
          <div className="text-center text-red-600 p-4">
            <p className="font-medium mb-2">Failed to load Google Maps</p>
            <p className="text-sm mb-2">Please check your API key configuration</p>
            <p className="text-xs text-gray-500">
              API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 
                import.meta.env.VITE_GOOGLE_MAPS_API_KEY.substring(0, 10) + '...' : 
                'NOT SET'
              }
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const GoogleMapComponent = ({ 
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY",
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
    apiKey: apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET', 
    center, 
    sensitiveZones: sensitiveZones.length 
  });
  
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