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
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Upload,
  CheckCircle,
  Clock,
  Globe,
  Camera
} from 'lucide-react';




export function TouristRegistration({ onBack, onComplete }) {



  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    dateOfBirth: '',
    gender: '',
    
    // Emergency Contacts
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    emergencyEmail: '',
    
    // KYC Documents
    documentType: '',
    documentNumber: '',
    documentFile: null,
    selfieFile: null,
    
    // Trip Itinerary
    destinations: '',
    tripDuration: '',
    startDate: '',
    endDate: '',
    accommodationType: '',
    tripPurpose: '',
    specialRequirements: ''
  });

  const [uploadStatus, setUploadStatus] = useState({
    document: false,
    selfie: false
  });

  const steps = [
    { id: 1, title: 'Basic Details', icon: User },
    { id: 2, title: 'Emergency Contacts', icon: Phone },
    { id: 3, title: 'KYC Verification', icon: FileText },
    { id: 4, title: 'Trip Itinerary', icon: MapPin }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (type, file) => {
    setFormData(prev => ({
      ...prev,
      [`${type}File`]: file
    }));
    setUploadStatus(prev => ({
      ...prev,
      [type]: true
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate blockchain-based Tourist ID (mock for now)
      const touristId = `BTID-${Date.now().toString(36).toUpperCase()}`;
      onComplete && onComplete(formData, touristId);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack && onBack();
    }
  };

  const isStepValid = () => {
    switch(currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2:
        return formData.emergencyName && formData.emergencyPhone && formData.emergencyRelation;
      case 3:
        return formData.documentType && formData.documentNumber && uploadStatus.document && uploadStatus.selfie;
      case 4:
        return formData.destinations && formData.startDate && formData.endDate && formData.tripPurpose;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="sm" onClick={handlePrevious}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Tourist Registration</h1>
              <p className="text-sm text-gray-500">Blockchain-based Tourist ID System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Progress Steps */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  currentStep >= step.id ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.id 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              Basic Details
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nationality</label>
                  <Input
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    placeholder="Enter nationality"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Emergency Contacts */}
        {currentStep === 2 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Phone className="h-5 w-5 text-emerald-600" />
              Emergency Contacts
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contact Name *</label>
                <Input
                  value={formData.emergencyName}
                  onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                  placeholder="Enter emergency contact name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <Input
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Relationship *</label>
                  <Select value={formData.emergencyRelation} onValueChange={(value) => handleInputChange('emergencyRelation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Emergency Contact Email</label>
                <Input
                  type="email"
                  value={formData.emergencyEmail}
                  onChange={(e) => handleInputChange('emergencyEmail', e.target.value)}
                  placeholder="Enter emergency contact email"
                />
              </div>

              <Alert>
                <Phone className="h-4 w-4" />
                <AlertDescription>
                  This contact will be notified in case of emergency during your trip. Please ensure the information is accurate.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        )}

        {/* Step 3: KYC Verification */}
        {currentStep === 3 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              KYC Verification
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Document Type *</label>
                <Select value={formData.documentType} onValueChange={(value) => handleInputChange('documentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="aadhar">Aadhar Card</SelectItem>
                    <SelectItem value="driving-license">Driving License</SelectItem>
                    <SelectItem value="voter-id">Voter ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Document Number *</label>
                <Input
                  value={formData.documentNumber}
                  onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                  placeholder="Enter document number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Document *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                    {uploadStatus.document ? (
                      <div className="text-emerald-600">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Document uploaded</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Click to upload document</p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload('document', e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Upload Selfie *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                    {uploadStatus.selfie ? (
                      <div className="text-emerald-600">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Selfie uploaded</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Camera className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Click to upload selfie</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('selfie', e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your documents will be verified using blockchain technology to ensure security and authenticity. All data is encrypted and stored securely.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        )}

        {/* Step 4: Trip Itinerary */}
        {currentStep === 4 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Trip Itinerary
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Destinations to Visit *</label>
                <Textarea
                  value={formData.destinations}
                  onChange={(e) => handleInputChange('destinations', e.target.value)}
                  placeholder="List the places you plan to visit (e.g., Tokyo, Kyoto, Osaka)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date *</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date *</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Trip Purpose *</label>
                  <Select value={formData.tripPurpose} onValueChange={(value) => handleInputChange('tripPurpose', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tourism">Tourism</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="family">Family Visit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Accommodation Type</label>
                  <Select value={formData.accommodationType} onValueChange={(value) => handleInputChange('accommodationType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accommodation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="airbnb">Airbnb</SelectItem>
                      <SelectItem value="family">Family/Friends</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Requirements</label>
                <Textarea
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  placeholder="Any special requirements, medical conditions, or accessibility needs"
                  rows={3}
                />
              </div>

              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  Your itinerary will help us provide personalized safety alerts and recommendations during your trip.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Back' : 'Previous'}
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {currentStep === 4 ? (
              <>
                Generate Tourist ID
                <Shield className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </>
            )}
          </Button>
        </div>

        {/* Blockchain Info */}
        <Card className="p-4 mt-6 bg-emerald-50 border-emerald-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-emerald-900 mb-1">Blockchain-Secured Tourist ID</h3>
              <p className="text-sm text-emerald-700">
                Your Tourist ID will be generated using blockchain technology, ensuring tamper-proof verification 
                and secure access to tourist services throughout your journey.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

