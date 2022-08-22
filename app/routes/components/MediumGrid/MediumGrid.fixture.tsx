import styled from 'styled-components';

import MediumGrid  from './index';

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

export default () => (
	<Container>
		<MediumGrid />
	</Container>
);
