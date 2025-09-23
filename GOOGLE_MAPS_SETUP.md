# Google Maps API Configuration

## Setting up Google Maps API

To use the interactive Google Maps in this application, you need to:

1. **Get a Google Maps API Key:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API (optional, for enhanced features)
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

2. **Configure the API Key:**
   
   ### Option 1: Environment Variable (Recommended)
   Create a `.env.local` file in the root directory:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
   
   Then update the GoogleMapComponent.jsx to use:
   ```jsx
   apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
   ```

   ### Option 2: Direct Replacement
   Replace `"YOUR_GOOGLE_MAPS_API_KEY"` in these files:
   - `src/components/GoogleMapComponent.jsx`
   - `src/components/AdminDashboard.jsx`
   - `src/components/TouristDashboard.jsx`

3. **API Key Restrictions:**
   For security, restrict your API key to:
   - HTTP referrers: `localhost:*` and your production domain
   - APIs: Maps JavaScript API

## Features Implemented

The Google Maps integration includes:

- **Interactive Map Display**: Real Google Maps with satellite and terrain views
- **Geofencing Visualization**: Colored circles for sensitive zones
- **User Location Tracking**: Real-time markers for tourist locations
- **Zone Information**: Hover tooltips and click details for sensitive areas
- **Risk Level Indicators**: Color-coded zones (Red=High, Orange=Medium, Yellow=Low)
- **Real-time Alerts**: Visual indicators when users enter sensitive zones

## Testing Without API Key

The application will show a fallback message if the API key is not configured. The rest of the dashboard functionality will work normally.

## Cost Considerations

Google Maps API usage is billed based on:
- Map loads
- API calls
- Advanced features usage

For development and testing, Google provides $200 in free credits monthly, which is typically sufficient for small applications.

For production deployment, monitor your usage in the Google Cloud Console to avoid unexpected charges.