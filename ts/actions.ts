import Redux = require("redux");


export const DUMMY = 'dummy action';
export const SET_QUERY_RESULTS = 'SET_QUERY_RESULTS';
export const SET_LYR_CHECKED = 'SET_LYR_CHECKED';

export interface iSetQueryResults extends Redux.Action{
    results: {[s: string]: {queried: number, mapped: number}}
}

export interface iSetLayerChecked extends Redux.Action{
    sev: string;
    checked: boolean;
}
