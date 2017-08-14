/**
 * http://github.com/sverres/liatoppen
 *
 * sverre.stikbakke 08.12.2016
 *
 */

/**
 * Referanser:
 *  
 * http://kartverket.no/data/api-og-wms/
 *
 * http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?
 * Version=1.0.0&service=wmts&request=getcapabilities
 *
 * http://wms.geonorge.no/kr/koordsys_res.txt
 *
 */

var center = [479250, 6726000];
var zoom = 9;

var attribution = new ol.Attribution({
  html: 'Kartgrunnlag: <a href="http://kartverket.no">Kartverket</a>\
         Kode: <a href="https://github.com/sverres/liatoppen">\
         github.com/sverres</a>'
});

var extentKartverket = [-2000000, 3500000, 3545984, 9045984];

// Datum og projeksjon: EUREF89, UTM zone 32
var projection = new ol.proj.Projection({
  code: 'EPSG:25832',
  extent: extentKartverket
});

// Alle tilgjengelige WMTS zoom-nivaaer
// - verdiene er meter i terrenget pr. bildepunkt/pixel
var resolutionsKartverket = [
  21664,
  10832,
  5416,
  2708,
  1354,
  677,
  338.5,
  169.25,
  84.625,
  42.3125,
  21.15625,
  10.578125,
  5.2890625,
  2.64453125,
  1.322265625,
  0.6611328125,
  0.33056640625,
  0.165283203125,
  0.0826416015625
];

// WMTS kartflis-sett
var matrixSet = 'EPSG:25832';

// ID'er for alle tilgjengelige WMTS zoom-nivaaer
var matrixIdsKartverket = [
  'EPSG:25832:0',
  'EPSG:25832:1',
  'EPSG:25832:2',
  'EPSG:25832:3',
  'EPSG:25832:4',
  'EPSG:25832:5',
  'EPSG:25832:6',
  'EPSG:25832:7',
  'EPSG:25832:8',
  'EPSG:25832:9',
  'EPSG:25832:10',
  'EPSG:25832:11',
  'EPSG:25832:12',
  'EPSG:25832:13',
  'EPSG:25832:14',
  'EPSG:25832:15',
  'EPSG:25832:16',
  'EPSG:25832:17',
  'EPSG:25832:18'
];

// Aktive zoom-nivaaer
var matrixIds = [
  matrixIdsKartverket[5],
  matrixIdsKartverket[6],
  matrixIdsKartverket[7],
  matrixIdsKartverket[8],
  matrixIdsKartverket[9],
  matrixIdsKartverket[10],
  matrixIdsKartverket[11],
  matrixIdsKartverket[12],
  matrixIdsKartverket[13],
  matrixIdsKartverket[14],
  matrixIdsKartverket[15],
  matrixIdsKartverket[16],
  matrixIdsKartverket[17],
  matrixIdsKartverket[18]
];

// Maa samsvare med matrixIds
var resolutions = [
  resolutionsKartverket[5],
  resolutionsKartverket[6],
  resolutionsKartverket[7],
  resolutionsKartverket[8],
  resolutionsKartverket[9],
  resolutionsKartverket[10],
  resolutionsKartverket[11],
  resolutionsKartverket[12],
  resolutionsKartverket[13],
  resolutionsKartverket[14],
  resolutionsKartverket[15],
  resolutionsKartverket[16],
  resolutionsKartverket[17],
  resolutionsKartverket[18]
];

// Zoom-nivaa for bytte av bakgrunnskart
var switchLayerResolution = resolutions[9];

var grunnkart = new ol.layer.Tile({
  minResolution: switchLayerResolution,
  source: new ol.source.WMTS({
    attributions: [attribution],
    url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
    layer: 'norges_grunnkart',
    matrixSet: matrixSet,
    format: 'image/png',
    tileGrid: new ol.tilegrid.WMTS({
      extent: extentKartverket,
      resolutions: resolutions,
      matrixIds: matrixIds,
    }),
    style: 'default',
  })
});

var topo2 = new ol.layer.Tile({
  maxResolution: switchLayerResolution,
  source: new ol.source.WMTS({
    attributions: [attribution],
    url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
    layer: 'topo2',
    matrixSet: matrixSet,
    format: 'image/png',
    tileGrid: new ol.tilegrid.WMTS({
      extent: extentKartverket,
      resolutions: resolutions,
      matrixIds: matrixIds
    }),
    style: 'default',
  })
});

var createKmlLayer = function (kmlFile) {return new ol.layer.Vector({
    source: new ol.source.Vector({
      url: kmlFile,
      format: new ol.format.KML(),
      projection: projection,
    }),
  });
};

var addMenu = function (layerId, menuText) {
  var layerSwitchText = document.createElement('div');
  layerSwitchText.setAttribute("class", "mdl-switch__label");
  layerSwitchText.textContent = menuText;

  var layerSwitch = document.createElement('input');
  layerSwitch.setAttribute("type", "checkbox");
  layerSwitch.setAttribute("id", "switch-" + layerId.layerId);
  layerSwitch.setAttribute("class", "mdl-switch__input");
  layerSwitch.setAttribute("onchange", "toggleLayer(" + layerId.layerId + ")");
  layerSwitch.setAttribute("checked", "");

  var menuLabel = document.createElement('label');
  menuLabel.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect");
  menuLabel.setAttribute("for", "switch-" + layerId.layerId);
  menuLabel.appendChild(layerSwitchText);
  menuLabel.appendChild(layerSwitch);

  var menuItem = document.createElement('div');
  menuItem.setAttribute("class", "mdl-navigation__link");
  menuItem.appendChild(menuLabel);
  
  document.getElementsByClassName('mdl-navigation')[0].appendChild(menuItem);
}

var addMenuForLayer = function (layerId) {
  addMenu(layerId, layerId.menuText)
};

var addLegend = function (layerId, legendText) {
  var child = document.createElement('div');
  child.setAttribute("id", layerId.layerId);
  child.textContent = legendText;
  document.getElementById('legend').appendChild(child)
}

var addLegendForLayer = function (layerId) {
  addLegend(layerId, layerId.legendText)
};

// slaar av og paa lag og sletter/setter legend-tekst
var toggleLayer = function(layer) {
  if (layer.getVisible()) {
    layer.setVisible(false);
    var legend = document.getElementById(layer.layerId);
    legend.innerHTML = '';
  } else {
    layer.setVisible(true);
    var legend = document.getElementById(layer.layerId);
    legend.innerHTML = layer.legendText;
  }
};

var kml_3_3 = createKmlLayer('kml/3_3.kml');
kml_3_3.layerId = 'kml_3_3';
kml_3_3.menuText = '3,3 km';
kml_3_3.legendText = '3,3 km - blå';
addMenuForLayer(kml_3_3);
addLegendForLayer(kml_3_3);

var kml_3_0 = createKmlLayer('kml/3.kml');
kml_3_0.layerId = 'kml_3_0';
kml_3_0.menuText = '3,0 km';
kml_3_0.legendText = '3,0 km - gul';
addMenuForLayer(kml_3_0);
addLegendForLayer(kml_3_0);

var kml_2_5 = createKmlLayer('kml/2_5.kml');
kml_2_5.layerId = 'kml_2_5';
kml_2_5.menuText = '2,5 km';
kml_2_5.legendText = '2,5 km - grønn';
addMenuForLayer(kml_2_5);
addLegendForLayer(kml_2_5);

var kml_2_0 = createKmlLayer('kml/2.kml');
kml_2_0.layerId = 'kml_2_0';
kml_2_0.menuText = '2,0 km';
kml_2_0.legendText = '2,0 km - rød';
addMenuForLayer(kml_2_0);
addLegendForLayer(kml_2_0);

var kml_1_5 = createKmlLayer('kml/1_5.kml');
kml_1_5.layerId = 'kml_1_5';
kml_1_5.menuText = '1,5 km';
kml_1_5.legendText = '1,5 km - oransje';
addMenuForLayer(kml_1_5);
addLegendForLayer(kml_1_5);

var kml_1_0 = createKmlLayer('kml/1.kml');
kml_1_0.layerId = 'kml_1_0';
kml_1_0.menuText = '1,0 km';
kml_1_0.legendText = '1,0 km - fiolett';
addMenuForLayer(kml_1_0);
addLegendForLayer(kml_1_0);

var kml_standplass = createKmlLayer('kml/standplass.kml');
kml_standplass.layerId = 'kml_standplass';
kml_standplass.menuText = 'standplass';
kml_standplass.legendText = 'Standplass og strafferunde - rosa';
addMenuForLayer(kml_standplass);
addLegendForLayer(kml_standplass);

var layers = [
  grunnkart,
  topo2,
  kml_3_3,
  kml_3_0,
  kml_2_5,
  kml_2_0,
  kml_1_5,
  kml_1_0,
  kml_standplass  
];

var map = new ol.Map({
  layers: layers,
  target: 'map',
  view: new ol.View({
    projection: projection,
    center: center,
    resolutions: resolutions,
    zoom: zoom
  })
});

// venter med aa vise tegnforklaring til kartet er ferdig lastet
document.getElementById('legend').style.visibility = 'visible';
