import type { LinksFunction } from '@remix-run/node';
import type { CSSProperties } from 'react';
import styles from './styles/RedDot.css';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
};

interface RedDotProps {
	value: number;
	dotStyle?: CSSProperties;
	indicatorStyle?: CSSProperties;
}

function RedDot({ value, dotStyle = {}, indicatorStyle = {} }: RedDotProps) {
	return (
		// <div style={dotStyle} className="text-xs font-bold absolute min-w-[1.25rem] min-h-[1.25rem] cursor-pointer text-white bg-red-500 border-white border-solid border-[0.125rem] rounded-xl z-1 left-[24px] top-[-1px]">
		<div style={dotStyle} className="red-dot">
			<div style={indicatorStyle} className="indicator">
				{value}
			</div>
		</div>
	);
};

export default RedDot;
