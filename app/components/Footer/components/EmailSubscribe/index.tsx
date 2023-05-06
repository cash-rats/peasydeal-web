import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useFetcher } from '@remix-run/react'
import { TextField } from '@mui/material';
import { Button } from '@chakra-ui/react'

interface EmailSubscribeParams {
  onSubscribe?: (email: string) => void;
}

function EmailSubscribe({ onSubscribe = () => { } }: EmailSubscribeParams) {
  const [email, setEmail] = useState('');
  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const subFetcher = useFetcher();

  useEffect(() => {
    if (subFetcher.type === 'done') {
      // Determine the status code
    }
  }, [subFetcher.type]);

  return (
    <div className="flex flex-col">
      <span className="
        text-white font-bold text-3xl
          capitalize
        ">
        get free shipping code
      </span>

      <p className="text-white mt-4 text-base">
        Join to our news letter & get £2.99 worth Free Shipping Code
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
            value={email}
            onChange={handleChangeEmail}
          />
        </div>

        <subFetcher.Form action='/subscribe?index' method='post'>
          <input type='hidden' name='email' value={email} />

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
        * Can be use on order £20+, expires at March, 31, 2023
        Terms and Condition applied
      </p>
    </div>
  )
}

export default EmailSubscribe;