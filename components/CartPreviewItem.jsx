import styles from "../styles/Home.module.css";
import { getPriceString } from "../utils";

export function CartPreviewitem(props) {
  const { product } = props;
  return (
    <div className={styles.cartPreviewProduct}>
      <img src={product.photos[0]} className={styles.cartPreviewProductImage} />
      <div className={styles.cartPreviewProductDetails}>
        <span>{product.title}</span>
        <span>{product.size}</span>
        <span>
          {product.quantity} × {getPriceString(product.price)}
        </span>
      </div>
    </div>
  );
}
