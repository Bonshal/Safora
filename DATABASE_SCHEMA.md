# Supabase Database Schema

## Tourists Table

Create this table in your Supabase project to store tourist registration data.

### SQL Schema

```sql
-- Create the tourists table
CREATE TABLE public.tourists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    emergency_contact_relationship VARCHAR(100) NOT NULL,
    emergency_contact_email VARCHAR(255),
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(50) UNIQUE NOT NULL,
    document_url TEXT, -- URL to document image in Supabase Storage
    selfie_url TEXT, -- URL to selfie image in Supabase Storage
    destinations TEXT[] NOT NULL, -- Array of destination strings
    trip_duration INTEGER NOT NULL, -- Trip duration in days (with buffer)
    special_requirements TEXT,
    txhash VARCHAR(66), -- Blockchain transaction hash (typically 64 chars + 0x prefix)
    verification_status VARCHAR(20) DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'emergency')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX idx_tourists_email ON public.tourists(email);

-- Create an index on document_number for faster lookups
CREATE INDEX idx_tourists_document_number ON public.tourists(document_number);

-- Create an index on verification_status for filtering
CREATE INDEX idx_tourists_verification_status ON public.tourists(verification_status);

-- Create an index on status for filtering
CREATE INDEX idx_tourists_status ON public.tourists(status);

-- Create an index on created_at for ordering
CREATE INDEX idx_tourists_created_at ON public.tourists(created_at);

-- Create an index on destinations for searching
CREATE INDEX idx_tourists_destinations ON public.tourists USING GIN (destinations);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tourists ENABLE ROW LEVEL SECURITY;

-- Create a policy for public access (you can modify this based on your authentication needs)
CREATE POLICY "Enable read access for all users" ON public.tourists
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.tourists
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.tourists
    FOR UPDATE USING (true);
```

## Add txhash Field to Existing Table

If you've already created the table, run this SQL command to add the blockchain transaction hash field:

```sql
-- Add txhash column to existing tourists table
ALTER TABLE public.tourists 
ADD COLUMN txhash VARCHAR(66);

-- Add comment for documentation
COMMENT ON COLUMN public.tourists.txhash IS 'Blockchain transaction hash for tourist registration verification';

-- Optional: Create index for faster hash lookups
CREATE INDEX idx_tourists_txhash ON public.tourists(txhash) WHERE txhash IS NOT NULL;
```

## Supabase Storage Setup

### Create Storage Buckets

You need to create two storage buckets in your Supabase project for storing uploaded files:

```sql
-- Create documents bucket for ID documents, passports, etc.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true);

-- Create selfies bucket for selfie photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('selfies', 'selfies', true);
```

### Storage Policies

```sql
-- Documents bucket policies
CREATE POLICY "Give users access to upload documents" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Give users access to view documents" ON storage.objects 
FOR SELECT USING (bucket_id = 'documents');

-- Selfies bucket policies  
CREATE POLICY "Give users access to upload selfies" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'selfies');

CREATE POLICY "Give users access to view selfies" ON storage.objects 
FOR SELECT USING (bucket_id = 'selfies');
```

### File Organization

Files will be organized in storage with the following structure:
- `documents/{tourist_id}/document_{timestamp}.{ext}` - ID documents
- `selfies/{tourist_id}/selfie_{timestamp}.{ext}` - Selfie photos


### Table Structure

| Column | Type | Description | Required | Unique |
|--------|------|-------------|----------|--------|
| id | UUID | Primary key (auto-generated) | Yes | Yes |
| first_name | VARCHAR(255) | Tourist's first name | Yes | No |
| last_name | VARCHAR(255) | Tourist's last name | Yes | No |
| email | VARCHAR(255) | Tourist's email address | Yes | Yes |
| phone | VARCHAR(20) | Tourist's phone number | Yes | No |
| nationality | VARCHAR(100) | Tourist's nationality | Yes | No |
| date_of_birth | DATE | Tourist's date of birth | Yes | No |
| gender | VARCHAR(20) | Tourist's gender | No | No |
| emergency_contact_name | VARCHAR(255) | Emergency contact full name | Yes | No |
| emergency_contact_phone | VARCHAR(20) | Emergency contact phone | Yes | No |
| emergency_contact_relationship | VARCHAR(100) | Relationship to tourist | Yes | No |
| emergency_contact_email | VARCHAR(255) | Emergency contact email | No | No |
| document_type | VARCHAR(50) | Type of ID document (passport, national_id, etc.) | Yes | No |
| document_number | VARCHAR(50) | Document/passport number | Yes | Yes |
| document_url | TEXT | URL to document image in Supabase Storage | No | No |
| selfie_url | TEXT | URL to selfie image in Supabase Storage | No | No |
| destinations | TEXT[] | Array of planned destinations | Yes | No |
| trip_duration | INTEGER | Trip duration in days (with 15-day buffer) | Yes | No |
| special_requirements | TEXT | Special requirements or medical conditions | No | No |
| txhash | VARCHAR(66) | Blockchain transaction hash | No | No |
| verification_status | VARCHAR(20) | KYC verification status (pending/verified/rejected) | No | No |
| status | VARCHAR(20) | Tourist status (active/inactive/emergency) | No | No |
| created_at | TIMESTAMP | Registration timestamp | Auto | No |
| updated_at | TIMESTAMP | Last update timestamp | Auto | No |

### Key Changes from Previous Schema

**Removed Fields:**
- `full_name` → Split into `first_name` and `last_name`
- `passport_number` → Replaced with generic `document_number`
- `medical_conditions` → Replaced with `special_requirements`
- `allergies` → Removed (not in current form)
- `travel_duration` → Renamed to `trip_duration`
- `accommodation_details` → Removed (destinations cover this)
- `purpose_of_visit` → Removed (defaulted to tourism)

**Added Fields:**
- `gender` → From basic details form
- `emergency_contact_email` → Additional emergency contact info
- `document_type` → To specify type of identity document
- `document_url` → URL to uploaded document image in Supabase Storage
- `selfie_url` → URL to uploaded selfie image in Supabase Storage

**Modified Fields:**
- `trip_duration` → Changed from VARCHAR to INTEGER (days with buffer)

### Trip Duration Conversion

The `trip_duration` field stores the number of days with a 15-day buffer added for flexibility:

| UI Selection | Days Calculation | Stored Value |
|-------------|------------------|--------------|
| "1-3 days" | 3 + 15 | 18 |
| "4-7 days" | 7 + 15 | 22 |
| "1-2 weeks" | 14 + 15 | 29 |
| "3-4 weeks" | 28 + 15 | 43 |
| "1+ month" | 30 + 15 | 45 |

This allows for better data analysis and automated processing while providing cushion for trip extensions.
- `destinations` → Array to store multiple destinations
- `verification_status` → To track KYC verification process

**Modified Fields:**
- `destinations` is now a TEXT[] array instead of a single accommodation field
- `document_number` replaces passport_number for more flexible ID types
- `special_requirements` combines medical conditions and special needs

### Setup Instructions

1. **Create Supabase Project:**
   - Go to [app.supabase.com](https://app.supabase.com/)
   - Create a new project
   - Note down your project URL and anon key

2. **Create the Table:**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the SQL schema above
   - Execute the query

3. **Configure Environment Variables:**
   - Update your `.env.local` file with:
     ```
     VITE_SUPABASE_URL=your_project_url_here
     VITE_SUPABASE_ANON_KEY=your_anon_key_here
     ```

4. **Test the Connection:**
   - Restart your development server
   - Try registering a new tourist to test the database integration

### Features Included

- **Automatic ID Generation:** UUID primary keys are generated automatically
- **Data Validation:** Required fields and data type constraints
- **Indexing:** Optimized queries for common lookups
- **Array Support:** PostgreSQL TEXT[] for multiple destinations
- **Verification Tracking:** KYC verification status management
- **Row Level Security:** Basic security policies (can be customized)
- **Timestamps:** Automatic creation and update timestamps
- **Status Management:** Tourist status tracking for safety management
- **Indexing:** Optimized queries for common lookups
- **Row Level Security:** Basic security policies (can be customized)
- **Timestamps:** Automatic creation and update timestamps
- **Status Management:** Tourist status tracking for safety management

### Optional Enhancements

You can extend this schema with additional tables for:

- **Tourist Locations:** Real-time location tracking
- **Geofence Alerts:** Alert history for zone violations  
- **Safety Incidents:** Incident reporting and management
- **Tourist Groups:** Group travel management
- **Notifications:** Push notification preferences and history