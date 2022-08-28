import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import { handleLogin, isAuthenticated } from '../../utils/auth';
import baseUrl from "../../utils/baseUrl";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      // for now, just save token instead of fetching the user from DB
      const token = isAuthenticated();
      if (token) {
        try {
          const payload = { headers: { Authorization: token } };
          const url = `${baseUrl}/api/account`;
          const { data } = await axios.get(url, payload);
          setUser(data);
        } catch (error) {
          console.error("Error fetching current user", error);
        }
      }
      // setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const login = async (user) => {
    const url = `${baseUrl}/api/login`;
    const payload = { ...user };
    const { data: token } = await axios.post(url, payload);
    handleLogin(token);
    setUser(token);
  }

  return (
    // I can also pass a value of loading to specify conditions for protected routes
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const protectedRoutes = ["/account", "/cart", "/create"];

  useEffect(() => {
    if (!isAuthenticated && protectedRoutes.includes(router.pathname)) {
      router.push("/login");
    }
  });

  return children;
};