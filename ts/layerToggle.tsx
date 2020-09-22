import React = require("react");
import * as cnst from './constants';
import {crashSevList} from './interfaces';

export class LayerToggle extends React.Component<{ layerChecked: { [s: string]: boolean }, clusterShown: (s: boolean) => any }, { showCluster: boolean }> {

    constructor(p, c) {
        super(p, c);
        this.state = {showCluster: false}
    }

    render() {
        return <input className="toolbar-button toggle-cluster" readOnly={true}
                      title={`Cluster Toggle - ${this.state.showCluster ? 'Clusters Shown' : 'Points Shown'}`}
                      style={{backgroundPosition: this.state.showCluster ? '2px 2px': '-30px 2px'}}
                      onClick={
                          () => {
                              let newShowCluster = !this.state.showCluster;

                              if (newShowCluster) {
                                  cnst.clusterLayer.setVisible(true);
                                  cnst.crashPointsK.setVisible(false);
                                  cnst.crashPointsA.setVisible(false);
                                  cnst.crashPointsB.setVisible(false);
                                  cnst.crashPointsC.setVisible(false);
                                  cnst.crashPointsO.setVisible(false);
                                  cnst.selectionLayer.setVisible(false);
                              } else {
                                  cnst.clusterLayer.setVisible(false);
                                  cnst.selectionLayer.setVisible(true);

                                  for (let s of crashSevList) {
                                      cnst.crashLayerDict[s].setVisible(this.props.layerChecked[s])
                                  }
                              }

                              this.props.clusterShown(newShowCluster);
                              this.setState({showCluster: newShowCluster});
                          }
                      }
        />
    }
}


