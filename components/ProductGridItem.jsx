import styles from "../styles/Home.module.css";
import Link from "next/link";
export function getPriceString(price) {
  return price.toString().replace(".", ",") + " RON";
}
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
