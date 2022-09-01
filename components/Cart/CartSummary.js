import { useEffect, useState } from "react";
import { Button, Segment, Divider } from "semantic-ui-react";
import calculateCartTotal from "../../utils/calculateCartTotal";

function CartSummary({ products }) {
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const [cartAmount, setCartAmount] = useState(0);
  const [stripeAmount, setStripeAmount] = useState(0);
  
  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setIsCartEmpty(products.length === 0);
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>Subtotal:</strong> ${cartAmount}
        <Button disabled={isCartEmpty} icon="cart" color="teal" floated="right" content="Checkout" />
      </Segment>
    </>
  );
}

export default CartSummary;
