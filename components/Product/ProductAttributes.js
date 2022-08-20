import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Header, Button, Modal } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";

function ProductAttributes({ _id, description }) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    // One approach
    // const url = `${baseUrl}/api/product?_id=${_id}`;
    // const response = await axios.delete(url);

    // Better approach
    const url = `${baseUrl}/api/product`;
    const payload = { params: { _id } };
    await axios.delete(url, payload);
    router.push("/");
  }

  return (
    <>
      <Header as="h3">About this product</Header>
      <p>{description}</p>
      <Button
        icon="trash alternate outline"
        color="red"
        content="Delete Product"
        onClick={() => setModalOpen(true)}
      />
      <Modal open={modalOpen} dimmer="blurring">
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this product?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel" onClick={() => setModalOpen(false)} />
          <Button
            negative
            icon="trash"
            labelPosition="right"
            content="Delete"
            onClick={handleDelete}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default ProductAttributes;
