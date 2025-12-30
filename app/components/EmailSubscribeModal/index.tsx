import SimpleModal from '~/components/SimpleModal';
import type { ApiErrorResponse } from '~/shared/types';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { FiMail, FiX } from 'react-icons/fi';
import { HiCheckCircle, HiStar } from 'react-icons/hi2';

interface SubscribeModalParams {
  open: boolean;
  onClose: () => void;
  error: ApiErrorResponse | null;
}

function SubscribeModal({ open, onClose, error }: SubscribeModalParams) {
  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      size="md"
      showOverlay
      overlayOpacity={40}
      overlayClassName="backdrop-blur-sm"
      showCloseButton={false}
      showCloseIcon={false}
      contentClassName="border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
    >
      <div className="-m-6 font-poppins">
        <div className="relative overflow-hidden rounded-2xl bg-white">
          <button
            type="button"
            aria-label="Close modal"
            className="group absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            onClick={onClose}
          >
            <FiX className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>

          <div className="flex flex-col items-center p-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 scale-150 rounded-full bg-primary/10 blur-xl animate-pulse" />
              <div
                className={[
                  'relative z-10 flex h-20 w-20 items-center justify-center rounded-full',
                  error ? 'bg-red-500/10 text-red-600' : 'bg-primary/10 text-primary',
                ].join(' ')}
              >
                {error ? (
                  <AiOutlineExclamationCircle className="h-11 w-11" aria-hidden />
                ) : (
                  <FiMail className="h-11 w-11" aria-hidden />
                )}
              </div>

              {!error ? (
                <>
                  <div
                    className="absolute -right-4 -top-2 text-yellow-400 animate-bounce"
                    style={{ animationDuration: '2s' }}
                  >
                    <HiStar className="h-5 w-5" aria-hidden />
                  </div>
                  <div
                    className="absolute -left-4 bottom-0 text-emerald-500 animate-bounce"
                    style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}
                  >
                    <HiCheckCircle className="h-5 w-5" aria-hidden />
                  </div>
                </>
              ) : null}
            </div>

            <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
              {error ? 'Something went wrong' : 'Welcome Aboard!'}
            </h2>
            <p
              className={[
                'mb-6 text-sm font-medium uppercase tracking-wider',
                error ? 'text-red-600' : 'text-primary',
              ].join(' ')}
            >
              {error ? 'Subscription Failed' : 'Subscription Successful'}
            </p>

            <div className="mb-6 h-1 w-16 rounded-full bg-slate-100" />

            {error ? (
              <div className="space-y-3 leading-relaxed text-slate-500">
                <p>Please check the email you entered and try again.</p>
                {error.error ? (
                  <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    {error.error}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="space-y-4 leading-relaxed text-slate-500">
                <p>
                  A confirmation link and your exclusive coupon have been sent directly to your
                  inbox.
                </p>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-left text-sm">
                  <p className="mb-2 font-medium text-slate-900">Next Steps:</p>
                  <p>
                    Please check your email for the{' '}
                    <span className="font-bold text-primary">£3 GBP voucher code</span>. Click the{' '}
                    <span className="font-semibold text-slate-900">“Confirm &amp; Validate”</span>{' '}
                    button inside to activate it.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-8 py-5">
            <div className="w-full">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
                  onClick={onClose}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
}

export default SubscribeModal;
