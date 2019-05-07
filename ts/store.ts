/**
 * Created by glenn on 6/12/2017.
 */

import * as actions from './actions';



import Redux = require('redux');

const createStore = Redux.createStore;
const combineReducers = Redux.combineReducers;


function dummy(state: string = 'dummy', action) {
    if (action.type == actions.DUMMY) {
        return action.dummy;
    } else {
        return state;
    }
}

export const store = createStore(
    combineReducers({dummy})
);


export interface iState {
    dummy: string;
}

export function getState(): iState {
    return store.getState() as iState;
}


export default store;