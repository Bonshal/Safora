import React, { useState, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronUp, MapPin, Clock, CheckCircle2, Shield } from 'lucide-react';

const mockTripData = [
  {
    id: '1',
    name: 'Paris, France',
    description: 'Explored the Eiffel Tower and Louvre Museum',
    estimatedTime: '3 days',
    type: 'visited',
    safetyScore: 85
  },
  {
    id: '2',
    name: 'Rome, Italy',
    description: 'Visited the Colosseum and Vatican City',
    estimatedTime: '2 days',
    type: 'visited',
    safetyScore: 78
  },
  {
    id: '3',
    name: 'Barcelona, Spain',
    description: 'Currently exploring Sagrada Familia and Park Güell',
    estimatedTime: '4 days',
    type: 'current',
    safetyScore: 82
  },
  {
    id: '4',
    name: 'Amsterdam, Netherlands',
    description: 'Canal tours and Van Gogh Museum',
    estimatedTime: '2 days',
    type: 'upcoming',
    safetyScore: 91
  },
  {
    id: '5',
    name: 'Berlin, Germany',
    description: 'Historical sites and modern culture',
    estimatedTime: '3 days',
    type: 'upcoming',
    safetyScore: 88
  },
  {
    id: '6',
    name: 'Prague, Czech Republic',
    description: 'Old Town Square and Prague Castle',
    estimatedTime: '2 days',
    type: 'upcoming',
    safetyScore: 86
  },
  {
    id: '7',
    name: 'Vienna, Austria',
    description: 'Imperial palaces and classical music',
    estimatedTime: '2 days',
    type: 'upcoming',
    safetyScore: 93
  }
];

function SafetyScore({ score, size = 'default' }) {
  const radius = size === 'small' ? 20 : size === 'large' ? 40 : 28;
  const strokeWidth = size === 'small' ? 3 : size === 'large' ? 5 : 4;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
  
  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981'; // green
    if (score >= 70) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const containerSize = size === 'small' ? 'w-12 h-12' : size === 'large' ? 'w-20 h-20' : 'w-16 h-16';
  const textSize = size === 'small' ? 'text-sm' : size === 'large' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`relative ${containerSize}`}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-muted/20"
        />
        <circle
          stroke={getScoreColor(score)}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`${textSize} text-foreground font-bold leading-none`}>{score}</div>
          {size !== 'small' && (
            <div className={`text-xs text-muted-foreground ${size === 'large' ? 'mt-1' : '-mt-0.5'}`}>Safety</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TripPlan() {
  const [isVisitedOpen, setIsVisitedOpen] = useState(false);
  const [expandedDestinationId, setExpandedDestinationId] = useState(null);

  const visitedPlaces = mockTripData.filter(place => place.type === 'visited');
  const currentLocation = mockTripData.find(place => place.type === 'current');
  const upcomingDestinations = mockTripData.filter(place => place.type === 'upcoming');

  const handleDestinationClick = (destination) => {
    // Toggle expansion of the clicked destination
    setExpandedDestinationId(expandedDestinationId === destination.id ? null : destination.id);
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <h1 className="text-center mb-2">European Adventure</h1>
        <p className="text-center text-muted-foreground">Your Journey Through Europe</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Already Visited Section */}
        <Collapsible open={isVisitedOpen} onOpenChange={setIsVisitedOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between bg-card hover:bg-accent transition-colors border-border"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Already Visited ({visitedPlaces.length})</span>
              </div>
              {isVisitedOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {visitedPlaces.map((place) => (
              <Card key={place.id} className="bg-card border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-foreground">{place.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{place.description}</p>
                        <Badge variant="secondary" className="text-xs mt-2">
                          {place.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                    {/* <SafetyScore score={place.safetyScore} size="small" /> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Current Location */}
        {currentLocation && (
          <Card className="border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg border-2">
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    
                    {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" /> */}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-primary text-xs font-semibold uppercase tracking-widest">Current Location</h3>
                      <MapPin className="w-4 h-4 text-destructive" />
                    </div>
                    <h2 className="text-foreground mt-1 text-2xl font-bold tracking-tight">{currentLocation.name}</h2>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed font-light">{currentLocation.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex-1 h-2 bg-muted border border-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-500 ease-in-out"
                          style={{ width: '50%' }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap font-medium tracking-wide">
                        {currentLocation.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Safety Score below the progress bar */}
                <div className="flex justify-center mt-6">
                  <SafetyScore score={currentLocation.safetyScore} size="large" />
                </div>
              </div>
              {/* <div className="flex items-center gap-2 text-sm text-primary">
                <Clock className="w-4 h-4" />
                <span>Currently exploring</span>
              </div> */}
            </div>
          </Card>
        )}

        {/* Next Destinations */}
        <div>
          <h3 className="mb-3 text-muted-foreground">Next Destinations</h3>
          <ScrollArea className="h-96">
            <div className="space-y-3 pr-4">
              {upcomingDestinations.map((destination, index) => {
                const isExpanded = expandedDestinationId === destination.id;
                
                // Get safety color based on score
                const getSafetyColor = (score) => {
                  if (score >= 85) return '#10b981'; // green
                  if (score >= 70) return '#f59e0b'; // yellow
                  return '#ef4444'; // red
                };
                
                const safetyColor = getSafetyColor(destination.safetyScore);
                
                return (
                  <Card 
                    key={destination.id} 
                    className={`cursor-pointer transition-all duration-300 border-border hover:scale-[1.02] ${
                      isExpanded 
                        ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/50 shadow-lg' 
                        : 'bg-card hover:bg-accent hover:shadow-lg hover:border-primary/20'
                    }`}
                    style={!isExpanded ? { borderLeftColor: safetyColor, borderLeftWidth: '4px' } : {}}
                    onClick={() => handleDestinationClick(destination)}
                  >
                    <div className={`transition-all duration-300 ${isExpanded ? 'p-6' : 'p-4'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-sm flex-shrink-0 mt-0.5 ${
                            isExpanded ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-foreground">{destination.name}</h4>
                              {!isExpanded && (
                                <div 
                                  className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white flex-shrink-0"
                                  style={{ backgroundColor: safetyColor }}
                                >
                                  {destination.safetyScore}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{destination.description}</p>
                            <Badge 
                              variant={isExpanded ? "default" : "outline"} 
                              className={`text-xs mt-2 ${
                                isExpanded 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'border-border'
                              }`}
                            >
                              {destination.estimatedTime}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                        <>
                          {/* Safety Score below the content */}
                          <div className="flex justify-center mt-4">
                            <SafetyScore score={destination.safetyScore} size="large" />
                          </div>
                          <div className="flex items-center gap-2 text-sm text-primary mt-4">
                            <Clock className="w-4 h-4" />
                            <span>Planned destination</span>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}