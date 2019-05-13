import Map from 'ol/WebGLMap.js';
// import Map from 'ol/Map.js';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Cluster from 'ol/source/Cluster';
import {Circle as CircleStyle, Fill, Stroke, Style, Text, Icon} from 'ol/style.js';
import * as ax from 'webmapsjs/dist/api/axios';
import GeoJSON from 'ol/format/GeoJSON.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import OSM from 'ol/source/OSM.js';
import Feature from "ol/feature";

export const crashOrder: string[] = ['K', 'A', 'B', 'C', 'P', 'O'];

let colors = {
    K: '#ff3f4f',
    A: '#fba25b',
    B: '#fbea5b',
    C: '#5858ff',
    P: '#61d961',
    O: '#61d961',
    // O: '#b6b6b6'
};

let styleCache = {};

export const crashBySevStyle = (sev: string): Style => {
    return new Style({
        image: new CircleStyle({
            radius: 7,
            fill: new Fill({color: colors[sev] || 'grey'}),
            stroke: new Stroke({color: 'black', width: 0.5})
        })
    })
};

export const vectorLayerStyle = (feature: Feature) => {
    let sev = feature.getProperties()['injSvr'];
    if (!styleCache[sev]) {
        styleCache[sev] = new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({color: colors[sev] || 'grey'}),
                stroke: new Stroke({color: 'black', width: 0.5})
            })
        })
    }

    return [styleCache[sev]]
};
//
// export const vectorLayerOrder = (a: Feature, b: Feature): number => {
//     let aInj = a.getProperties()['injSvr'];
//     let bInj = b.getProperties()['injSvr'];
//
//     let aInd = crashOrder.indexOf(aInj);
//     let bInd = crashOrder.indexOf(bInj);
//
//     if (aInd < 0) {
//         return -1
//     }
//
//     if (bInd < 0) {
//         return 1
//     }
//
//     if (aInd == bInd) {
//         return 0
//     } else {
//         return aInd > bInd ? -1 : 1;
//     }
// };


export const clusterSyle = (feature) => {
    var size = feature.get('features').length;
    var style = styleCache[size];
    if (!style) {
        style = new Style({
            image: new CircleStyle({
                radius: 10,
                stroke: new Stroke({
                    color: '#fff'
                }),
                fill: new Fill({
                    color: '#3399CC'
                })
            }),
            text: new Text({
                text: size.toString(),
                fill: new Fill({
                    color: '#fff'
                })
            })
        });
        styleCache[size] = style;
    }
    return style;
};
