import React = require('react');
import ReactDom = require('react-dom');
import $ = require("jquery");
import {connect, Provider} from "react-redux";
import {SelectionInfo} from "./SelectionInfo";
import * as ajx from './ajax';
import 'webmapsjs/dist/import-queryui';
import * as store from './store'
import Map from 'ol/WebGLMap.js';
import {LayerSwitcher} from './layerSwitcher';
import View from "ol/View";
import VectorLayer from 'ol/layer/Vector.js';
import EsriJSON from 'ol/format/EsriJSON';
import {accordionSetup} from './accordionSetup';
import * as act from './actions';
import * as cnst from './constants';
import * as cnstEl from './constantEls';
import * as intf from './interfaces';
import {Legend} from './Legend';
import {Popup} from "./popup";
import {Selection} from './selection';
import {Loading} from "./loading";
import ScaleLine from 'ol/control/ScaleLine';
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import {iQueryResults, iResultInner} from "./interfaces";
import {crashColors} from './layerStyles'
import Feature from 'ol/Feature';
import {LayerToggle} from './layerToggle';
import {Search} from './search';
import {Measure} from "./measure";
import * as fileSaver from 'file-saver';

const esriJson = new EsriJSON();

declare let glob: Object;

store.store.subscribe(() => {
    let s = store.getState();
    console.log(s)
});


// export interface iQueryResults {
//     K?: iResultInner;
//     A?: iResultInner;
//     B?: iResultInner;
//     C?: iResultInner;
//     O?: iResultInner;
// }

class _CrashMap extends React.Component<{
    setQueryResults: (r: iQueryResults) => any,
    lyrChecked: { [s: string]: boolean },
    loading: boolean,
    setLoading: (b: boolean) => any,
    setMap: (m: Map) => any,
    setCluster: (c: boolean) => any,
    clusterShown: boolean,
    // isSelecting: boolean,
    activeTool: string,
    setUnmapped: (l: { [s: string]: string[] }) => any
}, {
    originalExtent: {
        center: [number, number], zoom: number
    },
    unmappedList: {
        K: string[],
        A: string[],
        B: string[],
        C: string[],
        O: string[]
    },
}> {
    private map: Map;
    private dblClickInteraction: DoubleClickZoom;
    private lastIsSelecting: boolean;
    private lastActiveTool: string;

    constructor(props, context) {
        super(props, context);
        this.map = null;
        this.lastIsSelecting = false;
        this.lastActiveTool = null;
        this.dblClickInteraction = null;

        this.state = {
            originalExtent: {
                center: [-9950741.719619062, 5572860.553334906],
                zoom: 0.67
            },
            unmappedList: {K: [], A: [], B: [], C: [], O: []},
        }
    }

    getCrashesByQueryId(queryId: number) {

        // if (window.location.href.indexOf('queryId') < 0) {
        //     window.history.replaceState(
        //         window.location.href,
        //         'query id location',
        //         `${window.location.href}?queryId=${queryId}`
        //     )
        // }

        this.props.setLoading(true);

        $.post(cnst.GP_BY_QUERY_ID,
            {queryId: queryId, f: 'json', 'env:outSR': 3857},
            (d) => {
                this.props.setLoading(false);

                if (d.results) {
                    for (let r of d.results) {
                        if (r.paramName === 'message') {
                            console.log(r.value);
                            break;
                        }
                    }
                }

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

                let res: iQueryResults = {};
                let mappedFeatures = [];

                for (let f of resultObj['out_features']['features']) {
                    let sev = f['attributes']['injSvr'] || 'O';
                    res[sev] = res[sev] || {queried: 0, mapped: 0, unmappedList: []};
                    res[sev].queried++;

                    if (!isNaN(f['geometry']['x']) && !isNaN(f['geometry']['y'])) {
                        res[sev].mapped++;
                        mappedFeatures.push(f);
                    } else {
                        res[sev].unmappedList.push(f.attributes.id);
                    }
                }

                let unmappedLookup = {
                    K: res.K ? res.K.unmappedList : [],
                    A: res.A ? res.A.unmappedList : [],
                    B: res.B ? res.B.unmappedList : [],
                    C: res.C ? res.C.unmappedList : [],
                    O: res.O ? res.O.unmappedList : [],
                };

                this.setState({
                    unmappedList: unmappedLookup
                });

                this.props.setUnmapped(unmappedLookup);


                resultObj['out_features']['features'] = mappedFeatures;

                this.props.setQueryResults(res);

                let features = esriJson.readFeatures(resultObj['out_features']);

                let allFeaturesArr: Feature[] = [];

                for (let f of features) {
                    allFeaturesArr.push(f);
                    cnst.allPointLayer.getSource().addFeature(f);

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
                        default:
                            cnst.crashPointsO.getSource().addFeature(f);
                            break;
                    }
                }

                cnst.clusterSource.addFeatures(allFeaturesArr);

                let featureCount = cnst.allPointLayer.getSource().getFeatures().length;

                if (featureCount === 1) {
                    let ext1 = cnst.allPointLayer.getSource().getFeatures()[0].getGeometry().getExtent();
                    this.map.getView().setCenter([ext1[0], ext1[1]]);
                    this.map.getView().setZoom(7);

                } else if (featureCount > 0) {
                    this.map.getView().fit(cnst.allPointLayer.getSource().getExtent());
                }


                this.setState({
                    originalExtent: {
                        center: this.map.getView().getCenter(),
                        zoom: this.map.getView().getZoom()
                    }
                });

                this.map.updateSize();
            },
            'json');
    }

    componentDidMount() {

        this.map = new Map({
            target: document.getElementById('map'),
            view: new View({
                center: this.state.originalExtent.center,
                zoom: this.state.originalExtent.zoom,
                maxResolution: 2000
            })
        });

        glob['map'] = this.map;
        cnst.popup.init(this.map);

        // let dblClickInteraction;
        // find DoubleClickZoom interaction
        this.map.getInteractions().getArray().forEach((interaction) => {
            if (interaction instanceof DoubleClickZoom) {
                this.dblClickInteraction = interaction as DoubleClickZoom;
            }
        });

        this.props.setMap(this.map);

        for (let ll of [cnst.crashPointsK, cnst.crashPointsA, cnst.crashPointsB,
            cnst.crashPointsC, cnst.crashPointsO]) {
            cnst.popup.addVectorOlPopup(ll, (f) => {
                return ``;
            }, (div, data) => {
                let callbackData: Array<{ layerName: string, crashId: string }> = data['callbackData'];

                if (callbackData.length == 1) {
                    ajx.getCrashInfo(callbackData[0].crashId, div);
                } else {


                    let outerFunc = function (): (number) => any {
                        let index = 0;
                        let maxIndex = callbackData.length;
                        let popupIndex = (document.getElementById('popup-index')) as HTMLSpanElement;
                        let popupCrashDiv = (document.getElementById('popup-crash-info')) as HTMLDivElement;


                        return function (inc: number) {
                            if (index + inc < 0 || index + inc === maxIndex) {
                                return;
                            }
                            index += inc;
                            popupIndex.innerText = (index + 1).toFixed();
                            ajx.getCrashInfo(callbackData[index]['crashId'], popupCrashDiv);

                        }
                    };

                    let incrementFunc = outerFunc();

                    (document.getElementById('popup-previous') as HTMLSpanElement).onclick = () => {
                        incrementFunc(-1);
                    };

                    (document.getElementById('popup-next') as HTMLSpanElement).onclick = () => {
                        incrementFunc(1);
                    };

                    incrementFunc(0);
                }
            });
        }

        accordionSetup(this.map);

        // this.map.addLayer(cnst.allPointLayer);
        this.map.addLayer(cnst.crashPointsK);
        this.map.addLayer(cnst.crashPointsA);
        this.map.addLayer(cnst.crashPointsB);
        this.map.addLayer(cnst.crashPointsC);
        this.map.addLayer(cnst.crashPointsO);
        this.map.addLayer(cnst.selectionLayer);
        this.map.addLayer(cnst.selectionOneLayer);
        this.map.addLayer(cnst.selectionExtentLayer);

        this.map.addLayer(cnst.clusterLayer);
        this.map.addLayer(cnst.searchIndicator);

        this.map.addControl(new ScaleLine({units: 'us', minWidth: 125}));

        this.getCrashesByQueryId(cnst.queryId);

    }

    componentDidUpdate() {
        if (this.lastActiveTool != this.props.activeTool) {
            if (this.dblClickInteraction) {
                if (this.props.activeTool !== null) {
                    this.map.removeInteraction(this.dblClickInteraction);
                } else {
                    this.map.addInteraction(this.dblClickInteraction);
                }
            }
            this.lastActiveTool = this.props.activeTool
        }

        let lyrs: { [s: string]: VectorLayer } = {
            K: cnst.crashPointsK,
            A: cnst.crashPointsA,
            B: cnst.crashPointsB,
            C: cnst.crashPointsC,
            O: cnst.crashPointsO,
        };


        cnst.clusterSource.clear();

        let onFeaturesArr: Feature[] = [];

        for (let l of intf.crashSevList) {
            if (!this.props.clusterShown) {
                lyrs[l].setVisible(this.props.lyrChecked[l]);
            }

            if (this.props.lyrChecked[l]) {
                onFeaturesArr.push(...lyrs[l].getSource().getFeatures())
            }
        }

        cnst.clusterSource.addFeatures(onFeaturesArr);
    }


    render() {

        let unmappedInfo = document.getElementById('unmapped-info') as HTMLDivElement;

        let unMappedSpans = [];

        for (let sv of ['K', 'A', 'B', 'C', 'O']) {
            for (let c of this.state.unmappedList[sv]) {
                unMappedSpans.push(<span key={`umapped-${c}`} data-docnum={c} onClick={
                    (e) => {
                        let docNum = (e.target as HTMLSpanElement).getAttribute('data-docnum');
                        ajx.getCrashInfo(docNum, unmappedInfo)
                    }
                }>
                    {`${c}:${sv}`}
                    <a href={cnst.CRASH_REPORT_DOWNLOAD + c} download="download"
                       className="crash-download" title="Download crash report"/>

                </span>)
            }
        }


        return <div id="app-container">
            {cnstEl.header}
            <div id="map-container">
                <div id="accordion-container-collapsed" className="collapsed">
                    <div id="shower">Show&nbsp;&#9650;</div>
                </div>
                <div id="accordion-container">
                    <div id="hider">Hide&#9660;</div>
                    <div id="accordion">
                        <h3>Legend</h3>
                        <div className="legend-container">
                            <div id='legend-container-outer'>
                                <Legend/>
                            </div>
                            <SelectionInfo/>
                        </div>


                        <h3>Base Map</h3>
                        <div>
                            <LayerSwitcher mapFunc={() => {
                                return this.map
                            }} embed={false}/>
                        </div>
                        <h3>Unmapped Crashes</h3>
                        <div id="unmapped-container">
                            <div id="unmapped-list">
                                {unMappedSpans}
                            </div>
                            <div id="unmapped-info">
                            </div>
                        </div>
                        {cnstEl.helpH3}
                        {cnstEl.helpDiv}
                        {cnstEl.aboutH3}
                        {cnstEl.aboutDiv}
                    </div>
                </div>
                <div id="map">
                    <Search/>
                    <Loading/>
                    <div id="toolbar">
                        <input className="toolbar-button zoom-extent" readOnly={true}
                               title="Zoom to initial extent"
                               onClick={() => {
                                   this.map.getView().setCenter(this.state.originalExtent.center);
                                   this.map.getView().setZoom(this.state.originalExtent.zoom);
                               }
                               }
                        />
                        <LayerToggle layerChecked={this.props.lyrChecked} clusterShown={(shown) => {
                            this.props.setCluster(shown);
                        }}/>
                        <Selection/>
                        <Measure/>
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
            loading: s.loading,
            clusterShown: s.cluster,
            // isSelecting: s.isSelecting,
            activeTool: s.activeTool
        };
    },
    (dispatch) => {
        return {
            setQueryResults: (r: { [s: string]: { queried: number, mapped: number } }) => {
                dispatch({type: act.SET_QUERY_RESULTS, results: r} as act.iSetQueryResults);
            },
            setLoading(b: boolean) {
                dispatch({type: act.SET_LOADING, loading: b} as act.iSetLoading)
            },
            setMap(m: Map) {
                dispatch({type: act.SET_MAP, map: m} as act.iSetMap)
            },
            setCluster: (b: boolean) => {
                dispatch({type: act.SET_CLUSTER, cluster: b} as act.iSetCluster);
            },
            setUnmapped: (l: { [s: string]: string[] }) => {
                dispatch({type: act.SET_UNMAPPED, unmappedLookup: l})
            }
        }
    }
)(_CrashMap);

ReactDom.render(
    <Provider store={store.store}><CrashMap/></Provider>,
    document.getElementById('root')
);
