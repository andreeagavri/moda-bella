import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { db } from "../../config/firebase";
import { useRouter } from "next/router";

export default function SignUp() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Înregistrare</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className={styles.main}>
        <Link href="/">
          <h1 className={styles.title}>MODA BELLA</h1>
        </Link>
        <SignUpForm />
      </main>
    </div>
  );
}
const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
};
function SignUpForm() {
  const [credentials, setCredentials] = useState(INITIAL_STATE);

  const router = useRouter();
  function createUser(user) {
    return db
      .collection("users")
      .doc(user.uid)
      .set(user)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const onSubmit = (event) => {
    const { username, email, passwordOne } = credentials;
    auth
      .createUserWithEmailAndPassword(email, passwordOne)
      .then((response) => {
        return createUser({ uid: response.user.uid, email, username });
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

  const { username, email, passwordOne, passwordTwo, error } = credentials;

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    email === "" ||
    username === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={username}
        onChange={onChange}
        type="text"
        placeholder="Username"
      />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
}
