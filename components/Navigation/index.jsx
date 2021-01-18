import styles from "../../styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "../../config/firebase";
import { db } from "../../config/firebase";

export function Navigation(props) {
  const [user, setUser] = useState();
  const [cartProductsNumber, setCartProductsNumber] = useState(0);

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

  auth.onAuthStateChanged((user) => {
    if (user) {
      getUserAdditionalData(user);
    }
  });
  return (
    <div className={styles.navbar}>
      {user === undefined ? (
        <Link href="/signin">
          <a className={styles.navlink}>Autentificare</a>
        </Link>
      ) : (
        <div className={styles.userNavbar}>
          <span>{user.username}</span>
          <div className={styles.userDropdown}>
            <Link href="/signout">
              <span>Deconectare</span>
            </Link>
          </div>
        </div>
      )}

      <Link href="/cart">
        <a className={styles.navlink}>Coş de cumpărături</a>
      </Link>
    </div>
  );
}
