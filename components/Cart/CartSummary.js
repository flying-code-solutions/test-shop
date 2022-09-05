import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { Button, Segment, Divider } from "semantic-ui-react";
import calculateCartTotal from "../../utils/calculateCartTotal";

function CartSummary({ products, handleCheckout, success }) {
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
        <StripeCheckout
          name="Test Shop"
          amount={stripeAmount}
          image={products.length > 0 ? products[0].product.mediaUrl : ""}
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          stripeKey="pk_test_51LelkRDHkZB0mGcrxE72lesiIumWLMhRphqI78FunJTzS63VxYJCH9vPyoSaEfyghgS6bTtWuUbHZBRym5OibI4200oaUPF6B8"
          token={handleCheckout}
          triggerEvent="onClick"
        >
          <Button
            disabled={isCartEmpty || success}
            icon="cart"
            color="teal"
            floated="right"
            content="Checkout"
          />
        </StripeCheckout>
      </Segment>
    </>
  );
}

export default CartSummary;
