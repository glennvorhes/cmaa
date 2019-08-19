import React = require("react");
import {connect} from "react-redux";
import {iState} from "./store";
import $ = require("jquery");
import Map from 'ol/Map';
import {searchIndicator, allPointLayer} from './constants';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import {SortedFeatures} from "./sortedFeatures";
import {proj4326, proj3857} from 'webmapsjs/dist/olHelpers/projections';

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


        let searchRes = searchInfo.match(/-?\d+(\.\d+)?(\s+|\s?,\s?)-?\d+(\.\d+)?/);

        if (searchRes) {
            let searchParts = searchInfo.split(/\s?,\s?/);

            if (searchParts.length === 1) {
                searchParts = searchInfo.split(/\s+/);
            }

            let p = new Point([parseFloat(searchParts[1]), parseFloat(searchParts[0])]);
            let f = new Feature(p);
            f.getGeometry().transform(proj4326, proj3857);

            let fExt = f.getGeometry().getExtent();


            if (this.props.map.getView().getZoom() < 8){
                this.props.map.getView().setZoom(8);
            }

            this.props.map.getView().setCenter([fExt[0], fExt[1]]);

            searchIndicator.getSource().addFeature(f);

            this.clearIndicator(3000);

            return;
        }


        if (this.sorted.sortedFeatures.length > 0) {
            let f = this.sorted.getFeature(searchInfo, true);

            if (f) {
                let fExt = f.getGeometry().getExtent();
                this.props.map.getView().setCenter([fExt[0], fExt[1]]);
                this.props.map.getView().setZoom(10);
                searchIndicator.getSource().addFeature(f);
                // foundCrash = true;

                this.clearIndicator(3000);
                return;
            }
        }

        // if (!foundCrash) {

        $.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates',
            {
                f: 'json',
                SingleLine: searchInfo,
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


                    if (isNaN(loc.x) || isNaN(loc.y) || typeof loc.x === 'string' || typeof loc.y === 'string') {
                        // pass
                    } else {
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
                }

            }, 'json');

    }


    render() {
        return <div id="search-bar-div">
            <input type="text" id="search-bar-text" placeholder="Search" onKeyUp={
                (e) => {
                    //enter key
                    if (e.keyCode == 13) {
                        this.getLoc()
                    }

                }
            }/>
            <input type="button" id="search-button" value="" onClick={() => {
                this.getLoc();
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
})(_Search);
