import { LinksFunction } from '@remix-run/node';
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	FormHelperText,
} from '@chakra-ui/react';

import styles from './styles/Checkout.css';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
};

function CheckoutPage() {
	return (
		<section className="checkout-page-container">
			<div className="left">

				{/* You Details  */}
				<div className="form-container">
					<h1 className="title">
						Shipping Details
					</h1>

					<div className="shipping-detail-container">
						<FormControl className="shipping-detail-form">
							<div className="shipping-form-field">
								<FormLabel>Email address</FormLabel>
  							<Input size='lg' type='email' />
							</div>

							<div className="shipping-form-fields fields--2">
								<div className="shipping-form-field">
									<FormLabel>First name (required) </FormLabel>
  								<Input size='lg' type='email' />
								</div>

								<div className="shipping-form-field">
									<FormLabel>Last name (required) </FormLabel>
  								<Input size='lg' type='email' />
								</div>
							</div>

							<div className="shipping-form-field">
								<FormLabel>Address line 1 (required)</FormLabel>
  							<Input size='lg' type='email' />
							</div>

							<div className="shipping-form-field">
								<FormLabel>Address line 2</FormLabel>
  							<Input size='lg' type='email' />
							</div>

							<div className="shipping-form-fields fields--2">
								<div className="shipping-form-field">
									<FormLabel> Postal </FormLabel>
  								<Input size='lg' type='email' />
								</div>

								<div className="shipping-form-field">
									<FormLabel> City </FormLabel>
  								<Input size='lg' type='email' />
								</div>
							</div>
						</FormControl>
					</div>
				</div>

				{/*Payment gateways*/}
				{/* You Details  */}
				<div className="form-container">
					<h1 className="title">
						Pay with
					</h1>

					{/* select payment gateways */}


				</div>
			</div>

			<div className="right">

			</div>
		</section>
	);
}

export default CheckoutPage;
