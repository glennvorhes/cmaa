import Redux = require("redux");
import Feature from 'ol/Feature'


export const DUMMY = 'dummy action';
export const SET_QUERY_RESULTS = 'SET_QUERY_RESULTS';
export const SET_LYR_CHECKED = 'SET_LYR_CHECKED';
export const SET_SELECTED_FEATURES = 'SET_SELECTED_FEATURES';

export interface iSetQueryResults extends Redux.Action{
    results: {[s: string]: {queried: number, mapped: number}}
}

export interface iSetLayerChecked extends Redux.Action{
    sev: string;
    checked: boolean;
}

export interface iSetSelectedFeatures extends Redux.Action{
    features: Feature[];
}
