import styles from "../styles/Home.module.css";
import Link from "next/link";
export function getPriceString(price) {
  return price.toString().replace(".", ",") + " RON";
}
export function ProductCartItem(props) {
  const { product } = props;

  return (
    <div className={styles.cartItem}>
      <div className={styles.cartImageAndText}>
        <img className={styles.cartItemImage} src={product.photos[0]}></img>
        <div className={styles.cartItemText}>
          <h1 className={styles.cartItemTitle}>{product.title}</h1>
          <p>Mărime: {product.size}</p>
          <p className={styles.cartItemPrice}>
            {getPriceString(product.price)}
          </p>
        </div>
      </div>
      <div>X</div>
    </div>
  );
}
