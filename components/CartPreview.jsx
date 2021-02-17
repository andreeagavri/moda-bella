import { CartPreviewitem } from "./CartPreviewItem";
import styles from "../styles/Home.module.css";
import Link from "next/link";

// Component for the shopping cart preview which shows up
// in the top-right corner after adding a product to it
// It consists of a list of CartPreviewItems
export function CartPreview(props) {
  const { products, setShowCartPreview } = props;

  function closePreview() {
    setShowCartPreview(false);
  }

  return (
    <div className={styles.cartPreview}>
      <div className={styles.closeCartPreview} onClick={() => closePreview()}>
        ⨉
      </div>
      <div className={styles.cartPreviewProducts}>
        {products.map((product) => (
          <CartPreviewitem product={product} />
        ))}
      </div>
      <Link href="/cart">
        <div className={styles.cartPreviewDetails}>DETALII COŞ</div>
      </Link>
    </div>
  );
}
