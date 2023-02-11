import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

function EmailSubscribe() {
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
          />
        </div>

        <Button
          variant='contained'
          style={{
            borderRadius: '10px',
            textTransform: 'capitalize',
            backgroundColor: '#d02e7d',
            fontSize: '1rem',
          }}
        >
          Subscribe
        </Button>
      </div>

      <p className="text-white mt-3 text-base font-bold">
        * Can be use on order £20+, expires at March, 31, 2023
        Terms and Condition applied
      </p>
    </div>
  )
}

export default EmailSubscribe;