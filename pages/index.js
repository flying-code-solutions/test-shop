import { useEffect, useState } from "react";
import axios from "axios";
import products from '../public/products.json';

function Home() {
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

  return <>Home</>
}

export async function getServerSideProps(context) {
  // fetch data on server
  // return response data as an object
  return {
    props: {
      products: products
    }
  };
  // note: this object will be merged with existing props
}

export default Home;