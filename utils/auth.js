import cookie from "js-cookie";
import router from "next/router";

export function handleLogin(token) {
  cookie.set("token", token);
  router.push("/account");
}
