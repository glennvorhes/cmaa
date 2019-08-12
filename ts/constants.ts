import * as lyr from './layers';

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import ClusterSource from "ol/source/Cluster";
import jsts = require("jsts");
import {
    selectionStyle,
    selectionOneStyle,
    selectionExtentStyle,
    searchIndicatorStyle,
    clusterStyle, measureStyle
} from './layerStyles';
import {Popup} from "./popup";
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from "ol/style";


export const GP_BY_QUERY_ID = 'https://transportal.cee.wisc.edu/applications/arcgis2/rest/services/crash/getCrashByQueryId/GPServer/GetCrashByQueryId/execute';
export const GP_GET_CRASH_PROPS = 'https://transportal.cee.wisc.edu/applications/arcgis2/rest/services/crash/GetCrashProps/GPServer/GetCrashProps/execute';
export const CRASH_REPORT_DOWNLOAD = 'https://transportal.cee.wisc.edu/applications/crash-reports/retrieveCrashReport.do?doctnmbr=';

export const popup = new Popup();


export const allPointLayer = lyr.crashVector();

allPointLayer.set('loaded', false);

export const crashPointsK = lyr.crashVector('K', 10);
export const crashPointsA = lyr.crashVector('A', 9);
export const crashPointsB = lyr.crashVector('B', 8);
export const crashPointsC = lyr.crashVector('C', 7);
export const crashPointsO = lyr.crashVector('O', 5);

export const crashLayerDict: { [s: string]: VectorLayer } = {
    K: crashPointsK,
    A: crashPointsA,
    B: crashPointsB,
    C: crashPointsC,
    O: crashPointsO,
};

export const allowCrashReportDownload = (
    (document.getElementById('crashReports')
    ) as HTMLInputElement).value === 'true';


export const selectionLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 12,
    style: selectionStyle
});

export const searchIndicator = new VectorLayer({
    source: new VectorSource(),
    zIndex: 25,
    style: searchIndicatorStyle
});

export const selectionExtentLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 4,
    style: selectionExtentStyle()
});

export const selectionOneLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 13,
    style: selectionOneStyle
});

export const clusterSource = new VectorSource();


export const clusterLayer = new VectorLayer({
    // minResolution: 150,
    visible: false,
    source: new ClusterSource({
        distance: 20,
        source: clusterSource
    }),
    zIndex: 20,
    style: clusterStyle
});


export const crashSevList = ['K', 'A', 'B', 'C', 'O'];

export const crashOrder: string[] = ['K', 'A', 'B', 'C', 'P', 'O'];

export const crashColors = {
    K: '#ff3f4f',
    A: '#fba25b',
    B: '#fbea5b',
    C: '#5858ff',
    O: '#61d961',
};

export const drawVectorLayer = new VectorLayer({
    source: new VectorSource(),
    style: measureStyle
});


export const parser = new jsts.io.OL3Parser();
