import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import nprogress from "nprogress";
import { Menu, Container, Icon } from "semantic-ui-react";

function Header() {
  // hooks need to be executed at the very top
  const router = useRouter();
  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`);
      nprogress.start();
    };
    const handleStop = () => {
      nprogress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  const user = true;

  function isActive(route) {
    return router.pathname === route;
  }

  return (
    <Menu fluid id="menu" inverted stackable>
      <Container text>
        <Link href="/">
          <Menu.Item header active={isActive("/")}>
            <Icon name="shopping bag" size="large" />
            Test Shop
          </Menu.Item>
        </Link>
        <Link href="/cart">
          <Menu.Item header active={isActive("/cart")}>
            <Icon name="cart" size="large" />
            Cart
          </Menu.Item>
        </Link>
        {user && (
          <Link href="/create">
            <Menu.Item header active={isActive("/create")}>
              <Icon name="add square" size="large" />
              Create
            </Menu.Item>
          </Link>
        )}
        {user ? (
          <>
            <Link href="/account">
              <Menu.Item header active={isActive("/account")}>
                <Icon name="user" size="large" />
                Account
              </Menu.Item>
            </Link>
            <Menu.Item header>
              <Icon name="sign out" size="large" />
              Logout
            </Menu.Item>
          </>
        ) : (
          <>
            <Link href="/login">
              <Menu.Item header active={isActive("/login")}>
                <Icon name="sign in" size="large" />
                Login
              </Menu.Item>
            </Link>
            <Link href="/signup">
              <Menu.Item header active={isActive("/signup")}>
                <Icon name="signup" size="large" />
                Signup
              </Menu.Item>
            </Link>
          </>
        )}
      </Container>
    </Menu>
  );
}

export default Header;
