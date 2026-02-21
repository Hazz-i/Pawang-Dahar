/**
 * Parse markdown-style bold text (**text**) into JSX with <strong> tags
 */
export const parseMarkdownBold = (text: string): (string | JSX.Element)[] => {
	const parts: (string | JSX.Element)[] = [];
	let lastIndex = 0;
	let keyCounter = 0;
	const regex = /\*\*([^*]+)\*\*/g;
	let match;

	while ((match = regex.exec(text)) !== null) {
		// Add text before match
		if (match.index > lastIndex) {
			parts.push(text.slice(lastIndex, match.index));
		}

		// Add bold text
		parts.push(
			<strong key={`bold-${keyCounter++}`} className='font-semibold'>
				{match[1]}
			</strong>
		);

		lastIndex = match.index + match[0].length;
	}

	// Add remaining text
	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex));
	}

	// If no matches, return original text in array
	if (parts.length === 0) {
		return [text];
	}

	return parts;
};
