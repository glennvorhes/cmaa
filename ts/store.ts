/**
 * Created by glenn on 6/12/2017.
 */

import * as act from './actions';
import Redux = require('redux');
import * as intf from './interfaces';


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

export const store = Redux.createStore(
    Redux.combineReducers({queryResults, layerChecked})
);


export interface iState {
    queryResults: intf.iQueryResults;
    layerChecked: { [s: string]: boolean };
}

export function getState(): iState {
    return store.getState() as iState;
}


export default store;