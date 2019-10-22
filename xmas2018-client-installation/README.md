this is meant to be run on a windows machine

```
node start.js
```

if you want to fake it because there is no Kinect available:

`start.js` comments out the following lines

```
var Kinect2 = require('kinect2');
var kinect = new Kinect2();
```

`sketch.js` swap boolean

```
const USE_MOUSE = true;
```