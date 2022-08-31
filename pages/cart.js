import { Segment } from "semantic-ui-react";
import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary.js";
import connectDb from "../utils/connectDb";
import { parseCookies } from "nookies";
import { useAuth } from "../components/_App/AuthProvider";
import { useEffect, useState } from "react";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

function Cart() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      if (isAuthenticated) {
        const { token } = parseCookies();
        const url = `${baseUrl}/api/cart`;
        console.log(url);
        const payload = { headers: { Authorization: token } };
        const response = await axios.get(url, payload);
        setProducts(response.data);
        console.log(response.data);
      }
    }
    getProducts();
  }, []);

  return (
    <>
      <Segment>
        <CartItemList />
        <CartSummary />
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
