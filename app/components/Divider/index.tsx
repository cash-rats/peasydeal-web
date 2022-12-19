import type { ReactNode } from 'react';

interface DividerProps {
	text?: ReactNode;
};

function Divider({ text }: DividerProps) {
	return (
		<div className="relative my-4 block font-lato  text-[#999] uppercase text-center">
			<span className="absolute block top-3 left-0 right-0 border-b-[1px] border-gray-400" />

			<h1 className="text-lg relative inline-block px-[3.5%] font-bold leading-tight text-center bg-white">
				{text}
			</h1>
		</div>
	);
}

export default Divider;
