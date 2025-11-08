import { useState } from 'react';
import { clsx } from 'clsx'
import { AiOutlineSearch } from "react-icons/ai";
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/SearchBar.css?url';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles }
	];
}

export default function SearchBar() {
	const [openSearchBar, toggleSearchBar] = useState<boolean>(false);

	const handleOpenSearchBar = () => {
		toggleSearchBar(prev => !prev)
	}

	return (
		<>
			<div className="open-search">
				<div
					className="open-search-icon"
					onClick={handleOpenSearchBar}
				>
					<AiOutlineSearch fontSize={25} />
				</div>

				<div className={clsx('search', openSearchBar && 'show')}>
					<input
						className="input-search"
						type="text"
						placeholder="What are you looking for?"
						onChange={() => { }}
					/>

					<button className="search-button">
						<AiOutlineSearch fontSize={18} />
					</button>
				</div>
			</div>
		</>
	);
}
