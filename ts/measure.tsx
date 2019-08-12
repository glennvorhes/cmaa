import React = require("react");
import {connect} from 'react-redux'
import {iState} from "./store";

import Map from 'ol/Map';
// import {unByKey} from 'ol/Observable';
import * as obs from 'ol/Observable';
import Overlay from 'ol/Overlay';
import * as sphere from 'ol/sphere';
// import  {getArea, getLength} from 'ol/sphere';
import View from 'ol/View';
import {LineString, Polygon} from 'ol/geom';
import Draw from 'ol/interaction/Draw';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import Feature from 'ol/Feature';
import * as act from "./actions";
import {measureDrawStyle, measureStyle} from "./layerStyles";
import * as cnst from './constants';

export const MEASURE_TOOL = 'MEASURE_TOOL';


/**
 * Overlay to show the help messages.
 * @type {module:ol/Overlay}
 */
var helpTooltip: Overlay;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement: HTMLDivElement;


/**
 * Overlay to show the measurement.
 * @type {module:ol/Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */

// var continueLineMsg = 'Click to continue drawing the line';

/**
 * Format length output.
 * @param {module:ol/geom/LineString~LineString} line The line.
 * @return {string} The formatted length.
 */
function formatLength(line) {
    let length = sphere['getLength'](line);

    let length_ft = length * 3.28084;

    if (length_ft < 5280) {
        return `${length_ft.toFixed()} ft`
    } else {
        return `${(Math.round(length_ft / 5280 * 100) / 100)} mi`;
    }
}


class _Measure extends React.Component<{ map: Map, activeTool: string, setActiveTool: (s: string) => any }, { enabled: boolean }> {
    sketch: Feature;
    initialized: boolean;
    draw: Draw;
    // source: VectorSource;
    // vector: VectorLayer;
    helpTooltipElement: HTMLDivElement;

    constructor(p, c) {
        super(p, c);
        this.state = {enabled: false};
        this.initialized = false;
        this.sketch = null;

        // this.source = new VectorSource();
        //
        // this.vector = new VectorLayer({
        //     source: this.source,
        //     style: measureStyle
        // });

        this.draw = new Draw({
            source: cnst.drawVectorLayer.getSource(),
            type: "LineString",
            style: measureDrawStyle
        });

        let listener;
        this.draw.on('drawstart',
            (evt) => {
                // set sketch
                this.sketch = evt['feature'] as Feature;

                /** @type {module:ol/coordinate~Coordinate|undefined} */
                var tooltipCoord = evt['coordinate'];

                listener = this.sketch.getGeometry().on('change', (evt) => {
                    let geom = evt.target;
                    let output;
                    if (geom instanceof Polygon) {
                        // output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof LineString) {
                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            });

        this.draw.on('drawend',
            () => {
                measureTooltipElement.className = 'tooltip tooltip-static';
                measureTooltip.setOffset([0, -7]);
                // unset sketch
                this.sketch = null;
                // unset tooltip so that a new one can be created
                measureTooltipElement = null;
                this.createMeasureTooltip();
                obs['unByKey'](listener);
            });
    }

    createHelpTooltip(): Overlay {
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'tooltip hidden';
        helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        if (this.props.map) {
            this.props.map.addOverlay(helpTooltip);
        }

        return helpTooltip

    }

    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip(): HTMLDivElement {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
        measureTooltip = new Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        if (this.props.map) {
            this.props.map.addOverlay(measureTooltip);
        }
        return measureTooltip
    }

    /**
     * Handle pointer move.
     * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
     */
    pointerMoveHandler(evt) {
        if (evt.dragging) {
            return;
        }

        /** @type {string} */
        var helpMsg = 'Click to start drawing';

        if (this.sketch) {
            helpMsg = 'Click to continue, double click to end';
            // let geom = this.sketch.getGeometry();
            // if (geom instanceof Polygon) {
            //     helpMsg = continuePolygonMsg;
            // } else if (geom instanceof LineString) {
            //     helpMsg = continueLineMsg;
            // }
        }

        if (this.helpTooltipElement) {
            this.helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(evt.coordinate);

            // this.helpTooltipElement.classList.remove('hidden');
        }


    };

    componentDidUpdate() {
        if (this.initialized) {
            return;
        }

        if (this.props.map) {
            this.props.map.addLayer(cnst.drawVectorLayer);
            this.createHelpTooltip();
            this.createMeasureTooltip();

            this.initialized = true;
        }


    }

    enable() {
        if (this.state.enabled) {
            this.disable()
        } else {
            this.props.map.addInteraction(this.draw);
            this.props.map.on('pointermove', (e) => {
                this.pointerMoveHandler.call(this, e);
            });
            this.setState({enabled: true});
            this.helpTooltipElement.classList.remove('hidden-help-tooltip');
            this.props.setActiveTool(MEASURE_TOOL);
        }
    }

    disable() {
        this.props.map.removeInteraction(this.draw);
        this.props.map.un('pointermove', (e) => {
            this.pointerMoveHandler.call(this, e);
        });
        this.setState({enabled: false});
        this.helpTooltipElement.classList.add('hidden-help-tooltip');
        this.props.setActiveTool(null);
    }

    render() {
        let enabled = this.props.activeTool  === MEASURE_TOOL ||  this.props.activeTool === null;
        let disabled = !enabled;

        return <input className="toolbar-button ruler" readOnly={true}
                      style={{backgroundColor: this.state.enabled ? 'lightblue' : '', cursor: disabled ? 'not-allowed': ''}}
                      onClick={() => {
                          this.enable()
                      }} disabled={disabled} title="Measure"/>

    }
}


export const Measure = connect((s: iState) => {
    return {
        map: s.map,
        activeTool: s.activeTool
    };
}, (dispatch) => {
    return {
        setActiveTool: (s: string) => {
            dispatch({type: act.SET_ACTIVE_TOOL, tool: s});
        }
    };
})(_Measure);