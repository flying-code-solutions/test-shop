import { useState } from "react";
import {
  Form,
  Input,
  TextArea,
  Button,
  Image,
  Message,
  Header,
  Icon
} from "semantic-ui-react";

const NEW_PRODUCT = {
  name: "",
  price: "",
  description: "",
  media: ""
};

function Create() {
  const [product, setProduct] = useState(NEW_PRODUCT);
  const [mediaPreview, setMediaPreview] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value, files } = event.target;
    if (name === "media") {
      setProduct((prev) => ({ ...prev, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(event) {
    // prevent the page from reloading after submit (default behaviour)
    event.preventDefault();

    // todo implement product submission, just logging it for now
    console.log(product);
    setSuccess(true);

    // reset form
    setProduct(NEW_PRODUCT);
    // setTimeout(() => {
    //   setSuccess(false);
    // }, 10000);
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form success={success} onSubmit={handleSubmit}>
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been successfully created."
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            onChange={handleChange}
            value={product.name}
          />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            type="number"
            min="0.00"
            step="0.01"
            onChange={handleChange}
            value={product.price}
          />
          <Form.Field
            control={Input}
            name="media"
            label="Media"
            content="Select Image"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="medium" />
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description"
          onChange={handleChange}
          value={product.description}
        />
        <Form.Field
          control={Button}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default Create;
