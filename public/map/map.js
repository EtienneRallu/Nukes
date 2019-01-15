import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import BingMaps from 'ol/source/BingMaps';

const nukes = require('../json/nukes').nukes;

let layers = [];
const layersName = ['osm', 'aerial', 'label', 'pop'];
let selectedNuke;

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

/**
 * Add buttons for every nukes in the JSON and listen on click on this button
 */

for (const i in nukes) {
    const btn = document.createElement("BUTTON");
    const name = document.createTextNode(nukes[i].name);

    btn.appendChild(name);
    btn.setAttribute('class', 'btn btn-outline-warning mx-1 my-1');
    btn.setAttribute('id', nukes[i].name);

    document
        .getElementById('devicesBtn')
        .appendChild(btn);

    /*
    Listen on clicks made on the created button and update the alert with the correct information and set buttons in the correct color
     */
    document
        .getElementById(nukes[i].name)
        .addEventListener('click', () => {

            selectedNuke = nukes[i];

            /*
            Setting the alert
             */
            const alert = document.createElement("DIV");
            const alertTxt = document.createTextNode(`Where do you want to launch your ${nukes[i].name} with a blast yield of ${nukes[i].blastYield} megatons`);

            alert.appendChild(alertTxt);
            alert.setAttribute('class', 'alert alert-danger my-2');
            alert.setAttribute('role', 'alert');
            alert.setAttribute('id', 'alert');

            const alertToDelete = document.getElementById('alert');
            if(alertToDelete) {
                alertToDelete.parentNode.removeChild(alertToDelete);
            }

            const contentElement = document.getElementById('content');
            contentElement.insertBefore(alert, contentElement.childNodes[0]);

            /*
            Resetting the colours
             */

            for (const j in nukes) {
                document.getElementById(nukes[j].name).setAttribute('class', 'btn btn-outline-warning mx-1 my-1');
                if (j === i) {
                    document.getElementById(nukes[j].name).setAttribute('class', 'btn btn-outline-danger mx-1 my-1');
                }
            }

            /*
            Setting the card
             */

            const cardToDelete = document.getElementById('card');
            if(cardToDelete) {
                cardToDelete.parentNode.removeChild(cardToDelete);
            }

            const card = document.createElement("DIV");
            card.setAttribute('class', 'card my-3');
            card.setAttribute('id', 'card');
            card.setAttribute('style', 'width: 50%; margin: 0 auto');

            const img = document.createElement("IMG");
            img.setAttribute('class', 'card-img-top');
            img.setAttribute('alt', nukes[i].name);
            img.setAttribute('src', nukes[i].img);

            const body = document.createElement("DIV");
            body.setAttribute('class', 'card-body');

            const title = document.createElement("H5");
            const titleTxt = document.createTextNode(nukes[i].name);
            title.appendChild(titleTxt);
            title.setAttribute('class', 'card-title');

            body.appendChild(title);

            const contentBody = document.createElement("P");
            const contentTxt1 = document.createTextNode(`Produced in : ${nukes[i].yearProduced}`);
            const contentTxt2 = document.createTextNode(`From : ${nukes[i].country}`);
            const contentTxt3 = document.createTextNode(`Blast yield : ${nukes[i].blastYield} megatons`);
            const contentTxt4 = document.createTextNode(`${nukes[i].description}`);
            contentBody.appendChild(contentTxt1);
            contentBody.appendChild(contentTxt2);
            contentBody.appendChild(contentTxt3);
            contentBody.appendChild(contentTxt4);
            contentBody.setAttribute('class', 'card-text');

            body.appendChild(contentBody);

            if(nukes[i].lat !== 0 && nukes[i].lon !== 0 ) {
                const testSite = document.createElement("BUTTON");
                const testSiteTxt = document.createTextNode("View Test Site");
                testSite.appendChild(testSiteTxt);
                testSite.setAttribute('class', 'btn btn-outline-primary');

                body.appendChild(testSite);
            }

            card.appendChild(img);
            card.appendChild(body);

            document
                .getElementById('devices')
                .appendChild(card);
        });
}

/**
 * Event listener for clicks on layers' selector buttons
 */
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

/**
 * Set the correct layer to be visible and set the correct button to be toggled
 * @param name
 */

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