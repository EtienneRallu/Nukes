import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';

let isOSMDisplayed = true;
let isBingDisplayed = false;
let isPopDensDisplayed = false;

/**
 * Creating the OpenStreetMap layer
 * @type {ol.layer.Tile}
 */
let mapLayer = new TileLayer({
    visible: isOSMDisplayed,
    preload: Infinity,
    source: new OSM()
});

/**
 * Creating the WMS world's density source
 * @type {ol.source.ImageWMS}
 */

let densityWMSSource = new TileWMS({
    url: 'http://sedac.ciesin.columbia.edu/geoserver/wms',
    params: {
        'LAYERS': 'gpw-v3:gpw-v3-population-density_2000',
        'TILED': true,
    }
});


let densityWMSLayer = new TileLayer({
        visible: isPopDensDisplayed,
        preload: Infinity,
        source: densityWMSSource
    });

/**
 * Get user position and center the map on it
 */
getUserPosition()
    .then(res => {
        const userPosLon = res[0];
        const userPosLat = res[1];

        /**
         * Generating the view and centering the position on the user
         * @type {View}
         */
        let view = new View({
            center: fromLonLat([userPosLon, userPosLat]),
            zoom: 6
        });

        /**
         * Generating the map
         * @type {ol.Map}
         */
        new Map({
            target: 'map-container',
            layers: [
                mapLayer,
                densityWMSLayer,
            ],
            view: view,
      });
});

/**
 *
 * getPosition() allow to get the user position
 * It is exporting an array with longitude in
 * position 0 and latitude in position 1
 * @returns {Promise<Array>}
 */

function getUserPosition() {
    return new Promise ((resolve) => {
        const coordinates = [6.647959, 46.781072];

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {

                    coordinates[0] = position.coords.longitude;
                    coordinates[1] = position.coords.latitude;
                    resolve(coordinates);
                },
                () => {
                    resolve(coordinates);
                }
            );
        } else {
            resolve(coordinates);
        }

    });
}