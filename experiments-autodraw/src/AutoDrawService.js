const API = 'https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8';

// check https://www.autodraw.com/ 
// all categories that are recognised https://github.com/googlecreativelab/quickdraw-dataset/blob/master/categories.txt
// check https://cloud.google.com/blog/big-data/2017/12/drawings-in-the-cloud-introducing-the-quick-draw-dataset "The data"-section

export default class AutoDrawService {


  static getSuggestions(ink, width, height) {

    // the "ink" param is an array [] in the form of arrays of x,y and time coordinates.
    // each index is a stroke, each stroke is an array []
    // within each stroke there are 3 arrays xpos,ypos,time 
    // const ink = [
    //   /*stroke*/
    //   [
    //     [xpos, xpos, xpos, xpos],
    //     [ypos, ypos, ypos, ypos],
    //     [timeFromFirstMouseDownTillMove, timeFromFirstMouseDownTillMove, timeFromFirstMouseDownTillMove, timeFromFirstMouseDownTillMove]
    //   ],
    //   /*another stroke*/
    // ]

    const request = {
      "language": "autodraw",
      "writing_guide": {
        "width": width,
        "height": height
      },
      "ink": ink
    }

    return fetch(API, {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input_type: 0,
          requests: [request]

        })
      })
      .then(response => response.json())
      .then(data => {
        const suggestions = data[1][0][1];
        return suggestions;

      });

  }

}