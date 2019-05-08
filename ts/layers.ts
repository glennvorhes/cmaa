import VectorLayer from 'ol/layer/Vector.js';
import {LayerSwitcher, ESRI_STREETS} from './layerSwitcher';
import VectorSource from "ol/source/Vector";
import * as layerStyles from "./layerStyles";

export function crashVector(sev?: string, z?: number): VectorLayer {

    let opt = {
        source: new VectorSource()
    };

    if (typeof sev === 'undefined') {
        opt['style'] = undefined
    } else {
        opt['style'] = layerStyles.crashBySevStyle(sev)
    }

    if (typeof z !== 'undefined') {
        opt['zIndex'] = z;
    }

    return new VectorLayer(opt);
}
