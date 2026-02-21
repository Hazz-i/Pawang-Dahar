import { create } from 'zustand';

interface FoodEntry {
	id: number;
	timestamp: string;
	personality: string;
	analysis: string;
	originalFileName: string;
}

interface FoodStore {
	history: FoodEntry[];
	isLoading: boolean;
	error: string | null;

	setHistory: (history: FoodEntry[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	addFoodEntry: (entry: FoodEntry) => void;
	clearHistory: () => void;
}

export const useFoodStore = create<FoodStore>((set) => ({
	history: [],
	isLoading: false,
	error: null,

	setHistory: (history) => set({ history }),
	setLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),
	addFoodEntry: (entry) => set((state) => ({ history: [entry, ...state.history] })),
	clearHistory: () => set({ history: [] }),
}));
