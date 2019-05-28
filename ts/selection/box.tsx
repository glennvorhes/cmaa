

import React = require("react");
import {connect} from "react-redux";
import {iState} from "../store";
import {SelectionControl} from './selectionLayer';


class _Box extends React.Component<{}, {}>{

    render() {
        return <SelectionControl top={0} title="Select by Box"/>
    }
}

export const Box = connect(
    (s: iState) => {
        return {}
    },
    (dispatch) => {
        return {}
    }
)(_Box);

class _Line extends React.Component<{}, {}>{

    render() {
        return <SelectionControl top={110} title="Select by Line"/>
    }
}

export const Line = connect(
    (s: iState) => {
        return {}
    },
    (dispatch) => {
        return {}
    }
)(_Line);


class _Poly extends React.Component<{}, {}>{

    render() {
        return <SelectionControl top={27} title="Select by Polygon"/>
    }
}

export const Poly = connect(
    (s: iState) => {
        return {}
    },
    (dispatch) => {
        return {}
    }
)(_Poly);


