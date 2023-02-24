import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { FiShoppingCart } from 'react-icons/fi';
import { RiTruckLine } from 'react-icons/ri';
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
}

// Load shopping cart items.
function NavBar({ cartItemCount = 0 }: NavBarProps) {
	return (
		<nav className="flex flex-1">
			<ul className="list-none p-0 items-center flex justify-center gap-5">
				<li>
					<Link aria-label='super deal with extra 10% off' className="flex flex-col items-center" to="/super_deal">
						<IoPricetagsOutline
							color='#DA3B66'
							className='flex-1 text-xl md:text-2xl'
						/>
						<span className="
							text-[#DA3B66] text-center text-[10px] md:text-[14px]
							mt-1 font-normal capitalize whitespace-nowrap font-bold"
						>
							Super Deal
						</span>
					</Link>
				</li>
				{/* shopping cart */}
				<li className="flex items-center h-10 my-0 mx-1 relative transition-all ease-linear">
					{
						cartItemCount > 0 && (
							<div className="
								left-[14px] sm:left-[20px]
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
					<Link aria-label='shopping cart' className={`flex flex-col items-center`} to="/cart">
						<FiShoppingCart
							color='#707070'
							className='flex-1 text-xl md:text-2xl'
						/>
						<span className='justify-self-center text-[10px] md:text-[14px] mt-1 font-normal capitalize flex-1'>
							Cart
						</span>
					</Link>
				</li>

				<li>
					<Link aria-label='track order' className="flex flex-col items-center" to="/tracking">
						<RiTruckLine
							color='#707070'
							className='flex-1 text-xl md:text-2xl'
						/>
						<span className="text-center mt-1 text-[10px] md:text-[14px] font-normal capitalize whitespace-nowrap">
							Track Order
						</span>
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
