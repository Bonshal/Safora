import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ArrowLeft, Shield } from 'lucide-react';

export function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">Safora Admin</span>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Access
          </h1>
          <p className="text-gray-600">
            Secure login for system administrators
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-6 mb-6 shadow-sm border-0 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">
                ADMIN EMAIL
              </label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@safora.com"
                required
                className="w-full bg-white border-gray-200 rounded-xl h-12"
              />
            </div>
            
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                PASSWORD
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secure password"
                required
                className="w-full bg-white border-gray-200 rounded-xl h-12"
              />
            </div>

            <div className="text-right">
              <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                Contact System Administrator
              </span>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl h-12"
            >
              Admin Sign In
            </Button>
          </form>
        </Card>

        {/* Security Notice */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">Security Notice</p>
              <p className="text-xs text-amber-700 mt-1">
                Admin access is monitored and logged. Ensure secure network connection.
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? <span className="text-gray-900 font-medium cursor-pointer hover:underline">Contact IT Support</span>
          </p>
        </div>
      </div>
    </div>
  );
}