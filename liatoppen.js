/*
 * http://github.com/sverres
 *
 * sverre.stikbakke 27.03.2016
 *
 */

/*
http://kartverket.no/Kart/Gratis-kartdata/WMS-tjenester/

http://status.kartverket.no/tjenester/openwms.py?
http://openwms.statkart.no/skwms1/wms.topo2?request=GetCapabilities&Service=WMS

http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?
Version=1.0.0&service=wmts&request=getcapabilities

http://wms.geonorge.no/kr/koordsys_res.txt
*/

var attribution = new ol.Attribution({
  html: 'Kartgrunnlag: <a href="http://kartverket.no">Kartverket</a>'
});

var extent1200m = [596417, 6731415, 597617, 6732615];
var extent150km = [522017, 6657015, 672017, 6807015];
var extentKartverket = [-2000000, 3500000, 3545984, 9045984];

var projection = new ol.proj.Projection({
  code: 'EPSG:25832',
  extent: extentKartverket
});

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

var matrixSet = 'EPSG:25832'; // EUREF89, UTM zone 32

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
  matrixIdsKartverket[16]
]

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
  resolutionsKartverket[16]
]

var switchLayerResolution = resolutions[9];

var grunnkart = new ol.layer.Tile({
  minResolution: switchLayerResolution,
  source: new ol.source.WMTS({
    attributions: [attribution],
    url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
    //layer: 'norges_grunnkart',
    layer: 'norges_grunnkart_graatone',
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
    //layer: 'topo2',
    layer: 'topo2graatone',
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

var veger = new ol.layer.Tile({
  maxResolution: resolutions[0],
  minResolution: resolutions[12],
  extent: extentKartverket,
  source: new ol.source.TileWMS({
    attributions: [attribution],
    url: 'http://openwms.statkart.no/skwms1/wms.topo2?',
    params: {
      'LAYERS': 'N500Bilveg',
      'STYLES': 'default'
    },
  })
});

var map = new ol.Map({
  layers: [grunnkart, topo2, veger],
  target: 'map',
  view: new ol.View({
    projection: projection,
    center: [479175, 6726100],
    resolutions: resolutions,
    zoom: 3
  })
});
