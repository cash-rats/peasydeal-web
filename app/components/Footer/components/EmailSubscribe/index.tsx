import type { ChangeEvent } from 'react';
import { TextField, FormControl } from '@mui/material';
import { Button } from '@chakra-ui/react';

import SubscribeModal from '~/components/EmailSubscribeModal';
import useEmailSubscribe from '~/hooks/useEmailSubscribe';

function EmailSubscribe() {
  const {
    setEmail,
    openModal,
    error,
    email,
    fetcher,
    onCloseModal,
  } = useEmailSubscribe();

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)

  return (
    <>
      <SubscribeModal open={openModal} onClose={onCloseModal} error={error} />

      <div className="flex flex-col text-center">
        <span className="
        font-bold text-3xl
          capitalize
        ">
          get free £3 GBP
        </span>

        <p className="mt-4 text-base">
          Join to our news letter & get £3 GBP voucher
        </p>

        <div className="w-full">
          <FormControl className="w-full flex flex-row mt-3 gap-2 justify-center">
            <TextField
              fullWidth
              placeholder='Enter Your Email Address'
              variant='outlined'
              className='w-full'
              style={{
                width: '100%',
                backgroundColor: '#fff',
                borderRadius: '8px',
              }}
              value={email}
              onChange={handleChangeEmail}
              error={!!error}
            />

            <fetcher.Form action='/subscribe?index' method='post'>
              <input type='hidden' name='email' value={email} />
              <Button
                isLoading={fetcher.state !== 'idle'}
                variant='contained'
                type='submit'
                className='text-white'
                style={{
                  borderRadius: '10px',
                  textTransform: 'capitalize',
                  backgroundColor: '#d02e7d',
                  fontSize: '1rem',
                  height: '100%',
                }}
              >
                Subscribe
              </Button>
            </fetcher.Form>
          </FormControl>

          {error && (
            <div className="w-full text-left text-red-500 text-sm mt-1 font-poppins">
              {error.error}
            </div>
          )}
        </div>

        <p className="mt-3 text-sm md:text-base">
          * Can be use on order £30+, Terms and Condition applied
        </p>
      </div>
    </>
  )
}

export default EmailSubscribe;