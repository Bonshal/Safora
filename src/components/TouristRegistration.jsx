import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { touristService } from '../lib/supabase';
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
  Camera,
  Plus,
  Trash2,
  Loader,
  AlertTriangle
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
    destinations: [''], // Array of destinations, starting with one empty field
    tripDuration: '',
    startDate: '',
    endDate: '',
    specialRequirements: ''
  });

  const [uploadStatus, setUploadStatus] = useState({
    document: false,
    selfie: false
  });

  const [submissionState, setSubmissionState] = useState({
    isLoading: false,
    error: null,
    success: false
  });

  const [verificationState, setVerificationState] = useState({
    isVerifying: false,
    isVerified: false,
    error: null
  });

  const steps = [
    { id: 1, title: 'Basic Details', icon: User },
    { id: 2, title: 'Emergency Contacts', icon: Phone },
     { id: 3, title: 'Trip Itinerary', icon: MapPin },
    { id: 4, title: 'KYC Verification', icon: FileText },
   
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Convert trip duration text to days with buffer
  const convertTripDurationToDays = (durationText) => {
    const durationMap = {
      "1-3 days": 3 + 15, // 18 days
      "4-7 days": 7 + 15, // 22 days  
      "1-2 weeks": 14 + 15, // 29 days
      "3-4 weeks": 28 + 15, // 43 days
      "1+ month": 30 + 15  // 45 days
    };
    
    return durationMap[durationText] || 0;
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

  // Destination management functions
  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, '']
    }));
  };

  const removeDestination = (index) => {
    if (formData.destinations.length > 1) {
      setFormData(prev => ({
        ...prev,
        destinations: prev.destinations.filter((_, i) => i !== index)
      }));
    }
  };

  const updateDestination = (index, value) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.map((dest, i) => i === index ? value : dest)
    }));
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Step 4 (KYC) - Show verification process instead of direct submission
      if (!verificationState.isVerified) {
        // Start verification process
        await handleVerification();
      } else {
        // Verification complete, proceed with final submission
        await handleFinalSubmission();
      }
    }
  };

  const handleVerification = async () => {
    setVerificationState({ isVerifying: true, isVerified: false, error: null });
    
    try {
      // Simulate document verification process (3-5 seconds)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Simulate verification success (you can add validation logic here)
      const hasDocuments = uploadStatus.document && uploadStatus.selfie;
      const hasDocumentNumber = formData.documentNumber?.trim();
      const hasDocumentType = formData.documentType;
      
      if (!hasDocuments || !hasDocumentNumber || !hasDocumentType) {
        throw new Error('Please ensure all required documents are uploaded and document details are filled');
      }
      
      // Verification successful
      setVerificationState({ 
        isVerifying: false, 
        isVerified: true, 
        error: null 
      });
      
    } catch (error) {
      setVerificationState({ 
        isVerifying: false, 
        isVerified: false, 
        error: error.message 
      });
    }
  };

  const handleFinalSubmission = async () => {
    // Final submission - save to Supabase
    setSubmissionState({ isLoading: true, error: null, success: false });
    
    try {
      // Generate a temporary ID for file uploads
      const tempTouristId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Upload documents and selfie to Supabase Storage
      let documentUrls = {};
      if (formData.documentFile || formData.selfieFile) {
        const uploadResult = await touristService.uploadTouristDocuments({
          documentFile: formData.documentFile,
          selfieFile: formData.selfieFile
        }, tempTouristId);

        if (uploadResult.error) {
          throw new Error(`File upload failed: ${uploadResult.error.message}`);
        }

        documentUrls = uploadResult.data;
      }

      // Prepare data for Supabase (matching our new database schema)
      const touristData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        emergencyContactName: formData.emergencyName,
        emergencyContactPhone: formData.emergencyPhone,
        emergencyContactRelationship: formData.emergencyRelation,
        emergencyContactEmail: formData.emergencyEmail,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        documentUrl: documentUrls.documentUrl || null,
        selfieUrl: documentUrls.selfieUrl || null,
        destinations: formData.destinations.filter(dest => dest.trim() !== ''),
        tripDuration: convertTripDurationToDays(formData.tripDuration),
        specialRequirements: formData.specialRequirements || ''
      };

      // Save to Supabase
      const { data, error } = await touristService.createTourist(touristData);

      if (error) {
        throw new Error(error.message || 'Failed to save registration');
      }

      // Success! Get the generated ID from Supabase
      const touristId = data?.id || `BTID-${Date.now().toString(36).toUpperCase()}`;
      
      setSubmissionState({ isLoading: false, error: null, success: true });
      
      // Call the completion callback with the real database ID
      if (onComplete) {
        onComplete(formData, touristId);
      }

    } catch (error) {
      console.error('Registration error:', error);
      setSubmissionState({ 
        isLoading: false, 
        error: error.message || 'Failed to complete registration. Please try again.', 
        success: false 
      });
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
        // Trip Itinerary - check if at least one destination is filled and duration is set
        return formData.destinations.some(dest => dest.trim() !== '') && formData.tripDuration;
      case 4:
        // KYC Verification - check documents are uploaded
        return formData.documentType && formData.documentNumber && uploadStatus.document && uploadStatus.selfie;
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

        {/* Step 3: Trip Itinerary */}
        {currentStep === 3 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Trip Itinerary
            </h2>
            
            <div className="space-y-4">
              {/* Dynamic Destinations */}
              <div>
                <label className="block text-sm font-medium mb-3">Destinations to Visit *</label>
                
                <div className="space-y-3">
                  {formData.destinations.map((destination, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          value={destination}
                          onChange={(e) => updateDestination(index, e.target.value)}
                          placeholder={index === 0 ? "Enter your first destination (e.g., Shillong)" : `Enter destination ${index + 1}`}
                        />
                      </div>
                      {formData.destinations.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDestination(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Destination Button - positioned below and on the left */}
                  <div className="flex justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addDestination}
                      className="flex items-center gap-1 text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                    >
                      <Plus className="h-4 w-4" />
                      Add Destination
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trip Duration</label>
                <Select value={formData.tripDuration} onValueChange={(value) => handleInputChange('tripDuration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 days">1-3 days</SelectItem>
                    <SelectItem value="4-7 days">4-7 days</SelectItem>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="3-4 weeks">3-4 weeks</SelectItem>
                    <SelectItem value="1+ month">1+ month</SelectItem>
                  </SelectContent>
                </Select>
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


        
        {/* Step 4: KYC Verification */}
        {currentStep === 4 && (
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
                  type="text"
                  value={formData.documentNumber}
                  onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                  placeholder="Enter document number "
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

              {/* Verification Process */}
              {verificationState.isVerifying && (
                <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-center space-y-4 flex-col">
                    <Loader className="h-8 w-8 text-blue-600 animate-spin" />
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">Verifying Documents...</h3>
                      <p className="text-blue-600 text-sm">
                        Please wait while we verify your documents using our secure blockchain verification system.
                      </p>
                      <p className="text-blue-500 text-xs mt-1">This usually takes 30-60 seconds.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Success */}
              {verificationState.isVerified && (
                <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Verification Successful!</h3>
                      <p className="text-green-600 text-sm">
                        Your documents have been successfully verified. You can now submit your registration.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Error */}
              {verificationState.error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-red-800">Verification Failed</h3>
                      <p className="text-red-600 text-sm">{verificationState.error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Final Submission Loading */}
              {submissionState.isLoading && (
                <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-center space-y-4 flex-col">
                    <Loader className="h-8 w-8 text-emerald-600 animate-spin" />
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-2">Submitting Registration...</h3>
                      <p className="text-emerald-600 text-sm">
                        Saving your registration to our secure database.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submission Success */}
              {submissionState.success && (
                <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Registration Complete!</h3>
                      <p className="text-green-600 text-sm">
                        Your tourist registration has been successfully submitted and saved to our database.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submission Error */}
              {submissionState.error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-red-800">Submission Failed</h3>
                      <p className="text-red-600 text-sm">{submissionState.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}


        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={submissionState.isLoading || verificationState.isVerifying || submissionState.success}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Back' : 'Previous'}
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!isStepValid() || submissionState.isLoading || verificationState.isVerifying || submissionState.success}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {verificationState.isVerifying ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Verifying Documents...
              </>
            ) : submissionState.isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Saving to Database...
              </>
            ) : submissionState.success ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Registration Complete
              </>
            ) : currentStep === 4 ? (
              !verificationState.isVerified ? (
                <>
                  Verify Documents
                  <Shield className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Submit Registration
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )
            ) : (
              <>
                Next
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {submissionState.error && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              <strong>Registration Failed:</strong> {submissionState.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {submissionState.success && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-800">
              <strong>Success!</strong> Tourist registration completed successfully and saved to database.
            </AlertDescription>
          </Alert>
        )}

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

