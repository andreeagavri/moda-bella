import styles from "../styles/Home.module.css";
export function ProductGridItem(props) {
  const { product } = props;
  function getPriceString(price) {
    return price.toString().replace(".", ",") + " RON";
  }
  return (
    <div className={styles.card}>
      <img className={styles.cardImage} src={product.photos[0]}></img>
      <h1 className={styles.cardTitle}>{product.title}</h1>
      <span className={styles.cardPrice}>{getPriceString(product.price)}</span>
    </div>
  );
}
