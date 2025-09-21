import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage.jsx';
import { WelcomePage } from './components/WelcomePage.jsx';
import { TouristLogin } from './components/TouristLogin.jsx';
import { AdminLogin } from './components/AdminLogin.jsx';
import { TouristDashboard } from './components/TouristDashboard.jsx';
import { AdminDashboard } from './components/AdminDashboard.jsx';
import { TouristRegistration } from './components/TouristRegistration.jsx';
import { TripPlan } from './components/TripPlan.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [appState, setAppState] = useState('landing');

  //hard code start
 
  //hard core end
 
  const handleGetStarted = () => {
    console.log('Get start clicked')
    setAppState('welcome');
  };

  const handleUserTypeSelect = (userType) => {
    if (userType === 'tourist') {
      setAppState('tourist-login');
    } else {
      setAppState('admin-login');
    }
  };

  const handleRegister = () => {
    setAppState('tourist-registration');
  };

  const handleRegistrationComplete = (formData, touristId) => {
    // Mock storing the registered user
    setUser({
      type: 'tourist',
      email: formData.email,
      touristId: touristId,
      name: `${formData.firstName} ${formData.lastName}`
    });
    setAppState('logged-in');
  };

  const handleLogin = (userType, credentials) => {
    // Mock authentication - in a real app, this would validate credentials
    setUser({
      type: userType,
      email: credentials.email
    });
    setAppState('logged-in');
  };

  const handleTouristLogin = (credentials) => {
    console.log('Tourist login called with:', credentials);
    handleLogin('tourist', credentials);
  };

  

  const handleAdminLogin = (credentials) => {
    handleLogin('admin', credentials);
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('landing');
  };

  const handleBack = () => {
    setAppState('welcome');
  };

  // Show landing page
  if (appState === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
    //  return <LandingPage onGetStarted={handleTouristLogin} />;
  }

  // Show welcome page (user type selection)
  if (appState === 'welcome') {
    return <WelcomePage onSelectUserType={handleUserTypeSelect} />;
    // return <div>Welcome page should render Here</div>
  }

  // Show tourist login
  if (appState === 'tourist-login') {
    return <TouristLogin onLogin={handleTouristLogin} onBack={handleBack} onRegister={handleRegister} />;
  }

  // Show tourist registration
  if (appState === 'tourist-registration') {
    return <TouristRegistration onBack={handleBack} onComplete={handleRegistrationComplete} />;
  }

  // Show admin login
  if (appState === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} onBack={handleBack} />;
  }

  // Show dashboard based on user type
  if (appState === 'logged-in' && user) {
    console.log('Rendering dashboard for user:', user);
    if (user.type === 'admin') {
      return <AdminDashboard onLogout={handleLogout} />;
    }
    return <TouristDashboard onLogout={handleLogout} />;
  }

  //trip plan
  if(appState == 'trip-plan'){
    return <TripPlan/>
  }

  // Fallback to landing page
  return <LandingPage onGetStarted={handleGetStarted} />;
  // return <WelcomePage onSelectUserType={handleUserTypeSelect}/>;
}