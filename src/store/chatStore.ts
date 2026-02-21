import { create } from 'zustand';

export interface ChatMessage {
	id: number;
	text: string | null;
	imageName: string | null;
	sender: string;
	timestamp: string;
	imageUrl: string | null;
}

interface ChatStore {
	messages: ChatMessage[];
	isLoading: boolean;
	error: string | null;
	isBotTyping: boolean;

	setMessages: (messages: ChatMessage[]) => void;
	addMessage: (message: ChatMessage) => void;
	addBotMessage: (text: string, image?: string) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setIsBotTyping: (typing: boolean) => void;
	clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
	messages: [],
	isLoading: false,
	error: null,
	isBotTyping: false,

	setMessages: (messages) => set({ messages }),
	addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
	addBotMessage: (text, image) =>
		set((state) => ({
			messages: [
				...state.messages,
				{
					id: Date.now(),
					text,
					imageName: image || null,
					sender: 'bot',
					timestamp: new Date().toISOString(),
					imageUrl: image || null,
				} as ChatMessage,
			],
		})),
	setLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),
	setIsBotTyping: (isBotTyping) => set({ isBotTyping }),
	clearMessages: () => set({ messages: [] }),
}));
