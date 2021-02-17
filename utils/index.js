// Get the price string with a comma, 2 decimals and RON afterwards
export function getPriceString(price) {
  price = price.toFixed(2);
  return price.toString().replace(".", ",") + " RON";
}

// Get the discount based on the points
export function getDiscountValue(points) {
  if (points < 1000) {
    return 0;
  }
  if (points < 3000) {
    return 0.1;
  }
  if (points < 8000) {
    return 0.2;
  }
  return 0.3;
}

// Capitalize a string
export function capitalize(str) {
  if (str !== undefined) return str[0].toUpperCase() + str.slice(1);

  return "";
}
