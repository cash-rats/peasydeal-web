import styled from "styled-components";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

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
`

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

			hello header
		</HeaderContainer>
	);
}
