import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes for file upload
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    console.log('📤 Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received:`, response.status);
    console.log('📥 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  healthCheck: () => api.get('/'),
  
  // Get available trials
  getTrials: () => api.get('/api/trials'),
  
  // Get form fields for specific trial type
  getTrialFields: (trialType) => api.get(`/api/trial-fields/${trialType}`),
  
  // Submit patient application
  submitPatientApplication: (data) => api.post('/api/patient/apply', data),
  
  // Upload bulk file for organization
  uploadBulkFile: (formData) => {
    console.log('📤 Uploading file with form data:', formData);
    return api.post('/api/organization/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes for file upload
    });
  },
  
  // Get analytics data
  getAnalytics: () => api.get('/api/analytics'),
  
  // Get patients by trial type
  getPatients: (trialType) => api.get(`/api/patients/${trialType}`),
};

export default apiService;
