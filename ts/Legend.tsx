import React = require("react");
import {connect} from 'react-redux';
import {iState} from './store';
import * as intf from './interfaces';
import * as act from './actions';

class _Legend extends React.Component<{
    res: intf.iQueryResults,
    lyrChecked: {[s: string]: boolean},
    checkChange: (sev: string, chk: boolean) => any
}, {}> {

    render() {
        let rws = [<tr key="legend-table-head">
            <th/>
            <th>
                Severity
            </th>
            <th>
                Mapped
            </th>
            <th>
                Queried
            </th>
        </tr>];

        for (let sv of intf.crashSevList) {

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
                    {resInfo.mapped}
                </td>
                <td>
                    {resInfo.queried}
                </td>
            </tr>)

        }

        return <table id="legend-table">
            <tbody>
            {rws}
            </tbody>
        </table>
    }
}

export const Legend = connect(
    (s: iState) => {
        return {
            res: s.queryResults,
            lyrChecked: s.layerChecked
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


