import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { 
  MapPin, 
  AlertTriangle, 
  Cloud, 
  Wind, 
  Shield, 
  Navigation, 
  Search,
  Menu,
  Bell,
  User,
  Thermometer,
  Droplets,
  Eye
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function TouristDashboard({ onLogout }) {
  const [searchLocation, setSearchLocation] = useState('');
  const [currentLocation] = useState('Tokyo, Japan');
  
  // Mock data for demonstration
  const riskAlerts = [
    { type: 'weather', level: 'high', message: 'Heavy rainfall expected in next 6 hours', area: 'Shibuya District' },
    { type: 'crime', level: 'medium', message: 'Increased pickpocket activity reported', area: 'Tourist areas' },
    { type: 'natural', level: 'low', message: 'Earthquake monitoring - stable conditions', area: 'All areas' }
  ];

  const weatherData = {
    temperature: 24,
    humidity: 68,
    condition: 'Partly cloudy',
    visibility: '10 km',
    airQuality: 'Good'
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (type) => {
    switch (type) {
      case 'weather': return <Cloud className="h-4 w-4" />;
      case 'crime': return <Shield className="h-4 w-4" />;
      case 'natural': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900">SafeGuide</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {currentLocation}
              </p>
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

      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search destination or address..."
            className="pl-10 bg-white"
          />
        </div>

        {/* Risk Alerts */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-emerald-600" />
              Safety Alerts
            </h2>
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              3 Active
            </Badge>
          </div>
          
          <div className="space-y-3">
            {riskAlerts.map((alert, index) => (
              <Alert key={index} className={`border ${getRiskColor(alert.level)}`}>
                <div className="flex items-start gap-3">
                  {getRiskIcon(alert.type)}
                  <div className="flex-1">
                    <AlertDescription className="text-sm">
                      <div className="font-medium mb-1">{alert.area}</div>
                      {alert.message}
                    </AlertDescription>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getRiskColor(alert.level)}`}>
                    {alert.level}
                  </Badge>
                </div>
              </Alert>
            ))}
          </div>
        </Card>

        {/* Weather & Air Quality */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Cloud className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium">Weather</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{weatherData.temperature}°C</span>
                <Thermometer className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-sm text-gray-600">{weatherData.condition}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Droplets className="h-3 w-3" />
                {weatherData.humidity}% humidity
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="h-5 w-5 text-green-600" />
              <h3 className="font-medium">Air Quality</h3>
            </div>
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {weatherData.airQuality}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="h-3 w-3" />
                Visibility: {weatherData.visibility}
              </div>
            </div>
          </Card>
        </div>

        {/* Map View */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Navigation className="h-5 w-5 text-emerald-600" />
              Your Location
            </h3>
            <Button variant="outline" size="sm">
              Navigate
            </Button>
          </div>
          
          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1652176862396-99e525e9f87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMHVyYmFuJTIwdHJhdmVsfGVufDF8fHx8MTc1ODA5NjYyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Map view"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-sm">Current Location</p>
                    <p className="text-xs text-gray-600">{currentLocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Safety Tips */}
        <Card className="p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Today's Safety Tips
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-emerald-800">Carry an umbrella due to expected rainfall</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-blue-800">Keep valuables secure in crowded areas</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-yellow-800">Emergency contact: 110 (Police), 119 (Fire/Medical)</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-12 bg-emerald-600 hover:bg-emerald-700">
            Emergency Call
          </Button>
          <Button variant="outline" className="h-12">
            Share Location
          </Button>
        </div>
      </div>
    </div>
  );
}