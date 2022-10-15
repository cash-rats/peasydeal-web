import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/divider.css';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	]
};

interface DividerProps {
	text?: ReactNode;
};

function Divider({ text }: DividerProps) {
	return (
		<div className="divider">
			<span className="divider-border" />

			<h1 className="divider-text">
				{text}
			</h1>
		</div>
	);
}

export default Divider;
