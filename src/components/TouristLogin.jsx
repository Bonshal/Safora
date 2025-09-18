import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ArrowLeft, Users, Shield } from 'lucide-react';

export function TouristLogin({ onLogin, onBack }) {
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
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">Safora</span>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to your Account
          </h1>
          <p className="text-gray-600">
            Enter your email and password to log in to your account
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-6 mb-6 shadow-sm border-0 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                EMAIL ADDRESS
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                required
                className="w-full bg-white border-gray-200 rounded-xl h-12"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                PASSWORD
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-white border-gray-200 rounded-xl h-12"
              />
            </div>

            <div className="text-right">
              <span className="text-sm text-teal-600 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl h-12"
            >
              Log In
            </Button>
          </form>
        </Card>

        {/* Social Login Options */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-xl border-gray-200">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E" alt="Google" className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button variant="outline" className="h-12 rounded-xl border-gray-200">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.650-2.068 5.12-1.194 1.492-2.761 2.711-4.593 3.378-.855.312-1.741.492-2.634.555v-4.592c1.266-.086 2.364-.528 3.132-1.269l-.523-.853c-.534.468-1.287.703-2.138.703-.683 0-1.336-.204-1.894-.552-.534-.333-.961-.784-1.241-1.309-.291-.544-.435-1.135-.435-1.721 0-.551.125-1.085.354-1.564.231-.485.561-.905.96-1.225.412-.331.886-.572 1.39-.705.517-.136 1.053-.136 1.57 0 .295.078.577.198.835.357.244.151.462.341.646.563l.68-.783c-.278-.322-.604-.608-.964-.843-.375-.244-.781-.431-1.205-.555-.464-.135-.94-.201-1.417-.201-1.385 0-2.7.587-3.654 1.613-1.041 1.122-1.612 2.593-1.612 4.137 0 .294.021.587.061.876-1.318-1.265-2.141-3.028-2.141-4.984C2.25 6.226 5.226 3.25 9 3.25s6.75 2.976 6.75 6.75c0 .386-.034.766-.099 1.137.917-.98 1.434-2.279 1.434-3.71 0-.221-.011-.441-.032-.659.708.674 1.147 1.623 1.147 2.676 0 .533-.114 1.041-.318 1.496z'/%3E%3C/svg%3E" alt="Apple" className="w-5 h-5 mr-2" />
              Apple
            </Button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? <span className="text-gray-900 font-medium cursor-pointer hover:underline">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}