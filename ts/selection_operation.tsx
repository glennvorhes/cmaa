import React = require("react");
import {connect} from "react-redux";
import {iState} from "./store";
import * as act from './actions';

class _Operation extends React.Component<{ selected: string, changed: (s: string) => any }, {}> {

    render() {
        return <ul id="selection-operation">
            <li>
                <label htmlFor="selection-operation-union">Union</label>
                <input id="selection-operation-union" type="radio" name="selection-operation"
                       checked={this.props.selected === act.OPERATION_UNION}
                       onChange={() => {
                           this.props.changed(act.OPERATION_UNION);
                       }
                       }/>
            </li>
            <li>
                <label htmlFor="selection-operation-subset">Subset</label>
                <input id="selection-operation-subset" type="radio" name="selection-operation"
                       checked={this.props.selected === act.OPERATION_SUBSET}
                       onChange={() => {
                           this.props.changed(act.OPERATION_SUBSET);
                       }
                       }/>

            </li>
            <li>
                <label htmlFor="selection-operation-remove">Remove</label>
                <input id="selection-operation-remove" type="radio" name="selection-operation"
                       checked={this.props.selected === act.OPERATION_REMOVE}
                       onChange={() => {
                           this.props.changed(act.OPERATION_REMOVE);
                       }
                       }/>
            </li>
        </ul>
    }
}

export const Selection_operation = connect(
    (s: iState) => {
        return {
            selected: s.operation
        };
    },
    (dispatch) => {
        return {
            changed: (s: string) => {
                dispatch({type: act.SET_OPERATION, operation: s} as act.iSetOperation)
            }
        };
    }
)(_Operation);




