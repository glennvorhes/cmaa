import React = require("react");
import Map from 'ol/Map';
import {connect} from "react-redux";
import {iState} from "./store";
import Point from 'ol/geom/Point';
import {proj3857, proj4326} from 'webmapsjs/dist/olHelpers/projections';
import {SET_ACTIVE_TOOL} from "./actions";

export const STREET_VIEW = 'STREET_VIEW';


class _StreetView extends React.Component<{ map: Map, activeTool: string, setActive: (s: string) => any },
    {}> {

    constructor(p, c) {
        super(p, c);
        this.state = {active: false};

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Escape' && this.props.activeTool === STREET_VIEW){
                this.deactivate();
            }
        });
    }

    private streetViewClick(e) {
        if (this.props.activeTool !== STREET_VIEW) {
            return;
        }

        this.setState({active: false});
        this.deactivate();
        let coord = e['coordinate'] as [number, number];
        let p = new Point(coord);
        p.transform(proj3857, proj4326);
        let coordTrans = p.getCoordinates();
        let a = document.createElement('a');
        a.href = `https://www.google.com/maps?cbll=${coordTrans[1]},${coordTrans[0]}&cbp=12,20.09,,0,5&layer=c`
        a.target = '_blank';
        a.click()
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.map.on('singleclick', (e) => {
                this.streetViewClick(e);
            });
        }, 300);

    }

    activate() {


        this.props.setActive(STREET_VIEW);
        (this.props.map.getTargetElement() as HTMLDivElement).style.cursor = 'crosshair';
    }

    deactivate() {

        this.props.setActive(null);
        (this.props.map.getTargetElement() as HTMLDivElement).style.cursor = '';
    }

    render() {

        let disabled = false;
        let enabled = this.props.activeTool === STREET_VIEW || this.props.activeTool === null;

        return <input className="toolbar-button street-view" readOnly={true}
                      title={"Google Street View" + (!enabled ? ' - Disabled when other tools are active' : '')}
                      disabled={!enabled}
                      style={
                          {
                              backgroundColor: this.props.activeTool ===  STREET_VIEW ? 'lightblue' : '',
                              cursor: enabled ? '' : 'not-allowed'
                          }
                      }
                      onClick={(e) => {
                          if (enabled && this.props.activeTool === STREET_VIEW) {
                              this.deactivate();
                          } else {
                              this.activate();

                          }
                      }
                      }
        />
    }

}


export const StreetView = connect(
    (s: iState) => {
        return {
            map: s.map,
            activeTool: s.activeTool
        }
    },
    (dispatch) => {
        return {
            setActive: (s: string) => {
                dispatch({type: SET_ACTIVE_TOOL, tool: s})

            }
        }
    })(_StreetView);
