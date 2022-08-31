import { Item } from "semantic-ui-react";
import { Label } from "semantic-ui-react";
import AddProductToCart from "./AddProductToCart";

function ProductSummary({ name, mediaUrl, _id, price, sku, isAuthenticated }) {
  return (
    <Item.Group>
      <Item>
        <Item.Image size="medium" src={mediaUrl} />
        <Item.Content>
          <Item.Header>{name}</Item.Header>
          <Item.Description>
            <p>${price}</p>
            <Label>SKU: {sku}</Label>
          </Item.Description>
          <Item.Extra>
            <AddProductToCart isAuthenticated={isAuthenticated} productId={_id} />
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  );
}

export default ProductSummary;
