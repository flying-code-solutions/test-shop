import { Segment } from "semantic-ui-react";
import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary.js";
import connectDb from "../utils/connectDb";
import { parseCookies } from "nookies";
import { useAuth } from "../components/_App/AuthProvider";
import { useEffect, useState } from "react";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import catchErrors from "../utils/catchErrors";

function Cart() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function getProducts() {
      if (isAuthenticated) {
        const { token } = parseCookies();
        const url = `${baseUrl}/api/cart`;
        const payload = { headers: { Authorization: token } };
        const response = await axios.get(url, payload);
        setProducts(response.data);
      }
      setLoading(false);
    }
    getProducts();
  }, []);

  async function handleRemoveFromCart(productId) {
    const { token } = parseCookies();
    const url = `${baseUrl}/api/cart`;
    const payload = {
      params: { productId },
      headers: {
        Authorization: token
      }
    };
    const response = await axios.delete(url, payload);
    setProducts(response.data);
  }

  async function handleCheckout(paymentData) {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/checkout`;
      const { token } = parseCookies();
      const payload = { paymentData };
      const headers = { headers: { Authorization: token } };
      const { data } = await axios.post(url, payload, headers);
      setProducts(data);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Segment loading={loading}>
        {(!isAuthenticated || !loading) && (
          <>
            <CartItemList
              products={products}
              isAuthenticated={isAuthenticated}
              handleRemoveFromCart={handleRemoveFromCart}
              success={success}
            />
            <CartSummary
              products={products}
              handleCheckout={handleCheckout} 
              success={success}
            />
          </>
        )}
      </Segment>
    </>
  );
}

// export async function getServerSideProps(context) {
//   connectDb();

//   const { token } = nookies.get(context);
//   console.log(token);

//   //const cart = Cart.findOne()

//   return {
//     props: {
//       test: "test"
//     }
//   }
// }

export default Cart;
