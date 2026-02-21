import { Fragment } from 'react';

/**
 * Parse markdown-style bold text (**text**) into JSX with <strong> tags
 */
export const parseMarkdownBold = (text: string): any => {
	const parts: (string | any)[] = [];
	let lastIndex = 0;
	let keyCounter = 0;
	const regex = /\*\*([^*]+)\*\*/g;
	let match;

	while ((match = regex.exec(text)) !== null) {
		// Add text before match
		if (match.index > lastIndex) {
			parts.push(
				<Fragment key={`text-${keyCounter++}`}>{text.slice(lastIndex, match.index)}</Fragment>,
			);
		}

		// Add bold text
		parts.push(
			<strong key={`bold-${keyCounter++}`} className='font-semibold'>
				{match[1]}
			</strong>,
		);

		lastIndex = match.index + match[0].length;
	}

	// Add remaining text
	if (lastIndex < text.length) {
		parts.push(<Fragment key={`text-${keyCounter}`}>{text.slice(lastIndex)}</Fragment>);
	}

	// If no matches, return original text wrapped in fragment
	if (parts.length === 0) {
		return <Fragment>{text}</Fragment>;
	}

	return <Fragment>{parts}</Fragment>;
};
