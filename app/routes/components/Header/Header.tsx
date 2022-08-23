import styled from "styled-components";
import { AiOutlineMail, AiOutlinePhone, AiFillHeart } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { MdFavorite } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi"


import SearchBar from "./SearchBar";

const HeaderContainer = styled.header`
	display: flex;
	flex-direction: column;
	box-shadow: 2px 9px 49px -17px rgba(0,0,0,0.3);
	position: sticky;
	top: 0;
	width: 100%;
	z-index: 10;
`;

const ContactContainer = styled.div`
	display: flex;
	background-color: #555BBD;
	justify-content: flex-end;
	height: 30px;
	align-items: center;
	width: 100%;
`;

const ContactContent = styled.span`
	color: #fff;
	font-size: 12px;
	margin: 0 15px;
	display: flex;
	justify-content: center;
	align-items: center;
	span {
		margin-right: 5px;
	}

	i {
		font-weight: bold;
		margin-right: 5px;
	}
`;

const Container = styled.div`
	height: 70px;
	display: flex;
	align-items: center;
	width: 100%;
	padding: 0 15px;
`;

const Logo = styled.strong`
	line-height: 20px;
	padding-right: 15px;
`

const SearchBarContainer = styled.div`
	display: flex;
	flex: 5;
`

const NavContainer = styled.nav`
	flex: 1;
`;
const NavContentList = styled.ul`
  list-style: none;
  padding: 0;
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
`;
const NavContentItem = styled.li`
	align-items: center;
  display: flex;
  height: 40px;
  margin: 0 5px;
  position: relative;
  transition: 100ms all linear 0s;

  @media (max-width: 991px) {
     padding: 0 5px;
   }
`;

export default function Header() {
	return (
		<HeaderContainer>
			{/* Contact */}
			<ContactContainer>
				<ContactContent>
					<span>
						<AiOutlinePhone />
					</span>

					<i>
						(00)0000-0000
					</i>
				</ContactContent>

				<ContactContent>
					<span>
						<AiOutlineMail />
					</span>

					<i>
						email@email.com
					</i>
				</ContactContent>
			</ContactContainer>

			<Container>
				<Logo>
					<AiFillHeart fontSize={45} color="#555BBD" />
				</Logo>

				<SearchBarContainer>
					<SearchBar />
				</SearchBarContainer>

				<NavContainer>
					<NavContentList>
						<NavContentItem>
							<BiUserCircle fontSize={25} />
						</NavContentItem>

						<NavContentItem>
							<MdFavorite fontSize={25} />
						</NavContentItem>

						<NavContentItem>
							<FiShoppingCart fontSize={25} />
						</NavContentItem>
					</NavContentList>
				</NavContainer>
			</Container>
		</HeaderContainer>
	);
}
