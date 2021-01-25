import styles from "../styles/Home.module.css";
import Link from "next/link";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const INITIAL_STATE = {
  details: "",
  city: "",
  county: "",
  postCode: "",
  phone: "",
};

export function AddressForm(props) {
  const { setShowAddressForm, saveAddress } = props;
  const [addressItems, setAddressItems] = useState(INITIAL_STATE);

  const { details, city, county, postCode, phone } = addressItems;
  function addAddress(event) {
    event.preventDefault();

    saveAddress({ id: uuidv4(), ...addressItems });
    setAddressItems(INITIAL_STATE);
    setShowAddressForm(false);
  }

  function onChange(event) {
    setAddressItems((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  function closeAddressForm() {
    setAddressItems(INITIAL_STATE);
    setShowAddressForm(false);
  }

  function isPhoneInvalid(phone) {
    // remove spaces
    phone = phone.replace(/\s+/g, "");

    if (phone.match(/^[0-9]{10}$/) !== null) {
      return false;
    }
    return true;
  }

  const isInvalid =
    details === "" ||
    city === "" ||
    county === "" ||
    postCode === "" ||
    isPhoneInvalid(phone);

  return (
    <div>
      <form onSubmit={addAddress} className={styles.addressForm}>
        <div className={styles.addressFormLabelAndInput}>
          <label className={styles.addressFormLabel}>Detalii adresă</label>
          <input
            className={styles.addressFormInput}
            name="details"
            value={details}
            onChange={onChange}
            type="text"
          />
        </div>
        <div className={styles.addressFormLabelAndInput}>
          <label className={styles.addressFormLabel}>Localitate</label>
          <input
            className={styles.addressFormInput}
            name="city"
            value={city}
            onChange={onChange}
            type="text"
          />
        </div>
        <div className={styles.addressFormLabelAndInput}>
          <label className={styles.addressFormLabel}>Judeţ</label>
          <input
            className={styles.addressFormInput}
            name="county"
            value={county}
            onChange={onChange}
            type="text"
          />
        </div>
        <div className={styles.addressFormLabelAndInput}>
          <label className={styles.addressFormLabel}>Cod Poştal</label>
          <input
            className={styles.addressFormInput}
            name="postCode"
            value={postCode}
            onChange={onChange}
            type="text"
          />
        </div>
        <div className={styles.addressFormLabelAndInput}>
          <label className={styles.addressFormLabel}>Număr de telefon</label>
          <input
            className={styles.addressFormInput}
            name="phone"
            value={phone}
            onChange={onChange}
            type="text"
          />
        </div>

        <button
          className={styles.closeAddressFormButton}
          onClick={closeAddressForm}
        >
          ANULARE
        </button>
        <button
          type="submit"
          disabled={isInvalid}
          className={styles.saveAddressButton}
        >
          SALVARE
        </button>
      </form>
    </div>
  );
}
