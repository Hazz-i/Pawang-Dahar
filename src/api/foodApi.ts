import axiosClient from './client';

export interface FoodAnalysisResponse {
  success: boolean;
  data: {
    id: number;
    personality: 'supportive' | 'savage';
    analysis: string;
    timestamp: string;
  };
}

export interface FoodHistoryResponse {
  success: boolean;
  data: Array<{
    id: number;
    timestamp: string;
    personality: string;
    analysis: string;
    originalFileName: string;
  }>;
}

// Analyze food image with AI
export const analyzeFood = async (
  imageFile: File,
  personality: 'supportive' | 'savage' = 'supportive'
): Promise<FoodAnalysisResponse> => {
  const formData = new FormData();
  formData.append('foodImage', imageFile);
  formData.append('personality', personality);

  const response = await axiosClient.post<FoodAnalysisResponse>(
    '/food/analyze',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};

// Get food analysis history
export const getFoodHistory = async (): Promise<FoodHistoryResponse> => {
  const response = await axiosClient.get<FoodHistoryResponse>('/food/history');
  return response.data;
};

// Clear food history
export const clearFoodHistory = async () => {
  const response = await axiosClient.delete('/food/history');
  return response.data;
};
