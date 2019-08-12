import React = require("react");
import {connect} from "react-redux";
import {iState} from "./store";
import $ = require("jquery");
import Map from 'ol/Map';
import {searchIndicator, allPointLayer} from './constants';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import SortedFeatures from "webmapsjs/dist/olHelpers/SortedFeatures";

class _Search extends React.Component<{ map: Map }, {}> {

    sorted: SortedFeatures;

    textInput: HTMLInputElement;

    constructor(p, c) {
        super(p, c);

        this.textInput = null;

        this.state = {};
        this.initSorted()

    }

    initSorted() {
        this.sorted = new SortedFeatures(allPointLayer.getSource().getFeatures(), 'id');
    }

    componentDidMount() {
        this.textInput = document.getElementById('search-bar-text') as HTMLInputElement;
    }

    clearIndicator(delay?: number) {
        if (typeof delay === 'undefined') {
            searchIndicator.getSource().clear()
        } else {
            setTimeout(() => {
                searchIndicator.getSource().clear()
            }, delay)
        }
    }

    getLoc() {

        // CQL0L368WC

        searchIndicator.getSource().clear();

        if (!this.textInput || !this.props.map) {
            return;
        }

        if (this.sorted.sortedFeatures.length === 0) {
            this.initSorted();
        }

        let searchInfo = this.textInput.value.trim();

        if (!searchInfo) {
            return;
        }

        let foundCrash = false;

        if (this.sorted.sortedFeatures.length > 0) {
            let f = this.sorted.getFeature(searchInfo, true);

            if (f) {
                let fExt = f.getGeometry().getExtent();
                this.props.map.getView().setCenter([fExt[0], fExt[1]]);
                this.props.map.getView().setZoom(16);
                searchIndicator.getSource().addFeature(f);
                foundCrash = true;

                this.clearIndicator(3000);
            }
        }

        if (!foundCrash) {
            $.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates',
                {
                    f: 'json',
                    SingleLine: searchInfo,
                    // SingleLine: 'wacky not',
                    searchExtent: {
                        xmin: -10354584,
                        ymin: 5233180,
                        xmax: -9656612,
                        ymax: 5957887,
                        spatialReference: {
                            wkid: 102100
                        }
                    },
                    outSR: 102100
                }, (d) => {
                    if (d['candidates'] && d['candidates']['length'] > 0) {
                        let cand = d['candidates'][0];

                        let loc = cand['location'] as { x: number, y: number };
                        let ext = cand['extent'] as { xmin: number, ymin: number, xmax: number, ymax: number };

                        this.props.map.getView().setCenter([loc.x, loc.y]);
                        this.props.map.getView().fit(
                            [ext.xmin, ext.ymin, ext.xmax, ext.ymax],
                            {size: this.props.map.getSize()}
                        );

                        let p = new Point([loc.x, loc.y]);
                        let f = new Feature(p);

                        searchIndicator.getSource().addFeature(f);

                        this.clearIndicator(3000);
                    }

                }, 'json');
        }
    }


    render() {
        return <div id="search-bar-div">
            <input type="text" id="search-bar-text" placeholder="Search" onKeyUp={
                (e) => {
                    //enter key
                    if (e.keyCode == 13) {
                        this.getLoc()
                        // console.log('enter')
                    } else {
                        // console.log(e.keyCode)

                    }
                    // let target = (e.target as HTMLInputElement)


                    // console.log(e)
                    // (document.getElementById('search-button') as HTMLInputElement).focus();
                }
            }/>
            <input type="button" id="search-button" value="" onClick={() => {
                this.getLoc();
                // console.log('search')
            }}/>
        </div>
    }
}


export const Search = connect((s: iState) => {
    return {
        map: s.map
    };
}, (dispatch) => {
    return {}
})(_Search)
