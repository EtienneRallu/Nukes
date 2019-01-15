import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import {Vector as VectorLayer} from 'ol/layer.js';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import BingMaps from 'ol/source/BingMaps';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import VectorSource from 'ol/source/Vector';

const nukes = require('../json/nukes').nukes;

let layers = [];
const layersName = ['osm', 'aerial', 'label', 'pop', 'vector'];
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

let vectorSource = new VectorSource({});

let vectorLayer = new VectorLayer({
    visible: true,
    source: vectorSource,
});

layers.push(mapLayer);
layers.push(aerialLayer);
layers.push(labelLayer);
layers.push(densityWMSLayer);
layers.push(vectorLayer);

layers[0].setVisible(true);

let view = new View({
    center: fromLonLat([0,0]),
    zoom: 6,
});

let map;

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
        view = new View({
            center: fromLonLat([userPosLon, userPosLat]),
            zoom: 6
        });

        /**
         * Generating the map
         * @type {ol.Map}
         */
        map = new Map({
            target: 'map-container',
            layers: layers,
            view: view,
        });

        /**
         * Get user position and add a marker
         */

        map.on('click', (event) => {
            createPin(event.coordinate);
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
    btn
        .addEventListener('click', () => {

            selectedNuke = nukes[i];

            /*
            Setting the alert
             */
            const alert = document.createElement("DIV");
            const alertTxt = document.createTextNode(`Where do you want to launch your ${nukes[i].name} with a blast yield of ${nukes[i].blastYield} megatons`);

            alert.appendChild(alertTxt);
            alert.setAttribute('class', 'alert alert-primary my-2');
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
            title.setAttribute('class', 'card-title text-primary');

            body.appendChild(title);

            const contentBody = document.createElement("P");
            const contentTxt1 = document.createTextNode(`Produced in : ${nukes[i].yearProduced}`);
            const newLine1 = document.createElement("BR");
            const contentTxt2 = document.createTextNode(`From : ${nukes[i].country}`);
            const newLine2 = document.createElement("BR");
            const contentTxt3 = document.createTextNode(`Blast yield : ${nukes[i].blastYield} megatons`);
            const newLine3 = document.createElement("BR");
            const newLine4 = document.createElement("BR");
            const contentTxt4 = document.createTextNode(`${nukes[i].description}`);
            contentBody.appendChild(contentTxt1);
            contentBody.appendChild(newLine1);
            contentBody.appendChild(contentTxt2);
            contentBody.appendChild(newLine2);
            contentBody.appendChild(contentTxt3);
            contentBody.appendChild(newLine3);
            contentBody.appendChild(newLine4);
            contentBody.appendChild(contentTxt4);
            contentBody.setAttribute('class', 'card-text');

            body.appendChild(contentBody);

            if(nukes[i].lat !== 0 && nukes[i].lon !== 0 ) {
                const testSite = document.createElement("BUTTON");
                const testSiteTxt = document.createTextNode("View Test Site");
                testSite.appendChild(testSiteTxt);
                testSite.setAttribute('class', 'btn btn-outline-primary');

                testSite.addEventListener('click', () => {
                   selectVisibleLayer('label');

                   view.setCenter(fromLonLat([nukes[i].lon, nukes[i].lat]));
                   view.setZoom(15);
                });

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
    layers[layersName.findIndex(layer => layer === 'vector')].setVisible(true);
    layersName.forEach(layer => {
        if (layer !== 'vector') {
            document.getElementById(layer).setAttribute('class', 'btn btn-secondary btn-lg');
        }
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

function createPin(coordinates) {

    if(selectedNuke) {

        const calcRadius = calculateBlastRadius(selectedNuke.blastYield);
        const conversionValue = 0.685;

        //TODO : Add geocoding
        let iconFeature = new Feature({
            geometry: new Point(coordinates),
            name: 'Foo',
        });

        iconFeature.setStyle(new Style({
            image: new Icon({
                src: 'http://www.mistercosmic.com/images/Nuke_256.png',
                scale: 0.25,
            })
        }));

        let fireball = new Feature({
            geometry: new Circle(coordinates, calcRadius.fireball/conversionValue),
            name: 'Complete Damage',
        });

        fireball.setStyle(new Style({
            stroke: new Stroke({color: [221, 18, 4]})
        }));

        let airBlast = new Feature({
            geometry: new Circle(coordinates, calcRadius.airBlast/conversionValue),
            name: 'Complete Damage',
        });

        airBlast.setStyle(new Style({
            stroke: new Stroke({color: [232, 150, 9]})
        }));

        let thermal = new Feature({
            geometry: new Circle(coordinates, calcRadius.thermal/conversionValue),
            name: 'Complete Damage',
        });

        vectorSource.addFeatures([iconFeature, fireball, airBlast, thermal]);
    } else {
        alert('Select a nuke to launch on the world');
    }
}

/**
 * Calculating the different radius of the fireball, blast, thermal damage and light damage for an explosion
 * @param blastYield
 * @returns {{fireball: number, airBlast: number, thermal: number, light: number}}
 */

function calculateBlastRadius(blastYield) {

    const yield1 = blastYield * 400;
    const yield2 = blastYield * 1000;

    const fireball = Math.round((Math.pow(yield2,0.4)*110/3.3));
    const airBlast = Math.round((Math.pow(yield1,0.33))*1000);
    const thermal = Math.round((Math.pow(yield1,0.41))*1000);

    return {
        'fireball': fireball,
        'airBlast': airBlast,
        'thermal': thermal,
    }
}