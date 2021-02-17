import Head from "next/head";
import styles from "../styles/Home.module.css";
import products from "../products.json";
import { ProductGridItem } from "../components/ProductGridItem";
import { Navigation } from "../components/Navigation";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { NavMenu } from "../components/NavMenu";
import { Title } from "../components/Title";
import { CarouselModaBella } from "../components/Carousel";

// Home page showing the general details and a carousel with
// promotions
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Moda Bella</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className={styles.main}>
        <Title />
        <NavMenu></NavMenu>
        <CarouselModaBella />
        <div className={styles.infoItem}>
          <img
            className={styles.infoImage}
            src="https://moda-bella.s3.eu-west-3.amazonaws.com/icons/truck.png"
          />
          <p className={styles.infoText}>
            Livare până în faţa uşii tale, în 48h
          </p>
        </div>
        <div className={styles.infoItem}>
          <img
            className={styles.infoImage}
            src="https://moda-bella.s3.eu-west-3.amazonaws.com/icons/return-box.png"
          />
          <p className={styles.infoText}>
            Returnează gratuit produsele în limita a 30 de zile.
          </p>
        </div>
        <div className={styles.infoItem}>
          <img
            className={styles.infoImage}
            src="https://moda-bella.s3.eu-west-3.amazonaws.com/icons/contact.png"
          />
          <p className={styles.infoText}>
            Telefon: 0745 190 765
            <br />
            E-mail: contact@modabella.ro
          </p>
        </div>
      </main>
    </div>
  );
}
