import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.warn('VITE_SUPABASE_URL is not set in environment variables');
}

if (!supabaseAnonKey) {
  console.warn('VITE_SUPABASE_ANON_KEY is not set in environment variables');
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database helper functions for tourist registration
export const touristService = {
  /**
   * Upload file to Supabase Storage
   * @param {File} file - The file to upload
   * @param {string} bucket - The storage bucket name ('documents', 'selfies')
   * @param {string} fileName - The file name/path in storage
   * @returns {Promise<{data: Object, error: Object}>} - Upload response with public URL
   */
  async uploadFile(file, bucket, fileName) {
    if (!supabase) {
      console.error('Supabase client not initialized. Please check your environment variables.');
      return {
        data: null,
        error: { message: 'Storage connection not configured' }
      };
    }

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error(`Error uploading file to ${bucket}:`, error);
        return { data: null, error };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      console.log(`File uploaded successfully to ${bucket}:`, data);
      return { 
        data: { 
          ...data, 
          publicUrl,
          fileName 
        }, 
        error: null 
      };
    } catch (err) {
      console.error(`Unexpected error uploading file to ${bucket}:`, err);
      return {
        data: null,
        error: { message: 'An unexpected error occurred while uploading the file' }
      };
    }
  },

  /**
   * Upload document and selfie images for a tourist
   * @param {Object} files - Object containing documentFile and selfieFile
   * @param {string} touristId - Unique identifier for the tourist
   * @returns {Promise<{data: Object, error: Object}>} - Upload response with URLs
   */
  async uploadTouristDocuments(files, touristId) {
    if (!supabase) {
      return {
        data: null,
        error: { message: 'Storage connection not configured' }
      };
    }

    try {
      const uploadPromises = [];
      const results = {};

      // Upload document if provided
      if (files.documentFile) {
        const documentFileName = `${touristId}/document_${Date.now()}.${files.documentFile.name.split('.').pop()}`;
        uploadPromises.push(
          this.uploadFile(files.documentFile, 'documents', documentFileName)
            .then(result => ({ type: 'document', result }))
        );
      }

      // Upload selfie if provided
      if (files.selfieFile) {
        const selfieFileName = `${touristId}/selfie_${Date.now()}.${files.selfieFile.name.split('.').pop()}`;
        uploadPromises.push(
          this.uploadFile(files.selfieFile, 'selfies', selfieFileName)
            .then(result => ({ type: 'selfie', result }))
        );
      }

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);

      // Process results
      for (const upload of uploadResults) {
        if (upload.result.error) {
          throw new Error(`Failed to upload ${upload.type}: ${upload.result.error.message}`);
        }
        results[`${upload.type}Url`] = upload.result.data.publicUrl;
        results[`${upload.type}Path`] = upload.result.data.fileName;
      }

      return { data: results, error: null };
    } catch (err) {
      console.error('Error uploading tourist documents:', err);
      return {
        data: null,
        error: { message: err.message || 'Failed to upload documents' }
      };
    }
  },

  /**
   * Create a new tourist registration in the database
   * @param {Object} touristData - The tourist registration data
   * @returns {Promise<{data: Object, error: Object}>} - Supabase response with tourist ID
   */
  async createTourist(touristData) {
    if (!supabase) {
      console.error('Supabase client not initialized. Please check your environment variables.');
      return {
        data: null,
        error: { message: 'Database connection not configured' }
      };
    }

    try {
      const { data, error } = await supabase
        .from('tourists')
        .insert([{
          first_name: touristData.firstName,
          last_name: touristData.lastName,
          email: touristData.email,
          phone: touristData.phone,
          nationality: touristData.nationality,
          date_of_birth: touristData.dateOfBirth,
          gender: touristData.gender,
          emergency_contact_name: touristData.emergencyContactName,
          emergency_contact_phone: touristData.emergencyContactPhone,
          emergency_contact_relationship: touristData.emergencyContactRelationship,
          emergency_contact_email: touristData.emergencyContactEmail,
          document_type: touristData.documentType,
          document_number: touristData.documentNumber,
          document_url: touristData.documentUrl,
          selfie_url: touristData.selfieUrl,
          destinations: touristData.destinations,
          trip_duration: touristData.tripDuration,
          special_requirements: touristData.specialRequirements,
          txhash: touristData.txhash || null,
          verification_status: 'verified',
          status: 'active',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating tourist:', error);
        return { data: null, error };
      }

      console.log('Tourist created successfully:', data);
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error creating tourist:', err);
      return {
        data: null,
        error: { message: 'An unexpected error occurred while creating the tourist registration' }
      };
    }
  },

  /**
   * Get all tourists from the database
   * @returns {Promise<{data: Array, error: Object}>} - List of tourists
   */
  async getAllTourists() {
    if (!supabase) {
      return {
        data: [],
        error: { message: 'Database connection not configured' }
      };
    }

    try {
      const { data, error } = await supabase
        .from('tourists')
        .select('*')
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (err) {
      console.error('Error fetching tourists:', err);
      return {
        data: [],
        error: { message: 'Failed to fetch tourists' }
      };
    }
  },

  /**
   * Get a tourist by ID
   * @param {string} touristId - The tourist ID
   * @returns {Promise<{data: Object, error: Object}>} - Tourist data
   */
  async getTouristById(touristId) {
    if (!supabase) {
      return {
        data: null,
        error: { message: 'Database connection not configured' }
      };
    }

    try {
      const { data, error } = await supabase
        .from('tourists')
        .select('*')
        .eq('id', touristId)
        .single();

      return { data, error };
    } catch (err) {
      console.error('Error fetching tourist by ID:', err);
      return {
        data: null,
        error: { message: 'Failed to fetch tourist details' }
      };
    }
  },

  /**
   * Update tourist status
   * @param {string} touristId - The tourist ID
   * @param {string} status - New status ('active', 'inactive', 'emergency')
   * @returns {Promise<{data: Object, error: Object}>} - Updated tourist data
   */
  async updateTouristStatus(touristId, status) {
    if (!supabase) {
      return {
        data: null,
        error: { message: 'Database connection not configured' }
      };
    }

    try {
      const { data, error } = await supabase
        .from('tourists')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', touristId)
        .select()
        .single();

      return { data, error };
    } catch (err) {
      console.error('Error updating tourist status:', err);
      return {
        data: null,
        error: { message: 'Failed to update tourist status' }
      };
    }
  }
};

// Export both the client and service
export default supabase;