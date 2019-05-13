import 'webmapsjs/dist/import-queryui';
import $ = require("jquery");
import Map from 'ol/Map'

let duration = 200;

export function accordionSetup(map: Map) {

    let $accordion = $('#accordion');

    $accordion.accordion({heightStyle: 'fill'});

    window.onresize = () => {
        $accordion.accordion('refresh');
    };

    let hider = document.getElementById("hider");
    let shower = document.getElementById("shower");
    let $accordionContainer = $('#accordion-container');
    let $accordionContainerCollapsed = $('#accordion-container-collapsed');


    hider.onclick = () => {
        $accordionContainer.hide(
            "slide",
            {direction: "left"},
            duration,
            () => {
                $accordionContainerCollapsed.show(
                    "slide",
                    {direction: "left"},
                    duration,
                    () => {
                        map.updateSize();
                        $accordion.accordion('refresh');
                    })
            });
    };

    shower.onclick = () => {
        $accordionContainerCollapsed.hide(
            "slide",
            {direction: "left"},
            duration,
            () => {
                $accordionContainer.show(
                    "slide",
                    {direction: "left"},
                    duration,
                    () => {
                        map.updateSize();
                        $accordion.accordion('refresh');
                    }
                )
            });
    };
}

