import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import React = require("react");


const iconString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAACICAMAAADH0avOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAABoaGiMiIygnKSoqKy8uMDQ0NDg3ODs7PD8/QD5VWjVcZDldZDtgaDRvejJyfj50fkNDREdGSEtLTENOUU5OUERQVE5VV1NTVFVWWFVZW1pbW0FeZF1fYEVmbEVob0xkaU1pb0Rud09tckVweEl2flVhZFNmalJpbV1gYl1maV1obGBfYGNjZGZmaGdoaWtrbGFvcm9vcGdydGF3e2xxcnBvcHNzdHZ2eHh3eXt7eyZ8jCtzgC5+jTV9izp2gTh4hDt9iUV5g0N+iVF4gH9/gB2HmhyJnReMoRiMoRCTqxmTqRyYrhucsxWiuxqiuyWJnCiElSuKnDGEkzeImDuGlTuLmiSOoSiOoSORpSKZriyZrTSSojudrjGesjqesCamvCqgtC2muzKgswilwQywzQC21wO83Q6z0Q241gq62RanwRWpxBGtyRmnwBipwx2vyRCxzhO10RS51xS92xq20gC/4SOsxSiswyKyyzmswDW70xHA3wPD5AHG6QHJ7QzC4wjH6QjK7ALN8QvN8AHQ9ALT+BnM6xbS8ybV8zbI4jfV8UKBjEGHlEiMmFKDjFiCilCHkFqJkUGTolefrEWoukultVagrVCjslyquG+Ag2yMkm+Xn3aFiH+DhHWXnn2Wm2WapG2aoniepFazxEjN5UvZ8lzR5lLa8mXH2XfI1n/N23PT5XjV5njd74ODg4OHiIaGiImJiYqKjIuMjYyLjI2Njo+PkIeYm42SlI2ZnJCPkJGRkZOTlJSTlJWVlZaXmJeYmZmZmZubnJucnJybnJ2dnZ+foIOkqoyqsJukp5+goJ2ipJOvs5qxtaGhoaOjpKOkpKSjpKWlpaemqKWpq6urrK6vsKC0t66ytKi3uqy5vLCvsLGxsbGztLO0tLW1tbe3uLW7vLi3uLm5ubu8vL29vYG9yL6/wJ7DyZnM1YbZ6MLCw8PJy8vLy8/P0MvV2NHR0dPT1NPU1NTT1NXV1dnZ2dzb3N3d3d7f4ODf4OPj4+rq6vX19fn5+QAAAPbjxMAAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xLjb9TgnoAAAG8ElEQVRYR92Xe5TcVB3Hdc84jg/EIazMElfwiYvNNorbLPFF0YoVh62ttKe2Vq3WHnE9qz0L+JqdtXvWByBV8IFyFK0vVPRKVgZbUlKmNT4Qok29WDFtukyjaLg11Azx3Dy8eWz33u3qn55jv3/MZO5nfkkm937v9zdPSv6r/lfYV2eUOxX1fsO4X9dbnWwsx4GFk8QdWLN69XIB2rY92xHbGcix2296oXvBlmsaoxd1o5gI7M1AjjuVXhWhr403mtt2PBbGcYSHtQwUuGrLw8Zj3/90c/I9u4M40BWePrldfQLp4KeP3nH99vGbDnWghSS62q7iqHsQzDzwo9s/s3nnLiOI5XszkOPDT8NxHHYk+Td/u/2z77zVjmNZzUCOrQrBcehfzIN//OS6WyDBdPWhCo4iXxa58lP5h3/81Z9HEVMNywF0PJmXFbDH/ft3dgahxODSAXFFB3Laoz/8wR3f+/hXOli6JwMF7uF5oRXw4C/f/fCWLfXPAVtgqp9cOSDzPhTB786qElUqVfp3w579j0MJYFE62rFgpuMZyLGzFJH5rPq6NIMLZeMF7s6SlyOcpvT1B9nAnHKcyVO4Wq/oF59yUThBlSXwX8VxIRpj5BWXPCkaL6LTBHd93z/he5nyJ8Bgie+rEfVyHNerZyMMFteNfnD0Auj73a5E26DQ0npjonHpbBhHwTDtsUKDIxPN5toH/a5jizQuZkIYaU413/0raAI4SC0mWzYfT9+Fkanp6fEdYgvHMoXhUPtnM7pzYmDsisu2T137hT0RYyIoH3egaeznV7/mmW/dNrn5Np9xCZwhhj9x7Je11z574Otv+8DYLTAcZjFRhPlVVyo+uHT9O1RMm2gO949tasWRMXC23JXuXojj8MIzzm+Rt2Nypa9KV5NBUh3+dpekEGwJPaWzqGf+UIbJo+zukzEO9nJcn0xte0U1kSloWgB54LjdeXworyZfUEvlsuPdxc9ZKa++O4dRpJQlTvMeqdq0Ba1hs5DIuy0RgJKWnzvH6L779uZSzeSEUBOFdAtOlWFWmmyGxeFimNZpgq3fk5AydH1/u6272QiDh150ySWvO3cYEPUv5rH6NY2tL3TTpKLX+ZwG641m44Y/4ThCCy2IHV3l6xNTzY0PIFczBdaC2FR1k798a3Pq2tv27IdsUJGgA22vK6x875apyZtf2QpjeU82PIcV049C4fLLXv3+qfGbd7EeIxKcKA4HRtadfcYVn/zot1w2iRJXQlGEl4xukP7whlUjXzIYEyUe0AOy/vmxTUoIb12+XGEwtiRENpRwYN2VZEk73+gXTIHymNuCJLTjcKivL13xHig9pULvDiAkDzKK3FmFeAy3az09nDmPLTVrCKIQG5Lr4l9wokLPmAU8HKYmiXROko53RAn51KbpKDp0UDeMQlDiKvCfeg1lsMAJ0i4WBYBCJFZUHrjHymbhwRyTzqXraqIq8RI+wvfxPS3aY7l82zQhSrDEA9MrxihMvtBNb6gD87tOxeBTdZrgOyUx1aAgCIMwG2GwuKZef/tL9nUcx3nFfwqqF89GZO+WFw2qRnNi7R+72HOYVjIXzoJqw687UNIF1kRIkyW5903vm5i++iZZ9ULGwGFHUY0jFr/yzSu3bt+8gyw9xiWuojpBiAfqb3zGqqs+sembQURb0Ndln6xVLIytr7189bYPfdFmgsoCbkR+TciPblKOi2e+5WMaG1SZDTKPtaJg9/OfCwK627PU3AUXPusFxERPwCFO4uiTaymOw12ymAZVZ1lPqUptXFAhlyYe8z2NXIYEVaUqWPPYAii9NjHRQRGa2OAU28n7tgwjDWBy54Rr5SrnIiD4RVxkOHFBO/V/6rFaVfceqjpM1GBL0aDjdhyJM2SprZX1BR5zWrIM5LaiJmgJx1f1UzyGfdTN+k8gtItT0/ikgsL6qRbBtP5fsHusQ3SU/Gc6bOe7C4Ol888773nnCqK4VOxbNKi2Nq56KVl3UbRi8aCaaLz+YbJ/+kxQoXyGsmZw44MIQcg0gwiY6eogHptuvuvbhtF2RObkrgTJFAojE43p8RsvSptBNqhcmcyiMFZ/1eSnrr5xoceIHFXz+LH1Tz9zdPIjO9GCoEqXm+zyYxvE3TfUR74M2b9M5OaMu3SUeixof37N2habY+TWV0Ac9tc33hNHfx46Z9lfRRrbQiuNh5c95xxiojSoKhUKY7gk68AOm4BYEJs8CaoDKSiqkaqm1Ri3ZdK47+N4SWFaCwT0LHyMGgC+Jcguyn1Q4AQpWjrDrVKlfNTXanN/nOZwgloKubxSBpziuRVYLPWTOEEOedFF3xDEZaV7i/J5nPXwyE6CZTUJuKdUn9RB9ZHiaFE8ryT5N/1Xe5GNBjIWAAAAAElFTkSuQmCC';


export const selectionLayer: VectorLayer = new VectorLayer({
    source: new VectorSource()
});

export function seletionLayerSetup(map: Map){
    map.addLayer(selectionLayer);
}

export class SelectionControl extends React.Component<{top: number,
title: string}, {}> {

    render() {
        return <div className="toolbar-button" style={{
            backgroundPosition: `0 -${this.props.top}px`
        }} title={this.props.title}>

        </div>
    }
}







