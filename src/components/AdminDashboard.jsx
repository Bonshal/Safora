import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { TouristRegistration } from './TouristRegistration';
import GoogleMapComponent from './GoogleMapComponent';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Menu,
  Bell,
  User,
  BarChart3,
  Settings,
  Map,
  Navigation,
  Zap,
  AlertCircle,
  Circle,
  Square,
  X,
  Minus
} from 'lucide-react';

export function AdminDashboard({ onLogout }) {
  // Updated layout with max-width constraints for professional appearance
  const [activeTab, setActiveTab] = useState('overview');
  const [showRegistration, setShowRegistration] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: '',
    level: '',
    area: '',
    message: ''
  });

  // Geofencing state
  const [sensitiveZones, setSensitiveZones] = useState([
    {
      id: 1,
      name: 'High Crime Area - Downtown',
      type: 'crime',
      center: { lat: 25.2677, lng: 91.8833 }, // Mawsynram coordinates
      radius: 500, // meters
      level: 'high',
      activeAlerts: 2,
      description: 'High crime rate area with frequent pickpocket incidents'
    },
    {
      id: 2,
      name: 'Landslide Risk Zone',
      type: 'natural',
      center: { lat: 25.2857, lng: 91.8653 },
      radius: 800,
      level: 'high',
      activeAlerts: 1,
      description: 'Area prone to landslides during heavy rainfall'
    },
    {
      id: 3,
      name: 'Flood Zone - River Bank',
      type: 'weather',
      center: { lat: 25.2477, lng: 91.9033 },
      radius: 300,
      level: 'medium',
      activeAlerts: 0,
      description: 'Flood-prone area during monsoon season'
    }
  ]);

  const [geofenceAlerts, setGeofenceAlerts] = useState([
    {
      id: 1,
      userId: 1,
      userName: 'John Smith',
      zoneId: 1,
      zoneName: 'High Crime Area - Downtown',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: 'active',
      alertSent: true
    },
    {
      id: 2,
      userId: 3,
      userName: 'Mike Wilson',
      zoneId: 2,
      zoneName: 'Landslide Risk Zone',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      status: 'resolved',
      alertSent: true
    }
  ]);

  const [mapCenter] = useState({ lat: 25.2677, lng: 91.8833 }); // Mawsynram
  const [mapZoom] = useState(13);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showZoneEditor, setShowZoneEditor] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mockUsers, setMockUsers] = useState([
    { id: 1, name: 'John Smith', lat: 25.2677, lng: 91.8833, status: 'Active', inDangerZone: false },
    { id: 2, name: 'Jane Doe', lat: 25.2657, lng: 91.8813, status: 'Active', inDangerZone: false },
    { id: 3, name: 'Mike Wilson', lat: 25.2697, lng: 91.8853, status: 'Active', inDangerZone: false },
    { id: 4, name: 'Sarah Johnson', lat: 25.2637, lng: 91.8873, status: 'Active', inDangerZone: false },
    { id: 5, name: 'Tom Brown', lat: 25.2717, lng: 91.8793, status: 'Active', inDangerZone: false }
  ]);
  const [dragAlerts, setDragAlerts] = useState([]);

  // Geofencing utility functions
  const addSensitiveZone = (zone) => {
    const newZone = {
      ...zone,
      id: Date.now(),
      activeAlerts: 0
    };
    setSensitiveZones(prev => [...prev, newZone]);
  };

  const updateZone = (zoneId, updates) => {
    setSensitiveZones(prev => 
      prev.map(zone => zone.id === zoneId ? { ...zone, ...updates } : zone)
    );
  };

  const deleteZone = (zoneId) => {
    setSensitiveZones(prev => prev.filter(zone => zone.id !== zoneId));
    setGeofenceAlerts(prev => prev.filter(alert => alert.zoneId !== zoneId));
  };

  const getZoneColor = (level) => {
    switch (level) {
      case 'high': return '#ef4444'; // red-500
      case 'medium': return '#f97316'; // orange-500
      case 'low': return '#eab308'; // yellow-500
      default: return '#ef4444';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Simulate real-time user tracking (in real app, this would come from GPS)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate checking user locations against sensitive zones
      // In real implementation, this would check actual user GPS coordinates
      const simulatedUsers = [
        { id: 1, name: 'John Smith', lat: 25.2677, lng: 91.8833 },
        { id: 2, name: 'Jane Doe', lat: 25.2857, lng: 91.8653 },
        { id: 3, name: 'Mike Wilson', lat: 25.2477, lng: 91.9033 }
      ];

      simulatedUsers.forEach(user => {
        sensitiveZones.forEach(zone => {
          const distance = calculateDistance(
            user.lat, user.lng,
            zone.center.lat, zone.center.lng
          );
          
          if (distance <= zone.radius) {
            // Check if alert already exists for this user/zone combo
            const existingAlert = geofenceAlerts.find(
              alert => alert.userId === user.id && 
                      alert.zoneId === zone.id && 
                      alert.status === 'active'
            );
            
            if (!existingAlert) {
              // Create new geofence violation alert
              const newAlert = {
                id: Date.now() + Math.random(),
                userId: user.id,
                userName: user.name,
                zoneId: zone.id,
                zoneName: zone.name,
                timestamp: new Date(),
                status: 'active',
                alertSent: true
              };
              
              setGeofenceAlerts(prev => [newAlert, ...prev]);
              
              // In real app, send push notification to both admin and user
              console.log(`GEOFENCE ALERT: ${user.name} entered ${zone.name}`);
            }
          }
        });
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [sensitiveZones, geofenceAlerts]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Get user's current location and create a test red zone around it
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Add a test red zone around user's location
          const testZone = {
            id: 999,
            name: 'Test Zone - Your Location',
            type: 'test',
            center: { lat: latitude, lng: longitude },
            radius: 200, // 200 meters
            level: 'high',
            activeAlerts: 0,
            description: 'Test red zone created around your current location'
          };
          
          setSensitiveZones(prev => {
            // Remove any existing test zone and add the new one
            const filtered = prev.filter(zone => zone.id !== 999);
            return [...filtered, testZone];
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location if geolocation fails
          setUserLocation({ lat: 25.2677, lng: 91.8833 });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, []);

  // Handle user marker drag events
  const handleUserLocationDrag = (dragData) => {
    const { userId, userName, zone, violation, coordinates } = dragData;
    
    if (violation) {
      // Create alert for zone violation
      const newAlert = {
        id: Date.now() + Math.random(),
        userId,
        userName,
        zoneName: zone.name,
        zoneId: zone.id,
        timestamp: new Date(),
        message: `${userName} has been dragged into the high-risk zone: ${zone.name}`,
        coordinates
      };
      
      setDragAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      
      // Update user status
      setMockUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, inDangerZone: true, lat: coordinates.lat, lng: coordinates.lng }
            : user
        )
      );
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('Geofence Violation!', {
          body: `${userName} entered ${zone.name}`,
          icon: '/Custom_logo.png'
        });
      }
      
      console.log('🚨 GEOFENCE VIOLATION:', newAlert);
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Mock data
  const stats = {
    activeUsers: 1247,
    activeAlerts: 8,
    safeAreas: 156,
    riskAreas: 12
  };

  const recentAlerts = [
    { id: 1, type: 'weather', level: 'high', area: 'Mawsynram', message: 'Heavy rainfall warning', status: 'active', created: '2 hours ago' },
    { id: 2, type: 'crime', level: 'medium', area: 'Tourist areas', message: 'Pickpocket activity increase', status: 'active', created: '5 hours ago' },
    { id: 3, type: 'natural', level: 'low', area: 'All areas', message: 'Seismic activity monitoring', status: 'resolved', created: '1 day ago' }
  ];

  const activeUsers = [
    { id: 1, name: 'John Smith', location: 'Tokyo Station', lastActive: '2 min ago', riskLevel: 'low' },
    { id: 2, name: 'Sarah Johnson', location: 'Shibuya Crossing', lastActive: '5 min ago', riskLevel: 'medium' },
    { id: 3, name: 'Mike Chen', location: 'Harajuku', lastActive: '12 min ago', riskLevel: 'low' }
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateAlert = () => {
    // Mock alert creation
    console.log('Creating alert:', newAlert);
    setNewAlert({ type: '', level: '', area: '', message: '' });
  };

  const handleRegistrationComplete = (formData, touristId) => {
    // Handle successful registration
    console.log('New tourist registered by admin:', { formData, touristId });
    setShowRegistration(false);
    
    // Show success message with database ID
    const isSupabaseId = touristId.includes('-') && touristId.length > 20; // UUID format check
    const message = isSupabaseId 
      ? `Tourist successfully registered!\n\nDatabase ID: ${touristId}\nName: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}`
      : `Tourist registration completed!\n\nTourist ID: ${touristId}\nName: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}`;
    
    alert(message);
    
    // You could refresh the users list here if implementing real-time data
    // await refreshUsersList();
  };

  const handleRegistrationBack = () => {
    setShowRegistration(false);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.activeUsers}</p>
            </div>
            <Users className="h-8 w-8 text-emerald-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-red-600">{stats.activeAlerts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Safe Areas</p>
              <p className="text-2xl font-bold text-green-600">{stats.safeAreas}</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Risk Areas</p>
              <p className="text-2xl font-bold text-orange-600">{stats.riskAreas}</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <Card className="p-4 relative">
        <h3 className="font-semibold mb-4">Quick Overview Map</h3>
        <div 
          className="h-64 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setActiveTab('geofencing')}
        >
          <GoogleMapComponent
            center={mapCenter}
            zoom={mapZoom}
            sensitiveZones={sensitiveZones}
            userLocations={mockUsers}
            className="w-full h-full"
          />
          {/* Overlay with click instruction */}
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-medium">Click to open full geofencing dashboard</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {recentAlerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getRiskColor(alert.level)}>{alert.level}</Badge>
                  <span className="text-sm font-medium ">
                    {alert.area}
                  </span>
                  <span className="text-sm font-medium text-gray-400 ml-4">{alert.created}</span>
                    
                </div>
                <p className="text-sm text-gray-600">{alert.message}</p>
                
              </div>
              <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                {alert.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      {/* Create New Alert */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Alert
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select value={newAlert.type} onValueChange={(value) => setNewAlert({...newAlert, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Alert Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="crime">Crime</SelectItem>
                <SelectItem value="natural">Natural Disaster</SelectItem>
                <SelectItem value="civil">Civil Unrest</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={newAlert.level} onValueChange={(value) => setNewAlert({...newAlert, level: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Input
            placeholder="Affected Area"
            value={newAlert.area}
            onChange={(e) => setNewAlert({...newAlert, area: e.target.value})}
          />
          
          <Textarea
            placeholder="Alert Message"
            value={newAlert.message}
            onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
            rows={3}
          />
          
          <Button onClick={handleCreateAlert} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Create Alert
          </Button>
        </div>
      </Card>

      {/* Active Alerts */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Manage Alerts</h3>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getRiskColor(alert.level)}>{alert.level}</Badge>
                  <span className="font-medium">{alert.area}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{alert.message}</p>
                <p className="text-xs text-gray-400">{alert.created}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Active Users</h3>
        <Button 
          onClick={() => setShowRegistration(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Register New Tourist
        </Button>
      </div>
      <div className="space-y-3">
        {activeUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {user.location}
                </p>
                <p className="text-xs text-gray-400">{user.lastActive}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getRiskColor(user.riskLevel)}>
                {user.riskLevel} risk
              </Badge>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderGeofencing = () => (
    <div className="space-y-6">
      {/* Geofencing Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Geofencing Management</h2>
          <p className="text-gray-600">Monitor sensitive zones and track real-time user locations</p>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Interactive Features:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Blue markers are draggable mock users</li>
                  <li>• Drag any user into a red zone to trigger alerts</li>
                  <li>• Red zone created around your current location</li>
                  <li>• Real-time notifications for violations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowZoneEditor(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Zone
          </Button>
          <Button variant="outline">
            <Navigation className="h-4 w-4 mr-2" />
            Refresh Map
          </Button>
        </div>
      </div>

      {/* Drag Alert Section */}
      {dragAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-800">Real-time Drag Violations</h3>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {dragAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-white border border-orange-200 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-orange-800">{alert.message}</p>
                      <p className="text-xs text-orange-600">{formatTimeAgo(alert.timestamp)}</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    DRAG ALERT
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Active Geofence Alerts */}
      {geofenceAlerts.filter(alert => alert.status === 'active').length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Active Geofence Violations</h3>
            </div>
            <div className="space-y-2">
              {geofenceAlerts
                .filter(alert => alert.status === 'active')
                .map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Zap className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-red-800">{alert.userName}</p>
                        <p className="text-sm text-red-600">Entered: {alert.zoneName}</p>
                        <p className="text-xs text-red-500">{formatTimeAgo(alert.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        VIOLATION
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setGeofenceAlerts(prev => 
                          prev.map(a => a.id === alert.id ? {...a, status: 'resolved'} : a)
                        )}
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Live Geofencing Map</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                  High Risk
                  <Circle className="h-3 w-3 fill-orange-500 text-orange-500" />
                  Medium Risk
                  <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  Low Risk
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Google Maps Component */}
              <div className="h-96 rounded-b-lg overflow-hidden">
                <GoogleMapComponent
                  center={userLocation || mapCenter}
                  zoom={mapZoom}
                  sensitiveZones={sensitiveZones}
                  onZoneClick={setSelectedZone}
                  selectedZone={selectedZone}
                  userLocations={mockUsers}
                  draggableUsers={true}
                  onUserLocationDrag={handleUserLocationDrag}
                  onMapClick={(location) => {
                    console.log('Map clicked at:', location);
                  }}
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Zone Management Panel */}
        <div className="space-y-4">
          {/* Zone Statistics */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Zone Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Zones</span>
                <span className="font-semibold">{sensitiveZones.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">High Risk</span>
                <span className="font-semibold text-red-600">
                  {sensitiveZones.filter(z => z.level === 'high').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mock Users</span>
                <span className="font-semibold text-blue-600">{mockUsers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Users in Danger</span>
                <span className="font-semibold text-red-600">
                  {mockUsers.filter(user => user.inDangerZone).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Drag Alerts</span>
                <span className="font-semibold text-orange-600">{dragAlerts.length}</span>
              </div>
              {userLocation && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Navigation className="h-4 w-4" />
                    <span>Your location detected</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Sensitive Zones List */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Sensitive Zones</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {sensitiveZones.map((zone) => (
                <div 
                  key={zone.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedZone?.id === zone.id ? 'border-emerald-500 bg-emerald-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Square 
                          className="h-3 w-3" 
                          style={{ color: getZoneColor(zone.level) }}
                          fill="currentColor"
                        />
                        <span className="text-sm font-medium">{zone.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{zone.description}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-500">
                          {zone.radius}m radius
                        </span>
                        {zone.activeAlerts > 0 && (
                          <Badge variant="destructive" className="text-xs px-1">
                            {zone.activeAlerts} alerts
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteZone(zone.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Geofence Activity */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {geofenceAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.status === 'active' ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-gray-600 flex-1">
                    {alert.userName} {alert.status === 'active' ? 'entered' : 'left'} {alert.zoneName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(alert.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Zone Editor Modal - Simple implementation */}
      {showZoneEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Sensitive Zone</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Zone Name</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2" 
                  placeholder="Enter zone name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Risk Level</label>
                <select className="w-full border rounded px-3 py-2">
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Radius (meters)</label>
                <input 
                  type="number" 
                  className="w-full border rounded px-3 py-2" 
                  placeholder="500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => setShowZoneEditor(false)}
                >
                  Add Zone
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowZoneEditor(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {showRegistration ? (
        <TouristRegistration 
          onBack={handleRegistrationBack} 
          onComplete={handleRegistrationComplete} 
        />
      ) : (
        <>
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="font-semibold text-gray-900">Safora</h1>
                    <p className="text-sm text-gray-500">Safety Management Dashboard</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onLogout}>
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex overflow-x-auto justify-evenly">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'geofencing', label: 'Geofencing', icon: Map },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'alerts' && renderAlerts()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'geofencing' && renderGeofencing()}
            {activeTab === 'settings' && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Settings</h3>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}