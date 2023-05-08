import { useReducer, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useFetcher } from '@remix-run/react'
import { TextField } from '@mui/material';
import { Button } from '@chakra-ui/react';

import type { ApiErrorResponse } from '~/shared/types';
import SubscribeModal from '~/components/EmailSubscribeModal';
import reducer, { setOpenEmailSubscribeModal, setEmail } from '~/components/EmailSubscribeModal/reducer';

function EmailSubscribe() {
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    error: null,
    email: '',
  });

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(setEmail(e.target.value));
  const subFetcher = useFetcher();

  useEffect(() => {
    if (subFetcher.type === 'done') {
      const data = subFetcher.data;

      if (data.err_code) {
        const errResp = data as ApiErrorResponse
        dispatch(setOpenEmailSubscribeModal(true, errResp))
        return;
      }

      // Open modal
      // display subscription email sent.
      dispatch(setOpenEmailSubscribeModal(true, null))
    }
  }, [subFetcher.type]);

  const onCloseModal = () =>
    dispatch(setOpenEmailSubscribeModal(false, null));

  return (
    <>
      <SubscribeModal
        open={state.open}
        onClose={onCloseModal}
        error={state.error}
      />

      <div className="flex flex-col">
        <span className="
        text-white font-bold text-3xl
          capitalize
        ">
          get free shipping code
        </span>

        <p className="text-white mt-4 text-base">
          Join to our news letter & get £3 GBP voucher
        </p>

        <div className="flex flex-row mt-3 w-full gap-2">
          <div className="w-[200px] 1200-[268px]">
            <TextField
              fullWidth
              placeholder='Enter Your Email Address'
              variant='outlined'
              size='small'
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
              }}
              value={state.email}
              onChange={handleChangeEmail}
            />
          </div>

          <subFetcher.Form action='/subscribe?index' method='post'>
            <input type='hidden' name='email' value={state.email} />

            <Button
              isLoading={subFetcher.state !== 'idle'}
              variant='contained'
              type='submit'
              className="text-white"
              style={{
                borderRadius: '10px',
                textTransform: 'capitalize',
                backgroundColor: '#d02e7d',
                fontSize: '1rem',
              }}
            >
              Subscribe
            </Button>
          </subFetcher.Form>
        </div>

        <p className="
          text-slate-50 mt-3 text-sm md:text-base
        ">
          * Can be use on order £30+, Terms and Condition applied
        </p>
      </div>
    </>
  )
}

export default EmailSubscribe;