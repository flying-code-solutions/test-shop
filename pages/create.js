import { useEffect, useState } from "react";
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
import catchErrors from "../utils/catchErrors";
import { useRouter } from "next/router";
import { useAuth } from "../components/_App/AuthProvider";

const NEW_PRODUCT = {
  name: "",
  price: "",
  description: "",
  media: ""
};

function Create() {
  const [product, setProduct] = useState(NEW_PRODUCT);
  const [mediaPreview, setMediaPreview] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const isProduct = Object.values(product).every((key) => Boolean(key));
    setDisabled(!isProduct);
  }, [product]);

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
    try {
      // prevent the page from reloading after submit (default behaviour)
      event.preventDefault();
      // show loading spinner and disable the Submit btn
      setLoading(true);
      // upload the product image and get the URL of the clour resource
      const mediaUrl = await handleImageUpload();
      // send a POST request to the DB
      const url = `${baseUrl}/api/product`;
      const payload = { ...product, mediaUrl };
      const response = await axios.post(url, payload);
      // display a success message
      setSuccess(true);
      // reset form
      setProduct(NEW_PRODUCT);

      // optional: make the success message disappear after 10 seconds
      // setTimeout(() => {
      //   setSuccess(false);
      // }, 10000);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      // turn off loading spinner
      setLoading(false);
    }
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", product.media);
    data.append("folder", "test-shop");
    data.append("upload_preset", "test-shop");
    const response = await axios.post(
      process.env.NEXT_PUBLIC_CLOUDINARY_URL,
      data
    );
    const mediaUrl = response.data.url;
    return mediaUrl;
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form
        loading={loading}
        success={success}
        error={Boolean(error)}
        onSubmit={handleSubmit}
      >
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been successfully created."
        />
        <Message error header="Oops!" content={error} />
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
        <Image src={mediaPreview} alt="Image Preview" rounded centered size="medium" />
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
          disabled={disabled || loading}
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
