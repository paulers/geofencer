const { degreesToRadians, radiansToDegrees } = require('./helpers');
const EARTH_RADIUS = 6378137;

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