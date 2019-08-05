import $ = require("jquery");
import * as cnst from './constants';


export function getCrashInfo(crsh: string, container?: HTMLDivElement) {

    $.get(cnst.GP_GET_CRASH_PROPS,
        {docNumber: crsh, f: 'json'},
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
                outHtml += `<tr>`;
                outHtml +=  `<td style="border: solid black 1px">${p}</td>`;

                let propVal = crashProps[p] || '';

                if (p === 'DOCTNMBR' && cnst.allowCrashReportDownload){
                    propVal += `&nbsp;<a href="${cnst.CRASH_REPORT_DOWNLOAD + crashProps[p]}" download="download" class="crash-download"/>`
                }

                outHtml +=  `<td style="border: solid black 1px">${propVal}</td>`;
                outHtml +=  `</tr>`;
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