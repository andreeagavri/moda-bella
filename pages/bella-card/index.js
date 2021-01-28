import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { Navigation } from "../../components/Navigation";
import { useEffect, useState } from "react";
import { NavMenu } from "../../components/NavMenu";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Moda Bella</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className={styles.main}>
        <h1 className={styles.title}>MODA BELLA</h1>
        <NavMenu></NavMenu>

        <h1 className={styles.pageTitle}>Bella Card</h1>
        <img
          className={styles.bellaCardsInfoImage}
          src="https://moda-bella.s3.eu-west-3.amazonaws.com/cards/cards.png"
        />

        <div className={styles.twoTextContainer}>
          <div className={styles.singleTextcontainer}>
            <h3 className={styles.smallTitle}>DESCOPERĂ OFERTA BELLA CARD</h3>
            <p className={styles.cardParagraph}>
              Bella Card îţi oferă discount-uri dinamice. Adună puncte cumpărând
              şi beneficiezi de reduceri de până la 30% la fiecare comandă.
            </p>
          </div>

          <div className={styles.singleTextcontainer}>
            <h3 className={styles.smallTitle}>CUM FUNCŢIONEAZĂ?</h3>

            <p className={styles.cardParagraph}>
              Fiecare leu cheltuit pe platforma Moda Bella îţi aduce un punct în
              contul tău. Adună 1000 de puncte şi vei primi primul tău card:
              Bella Bronze, cu 10% reducere.
            </p>
          </div>
        </div>

        <img
          className={styles.bellaCardsInfoImage}
          src="https://moda-bella.s3.eu-west-3.amazonaws.com/cards/cards-perspective.png"
        />

        <h3 className={styles.smallTitle}>BRONZE, SILVER {"&"} GOLD</h3>
        <p className={styles.cardParagraph}>
          O dată ce ai câştigat cardul Bella Bronze, te aşteaptă şi următoarele.
          Adună 3000 de puncte şi vei primi cardul Bella Silver, cu o reducere
          de 20% la fiecare comandă. După 8000 de puncte, te poţi bucura de
          reduceri de 30% cu cardul Bella Gold.
        </p>
      </main>
    </div>
  );
}
