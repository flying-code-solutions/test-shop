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
import axios from "axios";
import baseUrl from "../utils/baseUrl";

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

  async function handleSubmit(event) {
    // prevent the page from reloading after submit (default behaviour)
    event.preventDefault();

    // upload the product image and get the URL of the clour resource
    const mediaUrl = await handleImageUpload();
    console.log(mediaUrl);

    // todo implement product submission, just logging it for now
    const url = `${baseUrl}/api/product`;
    const payload = { ...product, mediaUrl };
    await axios.post(url, payload);
    setSuccess(true);

    // reset form
    setProduct(NEW_PRODUCT);

    // optional: make the success message disappear after 10 seconds
    // setTimeout(() => {
    //   setSuccess(false);
    // }, 10000);
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", product.media);
    data.append("folder", "test-shop");
    data.append("upload_preset", "test-shop");
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.url;
    return mediaUrl;
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
