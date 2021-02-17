import styles from "../styles/Home.module.css";
import { getPriceString } from "../utils/index";

// Component showing a cart item on the shopping cart page
// The product quantity can be increased (up to 5 items) and
// it can also be removed from the cart by clicking on the X
export function ProductCartItem(props) {
  const { product, updateQuantity, removeFromCart } = props;
  return (
    <div className={styles.cartItem}>
      <div className={styles.cartItemImageAndText}>
        <img className={styles.cartItemImage} src={product.photos[0]}></img>
        <div className={styles.cartItemText}>
          <h1 className={styles.cartItemTitle}>{product.title}</h1>
          <p>Mărime: {product.size}</p>
          <p className={styles.cartItemPrice}>
            Total: {getPriceString(product.quantity * product.price)}
          </p>
          <select
            id="quantity"
            name="quantity"
            value={product.quantity}
            onChange={(e) => updateQuantity(e, product)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <div
        onClick={() => removeFromCart(product)}
        className={styles.removeProduct}
      >
        ⨉
      </div>
    </div>
  );
}
