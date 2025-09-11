import { useEffect, useState } from "react";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import customerSupportBackImage from "../../assets/images/cusomer-support-back.svg";
import RightArrowIcon from "../../components/icons/RightArrowIcon";
import { useNavigate } from "react-router-dom";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

const PaymentStatus = ({ clientSecret }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setStatus("Payment succeeded!");
          break;
        case "processing":
          setStatus("Payment is processing.");
          break;
        case "requires_payment_method":
          setStatus("Payment failed. Please try another payment method.");
          break;
        default:
          setStatus("Something went wrong.");
          break;
      }
    });
  }, [stripe, clientSecret]);

  return (
    <div className="o-dasboard__rightbar o-general-dashboard">
      <div className="o-dasboard__rightbody flex-body flex-div-ends">
        <img
          src={customerSupportBackImage}
          alt="Customer Support backend"
          className="o-dasboard__pointimage"
        />
        <div className="o-general-dashboard__plan">
          <div className="flex justify-center items-center my-4">
            <img
              src="https://i.pinimg.com/originals/32/b6/f2/32b6f2aeeb2d21c5a29382721cdc67f7.gif"
              alt="payment_success"
              className="rounded-full h-52 w-60"
            />
          </div>
          <h6 className="o-general-dashboard__plantitle text-2xl">{status}</h6>
          <div className="o-general-dashboard__planbtn o-login__btnarea">
            <button
              className="o-login__button"
              onClick={() => navigate("/customer/dashboard")}
            >
              Home
              <RightArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => {
  // Retrieve the "payment_intent_client_secret" query parameter from the URL
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return <div>Missing client secret!</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentStatus clientSecret={clientSecret} />
    </Elements>
  );
};

export default PaymentSuccessPage;
