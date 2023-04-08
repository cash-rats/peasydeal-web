import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { FiShoppingCart } from 'react-icons/fi';
import { RiTruckLine, RiSearchLine } from 'react-icons/ri';
import { IoPricetagsOutline } from "react-icons/io5"

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
	toggleOpenMobileSearchBar?: () => void;
}

// Load shopping cart items.
function NavBar({ cartItemCount = 0, toggleOpenMobileSearchBar = () => {} }: NavBarProps) {
	return (
		<nav className="flex flex-1">
			<ul className="
				list-none p-0 items-center
				flex
			 	justify-center gap-1 md:gap-2
			">
				<Link
					aria-label='super deal with extra 10% off'
					className="flex min-w-[53px] md:min-w-[73x] basis-1/3"
					to="/promotion/super_deal"
					onClick={() => {
						window.rudderanalytics?.track('click_navbar_super_deal');
					}}
				>
					<li className='flex flex-col items-center'>
						<IoPricetagsOutline
							color='#DA3B66'
							className='flex-1 text-xl md:text-2xl'
						/>
						<span className="
							text-[#DA3B66] text-center text-[10px] md:text-[14px]
							mt-1 capitalize whitespace-nowrap font-bold"
						>
							Super Deal
						</span>
					</li>
				</Link>
				{/* shopping cart */}
				<Link
					aria-label='shopping cart'
					to="/cart"
					className='min-w-[53px] md:min-w-[73x] basis-1/3'
					onClick={() => {
						window.rudderanalytics?.track('click_navbar_cart');
					}}
				>
					<li className="flex justify-center items-center relative transition-all ease-linear">
						{
							cartItemCount > 0 && (
								<div className="
									right-[2px]
									top-[-8px] sm:top-[-9px]
									absolute
									text-sm
								">
									<RedDot
										value={cartItemCount}
									/>
								</div>
							)
						}
						{/* TODO this isn't the right way to have ripple effect */}
						<div className='flex flex-col justify-center items-center'>
							<FiShoppingCart
								color='#707070'
								className='flex-1 text-xl md:text-2xl'
							/>
							<span className='justify-self-center text-[10px] md:text-[14px] mt-1 font-normal capitalize flex-1'>
								Cart
							</span>
						</div>
					</li>
				</Link>


				<li className='flex flex-col items-center md:hidden basis-1/3' onClick={() => toggleOpenMobileSearchBar() }>
					<RiSearchLine
						color='#707070'
						className='flex-1 text-xl md:text-2xl'
					/>
					<span className="text-center mt-1 text-[10px] md:text-[14px] font-normal capitalize whitespace-nowrap">
						Search
					</span>
				</li>

				<Link
					aria-label='track order'
					className="min-w-[53px] md:min-w-[73x] basis-1/3 hidden md:flex"
					to="/tracking"
					onClick={() => {
						window.rudderanalytics?.track('click_navbar_track_order');
					}}
				>
					<li className='flex flex-col items-center '>
						<RiTruckLine
							color='#707070'
							className='flex-1 text-xl md:text-2xl'
						/>
						<span className="text-center mt-1 text-[10px] md:text-[14px] font-normal capitalize whitespace-nowrap">
							Track Order
						</span>
					</li>
				</Link>
			</ul>
		</nav>
	);
};

export default NavBar;
