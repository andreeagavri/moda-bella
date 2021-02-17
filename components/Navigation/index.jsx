import styles from "../../styles/Home.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";

// Top navigation bar, contains an authentification link if the
// user isn't logged in. Otherwise, it displays links to the user page,
// shopping cart, and to log out.
export function Navigation() {
  const [user, setUser] = useState();
  async function getUserAdditionalData(user) {
    return db
      .collection("users")
      .doc(user.uid)
      .get()
      .then((userData) => {
        if (userData.data()) {
          setUser({ ...userData.data() });
        }
      });
  }

  // Get user details
  useEffect(() => {
    const unsubscribeAfterAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserAdditionalData(user);
      }
    });
    return () => {
      unsubscribeAfterAuth();
    };
  }, []);

  return (
    <div className={styles.navbar}>
      {user === undefined ? (
        <Link href="/signin">
          <a className={styles.navlink}>Autentificare</a>
        </Link>
      ) : (
        <Link href="/user">Contul meu</Link>
      )}
      {user === undefined ? null : (
        <Link href="/cart">
          <a className={styles.navlink}>Coş de cumpărături</a>
        </Link>
      )}
      {user === undefined ? null : (
        <Link href="/signout">
          <a className={styles.navlink}>Deconectare</a>
        </Link>
      )}
    </div>
  );
}
