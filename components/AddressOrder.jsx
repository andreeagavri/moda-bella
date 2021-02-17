import styles from "../styles/Home.module.css";
import Link from "next/link";

// Component for the address details on the order page
export function AddressOrder(props) {
  const { address } = props;

  return (
    <div className={styles.orderDetailItem}>
      <div>{address.details}</div>
      <div>{address.city}</div>
      <div>{address.county}</div>
      <div>{address.postcode}</div>
      <div>{address.phone}</div>
    </div>
  );
}
