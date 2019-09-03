/**
 * Created by glenn on 6/12/2017.
 */

import * as act from './actions';
import Redux = require('redux');
import * as intf from './interfaces';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import * as cnst from './constants';


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
            if (action.sev === s) {
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

function activeTool(state: string = null, action: act.iSetSelectedTool) {
    if (action.type === act.SET_ACTIVE_TOOL) {
        return action.tool
    } else {
        return state
    }
}

function selectedFeatures(state: Feature[] = [], action: act.iSetSelectedFeatures) {
    if (action.type === act.SET_SELECTED_FEATURES) {

        action.features.sort((a: Feature, b: Feature) => {
            let sevA = a.getProperties()['injSvr'];
            let sevB = b.getProperties()['injSvr'];

            if (sevA === sevB) {
                return 0
            }

            let indA = intf.crashSevList.indexOf(sevA);
            let indB = intf.crashSevList.indexOf(sevB);

            if (indA < 0) {
                return 1
            }

            if (indB < 0) {
                return -1;
            }

            return indA < indB ? -1 : 1;
        });

        cnst.selectionOneLayer.getSource().clear();

        return action.features;
    } else {
        return state;
    }
}


// function selection(state: string = null, action: act.iSetSelection){
//     if (action.type === act.SET_SELECTION){
//         return action.selection;
//     } else {
//         return state;
//     }
// }

function loading(state: boolean = false, action: act.iSetLoading) {
    if (action.type === act.SET_LOADING) {
        return action.loading;
    } else {
        return state;
    }
}

function cluster(state: boolean = false, action: act.iSetCluster) {
    if (action.type === act.SET_CLUSTER) {
        return action.cluster;
    } else {
        return state;
    }
}

function isSelecting(state: boolean = false, action: act.iSetIsSelecting) {
    if (action.type === act.SET_IS_SELECTING) {
        return action.isSelecting;
    } else {
        return state;
    }
}

function map(state: Map = null, action: act.iSetMap) {
    if (action.type === act.SET_MAP) {
        return action.map
    } else {
        return state
    }
}

function unmappedList(state: string[] = [], action: act.iSetUnmapped) {
    if (action.type === act.SET_UNMAPPED) {
        let returnArr: string[] = [];

        for (let c of action.unmappedLookup.K) {
            returnArr.push(c);
        }

        for (let c of action.unmappedLookup.A) {
            returnArr.push(c);
        }

        for (let c of action.unmappedLookup.B) {
            returnArr.push(c);
        }

        for (let c of action.unmappedLookup.C) {
            returnArr.push(c);
        }

        for (let c of action.unmappedLookup.O) {
            returnArr.push(c);
        }

        return returnArr;


    } else {
        return state;
    }

}

export const store = Redux.createStore(
    Redux.combineReducers({
        queryResults, layerChecked,
        selectedFeatures, loading, map, isSelecting, cluster, activeTool, unmappedList
    })
);

export interface iState {
    queryResults: intf.iQueryResults;
    layerChecked: { [s: string]: boolean };
    selectedFeatures: Feature[];
    loading: boolean;
    selection: string;
    map: Map;
    isSelecting: boolean;
    cluster: boolean;
    activeTool: string;
    unmappedList: string[];
}

export function getState(): iState {
    return store.getState() as iState;
}


export default store;