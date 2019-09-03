import React = require("react");
import {connect} from "react-redux";
import {iState} from "./store";
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import $ = require("jquery");
import Map from 'ol/Map';
import * as cnst from './constants';


/**
 * crash download
 * https://transportal.cee.wisc.edu/applications/crash-reports/retrieveCrashReport.do?doctnmbr=170403679
 */

function getCrashInfo(docNum: string) {

    $.get(cnst.GP_GET_CRASH_PROPS,
        {docNumber: docNum, f: 'json'},
        (d) => {
            let resultObj = {};

            for (let r of d.results) {
                resultObj[r['paramName']] = r['value']
            }

            if (resultObj['error']) {
                alert(resultObj['error']);
                return;
            } else if (!resultObj['success']) {
                alert('Unknown request error');
                return;
            }

            let propOrder = ["DOCTNMBR", "CRSHDATE", "CNTYNAME", "MUNINAME", "MUNITYPE",
                "ONHWY", "ONSTR", "ATHWY", "ATSTR", "INTDIR", "INTDIS", "INJSVR", "TOTVEH", "TOTINJ",
                "TOTFATL", "CMAALAT", "CMAALONG"];

            let crashProps = resultObj['props'];

            let outHtml = '<table style="border-collapse: collapse">';

            for (let p of propOrder) {
                outHtml += `<tr><td style="border: solid black 1px">${p}</td><td style="border: solid black 1px">${crashProps[p] || ''}</td></tr>`;
            }
            outHtml += '</table>';

            (document.getElementById('selection-info') as HTMLDivElement).innerHTML = outHtml;
        },
        'json');
}

interface iColPresetPairs {
    index: number;
    value: string;
}

class _SelectionInfo extends React.Component<{ features: Feature[], map: Map, unmapped: string[] },
    { selectedPreset: string, downloadUnmapped: boolean }> {
    dataSource: string;
    colPresetList: string[];

    constructor(p, c) {
        super(p, c);

        this.dataSource = (document.getElementById('dataSource') as HTMLInputElement).value;

        this.state = {
            selectedPreset: (document.getElementById('activeColumnList') as HTMLInputElement).value,
            downloadUnmapped: false
        };

        let colPresetPairs: iColPresetPairs[] = [];

        let colPresets = document.getElementsByName('columnListOptions');

        for (let i = 0; i < colPresets.length; i++) {
            let el = colPresets[i] as HTMLInputElement;
            let ind = parseInt(el.id.replace('columnListOptions', ''));
            colPresetPairs.push({index: ind, value: el.value});

        }

        colPresetPairs.sort((a: iColPresetPairs, b: iColPresetPairs) => {
            if (a.index == b.index) {
                return 0;
            } else {
                return a.index < b.index ? -1 : 1;
            }
        });

        this.colPresetList = [];

        for (let pr of colPresetPairs) {
            this.colPresetList.push(pr.value);
        }

    }


    render() {


        let selectDivContent = <div>
            <h4 style={{margin: '3px 0 0 0'}}>No crashes selected</h4>
            <label htmlFor="download-unmapped">Include Unmapped</label>
            <input id="download-unmapped" type="checkbox" checked={this.state.downloadUnmapped} onChange={
                () => {
                    this.setState({downloadUnmapped: !this.state.downloadUnmapped})
                }
            }/>
        </div>;

        let divInfo = document.getElementById('selection-info') as HTMLDivElement;

        if (divInfo) {
            divInfo.innerHTML = '';
        }

        let docNumList: string[] = [];

        if (this.state.downloadUnmapped){
            for (let c of this.props.unmapped){
                docNumList.push(c);
            }
        }

        if (this.props.features.length > 0 || this.state.downloadUnmapped) {
            let spans = [];

            for (let f of this.props.features) {

                let ext = f.getGeometry().getExtent();

                let props = f.getProperties();
                let crsh = props['id'];
                let sev = props['injSvr'];

                docNumList.push(crsh);

                let crashDownLoadLink = cnst.allowCrashReportDownload ?
                    <a href={cnst.CRASH_REPORT_DOWNLOAD + crsh} download="download" className="crash-download"/> :
                    undefined;

                spans.push(<div key={crsh} style={{display: 'inline-block', margin: '0 4px'}}>
                    <span data-crash={crsh}
                          data-x={ext[0]}
                          data-y={ext[1]}
                          style={
                              {
                                  display: 'inline-block',
                                  margin: '0 4px',
                                  cursor: 'pointer',
                                  color: 'blue',
                                  textDecoration: 'underline'
                              }
                          } onClick={
                        (e) => {

                            cnst.selectionOneLayer.getSource().clear();
                            let target = e.target as HTMLSpanElement;
                            let docNum = target.getAttribute('data-crash');

                            let x = parseFloat(target.getAttribute('data-x'));
                            let y = parseFloat(target.getAttribute('data-y'));
                            getCrashInfo(docNum);


                            let f = new Feature();

                            f.setGeometry(new Point([x, y]));

                            cnst.selectionOneLayer.getSource().addFeature(f);

                            if (this.props.map.getView().getZoom() < 12) {
                                this.props.map.getView().setZoom(12);
                            }

                            this.props.map.getView().animate({
                                center: [x, y],
                                duration: 300
                            });


                        }
                    }>{crsh}:{sev}</span>
                    {crashDownLoadLink}
                    {/*<a href={cnst.CRASH_REPORT_DOWNLOAD + crsh} download="download" className="crash-download"/>*/}
                </div>);

            }

            let options = [];

            for (let opt of this.colPresetList) {
                options.push(<option key={opt} value={opt}>{opt}</option>)
            }


            selectDivContent = <div>
                <form name="crashQueryForm"
                      id="crashQueryForm"
                      method="post"
                      action={cnst.CRASH_TABLE_DOWNLOAD}
                      style={{display: 'inline-block'}}
                      target="_blank"
                >
                    <input type="hidden" name="dataSource" value={this.dataSource}/>
                    <input type="hidden" name="columnList" value={this.state.selectedPreset}/>
                    <input type="hidden" name="docKeySelection" value={docNumList.join(',')}/>
                    <input type="submit" value="Download Table"/>


                </form>

                <select style={{width: '166px'}} value={this.state.selectedPreset} onChange={(e) => {
                    this.setState({selectedPreset: e.target.value})
                }}>
                    {options}
                </select><br/>
                <label htmlFor="download-unmapped">Include Unmapped</label>
                <input id="download-unmapped" type="checkbox" checked={this.state.downloadUnmapped} onChange={
                    () => {
                        this.setState({downloadUnmapped: !this.state.downloadUnmapped})
                    }
                }/><br/>
                {spans}
            </div>
        }


        return <div id="selection-container">
            <div id="selections">
                {selectDivContent}
            </div>
            <div id="selection-info">
            </div>
        </div>
    }
}


export const SelectionInfo = connect((s: iState) => {
    return {
        features: s.selectedFeatures,
        map: s.map,
        unmapped: s.unmappedList
    }
})(_SelectionInfo);



