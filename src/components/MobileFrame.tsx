interface MobileFrameProps {
	children: React.ReactNode;
}

export const MobileFrame = ({ children }: MobileFrameProps) => {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			{/* Mobile viewport container - fixed width */}
			<div
				className='w-full max-w-md h-screen bg-white flex flex-col relative'
				style={{
					aspectRatio: '9/20',
				}}
			>
				{children}
			</div>
		</div>
	);
};
