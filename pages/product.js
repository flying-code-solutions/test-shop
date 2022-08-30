import connectDb from "../utils/connectDb";
import ProductModel from "../models/Product";
import ProductSummary from "../components/Product/ProductSummary";
import ProductAttributes from "../components/Product/ProductAttributes";
import { useAuth } from "../components/_App/AuthProvider";

function Product({ product }) {
  const { isAdmin } = useAuth();
  // the whole props object can be passed with spread operator like this
  return (
    <>
      <ProductSummary {...product} />
      <ProductAttributes {...product} isAdmin={isAdmin} />
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
