import {
  SurgePredictionRequest,
  SurgePredictionResponse,
  BatchPredictionRequest,
  SurgeAPIHealthResponse,
} from '../types';

const SURGE_API_URL = process.env.NEXT_PUBLIC_SURGE_API_URL || 'http://localhost:8000';

/**
 * API client for the external surge prediction service
 */
class SurgeAPIClient {
  private baseURL: string;

  constructor(baseURL: string = SURGE_API_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Predict patient surge for a single scenario
   */
  async predictSurge(request: SurgePredictionRequest): Promise<SurgePredictionResponse> {
    console.log('🔵 [SURGE API] Starting prediction request');
    console.log('🔵 [SURGE API] Base URL:', this.baseURL);
    console.log('🔵 [SURGE API] Full URL:', `${this.baseURL}/api/predict`);
    console.log('🔵 [SURGE API] Request payload:', JSON.stringify(request, null, 2));
    
    try {
      const response = await fetch(`${this.baseURL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('🔵 [SURGE API] Response status:', response.status);
      console.log('🔵 [SURGE API] Response status text:', response.statusText);
      console.log('🔵 [SURGE API] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 [SURGE API] Error response body:', errorText);
        throw new Error(`Surge API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ [SURGE API] Success! Response data:', JSON.stringify(data, null, 2));
      console.log('✅ [SURGE API] Response data type:', typeof data);
      console.log('✅ [SURGE API] Response keys:', Object.keys(data));
      return data;
    } catch (error) {
      console.error('🔴 [SURGE API] Error calling surge prediction API:', error);
      console.error('🔴 [SURGE API] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('🔴 [SURGE API] Error message:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Predict patient surge for multiple scenarios (batch)
   * Maximum 10 scenarios per request
   */
  async predictBatch(request: BatchPredictionRequest): Promise<SurgePredictionResponse[]> {
    if (request.scenarios.length > 10) {
      throw new Error('Maximum 10 scenarios allowed per batch request');
    }

    try {
      const response = await fetch(`${this.baseURL}/api/predict/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Surge API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling batch surge prediction API:', error);
      throw error;
    }
  }

  /**
   * Health check for the surge prediction API
   */
  async healthCheck(): Promise<SurgeAPIHealthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking surge API health:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const surgeAPI = new SurgeAPIClient();

// Export class for custom instances
export default SurgeAPIClient;
