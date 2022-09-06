import { useEffect, useState } from "react";
import AccountHeader from "../components/Account/AccountHeader";
import AccountOrders from "../components/Account/AccountOrders";
import { useAuth } from "../components/_App/AuthProvider";
import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "../utils/baseUrl";

function Account() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    async function getOrders() {
      const { token } = parseCookies();
      if (token) {
        const payload = { headers: { Authorization: token } };
        const url = `${baseUrl}/api/orders`;
        const response = await axios.get(url, payload);
        setOrders(response.data);
      }
    }
    
    getOrders();
  }, []);

  return (<>
    <AccountHeader {...user} />
    <AccountOrders orders={orders} />
  </>);
}

export default Account;