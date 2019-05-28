import React = require("react");
import {connect} from "react-redux";
import {iState} from "./store";
import Feature from 'ol/Feature'
import $ = require("jquery");
import {makeGuid} from 'webmapsjs/dist/util/makeGuid';
function getCrashInfo(crsh: number) {


    $.get('https://transportal.cee.wisc.edu/applications/arcgis2/rest/services/crash/GetCrashProps/GPServer/GetCrashProps/execute',
        {crashNumber: crsh, f: 'json'},
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


class _SelectionInfo extends React.Component<{ features: Feature[] }, {}> {


    render() {


        let selectDivContent = <h4>No crashes selected</h4>;

        let divInfo = document.getElementById('selection-info') as HTMLDivElement;

        if (divInfo){
            divInfo.innerHTML = '';
        }



        if (this.props.features.length > 0) {
            let spans = [];

            for (let f of this.props.features) {

                let props = f.getProperties();
                let crsh = props['id'];
                let sev = props['injSvr'];

                spans.push(<span key={makeGuid()} data-crash={crsh} style={
                    {
                        display: 'inline-block', margin: '0 4px', cursor: 'pointer', color: 'blue',
                        textDecoration: 'underline'
                    }
                } onClick={
                    (e) => {
                        let target = e.target as HTMLSpanElement;
                        let crashNum = parseInt(target.getAttribute('data-crash'));
                        getCrashInfo(crashNum);
                    }
                }>{crsh}:{sev}</span>);

            }

            selectDivContent = <div>{spans}</div>
        }


        return <div id="selection-container" style={{display: 'flex', flexDirection: 'column', padding: 0}}>
            <div id="selections" style={{flex: 1, overflowY: 'auto', borderBottom: 'solid black 1px'}}>
                {selectDivContent}
            </div>
            <div id="selection-info" style={{flex: 1, overflowY: 'auto'}}>
            </div>
        </div>
        //
        //       display: flex;
        // flex-direction: column;
    }
}


export const SelectionInfo = connect((s: iState) => {
    return {
        features: s.selectedFeatures
    }
})(_SelectionInfo);



