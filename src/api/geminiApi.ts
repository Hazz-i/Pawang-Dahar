import axiosClient from './client';

export interface GeminiChatResponse {
	success: boolean;
	data: {
		response: string;
	};
}

// Get greeting response from Gemini (text only, no image)
export const getBotGreeting = async (
	text: string,
	personality: 'supportive' | 'savage' = 'supportive',
): Promise<GeminiChatResponse> => {
	const response = await axiosClient.post<GeminiChatResponse>('/gemini/chat', {
		text,
		type: 'greeting',
		personality,
	});

	return response.data;
};

// Get bot response from Gemini for text messages
export const getBotResponseText = async (
	text: string,
	personality: 'supportive' | 'savage' = 'supportive',
): Promise<GeminiChatResponse> => {
	const response = await axiosClient.post<GeminiChatResponse>('/gemini/chat', {
		text,
		type: 'text',
		personality,
	});

	return response.data;
};

// Get bot response from Gemini for image analysis
export const getBotResponseImage = async (
	imageFile: File,
	text: string,
	personality: 'supportive' | 'savage' = 'supportive',
): Promise<GeminiChatResponse> => {
	const formData = new FormData();
	formData.append('image', imageFile);
	formData.append('text', text);
	formData.append('type', 'image');
	formData.append('personality', personality);

	const response = await axiosClient.post<GeminiChatResponse>('/gemini/chat', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};

