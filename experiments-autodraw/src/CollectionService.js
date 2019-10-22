const key = "605QHkdz9W3YbaPsyQRhtjVO1SEJkqJ47lS641ed";
export default class CollectionService {
  static search({ query, amountOfResults = 50 }) {
    const url =
      "https://data.tepapa.govt.nz/collection/media/?size=" +
      amountOfResults +
      "&q=" +
      query;

    return fetch(url, {
      method: "GET",
      headers: new Headers({
        "x-api-key": key,
        Accept: "application/json"
      })
    })
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => {
        return _.filter(response.results, function(suggestion) {
          return suggestion.previewUrl;
        });
      });
  }
}
