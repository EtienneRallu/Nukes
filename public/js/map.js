let mapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

let view = new ol.View({
    center: ol.proj.fromLonLat([8.19, 46.80]),
    zoom: 7
});

let map = new ol.Map({
    target: 'map-container',
    layers: [
        mapLayer,
    ],
    view: view,
});