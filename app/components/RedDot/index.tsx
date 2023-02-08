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
		<div style={dotStyle} className="red-dot">
			<div style={indicatorStyle} className="indicator">
				{value}
			</div>
		</div>
	);
};

export default RedDot;
