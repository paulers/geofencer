# Geofencer

This small library has everything you need for figuring out whether a point is within a circle or a polygon. The library uses a ray casting algorithm to determine whether a point is inside a polygon area. Determining whether a point is in a circle will also take Earth's dimensions into account.

## Installation

```
$ npm i --save geofencer
```

## Usage

Import whatever you need:

```JS
const { distanceTo, isInsidePolygon, isInsideCircle } = require('geofencer');
```

Are geo coordinates inside a polygon area?

```JS
const polygon = [
    [35.65933958796864, 139.74498385638253],
    [35.65866836447199, 139.74635982954518],
    [35.65794047287525, 139.7456758662772],
    [35.65874899876166, 139.74472636432873],
    [35.65933958796864, 139.74498385638253]
];
const point = [35.658685798919905, 139.7451286956628]; // Tokyo tower
const inside = isInsidePolygon(polygon, point);
// inside => true
```

Are geo coordinates inside a circle area?

```JS
const circle = {
    center: [29.812344634414643, 31.213763328787017], // red pyramid in Giza, Egypt
    radius: 5000 // 5km
}
const point = [31.216552730740375, 29.895073578154857] // Alexandria... >5km away from Giza
const inside = isInsideCircle(circle.center, point, circle.radius);
// inside => false
```

Internally, finding if a point is inside a circle uses the `distanceTo` function which is exported in case it's useful. Keep in mind the distance is calculated as a straight shot from one coordinate to the other, but it does take Earth's curvature into account.
```JS
const distance = distanceTo([51.50926624807988, -0.07020881841771057], [51.50294271525039, -0.13084189488481243]); // tower of london to buckingham palace
// distance => 4259.7544113594195 (~4259 meters, 4.3km)
```

## License

MIT