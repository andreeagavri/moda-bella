import styles from "../styles/Home.module.css";
import Link from "next/link";

export function Address(props) {
  const { address, selected, setSelectedAddressId } = props;

  return (
    <div
      className={
        selected ? styles.addressItemSelected : styles.addressItemUnselected
      }
      onClick={() => setSelectedAddressId(address.id)}
    >
      <div>{address.details}</div>
      <div>{address.city}</div>
      <div>{address.county}</div>
      <div>{address.postcode}</div>
      <div>{address.phone}</div>
    </div>
  );
}
