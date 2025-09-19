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
  Eye,
  Phone,
  Heart
} from 'lucide-react';

import { ImageWithFallback } from './figma/ImageWithFallback';

export function TouristDashboard({ onLogout }) {
  const [searchLocation, setSearchLocation] = useState('');
  const [currentLocation] = useState('Mawsynram, Meghalaya');
  
  // Mock data for demonstration
  const riskAlerts = [
    { type: 'weather', level: 'high', message: 'Heavy rainfall expected in next 6 hours', area: 'Mawsynram' },
    { type: 'crime', level: 'medium', message: 'Safe', area: 'Tourist areas' },
    { type: 'natural', level: 'low', message: 'Earthquake monitoring - stable conditions', area: 'All areas' }
  ];



  const weatherData = {
    temperature: 24,
    humidity: 68,
    condition: 'Partly cloudy',
    visibility: '10 km',
    airQuality: 'Good',
    AQI: 90
  };

  //emergency services mock data
   const emergencyServices = {
    police: {
      name: 'Sohra Police Station',
      distance: '3 km',
      address: 'Sohra, cheeranpunji',
      phone: '+91-3-3498-0110'
    },
    hospital: {
      name: 'Shillong Civil hospital',
      distance: '5 km',
      address: 'HV9J+3CW, Laban, Lachumiere, Shillong',
      phone: '+91-3-3444-1181'
    }
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
              <h1 className="font-semibold text-gray-900">Safora</h1>
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
                {getRiskIcon(alert.type)}
                <AlertDescription>
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1">
                      <div className="font-medium mb-2 text-gray-900">{alert.area}</div>
                      <div className="text-gray-700 leading-relaxed">{alert.message}</div>
                    </div>
                    <Badge variant="outline" className={`text-xs ml-3 flex-shrink-0 ${getRiskColor(alert.level)}`}>
                      {alert.level}
                    </Badge>
                  </div>
                </AlertDescription>
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
                <div className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="h-3 w-3" />
                AQI: {weatherData.AQI}
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
              src="/fake-map.png"
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

        {/* Safety Tips
        <Card className="p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            000000
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
        </Card> */}



          {/* Emergency Services */}
        <Card className="p-4">
      


          <div className="space-y-4">
            {/* Police Station */}
            <h2 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-emerald-600" />
              Nearest Police Station
            </h2>
            <div className="flex items-center justify-between p-6 rounded-lg border border-black">
              <div className="flex items-center gap-3">
                {/* <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  
                </div> */}
                <div className="flex-1">
                  <p className="font-medium mb-2 text-blue-900">{emergencyServices.police.name}</p>
                  <p className="text-sm text-gray-700">{emergencyServices.police.address}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">{emergencyServices.police.distance} away</span>
                  </div>
                </div>
              </div>
              <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                <Phone className="h-4 w-4" />
              </Button>
            </div>

           
          </div>
          <div className="space-y-4">
             <h2 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-emerald-600" />
              Nearest Hospital
            </h2>
             {/* Hospital */}
            <div className="flex items-center justify-between p-6  rounded-lg border border-red-100">
              <div className="flex items-center gap-3">
                {/* <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-600" />
                </div> */}
                <div className="flex-1">
                  <p className="font-medium mb-2 text-red-900">{emergencyServices.hospital.name}</p>
                  <p className="text-sm text-gray-700">{emergencyServices.hospital.address}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-red-600" />
                    <span className="text-xs text-red-600 font-medium">{emergencyServices.hospital.distance} away</span>
                  </div>
                </div>
              </div>
              <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

       
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          {/* <Button className="h-12 bg-red-600 text-black hover:bg-red-700">
            Emergency Call
          </Button> */}
                    <Button variant="destructive" className="h-12 ">
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