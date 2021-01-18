import Link from "next/link";
import React, { useState } from "react";
import { auth, db } from "../../config/firebase";
import { useRouter } from "next/router";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

export default function SignIn() {
  const [credentials, setCredentials] = useState(INITIAL_STATE);
  const router = useRouter();
  function onSubmit(event) {
    const { email, password } = credentials;
    auth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        router.push("/");
      })
      .catch((error) => {
        console.log("sign in error");
      });
    event.preventDefault();
  }
  function onChange(event) {
    setCredentials((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }
  const { email, password, error } = credentials;
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
