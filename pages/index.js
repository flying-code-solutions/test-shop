// import { useEffect, useState } from "react";
// import axios from "axios";
import connectDb from "../utils/connectDb";
// import products from "../public/products.json";
import Product from "../models/Product";
import ProductList from "../components/Index/ProductList";

function Home({ products }) {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   getProducts();
  // }, []);

  // async function getProducts() {
  //   // todo use fetch iso axios
  //   const url = 'http://localhost:3000/api/products';
  //   const response = await axios.get(url);

  //   console.log(response.data);
  // }

  return <ProductList products={products} />;
}

export async function getServerSideProps(context) {
  // original version from the course (with getInitialProps):
  // fetch data on server
  // return response data as an object
  // note: this object will be merged with existing props

  // getInitialProps is deprecated, with getServerSideProps the DB call
  // is made straight from here, no need for a redundant API call
  connectDb();

  const products = await Product.find();
  return {
    props: {
      // JSON.parse(JSON.stringify()) is used as a "hack" to prevent
      // serialization error
      products: JSON.parse(JSON.stringify(products))
    }
  };
}

export default Home;
