// import {} from 'webmapsjs/dist/reactComponents/reactAndRedux';
import React = require('react');
import ReactDom = require('react-dom');
export import ReactRedux = require('react-redux');
export import Redux = require('redux');
import $ = require("jquery");

const connect = ReactRedux.connect;
const Provider = ReactRedux.Provider;

import * as store from './store'
import Map from 'ol/WebGLMap.js';
import * as layerStyles from './layerStyles'
import {LayerSwitcher, ESRI_STREETS} from './layerSwitcher';
import View from "ol/View";
import TileLayer from "ol/layer/tile";
import XYZ from "ol/source/xyz";
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Cluster from 'ol/source/Cluster';
// import {arcgisToGeoJSON} from '@esri/arcgis-to-geojson-utils';
import GeoJSON from 'ol/format/GeoJSON.js';
import Feature from 'ol/Feature';
// import TileLayer from 'ol/layer/Tile.js';
// import XYZ from 'ol/source/XYZ.js';
import OSM from 'ol/source/OSM.js';
import EsriJSON from 'ol/format/EsriJSON';
import Projection from 'ol/proj/Projection';

import {Style, Stroke, Fill, Circle} from 'ol/style';

const esriJson = new EsriJSON();

declare let glob: Object;

class _CrashMap extends React.Component<{}, null> {

    private map: Map;
    readonly allPointLayer: VectorLayer;
    // readonly clusterLayer: VectorLayer;

    readonly crashPointsK: VectorLayer;
    readonly crashPointsA: VectorLayer;
    readonly crashPointsB: VectorLayer;
    readonly crashPointsC: VectorLayer;
    readonly crashPointsP: VectorLayer;
    readonly crashPointsO: VectorLayer;


    constructor(props, context) {
        super(props, context);
        this.map = null;

        this.allPointLayer = new VectorLayer({
            source: new VectorSource(),
            style: undefined
        });

        this.crashPointsK = new VectorLayer({
            source: new VectorSource(),
            style: layerStyles.crashBySevStyle('K'),
            zIndex: 10
        });

        this.crashPointsA = new VectorLayer({
            source: new VectorSource(),
            style: layerStyles.crashBySevStyle('A'),
            zIndex: 9
        });

        this.crashPointsB = new VectorLayer({
            source: new VectorSource(),
            style: layerStyles.crashBySevStyle('B'),
            zIndex: 8
        });

        this.crashPointsC = new VectorLayer({
            source: new VectorSource(),
            style: layerStyles.crashBySevStyle('C'),
            zIndex: 7
        });

        this.crashPointsP = new VectorLayer({
            source: new VectorSource(),
            style: layerStyles.crashBySevStyle('P'),
            zIndex: 6
        });

        this.crashPointsO = new VectorLayer({
            source: new VectorSource(),
            style: layerStyles.crashBySevStyle('O'),
            zIndex: 5
        });


        // let clusterSource = new Cluster({
        //     distance: 20,
        //     source: this.pointLayer.getSource()
        // });
        //
        // this.clusterLayer = new VectorLayer({
        //     minResolution: 150,
        //     source: clusterSource,
        //     style: layerStyles.clusterSyle
        // });
    }

    getCrashesByQueryId(queryId: number) {

        $.post('https://transportal.cee.wisc.edu/applications/arcgis2/rest/services/crash/getCrashByQueryId/GPServer/GetCrashByQueryId/execute',
            {queryId: queryId, f: 'json', 'env:outSR': 3857},
            (d) => {
                let resultObj = {};

                for (let r of d.results) {
                    resultObj[r['paramName']] = r['value']
                }

                if (resultObj['error']) {
                    alert(resultObj['error']);
                    return;
                } else if (!resultObj['success']) {
                    alert('Unknown request error');
                    return;
                }

                let features = esriJson.readFeatures(resultObj['out_features']);

                for (let f of features) {
                    switch (f.getProperties()['injSvr']) {
                        case 'K':
                            this.crashPointsK.getSource().addFeature(f);
                            break;
                        case 'A':
                            this.crashPointsA.getSource().addFeature(f);
                            break;
                        case 'B':
                            this.crashPointsB.getSource().addFeature(f);
                            break;
                        case 'C':
                            this.crashPointsC.getSource().addFeature(f);
                            break;
                        case 'P':
                            this.crashPointsP.getSource().addFeature(f);
                            break;
                        default:
                            this.crashPointsO.getSource().addFeature(f);
                            break;
                    }
                }

                let featureCount = this.crashPointsO.getSource().getFeatures().length;

                if (featureCount > 0) {
                    this.map.getView().fit(this.crashPointsO.getSource().getExtent());
                }
            },
            'json');
    }

    componentDidMount() {
        this.map = new Map({
            target: document.getElementById('map'),
            view: new View({
                center: [-9840124.542661136, 5379280.493658545],
                zoom: 7
            })
        });

        this.map.addLayer(this.allPointLayer);
        this.map.addLayer(this.crashPointsK);
        this.map.addLayer(this.crashPointsA);
        this.map.addLayer(this.crashPointsB);
        this.map.addLayer(this.crashPointsC);
        this.map.addLayer(this.crashPointsP);
        this.map.addLayer(this.crashPointsO);
        // this.map.addLayer(this.clusterLayer);

        glob['map'] = this.map;

        let queryId;
        let totalRecords;
        let crashReports;

        let queryIdInput = window.parent.document.getElementById('queryId');
        let totalRecordsInput = window.parent.document.getElementById('totalRecords');
        let crashReportsInput = window.parent.document.getElementById('crashReports');

        if (queryIdInput) {
            queryId = parseInt((queryIdInput as HTMLInputElement).value);
            totalRecords = parseInt((totalRecordsInput as HTMLInputElement).value);
            crashReports = (crashReportsInput as HTMLInputElement).value.trim().toLowerCase() === 'true';
        } else {
            queryIdInput = document.getElementById('queryId');
            totalRecordsInput = document.getElementById('totalRecords');
            crashReportsInput = document.getElementById('crashReports');

            if (queryIdInput) {
                queryId = parseInt((queryIdInput as HTMLInputElement).value);
                totalRecords = parseInt((totalRecordsInput as HTMLInputElement).value);
                crashReports = (crashReportsInput as HTMLInputElement).value.trim().toLowerCase() === 'true';
            } else {
                //small query
                queryId = 1023;
                totalRecords = 393;
                // //big query
                // queryId = 1057;
                // totalRecords = 45519;
                // //full state
                // queryId = 1058;
                // totalRecords = 122645;
                // crashReports = true;
            }
        }

        this.getCrashesByQueryId(queryId);

        // this.map.on('pointermove', function (evt) {
        //     if (evt.dragging) {
        //         return;
        //     }
        //
        //     let  pixel = map.getEventPixel(evt.originalEvent);
        //     displayFeatureInfo(pixel);
        // });

        this.map.on('click', (evt) => {

            let feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });

            if (feature) {
                let crashNumber = parseInt(feature.getProperties()['id']);

                $.get('https://transportal.cee.wisc.edu/applications/arcgis2/rest/services/crash/GetCrashProps/GPServer/GetCrashProps/execute',
                    {crashNumber: crashNumber, f: 'json'},
                    (d) => {
                        let resultObj = {};

                        for (let r of d.results) {
                            resultObj[r['paramName']] = r['value']
                        }

                        if (resultObj['error']) {
                            alert(resultObj['error']);
                            return;
                        } else if (!resultObj['success']) {
                            alert('Unknown request error');
                            return;
                        }

                        let propOrder = ["DOCTNMBR", "CRSHDATE", "CNTYNAME", "MUNINAME", "MUNITYPE",
                            "ONHWY", "ONSTR", "ATHWY", "ATSTR", "INTDIR", "INTDIS", "INJSVR", "TOTVEH", "TOTINJ",
                            "TOTFATL", "CMAALAT", "CMAALONG"];

                        let crashProps = resultObj['props'];
                        let outHtml = '<table style="border-collapse: collapse">';

                        for (let p of propOrder) {
                            outHtml += `<tr><td style="border: solid black 1px">${p}</td><td style="border: solid black 1px">${crashProps[p] || ''}</td></tr>`;
                        }
                        outHtml += '</table>';

                        (document.getElementById('crash-info') as HTMLDivElement).innerHTML = outHtml;
                    },
                    'json');
            } else {
                (document.getElementById('crash-info') as HTMLDivElement).innerHTML = '';
            }
        });
    }

    render() {
        return <div id="app-container">
            <div id="map" style={{position: 'relative'}}>
                <div id='crash-info' style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    zIndex: 5,
                    height: '200px',
                    width: '300px',
                    backgroundColor: 'white',
                    overflow: 'auto'
                }}/>
                <LayerSwitcher mapFunc={() => {
                    return this.map
                }}/>
            </div>
        </div>
    }
}

let CrashMap = connect(
    (s: store.iState) => {
        return {};
    },
    (dispatch) => {
        return {}
    }
)(_CrashMap);

ReactDom.render(<Provider store={store.store}><CrashMap/></Provider>, document.getElementById('root'));
