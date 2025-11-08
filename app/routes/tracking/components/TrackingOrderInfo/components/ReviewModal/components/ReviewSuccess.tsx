import { FaCheck } from 'react-icons/fa';
import type { LinksFunction } from '@remix-run/node';
import { Button, Stack } from '@chakra-ui/react';

import styles from './styles/check.css?url';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

interface ReviewSuccessParams {
  onClose: () => void;
}

function ReviewSuccess({ onClose }: ReviewSuccessParams) {
  return (
    <div className=" flex flex-col justify-center items-center">
      <div className="relative h-28">
        {/*success logo*/}
        <div className="center">
          <label className="label">
            <span className="label__text">
              <span className="label__check">
                <FaCheck fontSize={30} className="icon" />
              </span>
            </span>
          </label>
        </div>
      </div>

      <h3 className="font-poppins font-bold text-lg capitalize">
        Thank you for your review!
      </h3>

      <p className="font-poppins text-sm text-[#7f7f7f] mt-2 pl-10 pr-10">
        Your feedback can greatly improves the shopping experience on our platform.
      </p>

      {/* close button */}
      <Stack
        className="mt-5"
        direction='row'
        align='center'
      >
        <Button
          colorScheme='pink'
          className="captialize"
          onClick={onClose}
        >
          Continue shopping!
        </Button >
      </Stack>
    </div>
  )
}

export default ReviewSuccess;