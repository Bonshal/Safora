import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
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
  Settings
} from 'lucide-react';

export function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newAlert, setNewAlert] = useState({
    type: '',
    level: '',
    area: '',
    message: ''
  });

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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
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

      <Card className="p-4">
        <div className='space-y-3'>
          <img src="/cluster_map_gen.png" alt="" className="w-full h-full" />
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
      <h3 className="font-semibold mb-4">Active Users</h3>
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
            { id: 'users', label: 'Users', icon: Users },
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

      <div className="p-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'settings' && (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Settings</h3>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </Card>
        )}
      </div>
    </div>
  );
}