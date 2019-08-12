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

            // let propOrder = ["DOCTNMBR", "CRSHDATE", "CNTYNAME", "MUNINAME", "MUNITYPE",
            //     "ONHWY", "ONSTR", "ATHWY", "ATSTR", "INTDIR", "INTDIS", "INJSVR", "TOTVEH", "TOTINJ",
            //     "TOTFATL", "CMAALAT", "CMAALONG"];

            let propOrder = ["DOCTNMBR", "CRSHDATE", "CNTYNAME", "MUNINAME", "MUNITYPE",
                "ONHWY", "ONSTR", "ATHWY", "ATSTR", "INTDIR", "INTDIS", "INJSVR", "TOTVEH",
                // "TOTINJ", "TOTFATL",
                "TOTINJ_K", "TOTINJ_A", "TOTINJ_B", "TOTINJ_C", "TOTINJ_O", "MNRCOLL",
                "CMAALAT", "CMAALONG"];

            let crashProps = resultObj['props'];

            // let outHtml = '<div class="crash-attribute-table-container">';
            let outHtml = '<table class="crash-attribute-table" style="border-collapse: collapse">';

            for (let p of propOrder) {
                outHtml += `<tr>`;
                outHtml += `<td>${p}</td>`;

                let propVal = crashProps[p] || '';

                if (typeof crashProps[p] === 'number' && crashProps[p] === 0){
                    propVal = 0;
                }

                if (p === 'DOCTNMBR' && cnst.allowCrashReportDownload) {
                    propVal += `&nbsp;<a href="${cnst.CRASH_REPORT_DOWNLOAD + crashProps[p]}" download="download" class="crash-download"/>`
                }

                outHtml += `<td>${propVal}</td>`;
                outHtml += `</tr>`;
            }
            outHtml += '</table>';

            if (container) {
                container.innerHTML = outHtml
            }


            return outHtml;

        },
        'json');
}