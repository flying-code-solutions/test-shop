import { useEffect, useState } from "react";
import { Message, Form, Input, Button, Icon, Segment } from 'semantic-ui-react';
import Link from 'next/link';
import axios from 'axios';
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

const NEW_USER = {
  email: "",
  password: ""
}

function Login() {
  const [user, setUser] = useState(NEW_USER);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  useEffect(() => {
    const isUserValid = Object.values(user).every(prop => Boolean(prop));
    setValid(isUserValid);
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');
      const url = `${baseUrl}/api/login`
      const payload = user;
      await axios.post(url, payload);
      setUser(NEW_USER);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  return <>
    <Message attached icon="privacy" header="Welcome Back!" content="Log in with e-mail and password" color="blue" />
    <Form loading={loading} error={Boolean(error)} onSubmit={handleSubmit}>
      <Message 
        error
        header="Oops!"
        content={error}
      />
      <Segment>
        <Form.Input 
          fluid
          icon="envelope"
          iconPosition="left"
          label="E-mail"
          placeholder="E-mail"
          name="email"
          onChange={handleChange}
          value={user.email}
          type="email"
        />
        <Form.Input 
          fluid
          icon="lock"
          iconPosition="left"
          label="Password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={user.password}
          type="password"
        />
        <Button 
          disabled={!valid || loading}
          icon="sign in"
          type="submit"
          color="orange"
          content="Login"
        />
      </Segment>
    </Form>
    <Message attached="bottom" warning>
      <Icon name="help" />
      New user?{" "}
      <Link href="/signup">
        <a>Sign up here</a>
      </Link>{" "} instead.
    </Message>
  </>;
}

export default Login;