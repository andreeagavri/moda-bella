import styles from "../styles/Home.module.css";

export function Card(props) {
  const { points } = props;

  const baseURL = "https://moda-bella.s3.eu-west-3.amazonaws.com/cards/";
  let imgSrc = "";

  if (points < 1000) {
    imgSrc = "locked-card.png";
  } else if (points < 3000) {
    imgSrc = "bronze-card.png";
  } else if (points < 8000) {
    imgSrc = "silver-card.png";
  } else {
    imgSrc = "gold-card.png";
  }
  return <img className={styles.bellaCardImage} src={baseURL + imgSrc}></img>;
}
