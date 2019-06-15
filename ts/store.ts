/**
 * Created by glenn on 6/12/2017.
 */

import * as act from './actions';
import Redux = require('redux');
import * as intf from './interfaces';
import Feature from 'ol/Feature';
import Map from 'ol/Map';



function queryResults(state: intf.iQueryResults = {}, action: act.iSetQueryResults) {
    if (action.type === act.SET_QUERY_RESULTS) {

        for (let s of intf.crashSevList) {
            if (!action.results[s]) {
                action.results[s] = {queried: 0, mapped: 0}
            }
        }
        return action.results
    } else {
        return state;
    }
}

let _lyrChecked = {};

for (let s of intf.crashSevList) {
    _lyrChecked[s] = true;
}

function layerChecked(state: { [s: string]: boolean } = _lyrChecked, action: act.iSetLayerChecked) {
    if (action.type === act.SET_LYR_CHECKED) {
        let retObj = {};

        for (let s of intf.crashSevList) {
            if (action.sev === s){
                retObj[s] = action.checked;
            } else {
                retObj[s] = state[s];
            }
        }

        return retObj;
    } else {
        return state;
    }
}

function selectedFeatures(state: Feature[] = [], action: act.iSetSelectedFeatures) {
    if (action.type === act.SET_SELECTED_FEATURES){

        action.features.sort((a: Feature, b: Feature) => {
            let sevA = a.getProperties()['injSvr'];
            let sevB = b.getProperties()['injSvr'];

            if (sevA === sevB){
                return 0
            }

            let indA = intf.crashSevList.indexOf(sevA);
            let indB = intf.crashSevList.indexOf(sevB);

            if (indA < 0){
                return 1
            }

            if (indB < 0){
                return -1;
            }

            return indA < indB ? -1 : 1;
        });

        return action.features;
    } else {
        return state;
    }

}

function operation(state: string = act.OPERATION_UNION, action: act.iSetOperation){
    if (action.type === act.SET_OPERATION){
        return action.operation
    } else {
        return state;
    }
}

function selection(state: string = null, action: act.iSetSelection){
    if (action.type === act.SET_SELECTION){
        return action.selection;
    } else {
        return state;
    }
}

function loading(state: boolean = false, action: act.iSetLoading){
    if (action.type === act.SET_LOADING){
        return action.loading;
    } else {
        return state;
    }
}

function map(state: Map = null, action: act.iSetMap){
    if (action.type === act.SET_MAP){
        return action.map
    } else {
        return state
    }
}

export const store = Redux.createStore(
    Redux.combineReducers({queryResults, layerChecked, selectedFeatures, operation, loading, selection, map})
);

export interface iState {
    queryResults: intf.iQueryResults;
    layerChecked: { [s: string]: boolean };
    selectedFeatures: Feature[];
    operation: string;
    loading: boolean;
    selection: string;
    map: Map;
}

export function getState(): iState {
    return store.getState() as iState;
}


export default store;