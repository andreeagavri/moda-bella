import Link from "next/link";
import React, { useState } from "react";
import { auth, db } from "../../config/firebase";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import { Navigation } from "../../components/Navigation";
import { NavMenu } from "../../components/NavMenu";
import { Title } from "../../components/Title";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

// Page for signing in the user, it contains the sign in form and
// validation
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
    <div className={styles.container}>
      <Head>
        <title>Moda Bella</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className={styles.main}>
        <Title />
        <NavMenu></NavMenu>
        <form className={styles.signinForm} onSubmit={onSubmit}>
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
            <span className={styles.signinLabel}>Parolă</span>
            <input
              name="password"
              value={password}
              onChange={onChange}
              type="password"
              className={styles.signinInput}
            />
          </div>

          <div className={styles.registerAndSignIn}>
            <Link href="/signup">
              <span className={styles.signinLink}>Înregistrare</span>
            </Link>
            <button
              disabled={isInvalid}
              type="submit"
              className={styles.saveAddressButton}
            >
              Autentificare
            </button>
          </div>

          {error && <p>{error.message}</p>}
        </form>
      </main>
    </div>
  );
}
