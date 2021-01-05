import styles from "../../styles/Home.module.css";
import Link from "next/link";

export function Navigation() {
  return (
    <div className={styles.navbar}>
      <Link href="/signin">
        <a className={styles.navlink}>Autentificare</a>
      </Link>

      <Link href="/cart">
        <a className={styles.navlink}>Coş de cumpărături</a>
      </Link>
    </div>
  );
}
