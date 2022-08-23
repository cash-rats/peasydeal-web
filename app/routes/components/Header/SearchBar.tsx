import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";


const OpenSearch = styled.label`
	border-radius: 3px;
  flex: auto;
  margin: 0 15px;
  overflow: hidden;
  position: relative;
  @media(max-width: 991px){
    margin: 0;
    position: static;
    text-align: right;
  }
`;

const OpenSearchIcon = styled.div`
	display: none;
	@media(max-width: 991px){
	  display: flex;
		justify-content: flex-end;
	}
`;

const Search = styled.div`
	@media(max-width: 991px) {
		//display: none;
	  position: absolute;
	  left: 0;
	  top: 100px;
	  width: 100%;
	  z-index: 999;
	}

	@media(min-width: 992) {
	  top: 70px;
	}
`

const InputSearch = styled.input`
  border-radius: 3px;
  border: 1px solid #e1e1e1;
  height: 40px;
  padding: 0 70px 0 15px;
  width: 100%;
  // style and effect focus inputs
  background: white no-repeat;
  transition: 100ms all linear 0s;
  background-image: linear-gradient(to bottom, rgba(77,97,252,0.63) 0%, rgba(77,97,252,1) 90%), linear-gradient(to bottom, #e1e1e1, #e1e1e1);
  background-size: 0 2px, 100% 1px;
  background-position: 50% 100%, 50% 100%;
  // effect transition
  transition: background-size 0.3s cubic-bezier(0.64, 0.09, 0.08, 1);
  &:focus {
    background-size: 100% 2px, 100% 1px;
    outline: none;
  }
`;

const SearchButton = styled.button`
	background: #555BBD;
	border: 0;
	color: #fff;
	cursor: pointer;
	padding: 13px 20px;
	position: absolute;
	right: 0px;
	top: 0px;
	height: 40px;
	display: flex;
`;


const InputOpenSearchCheckbox = styled.input`
	display: none;
  &:checked ~ .search {
   display: block;
  }
`;

export default function SearchBar() {
	return (
		<>
			<OpenSearch labelFor="open-search">
				<OpenSearchIcon>
					<AiOutlineSearch fontSize={25} />
				</OpenSearchIcon>

				<InputOpenSearchCheckbox id="open-search" type="checkbox" name="menu" />

				<Search>
   		  	<InputSearch
						type="text"
						placeholder="What are you looking for?"
					/>

					<SearchButton>
						<AiOutlineSearch fontSize={18} />
					</SearchButton>
				</Search>
   		</OpenSearch>
		</>
	);
}
