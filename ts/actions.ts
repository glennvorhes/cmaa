import Redux = require("redux");
import Feature from 'ol/Feature'
import Map from 'ol/Map';


export const SET_QUERY_RESULTS = 'SET_QUERY_RESULTS';
export const SET_LYR_CHECKED = 'SET_LYR_CHECKED';
export const SET_SELECTED_FEATURES = 'SET_SELECTED_FEATURES';
export const SET_ACTIVE_TOOL = 'SET_ACTIVE_TOOL';
export const SET_IS_SELECTING = 'SET_IS_SELECTING';
export const SET_OPERATION = 'SET_OPERATION';
export const SET_LOADING = 'SET_LOADING';
export const SET_CLUSTER = 'SET_CLUSTER';
export const SET_SELECTION = 'SET_SELECTION';
export const SET_MAP = 'SET_MAP';
export const SET_BUFFER_DIST = 'SET_BUFFER_DIST';


export const OPERATION_UNION = 'OPERATION_UNION';
export const OPERATION_SUBSET = 'OPERATION_SUBSET';
export const OPERATION_REMOVE = 'OPERATION_REMOVE';

// export const SELECTION_BOX = 'SELECTION_BOX';
// export const SELECTION_LINE = 'SELECTION_LINE';
// export const SELECTION_POLYGON = 'SELECTION_POLYGON';


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

export interface iSetSelectedTool extends Redux.Action{
    tool: string;
}

export interface iSetOperation extends Redux.Action{
    operation: string;
}

export interface iSetLoading extends Redux.Action{
    loading: boolean;
}

export interface iSetCluster extends Redux.Action{
    cluster: boolean;
}

export interface iSetIsSelecting  extends Redux.Action{
    isSelecting: boolean;
}

export interface iSetSelection extends Redux.Action{
    selection: string;
}

export interface iSetMap extends Redux.Action{
    map: Map;
}

export interface iSetBuffDistance extends Redux.Action {
    dist: number;
}
