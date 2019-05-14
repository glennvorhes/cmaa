import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import {toStringHDMS} from 'ol/coordinate.js';
import {toLonLat} from 'ol/proj.js';
import Vector from 'ol/layer/Vector';
import Feature from 'ol/Feature';

class _PopupTracker {
    private cl: (dv: HTMLDivElement) => any;
    readonly fn: (f: Feature) => string;
    readonly lyr: Vector;

    constructor(lyr: Vector, fn: (f: Feature) => string, cl: (dv: HTMLDivElement) => any) {
        this.lyr = lyr;
        this.fn = fn;
        this.cl = cl;
    }

    layerHasFeature(f: Feature): boolean {
        let feats = this.lyr.getSource().getFeatures();
        return feats.indexOf(f) > -1;
    }

    getHtml(f: Feature) {
        return this.fn(f);
    }

    runCallback(contentDiv: HTMLDivElement) {
        this.cl(contentDiv);
    }
}

export class Popup {
    private mapDiv: HTMLDivElement;
    private popupDivId = 'popup';
    private popupCloserId = 'popup-close';
    private popupContentId = 'popup-content';
    private popupDiv: HTMLDivElement;
    private popupCloser: HTMLAnchorElement;
    private popupContent: HTMLDivElement;
    private map: Map;
    readonly overlay: Overlay;
    private popupTrackers: _PopupTracker[] = [];

    constructor(m: Map) {
        this.map = m;
        this.mapDiv = this.map.getTargetElement() as HTMLDivElement;
        let popupDiv = document.createElement('div');
        popupDiv.id = this.popupDivId;
        popupDiv.classList.add("ol-popup");
        let popupDivA = document.createElement('a');
        popupDivA.href = '#';
        popupDivA.id = this.popupCloserId;
        popupDivA.classList.add('ol-popup-closer');
        let popupDivContent = document.createElement('div');
        popupDivContent.id = this.popupContentId;
        popupDiv.appendChild(popupDivA);
        popupDiv.appendChild(popupDivContent);
        this.mapDiv.parentNode.insertBefore(popupDiv, this.mapDiv.nextSibling);
        this.popupDiv = document.getElementById(this.popupDivId) as HTMLDivElement;
        this.popupCloser = document.getElementById(this.popupCloserId) as HTMLAnchorElement;
        this.popupContent = document.getElementById(this.popupContentId) as HTMLDivElement;
        this.overlay = new Overlay({
            element: this.popupDiv,
            autoPan: true,
            autoPanAnimation: {duration: 250, source: undefined}
        });
        this.popupCloser.onclick = (e) => {
            e.preventDefault();
            this.closePopup();
        };
        this.map.addOverlay(this.overlay);
        this.map.on('pointermove', (e) => {
            if (e['dragging']) {
                return;
            }
            let vLayers: Vector[] = [];
            for (let t of this.popupTrackers) {
                vLayers.push(t.lyr);
            }
            if (this.map.hasFeatureAtPixel(e['pixel'], {
                layerFilter: (l: Vector) => {
                    return vLayers.indexOf(l) > -1
                }
            })) {
                this.mapDiv.style.cursor = 'pointer';
            } else {
                this.mapDiv.style.cursor = '';
            }
        });
        this.map.on('singleclick', (e) => {
            let vLayers: Vector[] = [];
            for (let t of this.popupTrackers) {
                vLayers.push(t.lyr);
            }
            let feats: Feature[] = this.map.getFeaturesAtPixel(e['pixel'], {
                layerFilter: (l: Vector) => {
                    return vLayers.indexOf(l) > -1
                }
            }) as Feature[];
            if (feats) {
                let coordinate = e['coordinate'] as [number, number];
                let featTrack: Array<{ f: Feature, t: _PopupTracker }> = [];
                for (let f of feats) {
                    for (let t of this.popupTrackers) {
                        if (t.layerHasFeature(f)) {
                            featTrack.push({f: f, t: t})
                        }
                    }
                }
                if (featTrack.length === 0){
                    return;
                } else if (featTrack.length === 1) {
                    this.popupHtml = featTrack[0].t.getHtml(featTrack[0].f);
                    this.overlay.setPosition(coordinate);
                    featTrack[0].t.runCallback(this.popupContent);
                } else {

                }


            } else {
                this.closePopup();
            }
        })
    }

    get popupHtml(): string {
        return this.popupContent.innerHTML;
    }

    set popupHtml(s: string){
        this.popupContent.innerHTML = s;
    }

    closePopup() {
        this.overlay.setPosition(undefined);
        this.popupCloser.blur();
        return false;
    }

    addCoordinatePopup() {
        this.map.on('singleclick', (evt) => {
            var coordinate = evt['coordinate'] as [number, number];
            var hdms = toStringHDMS(toLonLat(coordinate));
            this.popupContent.innerHTML = `<p>You clicked here:</p><code>${hdms}</code>`;
            this.overlay.setPosition(coordinate);
        });
    }

    addVectorOlPopup(lyr: Vector, fn: (f: Feature) => string, cl: (dv?: HTMLDivElement) => any = (dv: HTMLDivElement) => {
    }) {
        for (let t of this.popupTrackers) {
            if (lyr === t.lyr) {
                return;
            }
        }
        this.popupTrackers.push(new _PopupTracker(lyr, fn, cl));

    }


}

