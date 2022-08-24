import styled from "styled-components";
import { useState } from "react";

import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { BsList } from "react-icons/bs";

const Container = styled.div`
	display: flex;
	align-items: center;
`;

const AllCategoryNav = styled.nav`
	cursor: pointer;
	position: relative;
	max-width: 100%;
	width: 100%;
	@media (min-width: 991px) {
		max-width: 300px;
	}
`;

const Label = styled.label`
	align-items: center;
  cursor: pointer;
  display: flex;
  position: relative;
`;

const ArrowUp = styled(RiArrowUpSLine)``;
const ArrowDown = styled(RiArrowDownSLine)``;

const Span = styled.span`
	display: flex;
	align-items: center;
	background-color: #555BBD;
	color: white;
	width: 100%;
	height: 40px;
	padding: 0 25px;

	span {
		margin-left: 15px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
`;

const AllCategoryList = styled.ul`
  background: #fff;
  border-bottom: 3px solid $blue;
  border-bottom: 3px solid #545bc4;
  box-shadow: 2px 9px 49px -17px rgb(0 0 0 / 30%);
  height: auto;
  padding: 15px 0;
  position: absolute;
  top: 40px;
	width: 300px;
  z-index: 90;
  @media(max-width: 991px) {
    min-width: 100%;
  }
`;

const CategoryListItem = styled.li`
	a {
		align-items: center;
		display: flex;
		justify-content: space-between;
		padding: 15px;
		transition: 100ms all linear 0s;
	}

	&:hover {
		display: block;
		background: #555BBD;

		a {
			color: #fff;
		}
	}
`;

const FeaturedCategoryNav = styled.nav`
	flex: auto;
	margin: 0 15px 0 0;
	@media(max-width:991px) {
		display: none;
	}

	ul {
		list-style: none;
		display: flex;
		align-items: center;
		height: 40px;
		justify-content: space-between;
		margin: 0;
		padding: 0;

		li {
			flex: auto;
			cursor: pointer;
			transition: 100ms all linear 0s;
			&:hover {
				background-color: #E4E4E4;
			}

			a {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 40px;
			}
		}
	}
`;

export type Category = {
	name: string;
};

interface CategoriesNavProps {
	categories: Array<Category>,
};

/*
 * - [ ] Hover over all category should display all category list.
 * - [ ] If we have too many categories, we should have a scroll view.
 */
export default function CategoriesNav({ categories }: CategoriesNavProps) {
	const [openAllCategories, setOpenAllCategories] = useState<boolean>(false);

	const handleMouseEnterAllCategory = () => {
		setOpenAllCategories(true);
	}

	const handleMouseLeaveAllCategory = () => {
		setOpenAllCategories(false);
	}

	return (
		<Container>
			<AllCategoryNav>
				<Label
					labelFor="open-menu-all"
					onMouseEnter={handleMouseEnterAllCategory}
					onMouseLeave={handleMouseLeaveAllCategory}
				>
					<Span>
						<BsList fontSize={24} color="#fff" />
						<span>
							All Categories
							{
								openAllCategories
									? <ArrowUp />
									: <ArrowDown />
							}
						</span>
					</Span>
					{/* submenu */}

					{
						openAllCategories
							? (
								<AllCategoryList>
									{
										categories.map((category) => {
											return (
													<CategoryListItem key={category.name}>
														<a>
															{ category.name }
														</a>
													</CategoryListItem>
											);
										})
									}

								</AllCategoryList>
							) : ''
					}
				</Label>
			</AllCategoryNav>

			{/* categories nav */}
			<FeaturedCategoryNav>
				<ul>
				{
					categories.map((category) => (
						<li key={category.name}>
							<a>
								{ category.name }
							</a>
						</li>
					))
				}
				</ul>
			</FeaturedCategoryNav>
		</Container>
	);
}
