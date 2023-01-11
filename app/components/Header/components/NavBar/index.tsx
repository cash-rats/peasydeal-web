import type { MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { FiShoppingCart } from 'react-icons/fi';
import { RiTruckLine } from 'react-icons/ri';

import RedDot, { links as RedDotLinks } from '~/components/RedDot';

export const links: LinksFunction = () => {
	return [
		...RedDotLinks(),
	];
};

interface NavBarProps {
	/*
	 * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
	 */
	cartItemCount?: number;

	/*
	 * Open full screen search bar on mobile view. (Only works on mobile view)
	 */
	onClickSearch?: { (evt: MouseEvent<HTMLButtonElement>): void },

}

// Load shopping cart items.
function NavBar({ cartItemCount = 0, onClickSearch = () => { } }: NavBarProps) {
	return (
		<nav className="flex flex-1">
			<ul className="list-none p-0 items-center flex justify-start gap-5">
				{/* Search icon that only displays in mobile view */}
				{/* <li className="hidden 540:block md:hidden">
					<IconButton onClick={onClickSearch}>
						<TbSearch color='#e6007e' fontSize={22} />
					</IconButton>
				</li> */}

				{/* shopping cart */}
				<li className="flex items-center h-10 my-0 mx-1 relative transition-all ease-linear">
					{
						cartItemCount > 0 && (
							<RedDot
								dotStyle={{ left: '18px', top: '-1px' }}
								value={cartItemCount}
							/>
						)
					}
					{/* TODO this isn't the right way to have ripple effect */}
					<Link aria-label='shopping cart' className={`flex space-x-${cartItemCount > 0 ? '4' : '2'} items-center`} to="/cart">
						<FiShoppingCart color='#e6007e' fontSize={26} className='flex-1' />
						<span className='text-sm font-bold capitalize hover:text-primary flex-1'>
							Cart
						</span>
					</Link>
				</li>

				<li>

					<Link aria-label='track order' className='flex space-x-2 items-center' to="/tracking">
						<RiTruckLine color='#e6007e' fontSize={26} className='flex-1' />
						<span className="ml-[10px] text-sm font-bold capitalize hover:text-primary whitespace-nowrap">
							Track Order
						</span>
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
