import ImageGallery from "react-image-gallery";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const images = [
  {
    original:
      "https://moda-bella.s3.eu-west-3.amazonaws.com/carousel/discounts.png",
    thumbnail:
      "https://moda-bella.s3.eu-west-3.amazonaws.com/carousel/discounts.png",
  },
  {
    original:
      "https://moda-bella.s3.eu-west-3.amazonaws.com/carousel/noile-rochii.jpg",
    thumbnail:
      "https://moda-bella.s3.eu-west-3.amazonaws.com/carousel/noile-rochii.jpg",
  },
  {
    original:
      "https://moda-bella.s3.eu-west-3.amazonaws.com/carousel/missguided.jpg",
    thumbnail:
      "https://moda-bella.s3.eu-west-3.amazonaws.com/carousel/missguided.jpg",
  },
];

const imgNames = {
  discounts:
    "https://moda-bella.s3.eu-west-3.amazonaws.com/carousel/discounts.png",
  "noile-rochii":
    "https://moda-bella.s3.eu-west-3.amazonaws.com/carousel/noile-rochii.jpg",
  missguided:
    "https://moda-bella.s3.eu-west-3.amazonaws.com/carousel/missguided.jpg",
};

export function CarouselModaBella() {
  const router = useRouter();

  function handleClickedImage(e) {
    e.preventDefault();

    if (e.target.src === imgNames["discounts"]) {
      router.push("/bella-card");
    } else if (e.target.src === imgNames["noile-rochii"]) {
      router.push("/haine/rochii");
    } else if ((e.target.src = imgNames["missguided"])) {
      router.push("/brands/missguided");
    }
  }

  return (
    <div className={styles.carouselContainer}>
      <ImageGallery
        items={images}
        showPlayButton={false}
        showFullscreenButton={false}
        autoPlay={true}
        slideInterval={7000}
        onClick={(e) => handleClickedImage(e)}
      />
    </div>
  );
}
