import 'webmapsjs/dist/import-queryui';
import $ = require("jquery");
import Map from 'ol/Map'

let transitionTime = 200;

function updateMapSize(map: Map) {
    setTimeout(() => {
        map.updateSize()
    }, 2 * transitionTime + 10);
}

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

    hider.onclick = () => {
        accordionContainer.classList.add('collapsed');

        setTimeout(() => {
            accordionContainerCollapsed.classList.remove('collapsed');
        }, transitionTime);

        updateMapSize(map);
    };

    shower.onclick = () => {
        accordionContainerCollapsed.classList.add('collapsed');
        accordionContainer.style.display = 'block';

        setTimeout(() => {
            accordionContainer.classList.remove('collapsed');
        }, transitionTime);

        updateMapSize(map);
    };
}

