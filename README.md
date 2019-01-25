Nukes
======
A simple tool to show how destructive a nuclear bomb would be. Select your nuke, launch it somewhere on the globe and count the victims.

#### Deployed version

Visit the online version of the app https://geoinf2.herokuapp.com/ 

#### Contributors
   
* [Thibaut Bongard](https://github.com/b00ntee)
* [Etienne Rallu](https://github.com/etienne1992)

#### Disclaimer

In order to start the production or development build, be sure to have webpack-command install globally on your computer.

`npm i webpack-command -g`

#### Build

* Use `npm start` for the production build

* Use `npm run dev` for the development build

Tutorial
------
The use of the app is almost self explanatory

1. Choose your nuclear bomb by clicking on the name of it under the map
2. Click somewhere on the map to drop the weapon.
3. See the results of your bombing and get an aproximation of the victim count.

You can drop multiple bombs and compare the results in a table. For the weapons that have been tested in real life, you can see the test site by clicking on the "View Test Site" button.

Structure
------

#### App structure and dependencies
The app makes use of multiple libraries and APIs.
To allow a fast development, deployment and depedency management, the app uses the Node.js [Express](https://expressjs.com/) framework as well as [Webpack](https://webpack.js.org/). The app also uses [Bootstrap](https://getbootstrap.com/) library for styling and [Jquery](https://jquery.com/) for Javascript. See [Package.json](package.json) for the full dependency list.

All custom javascript for the app can be found in the [map.js](public/map/map.js) file. [OpenLayers](https://openlayers.org/) is used to deal with every operation on the map. 

#### Data and resources

Information on the nuclear weapons comes from various sources including Wikipedia. They have been compiled in the  [nukes.json](public/json/nukes.json) and formated so they could be easilly used in the app.

Four layers are used on the map :
1. Openstreet map layer
2. Aerial layer without labels provided by Bing Map
3. Aerial layer with labels provided by Bing Map
4. WMS layer providing information on population density around the world. This layer comes from [SEDAC (Columbia university)](http://sedac.ciesin.columbia.edu/)

#### Geocoding API

To reconcile the clicks on the map with the actual location, we use the [GeoName API](https://www.geonames.org/)  

All other geographical calculations and map drawings are custom made and client side. They can be found in the [map.js](public/map/map.js).
