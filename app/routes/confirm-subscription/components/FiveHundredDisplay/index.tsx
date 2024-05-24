import type { ApiErrorResponse } from '~/shared/types';

interface FiveHundredDisplayParams {
  errResp: ApiErrorResponse;
}

function FiveHundredDisplay({ errResp }: FiveHundredDisplayParams) {
  return (
    <div className="flex flex-col justify-center items-center">
      {
        errResp.err_code === '7000007' && (
          <>
            <h1 className="font-black font-poppins text-3xl text-center mb-6">
              Woops, email subscription not found.
            </h1>

            <div className="font-poppins mt-2 text-[#343434]">
              Please re-confirm subscription from email again
            </div>
          </>
        )
      }
    </div>
  );
}

export default FiveHundredDisplay;
