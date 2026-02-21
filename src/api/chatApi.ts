import axiosClient from './client';

export interface ChatMessage {
	id: number;
	text: string | null;
	imageName: string | null;
	sender: string;
	timestamp: string;
	imageUrl: string | null;
}

export interface SendMessageResponse {
	success: boolean;
	data: ChatMessage;
}

export interface GetMessagesResponse {
	success: boolean;
	data: ChatMessage[];
}

// Send message with optional image
export const sendChatMessage = async (
	text: string,
	imageFile?: File,
	sender: string = 'user',
): Promise<SendMessageResponse> => {
	const formData = new FormData();

	if (text) {
		formData.append('text', text);
	}

	if (imageFile) {
		formData.append('image', imageFile);
	}

	formData.append('sender', sender);

	const response = await axiosClient.post<SendMessageResponse>('/chat/send', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};

// Get all chat messages
export const getChatMessages = async (): Promise<GetMessagesResponse> => {
	const response = await axiosClient.get<GetMessagesResponse>('/chat/messages');
	return response.data;
};

// Clear chat
export const clearChat = async () => {
	const response = await axiosClient.delete('/chat/clear');
	return response.data;
};
