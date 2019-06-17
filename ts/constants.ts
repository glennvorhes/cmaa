import * as lyr from './layers';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import jsts = require("jsts");
import {selectionStyle, selectionOneStyle} from './layerStyles';



export const GP_BY_QUERY_ID = 'https://transportal.cee.wisc.edu/applications/arcgis2/rest/services/crash/getCrashByQueryId/GPServer/GetCrashByQueryId/execute';


export const allPointLayer = lyr.crashVector();
export const crashPointsK = lyr.crashVector('K', 10);
export const crashPointsA = lyr.crashVector('A', 9);
export const crashPointsB = lyr.crashVector('B', 8);
export const crashPointsC = lyr.crashVector('C', 7);
// export const crashPointsP = lyr.crashVector('P', 6);
export const crashPointsO = lyr.crashVector('O', 5);


export const selectionLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 12,
    style: selectionStyle
});

export const selectionOneLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 13,
    style: selectionOneStyle
});



export const crashSevList = ['K', 'A', 'B', 'C', 'O'];



export const parser = new jsts.io.OL3Parser();
