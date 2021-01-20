import { Assembly, Group, Operation } from "../assembly.js";
import {
    doAjaxThings,
    Div,
    Cellule,
    SelectItem,
    DownArrowStatus,
    Bouton
} from "../toolBox.js";

//PAGE CONSTRUCTION
const body = document.querySelector("body");
const btnConfirm = new Bouton('confirm');
const divMain = new Div("module", body);
const divContent = new Div("content", divMain);
divContent.id = "divContent";

// function initPage() {
//     addLoader();
//     setTimeout(() => {
//         const activeInput = document.querySelector(".active-input");
//         (activeInput) ? activeInput.focus(): false;
//         divMain.addEventListener("click", focusOnActiveInput);
//         upDateTracaPage()
//         removeLoader();
//     }, 1000);
// }

const buildTitleTopBar = function() {
    let titleTopBar = document.querySelector('.title-top')
    if (titleTopBar) {
        titleTopBar.remove();
    }
    titleTopBar = document.createElement('div');
    titleTopBar.classList.add('title-top');
    const divTitle = document.createElement('div');
    const title = "Mise en production des matières";
    divTitle.innerHTML = title.toUpperCase();
    divTitle.classList.add("title-font");

    titleTopBar.appendChild(divTitle)
    divMain.appendChild(titleTopBar);
}

/**
 *Construit la zone de texte qui clignote pour indiquer une instruction utilisateur
 *
 * @return {HTMLElement} 
 */
function builInstructionBar() {
    const divInstructions = document.createElement("div");
    divInstructions.classList.add("instructionsBar");
    const divInstructionText = document.createElement("div");
    divInstructionText.classList.add("fontWeightFlash");
    divInstructionText.id = 'instruction-text';
    divInstructions.appendChild(divInstructionText);
    return divInstructions;
}

/**
 *Change le texte en haut de l'écran
 *
 * @param {string} _text
 */
function changeInstructionText(_text) {
    const divIstructionText = document.getElementById('instruction-text')
    divIstructionText.innerHTML = _text;
}

/**
 *Construit une "left sidebar" dans le content
 *
 */
function builLeftSideBar() {
    let divLeftSideBarToDelete = document.querySelector('.leftSideBar')
    if (divLeftSideBarToDelete) {
        divLeftSideBarToDelete.remove();
    }
    const divLeftSideBar = document.createElement("div");
    divLeftSideBar.id = 'leftSideBar';
    divLeftSideBar.classList.add("leftSideBar");
    divContent.appendChild(divLeftSideBar);
}


////Main function
//initPage();
upDateTracaPage();

function addLoader() {
    const body = document.querySelector("body");
    const divLoader = document.createElement("div");
    divLoader.id = "loader";
    divLoader.classList.add("loader");
    body.appendChild(divLoader);
}

function removeLoader() {
    const loader = document.getElementById("loader");
    loader.remove();
}

function buildUser() {
    const divUser = document.createElement('div');
    divUser.id = 'div-user';
    const divUserName = document.createElement('div');
    divUserName.id = 'div-userName';
    const userName = document.getElementById('userName').innerHTML;
    divUserName.innerHTML = userName;
    const divRole = document.createElement('div');
    divRole.id = 'div-role';
    const role = document.getElementById('role').innerHTML;
    divRole.innerHTML = role;

    divUser.append(divUserName, divRole);

    return divUser;
}

function focusOnActiveInput(event) {
    if (event) {
        if (!(event.target.tagName === "BUTTON")) {
            const activeInput = document.querySelector(".active-input");
            (activeInput) ? activeInput.focus(): false;
        }
    } else {
        const activeInput = document.querySelector(".active-input");
        (activeInput) ? activeInput.focus(): false;
    }
}

function upDateTracaPage() {
    buildTitleTopBar();
    builLeftSideBar();
    divContent.appendChild(buildMatierialRecorder());
}

function buildMatierialRecorder() {
    const divMatiere = document.createElement('div');
    divMatiere.id = "recorder";

    const divARemplir = document.createElement('div');

    const divRefSapMatiere = document.createElement('div');
    divRefSapMatiere.id = 'ref-sap-material';
    const inputRefSap = document.createElement('input');
    inputRefSap.id = 'input-ref-sap';
    const lblRefSap = document.createElement('label');
    lblRefSap.innerHTML = 'Référence SAP';
    divRefSapMatiere.append(lblRefSap, inputRefSap);
    inputRefSap.onblur = () => {
        let divDesignation = document.getElementById('div-designation');
        if (divDesignation) {
            divDesignation.remove();
        }
        divDesignation = document.createElement('div');
        divDesignation.id = 'div-designation';
        const designation = document.createElement('div');
        designation.id = 'des-mat';
        const lblDesignation = document.createElement('label');
        lblDesignation.innerHTML = 'Designation matière : ';
        promListMatiere.then(listOfMaterials => {
            const matiere = listOfMaterials.find(matiere => matiere.ARTICLE == inputRefSap.value);
            designation.innerHTML = matiere['DESIGNATION SIMPLIFIEE'];
        })
        divDesignation.append(lblDesignation, designation);
        divRefSapMatiere.appendChild(divDesignation);
    }

    const divBatchNumber = document.createElement('div');
    const inputBatchNumber = document.createElement('input');
    inputBatchNumber.id = 'input-batch-number';
    const lblBatchNumber = document.createElement('label');
    lblBatchNumber.innerHTML = 'NUMERO DE LOT';
    divBatchNumber.append(lblBatchNumber, inputBatchNumber);

    const divPeremption = document.createElement('div');
    const inputShelflifeDate = document.createElement('input');
    inputShelflifeDate.type = 'date';
    inputShelflifeDate.id = 'input-shelflifeDate';
    const lblShelflifeDate = document.createElement('label');
    lblShelflifeDate.innerHTML = 'Date de péremption';
    divPeremption.append(lblShelflifeDate, inputShelflifeDate);

    const divNumberOfProducts = document.createElement('div');
    const inputNbOfProducts = document.createElement('input');
    inputNbOfProducts.type = 'number';
    inputNbOfProducts.id = 'input-number-of-products';
    const lblNumberOfProducts = document.createElement('label');
    lblNumberOfProducts.innerHTML = 'Nombre de produits';
    divNumberOfProducts.append(lblNumberOfProducts, inputNbOfProducts);

    divARemplir.append(divRefSapMatiere, divBatchNumber, divPeremption, divNumberOfProducts);

    inputBatchNumber.onchange = () => {
        checkIfComplete();
    }
    inputRefSap.onchange = () => {
        checkIfComplete();
    }
    inputShelflifeDate.onchange = () => {
        checkIfComplete();
    }
    inputNbOfProducts.onchange = () => {
        checkIfComplete();
    }
    btnConfirm.btn.onclick = () => {
        doAjaxThings(`../script/php/addMaterialsInProduction.php?articleSap=${inputRefSap.value}&batchNumber=${inputBatchNumber.value}&shelflifeDate=${inputShelflifeDate.value}&nbStickers=${inputNbOfProducts.value}`, 'text')
            .then(response => {
                const newWindow = window.open('../public/mag-stickers-matiere.php');
                newWindow.onload = () => {
                    const content = newWindow.document.getElementById('content');
                    content.appendChild(buildImpressStickers(Number.parseInt(response)));
                }
            });
    };
    divMatiere.append(divARemplir, btnConfirm.drawButton());
    return divMatiere;
}

const promListMatiere = doAjaxThings('../script/php/getMaterialsList.php?secteur=ASSEMBLAGE COMPOSITE', 'json');

function buildImpressStickers(firstId) {
    const divPageStickers = document.createElement('div');
    divPageStickers.id = 'sticker-conteneur';
    const nbOfStickers = document.getElementById('input-number-of-products').value;

    for (let index = 1; index <= nbOfStickers; index++) {
        let idMatiere;
        promListMatiere.then(listOfMaterials => {
            const refSap = document.getElementById('input-ref-sap');
            const matiere = listOfMaterials.find(matiere => matiere.ARTICLE == refSap.value);
            idMatiere = matiere['ID'];
        }).then(() => {
            const divSticker = document.createElement('div');
            divSticker.id = 'sticker';
            const qrCode = document.createElement('div');
            qrCode.id = 'qrcode';
            const divText = document.createElement('div');
            divText.id = 'human-reading';
            const matiere = document.createElement('div');
            matiere.id = 'matiere';
            const desMatiere = document.createElement('div');
            const refMatiere = document.getElementById('des-mat').innerHTML;
            desMatiere.innerHTML = `Désignation : ${refMatiere}`;
            const divBatch = document.createElement('div');
            const batchNumber = `lot : ${document.getElementById('input-batch-number').value}`;
            divBatch.innerHTML = batchNumber;
            const divDate = document.createElement('div');
            const shelfLifeDate = `Date lim : ${document.getElementById('input-shelflifeDate').value}`;
            divDate.innerHTML = shelfLifeDate;
            //récupérer l'ID du produit
            const idOfProduct = firstId + index - 1;
            const divId = document.createElement('div');
            const idText = `ID : ${idOfProduct}`;
            divId.innerHTML = idText;
            //QRCODE
            const textQrcode = `MAT ${idMatiere},${idOfProduct}`
            new QRCode(qrCode, { text: textQrcode, width: 50, height: 50 });


            divText.append(divId, desMatiere, divBatch, divDate);
            divSticker.append(qrCode, divText);

            divPageStickers.appendChild(divSticker);
        })
    }
    return divPageStickers;

}

function checkIfComplete() {
    const inputBatchNumber = document.getElementById('input-batch-number');
    const inputRefSap = document.getElementById('input-ref-sap');
    const inputShelflifeDate = document.getElementById('input-shelflifeDate');
    const inputNbOfProducts = document.getElementById('input-number-of-products');

    if (inputBatchNumber.value != "" && inputRefSap.value != "" && inputShelflifeDate.value != "" && inputNbOfProducts.value != "") {
        //btn CONFIRM ACTIVATE
        btnConfirm.setEnable()
    } else {
        //ERROR
        btnConfirm.setDisable()
    }
}