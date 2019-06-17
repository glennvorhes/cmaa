import React = require('react');
import ReactDom = require('react-dom');
import $ = require("jquery");
import {connect, Provider} from "react-redux";
import {SelectionInfo} from "./SelectionInfo";
import * as ajx from './ajax';

import 'webmapsjs/dist/import-queryui';

import * as store from './store'
import Map from 'ol/WebGLMap.js';
import Feature from 'ol/Feature';
import {LayerSwitcher} from './layerSwitcher';
import View from "ol/View";
import VectorLayer from 'ol/layer/Vector.js';
import EsriJSON from 'ol/format/EsriJSON';
import * as lyr from './layers';
import {accordionSetup} from './accordionSetup';
import * as act from './actions';

import * as cnst from './constants';
import * as cnstEl from './constantEls';

import * as cond from 'ol/events/condition';
import {DragBox, Select} from 'ol/interaction.js';

import * as intf from './interfaces';
import {Legend} from './Legend';
import {Popup} from "./popup";
import {Selection_operation} from "./selection_operation";
import {Box, Line, Poly} from './selection';
import * as sel from './selection';
import {Loading} from "./loading";

import ScaleLine from 'ol/control/ScaleLine';

import Draw from 'ol/interaction/Draw';
import * as geomType from 'ol/geom/GeometryType';
import VectorSource from "ol/source/Vector";

import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import {selectionLayer} from "./constants";


const esriJson = new EsriJSON();

declare let glob: Object;

store.store.subscribe(() => {
    let s = store.getState();
    console.log(s)
});

class _CrashMap extends React.Component<{
    setQueryResults: (r: { [s: string]: { queried: number, mapped: number } }) => any,
    lyrChecked: { [s: string]: boolean },
    setSelectedCrashes: (features: Feature[]) => any,
    loading: boolean,
    setLoading: (b: boolean) => any,
    setMap: (m: Map) => any
}, null> {
    private map: Map;
    private selectionTimeout: number = null;
    // readonly allPointLayer: VectorLayer;
    // // readonly clusterLayer: VectorLayer;
    //
    // readonly crashPointsK: VectorLayer;
    // readonly crashPointsA: VectorLayer;
    // readonly crashPointsB: VectorLayer;
    // readonly crashPointsC: VectorLayer;
    // // readonly crashPointsP: VectorLayer;
    // readonly crashPointsO: VectorLayer;
    //
    // readonly selectionLayer: VectorLayer;


    constructor(props, context) {
        super(props, context);
        this.map = null;

        // this.allPointLayer = lyr.crashVector();
        // this.crashPointsK = lyr.crashVector('K', 10);
        // this.crashPointsA = lyr.crashVector('A', 9);
        // this.crashPointsB = lyr.crashVector('B', 8);
        // this.crashPointsC = lyr.crashVector('C', 7);
        // // this.crashPointsP = lyr.crashVector('P', 6);
        // this.crashPointsO = lyr.crashVector('O', 5);
        //
        // this.selectionLayer = new VectorLayer({
        //     source: new VectorSource()
        // });


        //


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

        this.props.setLoading(true);

        $.post(cnst.GP_BY_QUERY_ID,
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

                let res: { [s: string]: intf.iResultInner } = {};
                let mappedFeatures = [];

                for (let f of resultObj['out_features']['features']) {
                    let sev = f['attributes']['injSvr'] || 'O';
                    res[sev] = res[sev] || {queried: 0, mapped: 0};
                    res[sev].queried++;

                    if (!isNaN(f['geometry']['x']) && !isNaN(f['geometry']['y'])) {
                        res[sev].mapped++;
                        mappedFeatures.push(f);
                    } else {

                    }
                }

                resultObj['out_features']['features'] = mappedFeatures;

                this.props.setQueryResults(res);

                let features = esriJson.readFeatures(resultObj['out_features']);

                for (let f of features) {
                    switch (f.getProperties()['injSvr']) {
                        case 'K':
                            cnst.crashPointsK.getSource().addFeature(f);
                            break;
                        case 'A':
                            cnst.crashPointsA.getSource().addFeature(f);
                            break;
                        case 'B':
                            cnst.crashPointsB.getSource().addFeature(f);
                            break;
                        case 'C':
                            cnst.crashPointsC.getSource().addFeature(f);
                            break;
                        case 'P':
                            // this.crashPointsP.getSource().addFeature(f);
                            break;
                        default:
                            cnst.crashPointsO.getSource().addFeature(f);
                            break;
                    }
                }

                let featureCount = cnst.crashPointsO.getSource().getFeatures().length;

                if (featureCount > 0) {
                    this.map.getView().fit(cnst.crashPointsO.getSource().getExtent());
                }

                this.props.setLoading(false);
            },
            'json');
    }

    componentDidUpdate() {
        let lyrs: { [s: string]: VectorLayer } = {
            K: cnst.crashPointsK,
            A: cnst.crashPointsA,
            B: cnst.crashPointsB,
            C: cnst.crashPointsC,
            // P: this.crashPointsP,
            O: cnst.crashPointsO,
        };

        cnst.crashPointsK.setVisible(false);

        for (let l of intf.crashSevList) {
            lyrs[l].setVisible(this.props.lyrChecked[l]);
        }
    }

    componentDidMount() {

        this.map = new Map({
            target: document.getElementById('map'),
            view: new View({
                center: [-9840124.542661136, 5379280.493658545],
                zoom: 7
            })
        });

        let dblClickInteraction;
        // find DoubleClickZoom interaction
        this.map.getInteractions().getArray().forEach(function (interaction) {
            if (interaction instanceof DoubleClickZoom) {
                dblClickInteraction = interaction;
            }
        });
        // remove from map
        if (dblClickInteraction) {
            this.map.removeInteraction(dblClickInteraction);
        }


        this.props.setMap(this.map);

        let popup = new Popup(this.map);

        popup.addVectorOlPopup(cnst.crashPointsO, (f) => {
            let props = f.getProperties();
            let crashNum = props['id'];

            return `${crashNum}`;

        }, (d) => {
            let id2 = parseInt(d.innerHTML);
            ajx.getCrashInfo(id2, d);
        });

        accordionSetup(this.map);

        this.map.addLayer(cnst.allPointLayer);
        this.map.addLayer(cnst.crashPointsK);
        this.map.addLayer(cnst.crashPointsA);
        this.map.addLayer(cnst.crashPointsB);
        this.map.addLayer(cnst.crashPointsC);
        // this.map.addLayer(this.crashPointsP);
        this.map.addLayer(cnst.crashPointsO);
        this.map.addLayer(cnst.selectionLayer);
        this.map.addLayer(cnst.selectionOneLayer);
        // this.map.addLayer(this.clusterLayer);s


        let selectionChangeTimeout: number = null;

        cnst.selectionLayer.getSource().on('change', () => {
            if (selectionChangeTimeout){
                clearTimeout(selectionChangeTimeout)
            }

            selectionChangeTimeout = setTimeout(() => {
                this.props.setSelectedCrashes(cnst.selectionLayer.getSource().getFeatures());
                console.log('changed');
            }, 5);


        });


        glob['map'] = this.map;

        this.map.addControl(new ScaleLine({units: 'us', minWidth: 125}));

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

        // this.map.on('click', (evt) => {
        //
        //     let feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        //         return feature;
        //     });
        //
        //     if (feature) {
        //         let crashNumber = parseInt(feature.getProperties()['id']);
        //
        //         $.get('https://transportal.cee.wisc.edu/applications/arcgis2/rest/services/crash/GetCrashProps/GPServer/GetCrashProps/execute',
        //             {crashNumber: crashNumber, f: 'json'},
        //             (d) => {
        //                 let resultObj = {};
        //
        //                 for (let r of d.results) {
        //                     resultObj[r['paramName']] = r['value']
        //                 }
        //
        //                 if (resultObj['error']) {
        //                     alert(resultObj['error']);
        //                     return;
        //                 } else if (!resultObj['success']) {
        //                     alert('Unknown request error');
        //                     return;
        //                 }
        //
        //                 let propOrder = ["DOCTNMBR", "CRSHDATE", "CNTYNAME", "MUNINAME", "MUNITYPE",
        //                     "ONHWY", "ONSTR", "ATHWY", "ATSTR", "INTDIR", "INTDIS", "INJSVR", "TOTVEH", "TOTINJ",
        //                     "TOTFATL", "CMAALAT", "CMAALONG"];
        //
        //                 let crashProps = resultObj['props'];
        //                 let outHtml = '<table style="border-collapse: collapse">';
        //
        //                 for (let p of propOrder) {
        //                     outHtml += `<tr><td style="border: solid black 1px">${p}</td><td style="border: solid black 1px">${crashProps[p] || ''}</td></tr>`;
        //                 }
        //                 outHtml += '</table>';
        //
        //                 (document.getElementById('crash-info') as HTMLDivElement).innerHTML = outHtml;
        //             },
        //             'json');
        //     } else {
        //         (document.getElementById('crash-info') as HTMLDivElement).innerHTML = '';
        //     }
        // });


        // let select = new Select({
        //     multi: true
        // });
        //
        // this.map.addInteraction(select);
        //
        // let selectedFeatures = select.getFeatures();
        //
        // let dragBox = new DragBox({
        //     condition: cond['platformModifierKeyOnly']
        // });
        //
        // sel.seletionLayerSetup(this.map);
        //
        //
        // this.map.addInteraction(dragBox);
        //
        // dragBox.on('boxend', () => {
        //     // features that intersect the box are added to the collection of
        //     // selected features
        //     let extent = dragBox.getGeometry().getExtent();
        //
        //     for (let lyr of [
        //         this.crashPointsK, this.crashPointsA, this.crashPointsB, this.crashPointsC, this.crashPointsO
        //     ]) {
        //         lyr.getSource().forEachFeatureIntersectingExtent(extent, (feature) => {
        //             // console.log(feature.getProperties()['id']);
        //             // crashIds.push(feature.getProperties()['id']);
        //             selectedFeatures.push(feature);
        //         });
        //     }
        // });
        //
        // selectedFeatures.on(['add', 'remove'], () => {
        //
        //     if (this.selectionTimeout) {
        //         clearTimeout(this.selectionTimeout);
        //     }
        //
        //     this.selectionTimeout = setTimeout(() => {
        //         let selDiv = (document.getElementById('selections') as HTMLDivElement);
        //
        //         let ids = selectedFeatures.getArray().map(function (feature) {
        //             return feature.get('id');
        //         });
        //
        //         let features: Feature[] = selectedFeatures.getArray().map(function (feature) {
        //             return feature;
        //         });
        //
        //         this.props.setSelectedCrashes(features);
        //
        //         // if (ids.length > 0) {
        //         //     selDiv.innerHTML = ids.join(', ');
        //         // } else {
        //         //     selDiv.innerHTML = 'No crashes selected';
        //         // }
        //
        //         this.map.getView().setZoom(this.map.getView().getZoom());
        //     }, 2)
        //
        //
        // });
    }

    render() {
        return <div id="app-container">
            {cnstEl.header}
            <div id="map-container">
                <div id="accordion-container-collapsed">
                    <div id="shower">Show&nbsp;&#9650;</div>
                </div>
                <div id="accordion-container" className="collapsed">
                    <div id="hider">Hide&#9660;</div>
                    <div id="accordion">
                        <h3>Legend</h3>
                        <div>
                            <Legend/>
                            {/*<img src="/legend.png"/>*/}
                        </div>
                        <h3>Selection</h3>
                        <SelectionInfo/>
                        <h3>Base Map</h3>
                        <div>
                            <LayerSwitcher mapFunc={() => {
                                return this.map
                            }} embed={false}/>
                        </div>
                        {cnstEl.disclamerH3}
                        {cnstEl.disclamerDiv}
                        {cnstEl.aboutH3}
                        {cnstEl.aboutDiv}
                    </div>
                </div>
                <div id="map">
                    {/*<div id="crash-info"/>*/}
                    <div id="search-bar-div">
                        <input type="text" id="search-bar" placeholder="Search" onKeyUp={
                            (e) => {
                                console.log(e)
                                // (document.getElementById('search-button') as HTMLInputElement).focus();
                        }
                        }/>
                        <input type="button" id="search-button" value="" onClick={() => {
                            console.log('search')}}/>
                    </div>
                    <Loading/>
                    <div id="toolbar">
                        <Box/>
                        <Line/>
                        <Poly/>
                        <input className="toolbar-button ruler" readOnly={true} title="Measure"/>
                        {/*<Selection_operation/>*/}
                    </div>
                </div>
            </div>
        </div>
    }
}

let CrashMap = connect(
    (s: store.iState) => {
        return {
            lyrChecked: s.layerChecked,
            loading: s.loading
        };
    },
    (dispatch) => {
        return {
            setQueryResults: (r: { [s: string]: { queried: number, mapped: number } }) => {
                dispatch({type: act.SET_QUERY_RESULTS, results: r} as act.iSetQueryResults);
            },
            setSelectedCrashes: (features: Feature[]) => {
                dispatch({type: act.SET_SELECTED_FEATURES, features: features} as act.iSetSelectedFeatures)

            },
            setLoading(b: boolean) {
                dispatch({type: act.SET_LOADING, loading: b} as act.iSetLoading)
            },
            setMap(m: Map) {
                dispatch({type: act.SET_MAP, map: m} as act.iSetMap)
            }

        }
    }
)(_CrashMap);

ReactDom.render(<Provider store={store.store}><CrashMap/></Provider>, document.getElementById('root'));
