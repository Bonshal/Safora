import React from 'react';
import { Button } from './ui/button.tsx';
import { Card } from './ui/card.tsx';
import { Shield, ShieldCheck, ShieldAlert, MapPin, AlertTriangle, Globe, Clock, Users, ArrowRight } from 'lucide-react';

export function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center relative">
              <Shield className="h-7 w-7 text-white" />
              <MapPin className="h-3.5 w-3.5 text-white absolute" />
            </div>
            {/* <img 
              src="/Custom_logo.png" 
              alt="Safora Logo" 
              className="h-16 w-17"
              style={{ filter: 'brightness(0) saturate(100%) invert(71%) sepia(45%) saturate(509%) hue-rotate(113deg) brightness(60%) contrast(87%)' }}
            /> */}
            <span className="text-xl font-semibold text-gray-900">Safora</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Main Content */}
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Smart Travel,
              <br />
              <span className="text-teal-600">Safer Journey!</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Get real-time safety alerts, weather updates, and AI-powered guidance for secure travel experiences.
            </p>
            
            {/* CTA Button */}
            <Button 
              onClick={onGetStarted}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-2xl text-lg font-medium mb-8"
            >
              Get Started
            </Button>
            
            <p className="text-sm text-gray-500">
              Join 50,000+ travelers worldwide
            </p>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-teal-50 to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Safora?
          </h2>
          
          {/* Features List */}
          <div className="space-y-4">
            <Card className="p-4 bg-white border-0 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Real-time Safety Alerts</h3>
                  <p className="text-sm text-gray-600">
                    Get instant notifications about weather emergencies and dangerous areas.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white border-0 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Smart Location Guidance</h3>
                  <p className="text-sm text-gray-600">
                    AI-powered route suggestions for the safest travel paths.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white border-0 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Weather & Air Quality</h3>
                  <p className="text-sm text-gray-600">
                    Comprehensive environmental monitoring for informed decisions.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white border-0 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Emergency Support</h3>
                  <p className="text-sm text-gray-600">
                    Instant access to emergency contacts and location sharing.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-12 px-6 bg-white">
        <div className="max-w-md mx-auto text-center">
          <h3 className="font-semibold text-gray-900 mb-6">Trusted Worldwide</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-2xl font-bold text-teal-600 mb-1">50K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-600 mb-1">180+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-600 mb-1">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}