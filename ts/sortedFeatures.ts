/**
 * Created by gavorhes on 12/23/2015.
 */
import Feature from 'ol/Feature';

export class SortedFeatures {
    sortedFeatures: Feature[];
    propertyName: string;
    _propertyType: string;

    constructor(features: Feature[], propertyName: string) {
        this.sortedFeatures = features;
        this.propertyName = propertyName;

        if (this.sortedFeatures.length > 0) {
            this._propertyType = typeof this.sortedFeatures[0].getProperties()[this.propertyName];

            this.sortedFeatures.sort( (a: Feature, b: Feature) : number =>{
                if (this._propertyType == 'number'){
                    let aMinusB = a.getProperties()[this.propertyName] - b.getProperties()[this.propertyName];
                    if (aMinusB == 0){
                        return 0;
                    } else {
                        return aMinusB > 0 ? 1 : -1;
                    }
                } else if (this._propertyType == 'string'){
                    let propA = a.getProperties()[this.propertyName] || '';
                    let propB = b.getProperties()[this.propertyName] || '';
                    propA = propA.toString().trim();
                    propB = propB.toString().trim();

                    if (propA == propB){
                        return 0;
                    } else {
                        return propA > propB ? 1 : -1;
                    }
                }
            });
        }
    }

    getFeature(propertyValue: number|string, exactMatch: boolean = false, sortedFeatures? :Feature[]): Feature {



        if (typeof sortedFeatures == 'undefined'){
            sortedFeatures = this.sortedFeatures;
        }

        if (sortedFeatures.length === 0){
            return undefined;
        }

        if (sortedFeatures.length == 1){
            if (exactMatch){
                if (sortedFeatures[0].getProperties()[this.propertyName] == propertyValue){
                    return sortedFeatures[0];
                } else {
                    return undefined;
                }
            } else {
                return sortedFeatures[0];
            }
        }


        let lowProp = sortedFeatures[0].getProperties()[this.propertyName];
        let highProp = sortedFeatures[sortedFeatures.length - 1].getProperties()[this.propertyName];

        if (exactMatch){
            if (lowProp == propertyValue){
                return sortedFeatures[0];
            } else if (propertyValue < lowProp){
                return undefined;
            } else if (highProp == propertyValue){
                return sortedFeatures[sortedFeatures.length - 1];
            } else if (propertyValue >  highProp){
                return undefined;
            }
        } else {
            if (propertyValue <= lowProp){
                return sortedFeatures[0];
            } else if (propertyValue >= highProp){
                return sortedFeatures[sortedFeatures.length - 1];
            }
        }

        let midIndex = Math.floor(sortedFeatures.length / 2);
        let midFeature = sortedFeatures[midIndex];
        let midProperty = midFeature.getProperties()[this.propertyName];

        if (midProperty ===  propertyValue){
            return midFeature;
        }

        if (propertyValue < midProperty){
            return this.getFeature(propertyValue, exactMatch, sortedFeatures.slice(0, midIndex));
        } else {
            return this.getFeature(propertyValue, exactMatch, sortedFeatures.slice(midIndex, sortedFeatures.length));
        }
    }
}

// nm.SortedFeatures = SortedFeatures;
export default SortedFeatures;

