import { Header, Segment, Button, Icon, Item, Message } from "semantic-ui-react";
import { useRouter } from "next/router"

function CartItemList({ products, isAuthenticated, handleRemoveFromCart, success }) {
  const router = useRouter();

  console.log(products);

  function mapCartProductsToItems(productArr) {
    return productArr.map((product) => ({
      header: (
        <Item.Header as="a" onClick={() => router.push(`/products?_id=${product.product._id}`)}>
          {product.product.name}
        </Item.Header>
      ),
      image: product.product.mediaUrl,
      meta: `${product.quantity} x $${product.product.price}`,
      childKey: product.product._id,
      fluid: "true",
      extra: (
        <Button
          basic
          icon="remove"
          floated="right"
          onClick={() => handleRemoveFromCart(product.product._id)}
        />
      )
    }));
  }

  if (success) {
    return (
      <Message
        success
        header="Success!"
        content="Your order and payment has been accepted."
        icon="star outline"
      />
    );
  }

  if (products.length === 0) {
    return (
      <Segment secondary color="teal" inverted textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket" />
          No products in your cart. Add some!
        </Header>
        <div>
          {isAuthenticated ? (
            <Button color="orange" onClick={() => router.push("/")}>View Products</Button>
          ) : (
            <Button color="blue" onClick={() => router.push("/login")}>Login to Add Products</Button>
          )}
        </div>
      </Segment>
    );
  } else {
    return (
      <Item.Group
        items={mapCartProductsToItems(products)}
        divided
      />
    );
  }
}

export default CartItemList;
