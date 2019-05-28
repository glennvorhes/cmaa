import $ = require("jquery");



export function getCrashInfo(crsh: number, container?: HTMLDivElement) {

    $.get('https://transportal.cee.wisc.edu/applications/arcgis2/rest/services/crash/GetCrashProps/GPServer/GetCrashProps/execute',
        {crashNumber: crsh, f: 'json'},
        (d) => {
            let resultObj = {};

            for (let r of d.results) {
                resultObj[r['paramName']] = r['value']
            }

            if (resultObj['error']) {
                alert(resultObj['error']);
                return;
            } else if (!resultObj['success']) {
                alert('Unknown request error');
                return;
            }

            let propOrder = ["DOCTNMBR", "CRSHDATE", "CNTYNAME", "MUNINAME", "MUNITYPE",
                "ONHWY", "ONSTR", "ATHWY", "ATSTR", "INTDIR", "INTDIS", "INJSVR", "TOTVEH", "TOTINJ",
                "TOTFATL", "CMAALAT", "CMAALONG"];

            let crashProps = resultObj['props'];

            let outHtml = '<table style="border-collapse: collapse">';

            for (let p of propOrder) {
                outHtml += `<tr><td style="border: solid black 1px">${p}</td><td style="border: solid black 1px">${crashProps[p] || ''}</td></tr>`;
            }
            outHtml += '</table>';

            if (container){
                container.innerHTML = outHtml
            }


            return outHtml;

            // (document.getElementById('selection-info') as HTMLDivElement).innerHTML = outHtml;
        },
        'json');
}