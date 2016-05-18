/* 
 * Maps for FMS using Bristol City Council's WMTS tile server
 */

// From the 'fullExtent' key from http://maps.bristol.gov.uk/arcgis/rest/services/base/2015_BCC_96dpi/MapServer?f=pjson
var layer_bounds = new OpenLayers.Bounds(
    268756.31099999975, // W
    98527.70309999958, // S
    385799.51099999994, // E
    202566.10309999995); // N

var matrix_ids = [
    {
      "identifier": "0",
      "supportedCRS": "urn:ogc:def:crs:EPSG::27700",
      "scaleDenominator": 181428.9342864172,
      "topLeftCorner": {
        "lat": 4470200.0,
        "lon": -5220400.0
      },
      "tileWidth": 256,
      "tileHeight": 256,
      "matrixWidth": 432,
      "matrixHeight": 337
    },
    {
      "identifier": "1",
      "supportedCRS": "urn:ogc:def:crs:EPSG::27700",
      "scaleDenominator": 90714.4671432086,
      "topLeftCorner": {
        "lat": 4470200.0,
        "lon": -5220400.0
      },
      "tileWidth": 256,
      "tileHeight": 256,
      "matrixWidth": 863,
      "matrixHeight": 673
    },
    {
      "identifier": "2",
      "supportedCRS": "urn:ogc:def:crs:EPSG::27700",
      "scaleDenominator": 45357.2335716043,
      "topLeftCorner": {
        "lat": 4470200.0,
        "lon": -5220400.0
      },
      "tileWidth": 256,
      "tileHeight": 256,
      "matrixWidth": 1725,
      "matrixHeight": 1345
    },
    {
      "identifier": "3",
      "supportedCRS": "urn:ogc:def:crs:EPSG::27700",
      "scaleDenominator": 22678.61678580215,
      "topLeftCorner": {
        "lat": 4470200.0,
        "lon": -5220400.0
      },
      "tileWidth": 256,
      "tileHeight": 256,
      "matrixWidth": 3449,
      "matrixHeight": 2690
    },
    {
      "identifier": "4",
      "supportedCRS": "urn:ogc:def:crs:EPSG::27700",
      "scaleDenominator": 11339.308392901075,
      "topLeftCorner": {
        "lat": 4470200.0,
        "lon": -5220400.0
      },
      "tileWidth": 256,
      "tileHeight": 256,
      "matrixWidth": 6898,
      "matrixHeight": 5379
    },
    {
      "identifier": "5",
      "supportedCRS": "urn:ogc:def:crs:EPSG::27700",
      "scaleDenominator": 5669.654196450538,
      "topLeftCorner": {
        "lat": 4470200.0,
        "lon": -5220400.0
      },
      "tileWidth": 256,
      "tileHeight": 256,
      "matrixWidth": 13795,
      "matrixHeight": 10758
    },
    {
      "identifier": "6",
      "supportedCRS": "urn:ogc:def:crs:EPSG::27700",
      "scaleDenominator": 2834.827098225269,
      "topLeftCorner": {
        "lat": 4470200.0,
        "lon": -5220400.0
      },
      "tileWidth": 256,
      "tileHeight": 256,
      "matrixWidth": 27590,
      "matrixHeight": 21515
    },
    {
      "identifier": "7",
      "supportedCRS": "urn:ogc:def:crs:EPSG::27700",
      "scaleDenominator": 1181.177957593862,
      "topLeftCorner": {
        "lat": 4470200.0,
        "lon": -5220400.0
      },
      "tileWidth": 256,
      "tileHeight": 256,
      "matrixWidth": 66215,
      "matrixHeight": 51634
    },
    {
      "identifier": "8",
      "supportedCRS": "urn:ogc:def:crs:EPSG::27700",
      "scaleDenominator": 708.7067745563172,
      "topLeftCorner": {
        "lat": 4470200.0,
        "lon": -5220400.0
      },
      "tileWidth": 256,
      "tileHeight": 256,
      "matrixWidth": 110359,
      "matrixHeight": 86057
    }
];

/* 
 * set_map_config() is called on dom ready in map-OpenLayers.js
 * to setup the way the map should operate.
 */
 function set_map_config(perm) {
    // This stuff is copied from js/map-bing-ol.js

    var nav_opts = { zoomWheelEnabled: false };
    if (fixmystreet.page == 'around' && $('html').hasClass('mobile')) {
        nav_opts = {};
    }
    fixmystreet.nav_control = new OpenLayers.Control.Navigation(nav_opts);

    fixmystreet.controls = [
        new OpenLayers.Control.ArgParser(),
        fixmystreet.nav_control
    ];
    if ( fixmystreet.page != 'report' || !$('html').hasClass('mobile') ) {
        fixmystreet.controls.push( new OpenLayers.Control.PanZoomFMS({id: 'fms_pan_zoom' }) );
    }

    /* Linking back to around from report page, keeping track of map moves */
    if ( fixmystreet.page == 'report' ) {
        fixmystreet.controls.push( new OpenLayers.Control.PermalinkFMS('key-tool-problems-nearby', '/around') );
    }

    fixmystreet.map_type = OpenLayers.Layer.WMTS;

    // Set DPI - default is 72
    OpenLayers.DOTS_PER_INCH = fixmystreet.wmts_config.tile_dpi;

    fixmystreet.map_options = {
        maxExtent: layer_bounds,
        units: 'm',
        scales: fixmystreet.wmts_config.scales
    };

    fixmystreet.layer_options = [{
        projection: new OpenLayers.Projection(fixmystreet.wmts_config.map_projection),
        name: fixmystreet.wmts_config.layer_name,
        layer: fixmystreet.wmts_config.layer_name,
        formatSuffix: fixmystreet.wmts_config.tile_suffix.replace(".", ""),
        matrixSet: fixmystreet.wmts_config.matrix_set,
        requestEncoding: "REST",
        url: fixmystreet.wmts_config.tile_url,
        style: fixmystreet.wmts_config.layer_style,
        matrixIds: matrix_ids
    }];

    // Give main code a new bbox_strategy that translates between
    // lat/lon and our WMTS layer's coordinates
    fixmystreet.bbox_strategy = new OpenLayers.Strategy.ReprojectBBOX({ratio: 1});
}

OpenLayers.Strategy.ReprojectBBOX = OpenLayers.Class(OpenLayers.Strategy.BBOX, {
    getMapBounds: function() {
        // Get the map bounds but return them in lat/lon, not
        // local coordinates
        if (this.layer.map === null) {
            return null;
        }

        var localBounds = this.layer.map.getExtent();
        // Transform bound corners into WGS84
        localBounds.transform( new OpenLayers.Projection(fixmystreet.wmts_config.map_projection), new OpenLayers.Projection("EPSG:4326") );
        return localBounds;
    },

    CLASS_NAME: "OpenLayers.Strategy.ReprojectBBOX"
});

function fms_marker_size_for_zoom(zoom) {
    console.log(zoom);
    if (zoom >= 7) {
        return 'normal';
    } else if (zoom >= 4) {
        return 'small';
    } else {
        return 'mini';
    }
}
