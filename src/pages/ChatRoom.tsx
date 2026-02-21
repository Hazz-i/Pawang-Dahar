import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { sendChatMessage } from '@/api/chatApi';
import { useChatStore } from '@/store/chatStore';
import { getBotGreeting, getBotResponseText, getBotResponseImage } from '@/api/geminiApi';
import { parseMarkdownBold } from '@/lib/parseMarkdown';
import { Upload, Send, X, Loader2 } from 'lucide-react';

export const ChatRoom = () => {
	const [messageText, setMessageText] = useState('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isInitializing, setIsInitializing] = useState(true);
	const [personality, setPersonality] = useState<'supportive' | 'savage'>('supportive');
	const fileInputRef = useRef<HTMLInputElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const { messages, addMessage, setMessages, addBotMessage, isBotTyping, setIsBotTyping } =
		useChatStore();

	// Initialize on mount - no message loading, fresh start each session
	useEffect(() => {
		setIsInitializing(false);
	}, []);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				alert('Tolong upload file gambar!');
				return;
			}
			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert('Ukuran gambar terlalu besar (max 5MB)');
				return;
			}
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const result = event.target?.result as string;
					if (result && result.startsWith('data:')) {
						setImagePreview(result);
					} else {
						throw new Error('Invalid data URL');
					}
				} catch (err) {
					console.error('Error processing image:', err);
					alert('Gagal memproses gambar. Coba lagi!');
					setSelectedImage(null);
				}
			};
			reader.onerror = () => {
				console.error('Failed to read file');
				alert('Gagal membaca file gambar. Coba lagi!');
				setSelectedImage(null);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setSelectedImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!messageText.trim() && !selectedImage) {
			return;
		}

		setIsLoading(true);
		try {
			// Only save user message if there's text or image
			if (messageText.trim() || selectedImage) {
				const response = await sendChatMessage(messageText, selectedImage || undefined);
				if (response.success) {
					addMessage(response.data);
				}
			}

			// Get bot response from Gemini
			setIsBotTyping(true);
			try {
				let botResponse;

				if (selectedImage) {
					// Analyze image
					botResponse = await getBotResponseImage(selectedImage, messageText || '', personality);
				} else if (messageText.trim()) {
					// Responds to text message (greeting-like)
					botResponse = await getBotResponseText(messageText, personality);
				} else {
					// Just greeting if both are empty (shouldn't happen due to initial check)
					botResponse = await getBotGreeting('', personality);
				}

				// Send bot message after a short delay
				setTimeout(() => {
					if (botResponse.success) {
						addBotMessage(botResponse.data.response);
					} else {
						addBotMessage('Maaf, ada error. Coba lagi ya! 😅');
					}
					setIsBotTyping(false);
				}, 500);
			} catch (error) {
				console.error('Error getting bot response:', error);
				addBotMessage('Maaf, ada error. Coba lagi ya! 😅');
				setIsBotTyping(false);
			}

			setMessageText('');
			handleRemoveImage();
		} catch (error) {
			console.error('Error sending message:', error);
			setIsBotTyping(false);
		} finally {
			setIsLoading(false);
		}
	};

	if (isInitializing) {
		return (
			<div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50'>
				<Loader2 className='w-8 h-8 text-indigo-500 animate-spin' />
			</div>
		);
	}

	return (
		<div className='h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50'>
			{/* Header */}
			<div className='bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex-shrink-0'>
				<h1 className='text-2xl font-bold text-gray-900'>Chat Room 💬</h1>
				<p className='text-xs text-gray-600 mt-1'>Chat dengan Bude Dahar tentang makanan kamu</p>

				{/* Personality Mode Selector */}
				<div className='mt-3 flex gap-2'>
					<button
						onClick={() => setPersonality('supportive')}
						className={`flex-1 py-2 px-3 rounded-lg font-semibold transition text-xs ${
							personality === 'supportive'
								? 'bg-green-500 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						💚 Supportive
					</button>
					<button
						onClick={() => setPersonality('savage')}
						className={`flex-1 py-2 px-3 rounded-lg font-semibold transition text-xs ${
							personality === 'savage'
								? 'bg-red-500 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						🔥 Savage
					</button>
				</div>
			</div>

			{/* Messages Container */}
			<div className='flex-1 overflow-y-auto p-4 space-y-4'>
				{messages.length === 0 && !isBotTyping ? (
					<div className='flex items-center justify-center h-full'>
						<div className='text-center'>
							<p className='text-gray-400 text-lg font-medium'>Belum ada pesan</p>
							<p className='text-gray-300 text-sm mt-1'>Mulai percakapan yuk! 👋</p>
						</div>
					</div>
				) : (
					<>
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-sm px-4 py-3 rounded-lg ${
										message.sender === 'user'
											? 'bg-indigo-500 text-white rounded-br-none'
											: 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
									}`}
								>
									{/* Image */}
									{message.imageUrl && (
										<img
											src={`${import.meta.env.VITE_BASE_URL}${message.imageUrl}`}
											alt='Chat'
											className='w-full rounded-lg mb-2 max-h-64 object-cover'
											onError={(e) => {
												console.error('Image failed to load:', message.imageUrl);
												e.currentTarget.style.display = 'none';
											}}
										/>
									)}

									{/* Text */}
									{message.text && (
										<div
											className={`text-sm break-words whitespace-pre-wrap leading-relaxed ${
												message.sender === 'user' ? 'text-white' : 'text-gray-700'
											}`}
										>
											{parseMarkdownBold(message.text)}
										</div>
									)}

									{/* Timestamp */}
									<p
										className={`text-xs mt-2 ${
											message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'
										}`}
									>
										{new Date(message.timestamp).toLocaleTimeString('id-ID', {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
								</div>
							</div>
						))}

						{/* Typing Indicator */}
						{isBotTyping && (
							<div className='flex justify-start'>
								<div className='bg-white text-gray-900 border border-gray-200 rounded-lg rounded-bl-none px-4 py-3'>
									<div className='flex gap-1'>
										<div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' />
										<div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100' />
										<div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200' />
									</div>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</>
				)}
			</div>

			{/* Image Preview */}
			{imagePreview && (
				<div className='px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0'>
					<div className='flex items-center gap-3'>
						<img
							src={imagePreview}
							alt='Preview'
							className='h-20 w-20 object-cover rounded-lg border border-gray-300'
							onError={(e) => {
								console.error('Image preview failed to load');
								e.currentTarget.style.display = 'none';
							}}
						/>
						<div className='flex-1 min-w-0'>
							<p className='text-xs font-semibold text-gray-700 truncate'>{selectedImage?.name}</p>
							<p className='text-xs text-gray-500'>
								{selectedImage && (selectedImage.size / 1024).toFixed(2)} KB
							</p>
						</div>
						<button
							onClick={handleRemoveImage}
							className='p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0'
							title='Hapus gambar'
						>
							<X className='w-5 h-5 text-gray-500' />
						</button>
					</div>
				</div>
			)}

			{/* Input Area */}
			<form
				onSubmit={handleSendMessage}
				className='border-t border-gray-200 bg-white p-4 flex-shrink-0'
			>
				<div className='flex gap-2'>
					{/* File Upload Button */}
					<button
						type='button'
						onClick={() => fileInputRef.current?.click()}
						className='flex-shrink-0 p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-600'
						disabled={isLoading}
						title='Upload gambar'
					>
						<Upload className='w-5 h-5' />
					</button>

					{/* Message Input */}
					<input
						type='text'
						value={messageText}
						onChange={(e) => setMessageText(e.target.value)}
						placeholder='Ketik pesan atau upload gambar...'
						className='flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm'
						disabled={isLoading}
					/>

					{/* Send Button */}
					<Button
						type='submit'
						disabled={isLoading || (!messageText.trim() && !selectedImage)}
						className='flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5'
					>
						{isLoading ? (
							<Loader2 className='w-5 h-5 animate-spin' />
						) : (
							<Send className='w-5 h-5' />
						)}
					</Button>

					{/* Hidden File Input */}
					<input
						ref={fileInputRef}
						type='file'
						accept='image/*'
						onChange={handleImageSelect}
						className='hidden'
					/>
				</div>
			</form>
		</div>
	);
};
