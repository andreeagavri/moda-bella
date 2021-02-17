import styles from "../styles/Home.module.css";
import Link from "next/link";

// Component with the details of an order shown on the order page
export function OrderSummary(props) {
  const { order } = props;
  return (
    <div className={styles.orderSummary}>
      <div className={styles.orderDetails}>
        <span className={styles.orderId}>Comanda #{order.id.slice(0, 8)}</span>
        <span>Plasată pe {order.date}</span>
        <span>Status: {order.status}</span>
        <span>Total: {order.total}</span>
      </div>
      <Link href={"/order/" + order.id}>
        <div className={styles.orderDetailsButton}>Detalii comandă</div>
      </Link>
    </div>
  );
}
