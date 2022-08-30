import cookie from "js-cookie";
import router from "next/router";

export function handleLogin(token) {
  cookie.set("token", token);
  router.push("/account");
}

export function isAuthenticated() {
  const savedCookie = cookie.get("token");
  return savedCookie;
}

export function removeCookie() {
  cookie.remove("token");
  router.push("/login");
}
