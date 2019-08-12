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

export const crashColors = {
    K: '#ff3f4f',
    A: '#fba25b',
    B: '#fbea5b',
    C: '#5858ff',
    O: '#61d961',
};

let styleCache = {};

export const crashBySevStyle = (sev: string): Style => {
    return new Style({
        image: new CircleStyle({
            radius: 7,
            fill: new Fill({color: crashColors[sev] || 'grey'}),
            stroke: new Stroke({color: 'black', width: 0.5})
        })
    })
};

export const selectionStyle = new Style({
    image: new CircleStyle({
        radius: 8,
        // fill: new Fill({color: ''),
        stroke: new Stroke({color: 'cyan', width: 2})
    })
});

export function selectionExtentStyle(): (f: Feature) => Style {

    let cache = {};

    return (f: Feature) => {

        let theType = f.getProperties()['type'] || 'none';

        if (cache[theType]) {
            return cache[theType];
        }

        let strokeColor = 'darkgray';
        let fillColor = 'rgba(125,125,125,0.3)';

        switch (theType) {
            case 'new':
            case 'add':
                strokeColor = 'rgb(255,165,0)';
                fillColor = 'rgba(255,165,0,0.12)';
                break;

            case 'subset':
                strokeColor = 'rgb(0,0,255)';
                fillColor = 'rgba(0,0,255,0.12)';
                break;
            case 'remove':
                strokeColor = 'rgb(255,0,0)';
                fillColor = 'rgba(255,0,0,0.12)';
                break;

            default:
                break;
        }


        cache[theType] = new Style({
            stroke: new Stroke({
                color: strokeColor,
                width: 2
            }),
            fill: new Fill({
                color: fillColor,
            })
        });

        return cache[theType];

    }
}

export const selectionOneStyle = new Style({
    image: new CircleStyle({
        radius: 8,
        fill: new Fill({color: 'cyan'}),
        stroke: new Stroke({color: 'cyan', width: 2})
    })
});

export const vectorLayerStyle = (feature: Feature) => {
    let sev = feature.getProperties()['injSvr'];
    if (!styleCache[sev]) {
        styleCache[sev] = new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({color: crashColors[sev] || 'grey'}),
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


export const searchIndicatorStyle = new Style({
            image: new CircleStyle({
                radius: 14,
                stroke: new Stroke({
                    color: '#000000'
                }),
                fill: new Fill({
                    color: 'rgba(204,36,104,0.6)'
                })
            })
        });


export const measureStyle = new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#42ff55',
                    width: 2
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                })
            });

export const measureDrawStyle = new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new CircleStyle({
                    radius: 5,
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            });

let clusterStyleCache = {};

export const clusterStyle = (feature) => {
        let size = feature.get('features').length;
        let style = clusterStyleCache[size];
        if (!style) {
            style = new Style({
                image: new CircleStyle({
                    radius: 12,
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
                    }),
                    font: '14px sans-serif',
                    offsetX: 0,
                    offsetY: 2
                })
            });
            clusterStyleCache[size] = style;
        }
        return style;
    };
