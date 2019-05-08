// import {} from 'webmapsjs/dist/reactComponents/reactAndRedux';
import React = require('react');
import ReactDom = require('react-dom');
import ReactRedux = require('react-redux');
import Redux = require('redux');
import $ = require("jquery");

const connect = ReactRedux.connect;
const Provider = ReactRedux.Provider;

import 'webmapsjs/dist/import-queryui';

import * as store from './store'
import Map from 'ol/WebGLMap.js';
import {LayerSwitcher} from './layerSwitcher';
import View from "ol/View";
import VectorLayer from 'ol/layer/Vector.js';
import EsriJSON from 'ol/format/EsriJSON';
import * as lyr from './layers';

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

        this.allPointLayer = lyr.crashVector();
        this.crashPointsK = lyr.crashVector('K', 10);
        this.crashPointsA = lyr.crashVector('A', 9);
        this.crashPointsB = lyr.crashVector('B', 8);
        this.crashPointsC = lyr.crashVector('C', 7);
        this.crashPointsP = lyr.crashVector('P', 6);
        this.crashPointsO = lyr.crashVector('O', 5);


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

        $("#accordion").accordion();

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
            <div id="accordion">
                <h3>Legend</h3>
                <div>
                    <img src="/legend.png"/>
                </div>
                <h3>Selection</h3>
                <div>
                    Selection tools here
                </div>
                <h3>Disclaimer</h3>
                <div>
                    The WISLR crash map is maintained by UW TOPS Lab on behalf of the
                    Wisconsin Department of Transportation for research and
                    planning purposes. Any other use, while not prohibited,
                    is the sole responsibility of the user.
                    <br/><br/>
                    Crashes are mapped from 2005 through the current year.
                    The WISLR crash map is updated on a monthly basis from police
                    reported crash locations on the DT4000 crash report.

                    <br/><br/>
                    See the February 2019
                    <a href="/documents/applications/crash-data/WISLR_Crash_Mapping_Update_201902.pdf" target="_blank">WISLR
                        Crash Mapping Update</a> summary document for additional information about the crash
                    mapping data source.

                </div>
                <h3>About</h3>
                <div>
                    <b>About the WisTransPortal Crash Database</b>
                    <p>
                        The WisTransPortal system contains a complete database of Wisconsin crash data from 1994 through
                        the
                        current year. This database contains information on all police reported crashes in Wisconsin,
                        including
                        the location of each crash, vehicles involved, and general crash attributes. Personal data have
                        been
                        removed. The TOPS Lab maintains this database for research purposes and as a service to the
                        Wisconsin
                        Department of Transportation (WisDOT).
                    </p>

                    <p><b>"Preliminary" and "Final" Crash Data</b></p>
                    <p>
                        Crash records for all police reported crashes from 1994 through the current year are available.
                        The
                        WisTransPortal crash database is updated on a nightly basis from extracts provided by WisDOT
                        Division of State Patrol (DSP) Bureau of Transportation Safety (BOTS). The database includes
                        both "preliminary" and "final year" crash data. Preliminary data represents the latest set of
                        available crash records for the current year and generally includes crash reports transmitted by
                        law enforcement as recently as the previous day. All preliminary data are subject to ongoing
                        review and editing and may not be suitable for analysis purposes. Final year data represents
                        the official closed WisDOT crash file for a given year.
                    </p>

                    <p><b>Wisconsin "Reportable" Crashes</b></p>
                    <p>
                        A reportable crash is defined as a crash resulting in injury or death of any person, any damage
                        to
                        government-owned non-vehicle property to an apparent extent of $200 or more, or total damage to
                        property owned by any one person to an apparent extent of $1000 or more. (This definition went
                        into
                        effect 1/1/96). It is important to note, however, that not all reportable crashes are reported.
                        In
                        order for a crash to be in the database, a crash report must have been completed by a police
                        officer.
                    </p>

                    <p><b>Differences Between WisTransPortal and WisDOT Crash Statistics</b></p>

                    This facility provides a user interface to query and retrieve crash records based on high level
                    attributes such as date range, location, and first harmful event. Often there may be more than one
                    way to formulate a query selection, especially for intersection based queries. <b>Based on the
                    particular search criteria, your results may differ from official crash counts reported by
                    WisDOT.</b>


                </div>
            </div>
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
