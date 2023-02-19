import type { MouseEvent } from 'react';
import { useState } from 'react';
import {
  InputGroup,
  Input,
  InputRightAddon,
  Stack,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { IoMdClose } from 'react-icons/io';

interface ITrackingSearchBar {
  onSearch?: (orderID: string, evt: MouseEvent<HTMLButtonElement>) => void;
  onClear?: () => void;
}

function TrackingSearchBar({
  onSearch = () => { },
  onClear = () => { },
}: ITrackingSearchBar) {
  const [orderID, setOrderID] = useState('');

  return (
    <Stack
      p={5}
      maxW={768}
      direction='row'
      mx='auto'
    >
      <InputGroup>
        <Input
          bgColor='white'
          placeholder='Search order by id.'
          name='query'
          value={orderID}
          onChange={(evt) => {
            if (!evt.target.value) return;
            setOrderID(evt.target.value);
          }}
        />
        <InputRightAddon
          p={0}
          children={
            <IconButton
              display='flex'
              variant='unstyled'
              aria-label='Search order by id'
              icon={<IoMdClose onClick={onClear} />}
            />
          } />
      </InputGroup>

      <Button
        type='submit'
        colorScheme='pink'
        onClick={(evt) => onSearch(orderID, evt)}
      >
        search
      </Button>
    </Stack>
  );
};

export default TrackingSearchBar;