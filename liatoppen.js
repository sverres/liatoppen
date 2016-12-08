/*
 * http://github.com/sverres/liatoppen
 *
 * sverre.stikbakke 08.12.2016
 *
 */

/*
 * http://kartverket.no/Kart/Gratis-kartdata/WMS-tjenester/
 *
 * http://status.kartverket.no/tjenester/openwms.py?
 * http://openwms.statkart.no/skwms1/wms.topo2?request=GetCapabilities&Service=WMS
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
  html: 'Kartgrunnlag: <a href="http://kartverket.no">Kartverket</a>'
});

var extentKartverket = [-2000000, 3500000, 3545984, 9045984];

// Datum og projeksjon: EUREF89, UTM zone 32
var projection = new ol.proj.Projection({
  code: 'EPSG:25832',
  extent: extentKartverket
});

// Alle tilgjengelige WMTS zoom-nivåer
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

// ID'er for alle tilgjengelige WMTS zoom-nivåer
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

// Aktive zoom-nivåer
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
]

// Må samsvare med matrixIds
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
]

// Zoom-nivå for bytte av bakgrunnskart
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

var kml_3_3 = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'kml/3_3.kml',
    format: new ol.format.KML(),
    projection: projection
  })
});

var kml_3_0 = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'kml/3.kml',
    format: new ol.format.KML(),
    projection: projection
  })
});

var kml_2_5 = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'kml/2_5.kml',
    format: new ol.format.KML(),
    projection: projection
  })
});

var kml_2_0 = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'kml/2.kml',
    format: new ol.format.KML(),
    projection: projection
  })
});

var kml_1_5 = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'kml/1_5.kml',
    format: new ol.format.KML(),
    projection: projection
  })
});

var kml_1_0 = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'kml/1.kml',
    format: new ol.format.KML(),
    projection: projection
  })
});

var kml_standplass = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'kml/standplass.kml',
    format: new ol.format.KML(),
    projection: projection
  })
});

// setter id property for layer - må samsvare med legend id'er i html-fil
kml_3_3.id = "kml_3_3";
kml_3_0.id = "kml_3_0";
kml_2_5.id = "kml_2_5";
kml_2_0.id = "kml_2_0";
kml_1_5.id = "kml_1_5";
kml_1_0.id = "kml_1_0";
kml_standplass.id = "kml_standplass";

// henter legend-tekst fra html div-element og legger inn på layer-objektet
kml_3_3.legend = document.getElementById("kml_3_3").textContent;
kml_3_0.legend = document.getElementById("kml_3_0").textContent;
kml_2_5.legend = document.getElementById("kml_2_5").textContent;
kml_2_0.legend = document.getElementById("kml_2_0").textContent;
kml_1_5.legend = document.getElementById("kml_1_5").textContent;
kml_1_0.legend = document.getElementById("kml_1_0").textContent;
kml_standplass.legend = document.getElementById("kml_standplass").textContent;

// slår av og på lag og sletter/setter legend-tekst
var toggleLayer = function(layer) {
  if (layer.getVisible()) {
    layer.setVisible(false);
    var legend = document.getElementById(layer.id);
    legend.innerHTML="";
  } else {
    layer.setVisible(true);
    var legend = document.getElementById(layer.id);
    legend.innerHTML= layer.legend;
  }
};

var map = new ol.Map({
  layers: [
    grunnkart,
    topo2,
    kml_3_3,
    kml_3_0,
    kml_2_5,
    kml_2_0,
    kml_1_5,
    kml_1_0,
    kml_standplass
  ],
  target: 'map',
  view: new ol.View({
    projection: projection,
    center: center,
    resolutions: resolutions,
    zoom: zoom
  })
});

// venter med å vise tegnforklaring til kartet er ferdig lastet
document.getElementById("legend").style.visibility = "visible";
