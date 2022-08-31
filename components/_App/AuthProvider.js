import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import { handleLogin, removeCookie, isAuthenticated } from '../../utils/auth';
import baseUrl from "../../utils/baseUrl";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = isAuthenticated();
      if (token) {
        try {
          getUserFromToken(token);
        } catch (error) {
          console.error("Error fetching current user", error);
          // throw out invalid token and redirect to the login page
          removeCookie();          
        }
      }
      // setLoading(false);
    }
    const syncLogout = event => {
      if (event.key === 'logout') {
        setUser("");
        setIsAdmin(false);
        router.push("/login");
      }
    }
    window.addEventListener('storage', syncLogout);
    loadUserFromCookies();
    return function cleanup() {
      window.removeEventListener('storage', syncLogout);
    }
  }, []);

  const login = async (user) => {
    const url = `${baseUrl}/api/login`;
    const payload = { ...user };
    const { data: token } = await axios.post(url, payload);
    // setUser(token);
    await getUserFromToken(token);
    handleLogin(token);
  }

  const logout = async () => {
    setUser("");
    setIsAdmin(false);
    removeCookie();
  }

  const getUserFromToken = async (token) => {
    const payload = { headers: { Authorization: token } };
    const url = `${baseUrl}/api/account`;
    const { data } = await axios.get(url, payload);
    const isRoot = data && data.role === "root";
    const isAdmin = data && data.role === "admin";
    setUser(data);
    setIsAdmin(isRoot || isAdmin);
  }

  return (
    // I can also pass a value of loading to specify conditions for protected routes
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const protectedRoutes = ["/account", "/create"];

  useEffect(() => {
    if (!isAuthenticated && protectedRoutes.includes(router.pathname)) {
      router.push("/login");
    }
  });

  return children;
};