import 'semantic-ui-css/semantic.min.css';
import '../styles/nprogress.css';
import '../styles/style.css';
import { AuthProvider, ProtectRoute } from '../components/_App/AuthProvider';
import Layout from '../components/_App/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ProtectRoute>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ProtectRoute>
    </AuthProvider>
  );
}

export default MyApp;
