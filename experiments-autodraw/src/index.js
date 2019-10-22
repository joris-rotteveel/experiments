import _ from "lodash";
import DrawArea from "./DrawArea";
import AutoDrawService from "./AutoDrawService";
import CollectionService from "./CollectionService";

import "./styles/main.scss";

function start() {
  const drawArea = new DrawArea({
    canvas: document.getElementById("draw-canvas"),
    onSuggestions: suggestions => {
      console.log(suggestions);
      if (suggestions && suggestions.length > 0) {
        searchCollections(suggestions[0].toString());
      }
    }
  });

  const createThumbnail = url => {
    var div = document.createElement("DIV");
    div.className = "suggestion-image-container";

    var img = document.createElement("IMG");
    img.setAttribute("src", url);
    img.className = "suggestion-image";
    div.appendChild(img);

    return div;
  };

  const searchCollections = query => {
    // console.log("search");
    const thumbsContainer = document.getElementById("thumbs");

    const queryContainer = document.getElementById("query");
    queryContainer.innerHTML = query.toString();

    //TODO: cancel the Search request when a new one comes in.
    CollectionService.search({
      query
    }).then(response => {
      while (thumbsContainer.firstChild) {
        thumbsContainer.removeChild(thumbsContainer.firstChild);
      }
      const thumbs = response.map(im => {
        const url = im.previewUrl;
        thumbsContainer.appendChild(createThumbnail(url));
      });
    });
  };

  const clearButton = document.getElementById("button-clear-canvas");
  clearButton.onclick = () => {
    drawArea.clear();
  };

  drawArea.enable();
}
start();
