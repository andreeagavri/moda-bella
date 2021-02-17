import styles from "../styles/Home.module.css";
import Link from "next/link";

// The Moda Bella title on every page
export function Title() {
  return (
    <Link href="/">
      <img
        src="https://moda-bella.s3.eu-west-3.amazonaws.com/logo/logo-text.png"
        className={styles.title}
      />
    </Link>
  );
}
