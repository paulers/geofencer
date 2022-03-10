const EARTH_RADIUS = 6378137;
const degreesToRadians = (angle) => {
    return angle * Math.PI / 180;
}

/**
 * This function will return a distance from one coordinate location to another
 * @param {Array<Number>} from The origin coordinate point in [lat,long] format
 * @param {Array<Number>} to The destination coordinate point in [lat,long] format
 * @returns {Number} Distance between 'from' and 'to' in meters
 */
module.exports.distanceTo = (from, to) => {
    if (from.length != 2) throw new Error('From must be an array of two numbers representing latitude and longitude.');
    if (to.length != 2) throw new Error('To must be an array of two numbers representing latitude and longitude.');

    const fromLat = from[0];
    const fromLon = from[1];
    const toLat = to[0];
    const toLon = to[1];
    // convert the latitude to radians
    const lat1 = degreesToRadians(fromLat);
    const lat2 = degreesToRadians(toLat);
    // get difference between the to and from and convert it to radians
    const dlat = degreesToRadians(toLat - fromLat);
    const dlon = degreesToRadians(toLon - fromLon);
    // do the math
    const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS * c;
    // return
    return distance;
}

/**
 * This function will return true if the point is within the circle and false if it's outside
 * @param {Array<Number>} center Center of the circle from which to draw the area
 * @param {Array<Number>} point Point which to evaluate against the circle's area
 * @param {Number} radius Number of meters to go out from the circle's center to draw the area
 * @returns {Boolean} True if the point is inside the circle's area, false otherwise
 */
module.exports.isInsideCircle = (center, point, radius) => {
    if (!center || !point || !radius) throw new Error('Center, point and radius must all be provided')
    if (!Number.isInteger(radius)) throw new Error('Radius must be a number');
    if (!Array.isArray(center)) throw new Error('Center of the circle must be a lat/long number pair in an array');
    if (!Array.isArray(point)) throw new Error('Queried point must be a lat/long number pair in an array');
    if (center.length != 2) throw new Error('Center of the circle location must contain at least two elements');
    if (point.length != 2) throw new Error('Queried point must contain 2 elements');

    return this.distanceTo(center, point) <= radius;
}

/**
 * This function will return true if the point is within the polygon and false if it's outside. Alternative implementation using a potentially faster algorithm.
 * @param {Array<Array<Number>>} edges Two dimensional array of lat/long pairs
 * @param {Array<Number>} point Point which to evaluate against the polygon's area
 * @returns {Boolean} True if the point is inside the polygon's area, false otherwise
 */
 module.exports.isInsidePolygon = (edges, point) => {
    if (!point || !edges) throw new Error('Edges and point must all be provided');
    if (!Array.isArray(point)) throw new Error('Queried point must be a lat/long number pair in an array');
    if (!Array.isArray(edges)) throw new Error('Edges must be a two dimensional array of lat/long pairs');
    if (point.length != 2) throw new Error('Queried point must contain 2 elements');
    if (edges.length < 3) throw new Error('Polygon must have at least 3 edges');

    const x = point[0];
    const y = point[1];
    const polyX = edges.map(e => e[0]);
    const polyY = edges.map(e => e[1]);

    let inside = false;

    let i, j = edges.length - 1;
    for (i = 0; i < edges.length; i++) {
        if (
            (polyY[i] < y && polyY[j] >= y || polyY[j] < y && polyY[i] >= y)
            &&
            (polyX[i] <= x || polyX[j] <=x)
        ) {
            inside ^= (polyX[i] + (y - polyY[i]) / (polyY[j] - polyY[i]) * (polyX[j] - polyX[i]) < x);
        }
        j=i;
    }

    return inside == 1;
}