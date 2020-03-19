export const mapRange = (current, fromMin, fromMax, toMin, toMax) => {
  return toMin + ((toMax - toMin) * (current - fromMin)) / (fromMax - fromMin);
};
