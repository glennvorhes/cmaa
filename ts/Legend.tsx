import React = require("react");
import {connect} from 'react-redux';
import {iState} from './store';
import * as intf from './interfaces';
import * as act from './actions';
import Feature from 'ol/Feature';

class _Legend extends React.Component<{
    res: intf.iQueryResults,
    lyrChecked: { [s: string]: boolean },
    checkChange: (sev: string, chk: boolean) => any,
    selectedFeatures: Feature[]
}, {}> {

    render() {
        let rws = [<tr key="legend-table-head">
            <th/>
            <th>
                Severity
            </th>

            <th>
                Queried
            </th>
            <th>
                Mapped
            </th>
            <th>
                Selected
            </th>
        </tr>];

        let kCount = 0;
        let aCount = 0;
        let bCount = 0;
        let cCount = 0;
        let oCount = 0;

        for (let f of this.props.selectedFeatures) {


            switch (f.getProperties()['injSvr']) {
                case 'K':
                    kCount++;
                    break;
                case 'A':
                    aCount++;
                    break;
                case 'B':
                    bCount++;
                    break;
                case 'C':
                    cCount++;
                    break;
                case 'O':
                    oCount++;
                    break;
            }

            let props = f.getProperties();
            // console.log(props['injSvr'])
        }

        let lookup = {
            K: kCount,
            A: aCount,
            B: bCount,
            C: cCount,
            O: oCount
        };

        for (let i = 0; i < intf.crashSevList.length; i++) {
            let sv = intf.crashSevList[i];

            let resInfo = this.props.res[sv] as intf.iResultInner;

            if (!resInfo) {
                continue;
            }

            rws.push(<tr key={sv}>
                <td>
                    <input type="checkbox" checked={this.props.lyrChecked[sv]} onChange={(e) => {
                        this.props.checkChange(sv, e.target.checked);
                        // console.log(e.target.checked);
                    }}/>
                </td>
                <td>
                    {sv}
                </td>

                <td>
                    {resInfo.queried}
                </td>
                <td>
                    {resInfo.mapped}
                </td>
                <td>
                    {lookup[sv]}
                </td>
            </tr>)

        }

        return <div id="legend-table-container">
            <table id="legend-table">
                <tbody>
                {rws}
                </tbody>
            </table>
        </div>
    }
}

export const Legend = connect(
    (s: iState) => {
        return {
            res: s.queryResults,
            lyrChecked: s.layerChecked,
            selectedFeatures: s.selectedFeatures

        }
    },
    (dispatch) => {
        return {
            checkChange: (sev: string, chk: boolean) => {
                dispatch({type: act.SET_LYR_CHECKED, sev: sev, checked: chk} as act.iSetLayerChecked);
            }
        }
    }
)(_Legend);


