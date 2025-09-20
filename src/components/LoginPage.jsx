import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { MapPin, Shield, Globe, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function LoginPage({ onLogin }) {
  const [userType, setUserType] = useState('tourist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(userType, { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="relative h-48 bg-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-emerald-500/90"></div>
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1720539468812-b8c048d0bcf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMHVyYmFuJTIwdHJhdmVsfGVufDF8fHx8MTc1ODA5NjYyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Travel landscape"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-[rgba(66,152,141,0)]">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Safora</h1>
          </div>
          <p className="text-emerald-100 text-center px-4">Your intelligent travel safety companion</p>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* User Type Selection */}
        <div className="flex gap-4 mb-8">
          <Card 
            className={`flex-1 p-4 cursor-pointer border-2 transition-all ${
              userType === 'tourist' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'
            }`}
            onClick={() => setUserType('tourist')}
          >
            <div className="flex flex-col items-center text-center">
              <Users className={`h-8 w-8 mb-2 ${userType === 'tourist' ? 'text-emerald-600' : 'text-gray-400'}`} />
              <h3 className={`font-medium ${userType === 'tourist' ? 'text-emerald-900' : 'text-gray-700'}`}>Tourist</h3>
              <p className="text-sm text-gray-500 mt-1">Explore safely</p>
            </div>
          </Card>
          
          <Card 
            className={`flex-1 p-4 cursor-pointer border-2 transition-all ${
              userType === 'admin' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'
            }`}
            onClick={() => setUserType('admin')}
          >
            <div className="flex flex-col items-center text-center">
              <Shield className={`h-8 w-8 mb-2 ${userType === 'admin' ? 'text-emerald-600' : 'text-gray-400'}`} />
              <h3 className={`font-medium ${userType === 'admin' ? 'text-emerald-900' : 'text-gray-700'}`}>Admin</h3>
              <p className="text-sm text-gray-500 mt-1">Manage safety</p>
            </div>
          </Card>
        </div>

        {/* Login Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Tourist ID
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your unique tourist ID"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
            >
              Sign In as {userType === 'tourist' ? 'Tourist' : 'Admin'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account? <span className="text-emerald-600 cursor-pointer">Sign up</span>
            </p>
          </div>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4">
        
          
        </div>
      </div>
    </div>
  );
}