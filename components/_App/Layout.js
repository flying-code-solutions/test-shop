import Head from 'next/head';
import { Container } from "semantic-ui-react";

import HeadContent from './HeadContent';
import Header from './Header';

function Layout({ children }) {
  return (
    <>
      <Head>
        <HeadContent />
        {/* <link href='/nprogress.css' rel='stylesheet' /> */}
        {/* <link href='/style.css' rel='stylesheet' /> */}
        <title>Test Shop</title>
      </Head>
      <Header />
      <Container text style={{ paddingTop: '1em' }}>
        { children }
      </Container>
    </>
  );
}

export default Layout;