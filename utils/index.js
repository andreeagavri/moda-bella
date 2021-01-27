export function getPriceString(price) {
  price = price.toFixed(2);
  return price.toString().replace(".", ",") + " RON";
}

export function getDiscountValue(points) {
  if (points < 1000) {
    return 0;
  }
  if (points < 2000) {
    return 0.1;
  }
  if (points < 5000) {
    return 0.2;
  }
  return 0.3;
}

export function capitalize(str) {
  if (str !== undefined) return str[0].toUpperCase() + str.slice(1);

  return "";
}
