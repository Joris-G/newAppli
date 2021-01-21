import {
    doAjaxThings,
    Div,
    Cellule,
    SelectItem,
    DownArrowStatus,
    Bouton
} from "../toolBox.js";


//PAGE CONSTRUCTION
const content = document.querySelector(".content");

const promECME = doAjaxThings(`../script/php/getECMEToolList.php?`, 'json');


promECME.then(listECME => {
    listECME.forEach(ECME => {
        const divECME = document.createElement('div');
        const divQrCode = document.createElement('div');
        const divTextQrCode = document.createElement('div');
        divECME.classList.add('divECME');
        const idType = ECME.TYPE_ID;
        const idECME = ECME.ID;
        const txtQrCode = `CTRL-TOOL ${idType},${idECME}`;
        const txtHuman = `${ECME.REFERENCE}`;
        new QRCode(divQrCode, { text: txtQrCode, width: 75, height: 75 });
        divTextQrCode.innerText = txtHuman;
        divECME.append(divQrCode, divTextQrCode);
        content.appendChild(divECME);
    });
});