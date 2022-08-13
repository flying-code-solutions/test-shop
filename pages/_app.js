import 'semantic-ui-css/semantic.min.css';
import Layout from '../components/_App/Layout';
import '../styles/nprogress.css';
import '../styles/style.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
