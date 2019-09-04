import React = require("react");
import {connect} from "react-redux";
import {iState} from "./store";
import {loadingGif64, totalRecords} from './constants';

class _Loading extends React.Component<{ loading: boolean }, {}> {


    render() {
        let show = this.props.loading ? '' : 'none';

        // show = '';

        let messageSpan = <span/>;

        if (totalRecords > 50000){
            messageSpan = <span style={
                {
                    display: 'block',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.65)',
                    borderRadius: '7px',
                    maxWidth: '95px',
                    border: 'solid black 1px'
                }
            }>Loading may take up to 2 minutes</span>
        }

        return <div className="loading-gif-container" style={{display: show}}>
            <img className="loading-gif" height="100"
                 src={loadingGif64}/>
            {messageSpan}

        </div>
    }
}

export const Loading = connect(
    (s: iState) => {
        return {
            loading: s.loading
        }
    }
)(_Loading);
