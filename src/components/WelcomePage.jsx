import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Users, Shield, ArrowLeft, AlertTriangle, MapPin } from 'lucide-react';

export function WelcomePage({ onSelectUserType }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">Safora</span>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Choose Your Role
          </h1>
          <p className="text-lg text-gray-600">
            Select how you'd like to use Safora
          </p>
        </div>

        {/* User Type Selection - Clean Cards */}
        <div className="space-y-4 max-w-md mx-auto">
          {/* Tourist Option */}
          <Card 
            className="p-6 cursor-pointer border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all duration-300 group bg-white"
            onClick={() => onSelectUserType('tourist')}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Tourist</h3>
                <p className="text-gray-600 text-sm">
                  Get safety alerts and travel guidance
                </p>
              </div>
            </div>
          </Card>

          {/* Admin Option */}
          <Card 
            className="p-6 cursor-pointer border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-300 group bg-white"
            onClick={() => onSelectUserType('admin')}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Admin</h3>
                <p className="text-gray-600 text-sm">
                  Manage alerts and system operations
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Preview */}
        <div className="mt-16 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">What you'll get</h2>
          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-sm text-gray-600">Safety Alerts</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Smart Routes</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Emergency Aid</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}