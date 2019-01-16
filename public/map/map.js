import {Map, View} from 'ol';
import {fromLonLat, toLonLat} from 'ol/proj';
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
import Stroke from 'ol/style/Stroke';
import VectorSource from 'ol/source/Vector';

const nukes = require('../json/nukes').nukes;

let layers = [];
const layersName = ['osm', 'aerial', 'label', 'pop', 'vector'];
let selectedNuke;
let previousNukes = [];

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
            const alertTitle = document.createElement("H4");
            const alertTitleTxt = document.createTextNode('Launch you nuke');
            const alertContent = document.createElement("P");
            const alertTxt = document.createTextNode(`Where do you want to launch your ${nukes[i].name} with a blast yield of ${nukes[i].blastYield} megatons`);

            alertTitle.appendChild(alertTitleTxt);
            alertTitle.setAttribute('class', 'alert-heading');
            alertTitle.setAttribute('id', 'alert-heading');

            alertContent.appendChild(alertTxt);
            alertContent.setAttribute('id', 'alert-content');
            alertContent.setAttribute('class', 'my-3');

            alert.appendChild(alertTitle);
            alert.appendChild(alertContent);
            alert.setAttribute('class', 'alert alert-warning my-2');
            alert.setAttribute('role', 'alert');
            alert.setAttribute('id', 'alert');

            removeAlert();

            const contentElement = document.getElementById('content');
            contentElement.insertBefore(alert, contentElement.childNodes[0]);

            /*
            Resetting the colours
             */

            unSelectNuke(i);

            /*
            Setting the card
             */

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

/**
 * Create a pin on the given coordinates and get information place
 * @param coordinates
 */

function createPin(coordinates) {

    if(selectedNuke) {

        const tempNuke = selectedNuke;
        selectedNuke = null;

        const calcRadius = calculateBlastRadius(tempNuke.blastYield);
        const conversionValue = 0.685;

        let iconFeature = new Feature({
            geometry: new Point(coordinates),
            name: tempNuke.name,
        });

        iconFeature.setStyle(new Style({
            image: new Icon({
                src: 'http://www.mistercosmic.com/images/Nuke_256.png',
                scale: 0.25,
            })
        }));

        let fireball = new Feature({
            geometry: new Circle(coordinates, calcRadius.fireball/conversionValue),
            name: 'Fireball Damage',
        });

        fireball.setStyle(new Style({
            stroke: new Stroke({color: [221, 18, 4]})
        }));

        let airBlast = new Feature({
            geometry: new Circle(coordinates, calcRadius.airBlast/conversionValue),
            name: 'Airblast Damage',
        });

        airBlast.setStyle(new Style({
            stroke: new Stroke({color: [232, 150, 9]})
        }));

        let thermal = new Feature({
            geometry: new Circle(coordinates, calcRadius.thermal/conversionValue),
            name: 'Thermal Damage',
        });

        getPopulationKilled(coordinates, calcRadius)
            .then(killed => {

                geocode(coordinates)
                    .then((geonames) => {

                        const nukeToPush = {
                            name: tempNuke.name,
                            target: geonames.adminName1,
                            country: geonames.countryName,
                            fireball: calcRadius.fireball,
                            airBlast: calcRadius.airBlast,
                            thermal: calcRadius.thermal,
                        };

                        document.getElementById('alert-heading').innerHTML = `${tempNuke.name} dropped in ${geonames.countryName}`;
                        document.getElementById('alert-content').innerHTML =
                            `Nuclear detonation successful in ${geonames.adminName1} in ${geonames.countryName} 
                where you launched a ${tempNuke.name} with a blast yield of ${tempNuke.blastYield} megatons. 
                <hr/> The fireball as a radius of ${calcRadius.fireball} meters and killing ${killed.fireball} persons.
                <hr/> The air blast has a radius of ${calcRadius.airBlast} meters and killing ${killed.airBlast} persons. 
                <hr/> The thermal radius is of ${calcRadius.thermal} meters and killing ${killed.thermal} persons`;

                        document.getElementById('alert').setAttribute('class', 'alert alert-success my-2');

                        /*
                        Resetting the colours
                         */
                        unSelectNuke();
                        listPreviousNukes(nukeToPush);

                        vectorSource.addFeatures([iconFeature, fireball, airBlast, thermal]);

                    })
                    .catch((err) => {
                        alert('Launch Cancelled! Something went wrong! Please try again');
                    });
            });

    } else {
        alert('Select a nuke to launch on the world');
    }
}

/**
 * Calculating the different radius of the fireball, blast, thermal damage and light damage for an explosion
 * @param blastYield
 * @returns {{fireball: number, airBlast: number, thermal: number}}
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

/**
 * Unselect the selected nuke
 */

function unSelectNuke(i) {

    const cardToDelete = document.getElementById('card');
    if(cardToDelete) {
        cardToDelete.parentNode.removeChild(cardToDelete);
    }

    if(i) {
        for (const j in nukes) {
            document.getElementById(nukes[j].name).setAttribute('class', 'btn btn-outline-warning mx-1 my-1');
            if (j === i) {
                document.getElementById(nukes[j].name).setAttribute('class', 'btn btn-outline-danger mx-1 my-1');
            }
        }
    } else {

        for (const j in nukes) {
            document.getElementById(nukes[j].name).setAttribute('class', 'btn btn-outline-warning mx-1 my-1');
            selectedNuke = null;
        }
    }

}

/**
 * List all previously dropped nukes and display a button to reset
 */

function listPreviousNukes(nukeToPush) {

    previousNukes.push(nukeToPush);

    if (previousNukes) {
        if (previousNukes.length > 0) {
            const resetButtonExist = document.getElementById('reset');
            const previousListExist = document.getElementById('previous-list');
            let previousList;
            if (previousListExist) {
                while (previousListExist.firstChild) {
                    previousListExist.removeChild(previousListExist.firstChild);
                    previousList = previousListExist;
                }
            } else {
                previousList = document.createElement("DIV");
                previousList.setAttribute('id', 'previous-list');
            }

            const previous = document.getElementById('previous');

            if (!resetButtonExist) {

                document.getElementById('previous-title').innerHTML = 'Previously dropped nukes';
                const resetBtn = document.createElement("BUTTON");
                const resetBtnTxt = document.createTextNode('Reset all nukes');

                resetBtn.appendChild(resetBtnTxt);
                resetBtn.setAttribute('id', 'reset');
                resetBtn.setAttribute('class', 'btn btn-danger btn-block');

                resetBtn.addEventListener('click', () => {
                    resetNukes();
                });

                previous.appendChild(resetBtn);
            }

            previousNukes.forEach(nuke => {

                const ul = document.createElement("UL");
                const ilTitle = document.createElement("IL");
                const il2 = document.createElement("IL");
                const il3 = document.createElement("IL");
                const il4 = document.createElement("IL");
                const il5 = document.createElement("IL");
                const il6 = document.createElement("IL");

                ilTitle.innerHTML = `Nuke : ${nuke.name}`;
                il2.innerHTML = `Target : ${nuke.target}`;
                il3.innerHTML = `Country : ${nuke.country}`;
                il4.innerHTML = `Fireball : ${nuke.fireball} meters`;
                il5.innerHTML = `Air Blast : ${nuke.airBlast} meters`;
                il6.innerHTML = `Thermal Damage : ${nuke.thermal} meters`;

                ul.setAttribute('class', 'list-group my-4');
                ul.setAttribute('id', nuke.name);

                ilTitle.setAttribute('class', 'list-group-item active');
                il2.setAttribute('class', 'list-group-item');
                il3.setAttribute('class', 'list-group-item');
                il4.setAttribute('class', 'list-group-item');
                il5.setAttribute('class', 'list-group-item');
                il6.setAttribute('class', 'list-group-item');

                ul
                    .appendChild(ilTitle);
                ul
                    .appendChild(il2);
                ul
                    .appendChild(il3);
                ul
                    .appendChild(il4);
                ul
                    .appendChild(il5);
                ul
                    .appendChild(il6);

                previousList.appendChild(ul);
            });

            previous.appendChild(previousList);
        } else {
            resetNukesList();

        }
    } else {
        resetNukesList();
    }

}

/**
 * Reset all nukes already in the app
 */

function resetNukes() {
    previousNukes = [];

    unSelectNuke();
    removeAlert();

    vectorSource.clear();

    resetNukesList();
}

/**
 * Reset the displayed list of nukes
 */

function resetNukesList() {

    document.getElementById('previous-title').innerHTML = 'No nukes dropped yet';
    document.getElementById('previous-list').remove();
    document.getElementById('reset').remove();

}

/**
 * Remove the alert on the screen
 */

function removeAlert() {
    const alertToDelete = document.getElementById('alert');
    if(alertToDelete) {
        alertToDelete.parentNode.removeChild(alertToDelete);
    }
}

/**
 * Return the population killed in the given radius
 * @param coordinates
 * @param calcRadius
 * @returns {Promise<JSON>}
 */

function getPopulationKilled(coordinates, calcRadius) {

    let response = {
        fireball: null,
        airBlast: null,
        thermal: null,
    };

    let fRate = 1;
    let aRate = 0.95;
    let tRate = 0.35;

    const fRadius = calcRadius.fireball / 1000;
    const aRadius = calcRadius.airBlast / 1000;
    const tRadius = calcRadius.thermal / 1000;

    return new Promise ((resolve) => {
        getPopulationInRadius(coordinates, fRadius)
            .then(fPop => {
                response.fireball = Math.floor(fPop * fRate);

                if(response.fireball > 0) {
                    getPopulationInRadius(coordinates, aRadius)
                        .then(aPop => {
                            response.airBlast = Math.floor(aPop * aRate);

                            getPopulationInRadius(coordinates, tRadius)
                                .then(tPop => {
                                    response.thermal = Math.floor(tPop * tRate);
                                    resolve(response);
                                })
                                .catch(() => {
                                    resolve(response);
                                });
                        })
                        .catch(() => {
                            resolve(response);
                        });
                } else {
                    getPopulationClosest(coordinates)
                        .then(cPop => {
                            console.log('Called closest one', cPop)
                            const coordinationValue = 0.05 / Math.pow(cPop.distance, 2);
                            response.fireball = Math.floor(cPop.population * fRate * coordinationValue);
                            response.airBlast = Math.floor(cPop.population * aRate * coordinationValue);
                            response.thermal = Math.floor(cPop.population * tRate * coordinationValue);
                            resolve(response);
                        })
                        .catch(() => {
                            resolve(response);
                        });
                }
            })
            .catch(() => {
                resolve(response);
            });

    });
}

/**
 * Call the geonames API to get all the populated places in the given radius and return the total sum
 * @param coordinates
 * @param radius
 * @returns {Promise<Number>}
 */

function getPopulationInRadius(coordinates, radius) {

    const coord = toLonLat(coordinates);

    return new Promise ((resolve, reject) => {
        fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${coord[1]}&lng=${coord[0]}&radius=${radius}&maxRows=50&username=Boontee`)
            .then(res => {
                if (!res) {
                    reject(null);
                }

                return res.json();
            })
            .then(data => {

                let pop = 0;

                data
                    .geonames
                    .forEach(geoname => {
                       if (geoname) {
                           if (geoname.population) {
                               pop+=geoname.population;
                           }
                       }
                    });

                resolve(pop);
            })
            .catch(() =>
                reject(null)
            )
    });

}

/**
 * Call the geonames API to get the closest most populated place
 * @param coordinates
 * @returns {Promise<Number>}
 */

function getPopulationClosest(coordinates) {

    const coord = toLonLat(coordinates);

    return new Promise ((resolve, reject) => {
        fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${coord[1]}&lng=${coord[0]}&maxRows=1&fcode=PPLA&fcode=PPLA2&fcode=PPLA3&fcode=PPLA4&username=voyage`)
            .then(res => {
                if (!res) {
                    reject(null);
                }

                return res.json();
            })
            .then(data => {

                console.log(data)

                resolve({
                        population: data.geonames[0].population,
                        distance: data.geonames[0].distance
                });
            })
            .catch(() =>
                reject(null)
            )
    });

}

/**
 * Geocode for given coordinates
 * @param coordinates
 * @returns {Promise<json>}
 */

function geocode(coordinates) {
    const coord = toLonLat(coordinates);

    return new Promise ((resolve, reject) => {
        fetch(`http://api.geonames.org/findNearbyJSON?lat=${coord[1]}&lng=${coord[0]}&username=voyage`)
            .then(res => {
                if (!res) {
                    reject();
                }
                return res.json();
            })
            .then(data => {
                resolve(data.geonames[0]);
            })
            .catch((err) => {
                reject()
            })

    });
}