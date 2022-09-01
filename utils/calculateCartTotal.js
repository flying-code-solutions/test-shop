function calculateCartTotal(products) {
  const total = products.reduce((acc, el) => {
    return acc + el.quantity * el.product.price;
  }, 0);
  // prevent JavaScript rounding error
  const cartTotal = ((total * 100) / 100).toFixed(2);
  const stripeTotal = Number((total * 100).toFixed(2));

  return { cartTotal, stripeTotal };
}

export default calculateCartTotal;