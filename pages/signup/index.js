import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { NavMenu } from "../../components/NavMenu";
import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { db } from "../../config/firebase";
import { useRouter } from "next/router";
import { Title } from "../../components/Title";

// Page for singing up the user. It contains a form to complete
// the necessary details and some validation
export default function SignUp() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Înregistrare</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className={styles.main}>
        <Title />
        <NavMenu></NavMenu>
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
        return createUser({
          uid: response.user.uid,
          email,
          username,
          points: 0,
        });
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

  function isPasswordNotComplex(password) {
    if (!password.match(/[0-9]/)) {
      return true;
    }
    if (!password.match(/[A-Z]/)) {
      return true;
    }
    if (password.length < 8) {
      return true;
    }

    return false;
  }

  const { username, email, passwordOne, passwordTwo, error } = credentials;

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    email === "" ||
    username === "" ||
    isPasswordNotComplex(passwordOne);

  return (
    <form onSubmit={onSubmit} className={styles.signinForm}>
      <div className={styles.signinItem}>
        <span className={styles.signinLabel}>Nume</span>{" "}
        <input
          name="username"
          value={username}
          onChange={onChange}
          type="text"
          className={styles.signinInput}
        />
      </div>

      <div className={styles.signinItem}>
        <span className={styles.signinLabel}>E-mail</span>
        <input
          name="email"
          value={email}
          onChange={onChange}
          type="text"
          className={styles.signinInput}
        />
      </div>

      <div className={styles.signinItem}>
        <span className={styles.signinLabel}>
          Parolă (min. 8 caractere, literă mare, cifră)
        </span>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={onChange}
          type="password"
          className={styles.signinInput}
        />
      </div>

      <div className={styles.signinItem}>
        <span className={styles.signinLabel}>Confirmare Parolă</span>
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={onChange}
          type="password"
          className={styles.signinInput}
        />
      </div>

      <button
        disabled={isInvalid}
        className={styles.saveAddressButton}
        type="submit"
      >
        Înregistrare
      </button>
      {error && <p>{error.message}</p>}
      <Link href="/signin">
        <span className={styles.signupLink}>Înapoi la autentificare</span>
      </Link>
    </form>
  );
}
