# experiments-autodraw
MVP to use the Google's autodraw API and recognise drawings. These will be categorised and we'll search for images that will match these categories. This example is made to show at museums ( potential jobs)

# Quick draw API
https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8

## params
```{"input_type":0,"requests":[{"language":"autodraw","writing_guide":{"width":900,"height":900},"ink":shapes}]}```

### shapes
An Array with all the points the current shape on the canvas
```
this.currentShape=[
        [...this.currentShape[0], this.previousXAxis],
        [...this.currentShape[1], this.previousYAxis],
        [...this.currentShape[2], Date.now() - this.pressedAt]
   ];

this.shapes.push(currentShape);
```
