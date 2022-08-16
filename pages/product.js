import connectDb from "../utils/connectDb";
import ProductModel from "../models/Product";
import ProductSummary from "../components/Product/ProductSummary";
import ProductAttributes from "../components/Product/ProductAttributes";

function Product({ product }) {
  // the whole props object can be passed with spread operator like this
  return (
    <>
      <ProductSummary {...product} />
      <ProductAttributes {...product} />
    </>
  );
}

// context object includes URL query string as an object of key value pairs
export async function getServerSideProps({ query: { _id: id } }) {
  connectDb();
  const product = await ProductModel.findById(id);

  return {
    props: {
      product: JSON.parse(JSON.stringify(product))
    }
  };
}

export default Product;
