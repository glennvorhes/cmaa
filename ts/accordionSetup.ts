import 'webmapsjs/dist/import-queryui';
import $ = require("jquery");
import Map from 'ol/Map'

let transitionTime = 200;

export function accordionSetup(map: Map) {

    let $accordion = $('#accordion');

    $accordion.accordion({heightStyle: 'fill'});

    window.onresize = () => {
        $accordion.accordion('refresh');
    };

    let hider = document.getElementById("hider") as HTMLDivElement;
    let shower = document.getElementById("shower") as HTMLDivElement;
    let accordionContainer = document.getElementById("accordion-container") as HTMLDivElement;
    let accordionContainerCollapsed = document.getElementById("accordion-container-collapsed") as HTMLDivElement;

    let startTime: Date = null;
    let timeOut: number = null;

    hider.onclick = () => {
        startTime = new Date();

        accordionContainer.classList.add('collapsed');

        setTimeout(() => {
            accordionContainerCollapsed.classList.remove('collapsed');
        }, transitionTime);

        timeOut = setInterval(() => {
            map.updateSize();
            if ((new Date()).getTime() - startTime.getTime() > 2 * transitionTime + 10) {
                clearInterval(timeOut);
            }
        }, 1)
    };

    shower.onclick = () => {
        startTime = new Date();

        accordionContainerCollapsed.classList.add('collapsed');
        accordionContainer.style.display = 'block';

        setTimeout(() => {
            accordionContainer.classList.remove('collapsed');
        }, transitionTime);

        setTimeout(() => {
            $accordion.accordion('refresh');
        }, 2 * transitionTime);

        timeOut = setInterval(() => {
            map.updateSize();
            if ((new Date()).getTime() - startTime.getTime() > 2 * transitionTime + 10) {
                clearInterval(timeOut);
            }
        }, 1)
    };
}
