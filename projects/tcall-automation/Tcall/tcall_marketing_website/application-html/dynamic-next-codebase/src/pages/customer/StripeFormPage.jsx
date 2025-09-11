import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import customerSupportBackImage from "../../assets/images/cusomer-support-back.svg";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

// The form component that will be wrapped by Elements
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.REACT_APP_FRONTEND_URL}/customer/dashboard/payment-success`,
      },
    });

    if (error) {
      setPaymentError(error.message);
    }

    setIsProcessing(false);
  };

  return (
    <div className="o-dasboard__rightbar o-general-dashboard">
      <div className="o-dasboard__rightbody flex-body flex-div-ends">
        <img
          src={customerSupportBackImage}
          alt="Customer Support backend"
          className="o-dasboard__pointimage"
        />
        <div className="o-general-dashboard__plan h-full">
          <form onSubmit={handleSubmit}>
            <PaymentElement />
            {paymentError && <div className="error">{paymentError}</div>}
            <div className="o-general-dashboard__planbtn o-login__btnarea my-5">
              <button
                className="o-login__button"
                disabled={!stripe || isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const StripeFormPage = () => {
  const location = useLocation();
  const state = location.state;
  console.log({ state });
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (state) {
      setClientSecret(state);
    }
  }, [state]);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: clientSecret?.client_secret,
          appearance: {
            theme: "stripe",
            variables: {
              // colorText: "#ffffff", // White text
              // spacingUnit: "10px", // Adjust spacing
            },
            rules: {
              ".Label": {
                color: "#ffffff", // White color for labels
                marginBottom: "10px", // Add space below labels
              },
            },
          },
        }}
      >
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default StripeFormPage;
