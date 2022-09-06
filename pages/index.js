// import { useEffect, useState } from "react";
// import axios from "axios";
import connectDb from "../utils/connectDb";
// import products from "../public/products.json";
import Product from "../models/Product";
import ProductList from "../components/Index/ProductList";
import ProductPagination from "../components/Index/ProductPagination";

function Home({ products, totalPages }) {
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

  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  );
}

export async function getServerSideProps(context) {
  // original version from the course (with getInitialProps):
  // fetch data on server
  // return response data as an object
  // note: this object will be merged with existing props

  // getInitialProps is deprecated, with getServerSideProps the DB call
  // is made straight from here, no need for a redundant API call
  connectDb();

  console.log(context.query);
  const page = context.query.page ? Number(context.query.page) : 1;
  const size = 6;
  let products = [];
  
  const totalDocs = await Product.countDocuments();
  const totalPages = Math.ceil(totalDocs / size);

  if (page === 1) {
    products = await Product.find().limit(size);
  } else {
    const offset = size * (page - 1);
    products = await Product.find().skip(offset).limit(size);
  }

  // const products = await Product.find();
  return {
    props: {
      // JSON.parse(JSON.stringify()) is used as a "hack" to prevent
      // serialization error
      products: JSON.parse(JSON.stringify(products)),
      totalPages
    }
  };
}

export default Home;
