import { useEffect } from 'react';
import { API_CONFIG } from './config/api';

const DebugConfig = () => {
  useEffect(() => {
    console.log('Configuration de l\'API:', {
      baseUrl: API_CONFIG.baseUrl,
      imageBaseUrl: API_CONFIG.imageBaseUrl,
      hasApiKey: !!API_CONFIG.apiKey,
      apiKeyLength: API_CONFIG.apiKey ? API_CONFIG.apiKey.length : 0,
      language: API_CONFIG.language,
      endpoints: API_CONFIG.endpoints
    });
  }, []);

  return null;
};

export default DebugConfig;
