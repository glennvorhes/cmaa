import React = require("react");
import {connect} from "react-redux";
import {iState} from "./store";
// import {SelectionControl} from './selectionLayer';
// import VectorLayer from "ol/layer/Vector";
// import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import * as act from './actions';
import Draw from "ol/interaction/Draw";
import Feature from 'ol/Feature';
import * as drw from 'ol/interaction/Draw';
import * as cnst from './constants';
import WKT from 'ol/format/WKT.js';

import jsts = require("jsts");
import {MEASURE_TOOL} from "./measure";

const SELECTION_MODE_NEW = 'New Selection';
const SELECTION_MODE_ADD = "Add to Selection";
const SELECTION_MODE_SUBSET = 'Subset Selection';
const SELECTION_MODE_REMOVE = 'Remove from Selection';

export const SELECTION_DRAW_BOX = 'SELECTION_BOX';
export const SELECTION_DRAW_LINE = 'SELECTION_LINE';
export const SELECTION_DRAW_POLY = 'SELECTION_POLYGON';

// const iconString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAACICAMAAADH0avOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAABoaGiMiIygnKSoqKy8uMDQ0NDg3ODs7PD8/QD5VWjVcZDldZDtgaDRvejJyfj50fkNDREdGSEtLTENOUU5OUERQVE5VV1NTVFVWWFVZW1pbW0FeZF1fYEVmbEVob0xkaU1pb0Rud09tckVweEl2flVhZFNmalJpbV1gYl1maV1obGBfYGNjZGZmaGdoaWtrbGFvcm9vcGdydGF3e2xxcnBvcHNzdHZ2eHh3eXt7eyZ8jCtzgC5+jTV9izp2gTh4hDt9iUV5g0N+iVF4gH9/gB2HmhyJnReMoRiMoRCTqxmTqRyYrhucsxWiuxqiuyWJnCiElSuKnDGEkzeImDuGlTuLmiSOoSiOoSORpSKZriyZrTSSojudrjGesjqesCamvCqgtC2muzKgswilwQywzQC21wO83Q6z0Q241gq62RanwRWpxBGtyRmnwBipwx2vyRCxzhO10RS51xS92xq20gC/4SOsxSiswyKyyzmswDW70xHA3wPD5AHG6QHJ7QzC4wjH6QjK7ALN8QvN8AHQ9ALT+BnM6xbS8ybV8zbI4jfV8UKBjEGHlEiMmFKDjFiCilCHkFqJkUGTolefrEWoukultVagrVCjslyquG+Ag2yMkm+Xn3aFiH+DhHWXnn2Wm2WapG2aoniepFazxEjN5UvZ8lzR5lLa8mXH2XfI1n/N23PT5XjV5njd74ODg4OHiIaGiImJiYqKjIuMjYyLjI2Njo+PkIeYm42SlI2ZnJCPkJGRkZOTlJSTlJWVlZaXmJeYmZmZmZubnJucnJybnJ2dnZ+foIOkqoyqsJukp5+goJ2ipJOvs5qxtaGhoaOjpKOkpKSjpKWlpaemqKWpq6urrK6vsKC0t66ytKi3uqy5vLCvsLGxsbGztLO0tLW1tbe3uLW7vLi3uLm5ubu8vL29vYG9yL6/wJ7DyZnM1YbZ6MLCw8PJy8vLy8/P0MvV2NHR0dPT1NPU1NTT1NXV1dnZ2dzb3N3d3d7f4ODf4OPj4+rq6vX19fn5+QAAAPbjxMAAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xLjb9TgnoAAAG8ElEQVRYR92Xe5TcVB3Hdc84jg/EIazMElfwiYvNNorbLPFF0YoVh62ttKe2Vq3WHnE9qz0L+JqdtXvWByBV8IFyFK0vVPRKVgZbUlKmNT4Qok29WDFtukyjaLg11Azx3Dy8eWz33u3qn55jv3/MZO5nfkkm937v9zdPSv6r/lfYV2eUOxX1fsO4X9dbnWwsx4GFk8QdWLN69XIB2rY92xHbGcix2296oXvBlmsaoxd1o5gI7M1AjjuVXhWhr403mtt2PBbGcYSHtQwUuGrLw8Zj3/90c/I9u4M40BWePrldfQLp4KeP3nH99vGbDnWghSS62q7iqHsQzDzwo9s/s3nnLiOI5XszkOPDT8NxHHYk+Td/u/2z77zVjmNZzUCOrQrBcehfzIN//OS6WyDBdPWhCo4iXxa58lP5h3/81Z9HEVMNywF0PJmXFbDH/ft3dgahxODSAXFFB3Laoz/8wR3f+/hXOli6JwMF7uF5oRXw4C/f/fCWLfXPAVtgqp9cOSDzPhTB786qElUqVfp3w579j0MJYFE62rFgpuMZyLGzFJH5rPq6NIMLZeMF7s6SlyOcpvT1B9nAnHKcyVO4Wq/oF59yUThBlSXwX8VxIRpj5BWXPCkaL6LTBHd93z/he5nyJ8Bgie+rEfVyHNerZyMMFteNfnD0Auj73a5E26DQ0npjonHpbBhHwTDtsUKDIxPN5toH/a5jizQuZkIYaU413/0raAI4SC0mWzYfT9+Fkanp6fEdYgvHMoXhUPtnM7pzYmDsisu2T137hT0RYyIoH3egaeznV7/mmW/dNrn5Np9xCZwhhj9x7Je11z574Otv+8DYLTAcZjFRhPlVVyo+uHT9O1RMm2gO949tasWRMXC23JXuXojj8MIzzm+Rt2Nypa9KV5NBUh3+dpekEGwJPaWzqGf+UIbJo+zukzEO9nJcn0xte0U1kSloWgB54LjdeXworyZfUEvlsuPdxc9ZKa++O4dRpJQlTvMeqdq0Ba1hs5DIuy0RgJKWnzvH6L779uZSzeSEUBOFdAtOlWFWmmyGxeFimNZpgq3fk5AydH1/u6272QiDh150ySWvO3cYEPUv5rH6NY2tL3TTpKLX+ZwG641m44Y/4ThCCy2IHV3l6xNTzY0PIFczBdaC2FR1k798a3Pq2tv27IdsUJGgA22vK6x875apyZtf2QpjeU82PIcV049C4fLLXv3+qfGbd7EeIxKcKA4HRtadfcYVn/zot1w2iRJXQlGEl4xukP7whlUjXzIYEyUe0AOy/vmxTUoIb12+XGEwtiRENpRwYN2VZEk73+gXTIHymNuCJLTjcKivL13xHig9pULvDiAkDzKK3FmFeAy3az09nDmPLTVrCKIQG5Lr4l9wokLPmAU8HKYmiXROko53RAn51KbpKDp0UDeMQlDiKvCfeg1lsMAJ0i4WBYBCJFZUHrjHymbhwRyTzqXraqIq8RI+wvfxPS3aY7l82zQhSrDEA9MrxihMvtBNb6gD87tOxeBTdZrgOyUx1aAgCIMwG2GwuKZef/tL9nUcx3nFfwqqF89GZO+WFw2qRnNi7R+72HOYVjIXzoJqw687UNIF1kRIkyW5903vm5i++iZZ9ULGwGFHUY0jFr/yzSu3bt+8gyw9xiWuojpBiAfqb3zGqqs+sembQURb0Ndln6xVLIytr7189bYPfdFmgsoCbkR+TciPblKOi2e+5WMaG1SZDTKPtaJg9/OfCwK627PU3AUXPusFxERPwCFO4uiTaymOw12ymAZVZ1lPqUptXFAhlyYe8z2NXIYEVaUqWPPYAii9NjHRQRGa2OAU28n7tgwjDWBy54Rr5SrnIiD4RVxkOHFBO/V/6rFaVfceqjpM1GBL0aDjdhyJM2SprZX1BR5zWrIM5LaiJmgJx1f1UzyGfdTN+k8gtItT0/ikgsL6qRbBtP5fsHusQ3SU/Gc6bOe7C4Ol888773nnCqK4VOxbNKi2Nq56KVl3UbRi8aCaaLz+YbJ/+kxQoXyGsmZw44MIQcg0gwiY6eogHptuvuvbhtF2RObkrgTJFAojE43p8RsvSptBNqhcmcyiMFZ/1eSnrr5xoceIHFXz+LH1Tz9zdPIjO9GCoEqXm+zyYxvE3TfUR74M2b9M5OaMu3SUeixof37N2habY+TWV0Ac9tc33hNHfx46Z9lfRRrbQiuNh5c95xxiojSoKhUKY7gk68AOm4BYEJs8CaoDKSiqkaqm1Ri3ZdK47+N4SWFaCwT0LHyMGgC+Jcguyn1Q4AQpWjrDrVKlfNTXanN/nOZwgloKubxSBpziuRVYLPWTOEEOedFF3xDEZaV7i/J5nPXwyE6CZTUJuKdUn9RB9ZHiaFE8ryT5N/1Xe5GNBjIWAAAAAElFTkSuQmCC';

const crashLayers = [cnst.crashPointsK, cnst.crashPointsA, cnst.crashPointsB, cnst.crashPointsC, cnst.crashPointsO];

// export const selectionLayer: VectorLayer = new VectorLayer({
//     source: new VectorSource()
// });

// export function seletionLayerSetup(map: Map) {
//     map.addLayer(selectionLayer);
// }

class SelectionControl extends React.Component<{
    top: number,
    title: string,
    value: string,
    activeSelection: string,
    setActive: (s: string) => any,
    deactivate: () => any,
    disabled: boolean
}, {}> {
    private isActive: boolean;

    constructor(p, c) {
        super(p, c);
        this.isActive = false;
    }

    render() {
        if (this.props.value !== this.props.activeSelection) {
            this.isActive = false;
            this.props.deactivate();
        }

        let disabledMessage = this.props.disabled ? ' - Disabled when measure tool is active' : '';

        return <input
            className="toolbar-button"
            style={{
                backgroundPosition: `0 -${this.props.top}px`,
                backgroundColor: this.props.activeSelection === this.props.value ? 'lightblue' : '',
                cursor: this.props.disabled ? 'not-allowed' : ''
            }}
            title={`${this.props.title}${disabledMessage}`}
            onClick={() => {
                if (this.isActive) {
                    console.log('here');
                } else {
                    this.isActive = true;
                    this.props.setActive(this.props.value);
                }
            }}
            readOnly={true}
            disabled={this.props.disabled}
        />
    }
}

interface iSelectControlWrap {
    selectionMode: string;
    activeTool: string;
    setActive: (s: string) => any;
    map: Map;
    setSelectedFeatures: (features: Feature[]) => any,
    disabled: boolean
}

function _update_selected_features(
    selFeature: Feature, newFeatures: Feature[], mode: string): Feature[] {

    let selectionLayerSource = cnst.selectionLayer.getSource();
    let selectionExtentSource = cnst.selectionExtentLayer.getSource();

    let oldSelection = selectionLayerSource.getFeatures();
    let modSet: Feature[] = [];

    switch (mode) {
        case SELECTION_MODE_NEW:
            selectionExtentSource.clear();
            selFeature.setProperties({type: 'new'});
            selectionExtentSource.addFeature(selFeature);

            selectionLayerSource.clear();
            selectionLayerSource.addFeatures(newFeatures);

            return selectionLayerSource.getFeatures();

        case SELECTION_MODE_ADD:
            selFeature.setProperties({type: 'add'});
            selectionExtentSource.addFeature(selFeature);

            for (let n of newFeatures) {
                if (oldSelection.indexOf(n) < 0) {
                    modSet.push(n);
                }
            }

            selectionLayerSource.addFeatures(modSet);

            return selectionLayerSource.getFeatures();

        case SELECTION_MODE_SUBSET:
            selFeature.setProperties({type: 'subset'});
            selectionExtentSource.addFeature(selFeature);

            for (let n of newFeatures) {
                if (oldSelection.indexOf(n) > -1) {
                    modSet.push(n);
                }
            }

            selectionLayerSource.clear();
            selectionLayerSource.addFeatures(modSet);

            return selectionLayerSource.getFeatures();

        case SELECTION_MODE_REMOVE:
            selFeature.setProperties({type: 'remove'});
            selectionExtentSource.addFeature(selFeature);


            for (let n of oldSelection) {
                if (newFeatures.indexOf(n) > -1) {
                    continue;
                }
                modSet.push(n);
            }

            selectionLayerSource.clear();
            selectionLayerSource.addFeatures(modSet);

            return selectionLayerSource.getFeatures();


        default:
            selectionExtentSource.clear();
            selectionLayerSource.clear();
            return [];
    }
}


class Box extends React.Component<iSelectControlWrap, {}> {
    readonly setActive: () => any;
    readonly deactivate: () => any;
    readonly draw: Draw;

    constructor(p, c) {
        super(p, c);
        this.draw = new Draw({type: 'Circle', geometryFunction: drw['createBox']()});
        // this.draw = new Draw({type: 'Circle'});

        this.draw.on('drawend', (e) => {
            this.props.setActive(null);
            let selectFeature = e['feature'] as Feature;
            let selectGeom = selectFeature.getGeometry();

            let newFeatures = [];


            for (let lyr of crashLayers) {
                if (!lyr.getVisible()) {
                    continue;
                }
                lyr.getSource().forEachFeatureIntersectingExtent(selectGeom.getExtent(), (f) => {
                    newFeatures.push(f)
                });
            }

            this.props.setSelectedFeatures(
                _update_selected_features(selectFeature, newFeatures, this.props.selectionMode)
            );
        });

        this.setActive = () => {
            this.props.setActive(SELECTION_DRAW_BOX);
            this.props.map.addInteraction(this.draw);
        };

        this.deactivate = () => {
            // this.props.setActive('');
            if (this.props.map) {
                this.props.map.removeInteraction(this.draw);
            }
        };
        //
        // (document.getElementsByTagName('body')[0] as HTMLBodyElement).onkeyup = (e) => {
        //     console.log(this.props.activeSelection)
        //     console.log(e.key);
        //     if (this.props.activeSelection === SELECTION_DRAW_BOX && e.key === 'Escape') {
        //         this.deactivate();
        //     }
        // }
    }

    render() {
        return <SelectionControl
            top={0}
            title="Select by Box"
            value={SELECTION_DRAW_BOX}
            activeSelection={this.props.activeTool}
            setActive={this.setActive}
            deactivate={this.deactivate}
            disabled={this.props.disabled}
        />
    }
}

class Line extends React.Component<iSelectControlWrap, {
    valid: boolean,
    tooltip: string, buffDistance: number, canChangeDist: boolean
}> {

    readonly draw: Draw;
    readonly setActive: () => any;
    readonly deactivate: () => any;

    constructor(p, c) {
        super(p, c);
        this.draw = new Draw({type: 'LineString'});

        this.state = {valid: true, tooltip: "Line Buffer Distance", buffDistance: 250, canChangeDist: true};

        // const parser = new jsts.io.OL3Parser();

        const wkt = new WKT();

        const reader = new jsts.io.WKTReader();
        const writer = new jsts.io.WKTWriter();

        this.draw.on('drawstart', () => {
            this.setState({canChangeDist: false})
        });

        this.draw.on('drawend', (e) => {
            // console.log(this.state.buffDistance);
            this.setState({canChangeDist: true});

            this.props.setActive(null);

            let selectFeat = e['feature'] as Feature;

            let lineWkt = wkt.writeFeature(selectFeat);

            let lineJst = reader.read(lineWkt);

            let buffDist = this.state.buffDistance;

            // TODO Cheat here
            buffDist *= .42;

            let lineJstBuff = lineJst.buffer(buffDist, 20, 1);

            let buffWKT = writer['write'](lineJstBuff);

            let buffGeom = wkt.readFeature(buffWKT);

            let newFeatures = [];

            for (let lyr of crashLayers) {
                if (!lyr.getVisible()) {
                    continue;
                }
                lyr.getSource().forEachFeatureIntersectingExtent(buffGeom.getGeometry().getExtent(), (f) => {
                    let ext = f.getGeometry().getExtent();
                    let crd: [number, number] = [ext[0], ext[1]];

                    if (buffGeom.getGeometry().intersectsCoordinate(crd)) {
                        newFeatures.push(f);
                    }
                });
            }

            this.props.setSelectedFeatures(
                _update_selected_features(buffGeom, newFeatures, this.props.selectionMode)
            );
        });

        this.setActive = () => {
            this.props.setActive(SELECTION_DRAW_LINE);
            this.props.map.addInteraction(this.draw);
        };

        this.deactivate = () => {
            if (this.props.map) {
                this.props.map.removeInteraction(this.draw)
            }
        };

        // (document.getElementsByTagName('body')[0] as HTMLBodyElement).onkeyup = (e) => {
        //     if (this.props.activeSelection === SELECTION_DRAW_LINE && e.key === 'Escape') {
        //         this.deactivate();
        //     }
        // }
    }

    render() {
        return <div
            style={{position: 'relative'}}>
            <SelectionControl
                top={110}
                title="Select by Line"
                value={SELECTION_DRAW_LINE}
                activeSelection={this.props.activeTool}
                setActive={this.setActive}
                deactivate={this.deactivate}
                disabled={this.props.disabled}
            />
            <div style={
                {
                    display: this.props.activeTool === SELECTION_DRAW_LINE ? '' : 'none',
                    position: 'absolute',
                    width: '115px',
                    top: '0',
                    left: '32px',
                    backgroundColor: 'lightgray',
                    padding: '4px',
                    border: 'solid darkgray 1px',
                    borderTopRightRadius: '5px',
                    borderBottomRightRadius: '5px',
                }
            }>
                <label htmlFor="buffer-distance" style={{width: '20px'}}>Buffer (ft)</label>
                <input id="buffer-distance" style={
                    {
                        display: 'inline-block',
                        width: '30px',
                        marginLeft: '7px',
                        backgroundColor: this.state.valid ? '' : '#fa6565'
                    }
                }
                       type="text" defaultValue={this.state.buffDistance.toFixed()}
                       title={this.state.tooltip}
                       disabled={!this.state.canChangeDist}
                       onChange={
                           (e) => {
                               let v = e.target.value;

                               if (v.search(/^\d+$/) < 0) {
                                   this.setState({tooltip: "Enter Valid Number", valid: false})
                               } else {
                                   let vNum = parseInt(v);

                                   if (vNum > 0 && vNum <= 5000) {
                                       this.setState({tooltip: "Line Buffer Distance", valid: true, buffDistance: vNum})
                                   } else {
                                       this.setState({tooltip: "Enter Number 1 - 5000", valid: false})
                                   }
                               }
                           }
                       }/>
            </div>
        </div>
    }
}

class Poly extends React.Component<iSelectControlWrap, {}> {

    readonly draw: Draw;
    readonly setActive: () => any;
    readonly deactivate: () => any;

    constructor(p, c) {
        super(p, c);
        this.draw = new Draw({type: 'Polygon'});

        this.draw.on('drawend', (e) => {
            this.props.setActive(null);

            let selectFeature = e['feature'] as Feature;
            let selectGeom = selectFeature.getGeometry();

            let newFeatures = [];

            for (let lyr of crashLayers) {
                if (!lyr.getVisible()) {
                    continue;
                }

                lyr.getSource().forEachFeatureIntersectingExtent(selectGeom.getExtent(), (f) => {
                    let ext = f.getGeometry().getExtent();
                    let crd: [number, number] = [ext[0], ext[1]];

                    if (selectGeom.intersectsCoordinate(crd)) {
                        newFeatures.push(f);
                    }
                });
            }
            this.props.setSelectedFeatures(
                _update_selected_features(selectFeature, newFeatures, this.props.selectionMode)
            );
        });

        this.setActive = () => {
            this.props.setActive(SELECTION_DRAW_POLY);
            this.props.map.addInteraction(this.draw);
        };

        this.deactivate = () => {
            if (this.props.map) {
                this.props.map.removeInteraction(this.draw)
            }
        };

        // (document.getElementsByTagName('body')[0] as HTMLBodyElement).onkeyup = (e) => {
        //     if (this.props.activeSelection === SELECTION_DRAW_LINE && e.key === 'Escape') {
        //         this.deactivate();
        //     }
        // }
    }

    render() {
        return <SelectionControl
            top={27}
            title="Select by Polygon"
            value={SELECTION_DRAW_POLY}
            activeSelection={this.props.activeTool}
            setActive={this.setActive}
            deactivate={this.deactivate}
            disabled={this.props.disabled}
        />
    }
}

const SEL_OFFSET_NEW = "0px 3px";
const SEL_OFFSET_ADD = "-32px 3px";
const SEL_OFFSET_SUBSET = "-94px 3px";
const SEL_OFFSET_REMOVE = "-62px 3px";


class SelectionMode extends React.Component<{ selectionModeChange: (s: string) => any },
    { expanded: boolean, backOffset: string, selectionMode: string }> {

    constructor(p, c) {
        super(p, c);

        this.state = {
            expanded: false,
            backOffset: SEL_OFFSET_NEW,
            selectionMode: SELECTION_MODE_NEW
        };
    }


    render() {


        return <div style={{position: 'relative'}}>
            <input className="toolbar-button selection-mode"
                   style={{backgroundPosition: this.state.backOffset}}
                   readOnly={true} title={`Selection Mode - ${this.state.selectionMode}`}
                   onClick={
                       () => {
                           this.setState({expanded: !this.state.expanded})
                       }
                   }
            />
            <div style={
                {
                    display: this.state.expanded ? '' : 'none',
                    position: 'absolute',
                    width: '132px',
                    top: '-1px',
                    left: '32px',
                    // backgroundColor: 'lightgray',
                    // padding: '4px',
                    backgroundColor: 'white',
                    border: 'solid darkgray 1px',
                    // borderTopRightRadius: '5px',
                    // borderBottomRightRadius: '5px',
                }
            }>
                <input className="toolbar-button selection-mode"
                       readOnly={true} title={SELECTION_MODE_NEW}
                       style={{backgroundPosition: SEL_OFFSET_NEW}}
                       onClick={
                           () => {
                               this.props.selectionModeChange(SELECTION_MODE_NEW);
                               this.setState({
                                   expanded: false,
                                   backOffset: SEL_OFFSET_NEW,
                                   selectionMode: SELECTION_MODE_NEW
                               })
                           }
                       }
                />
                <input className="toolbar-button selection-mode"
                       readOnly={true} title={SELECTION_MODE_ADD}
                       style={{backgroundPosition: SEL_OFFSET_ADD}}
                       onClick={
                           () => {
                               this.props.selectionModeChange(SELECTION_MODE_ADD);
                               this.setState({
                                   expanded: false,
                                   backOffset: SEL_OFFSET_ADD,
                                   selectionMode: SELECTION_MODE_ADD
                               })
                           }
                       }
                />
                <input className="toolbar-button selection-mode"
                       readOnly={true} title={SELECTION_MODE_SUBSET}
                       style={{backgroundPosition: SEL_OFFSET_SUBSET}}
                       onClick={
                           () => {
                               this.props.selectionModeChange(SELECTION_MODE_SUBSET);
                               this.setState({
                                   expanded: false,
                                   backOffset: SEL_OFFSET_SUBSET,
                                   selectionMode: SELECTION_MODE_SUBSET
                               })
                           }
                       }
                />
                <input className="toolbar-button selection-mode"
                       readOnly={true} title={SELECTION_MODE_REMOVE}
                       style={{backgroundPosition: SEL_OFFSET_REMOVE}}
                       onClick={
                           () => {
                               this.props.selectionModeChange(SELECTION_MODE_REMOVE);
                               this.setState({
                                   expanded: false,
                                   backOffset: SEL_OFFSET_REMOVE,
                                   selectionMode: SELECTION_MODE_REMOVE
                               })
                           }
                       }
                />
            </div>
        </div>
    }
}

class _Selection extends React.Component
    <{
        map: Map, setSelectedCrashes: (features: Feature[]) => any,
        setIsSelecting: (isSelecting: boolean) => any,
        cluster: boolean,
        setActiveTool: (s: string) => any,
        activeTool: string
    },
        { activeTool: string, selectionMode: string }> {

    constructor(p, c) {
        super(p, c);

        this.state = {activeTool: null, selectionMode: SELECTION_MODE_NEW}
    }

    setTool(s: string) {
        cnst.popup.closePopup();
        this.props.setIsSelecting(s !== null);
        this.props.setActiveTool(s);
        this.setState({activeTool: s})
    }

    setFeatures(features: Feature[]) {
        this.props.setSelectedCrashes(features);
    }


    render() {
        let selectionDisabled = this.props.cluster || this.props.activeTool === MEASURE_TOOL;

        return <div>
            <input className="toolbar-button clear-selection"
                   readOnly={true} title="Clear Selection"
                   onClick={() => {
                       cnst.selectionExtentLayer.getSource().clear();
                       cnst.selectionOneLayer.getSource().clear();
                       cnst.selectionLayer.getSource().clear();
                       this.props.setSelectedCrashes([]);
                       // cnst.drawVectorLayer.getSource().clear();
                       //
                       // let staticTooltips = document.getElementsByClassName('tooltip-static');
                       //
                       // for (let i = 0; i < staticTooltips.length; i++){
                       //     let t = staticTooltips[i] as HTMLDivElement;
                       //
                       //     t.parentElement.removeChild(t);
                       // }
                   }}
            />
            <SelectionMode selectionModeChange={(s: string) => {
                this.setState({selectionMode: s})
            }}/>

            <Box map={this.props.map} activeTool={this.state.activeTool}
                 selectionMode={this.state.selectionMode}
                 setActive={(s) => {
                     this.setTool(s)
                 }}
                 setSelectedFeatures={(f) => {
                     this.setFeatures(f)
                 }}
                 disabled={selectionDisabled}
            />
            <Line map={this.props.map} activeTool={this.state.activeTool}
                  selectionMode={this.state.selectionMode}
                  setActive={(s) => {
                      this.setTool(s)
                  }}
                  setSelectedFeatures={(f) => {
                      this.setFeatures(f)
                  }}
                  disabled={selectionDisabled}
            />
            <Poly map={this.props.map} activeTool={this.state.activeTool}
                  selectionMode={this.state.selectionMode}
                  setActive={(s) => {
                      this.setTool(s)
                  }}
                  setSelectedFeatures={(f) => {
                      this.setFeatures(f)
                  }}
                  disabled={selectionDisabled}
            />
        </div>
    }
}

export const Selection = connect(
    (s: iState) => {
        return {
            map: s.map,
            cluster: s.cluster,
            activeTool: s.activeTool
        };
    },
    (dispatch) => {
        return {
            setSelectedCrashes: (features: Feature[]) => {
                dispatch({type: act.SET_SELECTED_FEATURES, features: features})
            },
            setIsSelecting: (selecting: boolean) => {
                if (selecting) {
                    dispatch({type: act.SET_IS_SELECTING, isSelecting: selecting})
                } else {
                    setTimeout(() => {
                        dispatch({type: act.SET_ACTIVE_TOOL, tool: null});
                        dispatch({type: act.SET_IS_SELECTING, isSelecting: selecting})
                    }, 1000);
                }
            },
            setActiveTool: (s: string) => {
                setTimeout(() => {
                    dispatch({type: act.SET_ACTIVE_TOOL, tool: s});
                }, 500);

            }

        };
    }
)(_Selection);

