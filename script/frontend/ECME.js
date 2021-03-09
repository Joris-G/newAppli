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
const promECMEType = doAjaxThings(`../script/php/getECMEToolTypeList.php`, 'json');
promECMEType.then(toolTypeList => {
    promECME.then(listECME => {
        listECME.forEach(ECME => {
            const divECME = document.createElement('div');
            const divQrCode = document.createElement('div');
            divECME.classList.add('divECME');
            const idType = ECME.TYPE_ID;
            const idECME = ECME.ID;
            const txtQrCode = `CTRL-TOOL ${idType},${idECME}`;
            const divTxtHuman = document.createElement('div');
            const divTextRef = document.createElement('div');
            const txtRef = `${ECME.REFERENCE}`;
            divTextRef.innerText = txtRef
            const divTextDes = document.createElement('div');
            const tooltype = toolTypeList.find(type => type.ID === ECME.TYPE_ID);
            const txtType = tooltype.TYPE;
            divTextDes.innerText = txtType;
            divTxtHuman.append(divTextRef, divTextDes);
            divTxtHuman.classList.add('txt-human');
            new QRCode(divQrCode, { text: txtQrCode, width: 75, height: 75 });
            divECME.append(divQrCode, divTxtHuman);
            document.querySelector('body').appendChild(divECME);
        });
    });
});