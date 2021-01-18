import Link from "next/link";
import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { useRouter } from "next/router";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};
export default function SignIn() {
  const [credentials, setCredentials] = useState(INITIAL_STATE);
  const router = useRouter();
  const onSubmit = (event) => {
    const { email, password } = credentials;
    auth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        router.push("/");
      })
      .catch((error) => {
        setCredentials((prevState) => ({
          ...prevState,
          error: error,
        }));
      });
    event.preventDefault();
  };
  const onChange = (event) => {
    setCredentials((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  const { email, password, error } = credentials;

  let user = auth.currentUser;
  const isInvalid = password === "" || email === "";
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          value={email}
          onChange={onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={onChange}
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
      <Link href="/signup">
        <a>Înregistrare</a>
      </Link>
    </div>
  );
}
