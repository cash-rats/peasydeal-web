import { PayPalButtons } from "@paypal/react-paypal-js";
import clsx from 'clsx';
import type {
  OnClickActions,
  OnApproveData,
  OnApproveActions,
  OnInitActions,
} from "@paypal/paypal-js";

import selectedRadioCircleSVG from './images/selected_radio_circle.svg';
import unSelectedRadioCircleSVG from './images/unselected_radio_circle.svg';
import paypalPng from './images/paypal.png';

interface PaypalCheckoutProps {
  collapse?: boolean;
  onChoose: () => void;

  paypalDisabled?: boolean;
  paypalInit?: (data: Record<string, unknown>, actions: OnInitActions) => void;
  paypalCreateOrder: () => Promise<string>
  paypalInputValidate?: (
    rec: Record<string, unknown>,
    actions: OnClickActions
  ) => Promise<void> | void
  paypalApproveOrder?: (
    data: OnApproveData,
    actions: OnApproveActions
  ) => Promise<void>,
}

function PaypalCheckout({
  collapse,
  onChoose,

  paypalDisabled = false,
  paypalInit,
  paypalCreateOrder,
  paypalInputValidate,
  paypalApproveOrder,
}: PaypalCheckoutProps) {
  return (
    <div className="form-container">
      <div className="pricing-panel">
        <div className="payment-form-container">
          <div className="
              rounded-[5px] text-sm font-semibold box-border
              border-solid border-[1px] border-paymentelement-border
              px-4 flex flex-col
            ">
            <button
              className="
                  h-[55px] w-full
                  grid grid-cols-[auto_1fr] items-center
                  border-none bg-transparent cursor-pointer outline-none
                "
              type='button'
              onClick={onChoose}
            >
              {/* radio & paypal icon */}
              <div className="flex flex-row justify-center items-center">
                <img
                  alt="pay with paypal"
                  src={
                    !collapse
                      ? selectedRadioCircleSVG
                      : unSelectedRadioCircleSVG
                  }
                  width={16.8}
                  height={16.8}
                  className="mr-[10px]"
                />
                <div>
                  <img
                    alt="pay with paypal"
                    src={paypalPng}
                    width={16.8}
                    height={16.8}
                  />
                </div>
              </div>

              {/* title and annotation */}
              <div className="
                  flex flex-row justify-start items-center
                  capitalize
                ">
                <span className="font-medium">
                  paypal
                </span>
              </div>
            </button>

            {/* content */}
            <div
              className={
                clsx(`
                      relative z-[1]
                      overflow-hidden h-0
                      transition-[height] ease delay-300
                    `,
                  {
                    "h-[90px]": !collapse,
                  }
                )
              }
            >
              <div className="pt-1 pb-4 px-4 box-border">
                <PayPalButtons
                  disabled={paypalDisabled}
                  onInit={paypalInit}
                  onClick={paypalInputValidate}
                  createOrder={paypalCreateOrder}
                  onApprove={paypalApproveOrder}
                  style={{ layout: "horizontal" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaypalCheckout;