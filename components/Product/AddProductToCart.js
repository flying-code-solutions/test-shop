import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import axios from "axios";
import { catchErrors } from "../../utils/catchErrors";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";

function AddProductToCart({ isAuthenticated, productId }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeout;
    if (success) {
      timeout = setTimeout(() => setSuccess(false), 3000);
    }
    return () => {
      clearTimeout(timeout);
    }
  }, [success])

  async function handleAddProductToCart() {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/cart`;
      const payload = { quantity, productId }
      const token = cookie.get("token");
      const headers = { headers: { Authorization: token } };
      await axios.put(url, payload, headers);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
    
  }

  const addToCartButtonProps = {
    color: "orange",
    content: "Add to Cart",
    icon: "plus cart",
    loading,
    disabled: loading,
    onClick: handleAddProductToCart
  };

  const successButtonProps = {
    color: "blue",
    content: "Item Added!",
    icon: "plus cart",
    disabled: true
  };

  const signUpButtonProps = {
    color: "blue",
    content: "Sign Up To Purchase",
    icon: "signup",
    onClick: () => router.push("/signup")
  };

  return (
    <Input
      type="number"
      min="1"
      placeholder="Quantity"
      value={quantity}
      onChange={event => setQuantity(Number(event.target.value))}
      action={isAuthenticated
        ? success
          ? successButtonProps
          : addToCartButtonProps
        : signUpButtonProps}
    />
  );
}

export default AddProductToCart;
