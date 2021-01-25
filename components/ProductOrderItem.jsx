import styles from "../styles/Home.module.css";
import { getPriceString } from "../utils/index";

export function ProductOrderItem(props) {
  const { product } = props;
  return (
    <div className={styles.cartItem}>
      <div className={styles.cartItemImageAndText}>
        <img className={styles.cartItemImage} src={product.photos[0]}></img>
        <div className={styles.cartItemText}>
          <h1 className={styles.cartItemTitle}>{product.title}</h1>
          <p>Mărime: {product.size}</p>
        </div>
      </div>
      <div>
        <p className={styles.cartItemPrice}>
          {getPriceString(product.quantity * product.price)}
        </p>
        <div>{product.quantity} buc.</div>
      </div>
    </div>
  );
}
