import styles from "../styles/Home.module.css";
import Link from "next/link";

export function Address(props) {
  const {
    address,
    selected,
    user,
    updateSelectedAddress,
    deleteAddress,
  } = props;

  return (
    <div className={styles.addressItemAndDelete}>
      <div
        className={
          selected ? styles.addressItemSelected : styles.addressItemUnselected
        }
        onClick={() => updateSelectedAddress(user, address.id)}
      >
        <div>{address.details}</div>
        <div>{address.city}</div>
        <div>{address.county}</div>
        <div>{address.postcode}</div>
        <div>{address.phone}</div>
      </div>
      <div
        onClick={() => deleteAddress(address)}
        className={styles.deleteAddressButton}
      >
        ⨉
      </div>
    </div>
  );
}
