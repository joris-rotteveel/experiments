import "./index.css";
import { TickerItem } from "./tickerItem";

const tickerElements = document.querySelectorAll(".js-ticker-item");

const items = [];
tickerElements.forEach((el) => {
  const tickerItem = new TickerItem(el);
  
  items.push(tickerItem);
});
