import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import BingMaps from 'ol/source/BingMaps';

let layers = [];
const layersName = ['osm', 'aerial', 'label', 'pop'];

/**
 * Creating the OpenStreetMap layer
 * @type {ol.layer.Tile}
 */
let mapLayer = new TileLayer({
    visible: false,
    preload: Infinity,
    source: new OSM()
});

/**
 * Creating the Bing Aerial Layer
 * @type {ol.layer.Tile}
 */
let aerialLayer = new TileLayer({
    visible: false,
    preload: Infinity,
    source: new BingMaps({
        key: 'Al4Lwx9RuLedLsGGSwRbGSnvDqSQoHuMo955gLixhSrP1znUz_9K2qibzSnbSeaB',
        imagerySet: 'Aerial',
    })
});

/**
 * Creating the Bing Aerial with label layer
 * @type {layer.Tile | TileLayer}
 */
let labelLayer = new TileLayer({
    visible: false,
    preload: Infinity,
    source: new BingMaps({
        key: 'Al4Lwx9RuLedLsGGSwRbGSnvDqSQoHuMo955gLixhSrP1znUz_9K2qibzSnbSeaB',
        imagerySet: 'AerialWithLabels',
    })
});

/**
 * Creating the WMS world's density layer from a given source
 * @type {ol.source.ImageWMS}
 */

let densityWMSLayer = new TileLayer({
    visible: false,
    preload: Infinity,
    source: new TileWMS({
        url: 'http://sedac.ciesin.columbia.edu/geoserver/wms',
        params: {
            'LAYERS': 'gpw-v3:gpw-v3-population-density_2000',
            'TILED': true,
        }
    })
});

layers.push(mapLayer);
layers.push(aerialLayer);
layers.push(labelLayer);
layers.push(densityWMSLayer);

layers[0].setVisible(true);

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
            layers: layers,
            view: view,
      });
});

document
    .getElementById('osm')
    .addEventListener('click', () => {
        selectVisibleLayer('osm');
    });

document
    .getElementById('aerial')
    .addEventListener('click', () => {
        selectVisibleLayer('aerial');
    });

document
    .getElementById('label')
    .addEventListener('click', () => {
        selectVisibleLayer('label');
    });

document
    .getElementById('pop')
    .addEventListener('click', () => {
        selectVisibleLayer('pop');
    });

function selectVisibleLayer(name) {
    layers.forEach(layer => layer.setVisible(false));
    layersName.forEach(layer => {
        document.getElementById(layer).setAttribute('class', 'btn btn-secondary btn-lg');
    });
    document.getElementById(name).setAttribute('class', 'btn btn-primary btn-lg');
    layers[layersName.findIndex(layer => layer === name)].setVisible(true);
}

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