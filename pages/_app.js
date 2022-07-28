import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "../styles/globals.css";
import { StoreProvider } from "../utils/Store";

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <PayPalScriptProvider deferLoading={true}>
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </StoreProvider>
  );
}

export default MyApp;
