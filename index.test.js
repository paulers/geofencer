const { test, expect } = require('@jest/globals');
const { distanceTo, isInsidePolygon, isInsidePolygonV2, isInsideCircle } = require('./index');

describe('distance to', () => {
    test('from acropolis to temple of hephaestus', () => {
        expect(distanceTo([37.97574097089989, 23.734724888101972], [37.97622797881252, 23.72252442008438])).toBe(1071.9588774755532);
    });
    test('from tower of london to buckingham palace', () => {
        expect(distanceTo([51.50926624807988, -0.07020881841771057], [51.50294271525039, -0.13084189488481243])).toBe(4259.7544113594195);
    });
    test('tests distance with invalid from', () => {
        expect(() => distanceTo([51], [51.00089831528412, 0])).toThrowError(new Error('From must be an array of two numbers representing latitude and longitude.'));
    });
    test('tests distance with invalid to', () => {
        expect(() => distanceTo([51, 0], [51.00089831528412])).toThrowError(new Error('To must be an array of two numbers representing latitude and longitude.'));
    });
});

describe('polygon negative tests', () => {
    const testData = [
        [null, [1, 0], 'Edges and point must all be provided'],
        [[1, 0], null, 'Edges and point must all be provided'],
        [[0, 1], 1, 'Queried point must be a lat/long number pair in an array'],
        [1, [0, 1], 'Edges must be a two dimensional array of lat/long pairs'],
        [[1], [1, 0, 1], 'Queried point must contain 2 elements'],
        [[1, 2], [1, 0], 'Polygon must have at least 3 edges']
    ];

    test.each(testData)('negative tests', (edges, point, expected) => {
        expect(() => isInsidePolygon(edges, point)).toThrowError(new Error(expected));
    });
});

describe('polygon 1 tokyo tower', () => {
    const polygon = [
        [35.65933958796864, 139.74498385638253],
        [35.65866836447199, 139.74635982954518],
        [35.65794047287525, 139.7456758662772],
        [35.65874899876166, 139.74472636432873],
        [35.65933958796864, 139.74498385638253]
    ];

    const testData = [
        [35.658685798919905, 139.7451286956628, true],
        [35.658814377855656, 139.7458958074065, true],
        [35.65813443266171, 139.74573487487288, true],
        [35.65941150444318, 139.7479691549074, false],
        [35.65932869155412, 139.74431598634644, false],
        [35.6576799508927, 139.74528297564174, false]
    ];
    test.each(testData)('valid input inside v1', (lat, long, expected) => {
        expect(isInsidePolygon(polygon, [lat, long])).toBe(expected);
    });
});

describe('polygon 2 eiffel tower', () => {
    const polygon = [
        [48.853838192789496, 2.294081402957018],
        [48.8575178502786, 2.291086234210338],
        [48.86018119929609, 2.2949003944111883],
        [48.85764101405187, 2.3000015411828767],
        [48.854282503077165, 2.3053971434383165],
        [48.85614642162162, 2.2979360822744277],
        [48.8516170977103, 2.3014545996310383],
        [48.85412816277743, 2.2975571648206863],
        [48.853838192789496, 2.294081402957018]
    ];
    const testData = [
        [48.85843170477575, 2.2949678969250766, true],
        [48.85617016539086, 2.2982338027791607, true],
        [48.857102098196556, 2.2951844210700987, true],
        [48.85485237090885, 2.300498284485685, false],
        [48.853421752957296, 2.3028800500809288, false],
        [48.858247698816, 2.3020771063764713, false]
    ]
    test.each(testData)('valid input inside v1', (lat, long, expected) => {
        expect(isInsidePolygon(polygon, [lat, long])).toBe(expected);
    });
});

describe('polygon 3 empire state building', () => {
    const polygon = [
        [40.74978688915218, -73.98781578481889],
        [40.747109448232266, -73.981449139825],
        [40.74023653420966, -73.98641231598256],
        [40.74290458517267, -73.99275344336125],
        [40.746026842236525, -73.99049513441553],
        [40.74470492063843, -73.98731167901914],
        [40.745319942239426, -73.98689223321655],
        [40.74665126514798, -73.98997758911393],
        [40.74978688915218, -73.98781578481889]
    ];
    const testData = [
        [40.74223246368325, -73.98803837007635, true],
        [40.745325753389, -73.98956942698872, true],
        [40.74862188189329, -73.9851931559809, true],
        [40.745673739478015, -73.98426176302588, true],
        [40.74527742184372, -73.98752801777223, false],
        [40.74488758454883, -73.98727807351949, false],
        [40.74615145033222, -73.98901008174444, false]
    ];
    test.each(testData)('valid input inside v1', (lat, long, expected) => {
        expect(isInsidePolygon(polygon, [lat, long])).toBe(expected);
    });
});

describe('circle red pyramid egypt', () => {
    const circle = {
        center: [29.812344634414643, 31.213763328787017],
        radius: 5000 // 5km
    };
    const testData = [
        [29.814333605245828, 31.206551638751463, true], // general vicinity
        [29.801264510910883, 31.24086052454261, true], // general vicinity
        [29.79258832807695, 31.2280058610801, true], // general vicinity
        [30.032315426035968, 31.275357935351554, false], // cairo
        [31.216552730740375, 29.895073578154857, false], // alexandria
        [31.779216947627045, 35.22792555221807, false] // israel
    ];
    test.each(testData)('valid input', (lat, long, expected) => {
        expect(isInsideCircle(circle.center, [lat, long], circle.radius)).toBe(expected);
    });

    const negativeTestData = [
        [null, [1, 0], 100, 'Center, point and radius must all be provided'],
        [[1, 0], null, 100, 'Center, point and radius must all be provided'],
        [[1, 0], [0, 1], null, 'Center, point and radius must all be provided'],
        [[1, 0], [0, 1], 'abc', 'Radius must be a number'],
        [1, [0, 1], 100, 'Center of the circle must be a lat/long number pair in an array'],
        [[1, 0], 1, 100, 'Queried point must be a lat/long number pair in an array'],
        [[1, 0, 3], [1, 0], 100, 'Center of the circle location must contain at least two elements'],
        [[1, 0], [1, 0, 1], 100, 'Queried point must contain 2 elements']
    ];
    test.each(negativeTestData)('circle - negative tests', (center, point, radius, expected) => {
        expect(() => isInsideCircle(center, point, radius)).toThrowError(new Error(expected));
    });
});