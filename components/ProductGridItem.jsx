import styles from "../styles/Home.module.css";
import Link from "next/link";
export function getPriceString(price) {
  return price.toString().replace(".", ",") + " RON";
}

// A component showing the preview of a single product inside
// the grid view page with several products. Clicking on it
// redirects to the product page.
export function ProductGridItem(props) {
  const { product } = props;

  return (
    <Link href={"/product/" + product.id}>
      <div className={styles.card}>
        <img className={styles.cardImage} src={product.photos[0]}></img>
        <h1 className={styles.cardTitle}>{product.title}</h1>
        <span className={styles.cardPrice}>
          {getPriceString(product.price)}
        </span>
      </div>
    </Link>
  );
}
