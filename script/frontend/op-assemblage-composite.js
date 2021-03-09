import NavMenu from "../menu.js";
import { Assembly, Group, Operation } from "../assembly.js";
import {
    doAjaxThings,
    Div,
    Cellule,
    SelectItem,
    DownArrowStatus,
    Bouton,
    addLoader,
    removeLoader,
} from "../toolBox.js";

//AJAX START REQUESTS
//const promToolList = doAjaxThings('../script/php/getToolList.php?secteur=3', 'json');
//const promECME = doAjaxThings('../script/php/getECMEToolList.php?', 'json');
//const promAllOpenMaterials = doAjaxThings('../script/php/getAllOpenMaterials.php', 'json');
//const promListMatiere = doAjaxThings('../script/php/getMaterialsList.php?secteur=ASSEMBLAGE COMPOSITE', 'json');
//PAGE CONSTRUCTION
const body = document.querySelector("body");
const newAssembly = new Assembly();
const divPrepAssy = new Div("module", body);
const divContent = new Div("content", divPrepAssy);
divContent.id = "divContent";
const inputScan = buildScanInputArea();

function buildScanInputArea() {
    const scanInput = document.createElement("input");
    scanInput.id = 'input-scan';
    scanInput.classList.add("hidden");
    scanInput.classList.add("active-input");
    return scanInput;
}

function initPage() {
    addLoader();
    new NavMenu(body);
    body.appendChild(inputScan);
    setTimeout(() => {
        changeInstructionText(`Scanner le QR Code OF`);
        const activeInput = document.querySelector(".active-input");
        (activeInput) ? activeInput.focus(): console.error(`not active input`);
        divPrepAssy.addEventListener("click", focusOnActiveInput);
        removeLoader();
    }, 1000);
    const promWorkOrder = new Promise((resolve, reject) => {
        inputScan.onchange = function() {
            const scanProcessing = scanProc(this.value);
            inputScan.classList.remove("active-input");
            divPrepAssy.removeEventListener("click", focusOnActiveInput);
            // test si le résultat du scan est un OF
            if (scanProcessing.TYPE == 'OF') {
                resolve(scanProcessing.DATA);
            } else {
                reject();
            }
            inputScan.value = "";
        };
    });
    promWorkOrder
        .then((workOrder) => {
            newAssembly.loadAssembly(workOrder)
                .then(() => {
                    console.log(newAssembly);
                    newAssembly.upDateTracaPage();
                })
                //afterScanIdFac();
        }).catch(e => {
            console.error(e);
            alert(`SCAN: ${e}\n\ nLe QR code scanné ne correspond pas à un numéro d 'OF conforme. \nRecommencer l'opération.`);
        });
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

////IDFAC
const divGetIdFac = new Div("truc", divContent);
divGetIdFac.id = 'input-idFac';
divContent.appendChild(divGetIdFac);
const inputFacId = document.createElement("input");
inputFacId.classList.add("hidden");
divGetIdFac.appendChild(inputFacId);

////MATERIAL
const inputMaterialTraca = document.createElement("input");
inputMaterialTraca.id = "inputMaterial";


const promIdFac = new Promise((resolve, reject) => {
    inputFacId.onchange = function() {
        if (IdFac.checkValue(this.value)) {
            resolve(this.value);
        } else {
            reject(this.value);
        }
        inputFacId.value = "";
    };
});

////Main function
initPage();

function afterScanIdFac() {
    promIdFac.then((idFac) => {
        newAssembly.showOperation(operation);
    });
}

/**
 *
 *
 * @param {Array} nomTraca
 * @param {number} idTraca
 * @return {Object} 
 */
const findOpe = function(nomTraca, idTraca) {
    let operation;
    nomTraca.forEach((group) => {
        group.items.forEach((item) => {
            if (item.ID == idTraca) {
                operation = item;
            }
        });
    });
    return operation;
}

/**
 *
 *
 * @param {Array} nomTraca
 * @param {number} idTraca
 * @return {number} 
 */
const findGroup = function(nomTraca, idTraca) {
    let groupe = 0;
    nomTraca.forEach((group) => {
        group.items.forEach((item) => {
            if (item.ID == idTraca) {
                groupe = item.GROUPE;
            }
        });
    });
    return groupe;
}
class TracaOFRecorder {
    constructor(_tracaDatas) {
        this.tracaDatas = _tracaDatas;
        this.allPartToRecord = [];
        this.buildObject();
        this.allScanOF = [];
    }

    inputToFill(_workOrder) {
        let result = null;
        this.allPartToRecord.forEach(currentItem => {
            if (currentItem.article == _workOrder.article) {
                const itemID = this.tracaDatas.find(item => item.ARTICLE == currentItem.article);
                result = document.getElementById(`${itemID.ID}`);
            }
        });
        return result;
    }
    buildObject() {
        this.tracaDatas.forEach(part => {
            this.allPartToRecord.push({ 'article': part.ARTICLE, 'quantite': part.QUANTITE, 'idNomTracaOf': part.ID });
        })
    }
    addOf(_workOrder) {
        let msg = "";
        const isPartOfOperation = () => {
            let result = false;
            this.allPartToRecord.forEach(currentItem => {
                if (currentItem.article == _workOrder.article) {
                    result = true;
                }
            });
            return result;
        }
        if (isPartOfOperation()) {
            const selectPart = function(part) {
                return part.article === _workOrder.article;
            }
            const part = this.allPartToRecord.find(selectPart);
            console.log(part);
            if (part.workOrder === undefined) {
                part.workOrder = [_workOrder.workOrder];
                msg = "";
                this.inputToFill(_workOrder).innerHTML = part.workOrder;
                //VERIFIE SI DERNIERE PIECE
                if (part.workOrder.length == parseInt(part.quantite)) {
                    this.inputToFill(_workOrder).parentElement.classList.add('full');
                }
                this.allScanOF.push([_workOrder.workOrder, part.idNomTracaOf])
            } else if (part.workOrder.length < parseInt(part.quantite)) {
                part.workOrder.push(_workOrder.workOrder);
                msg = "";
                this.inputToFill(_workOrder).innerHTML = part.workOrder;
                //VERIFIE SI DERNIERE PIECE
                if (part.workOrder.length == parseInt(part.quantite)) {
                    this.inputToFill(_workOrder).parentElement.classList.add('full');
                }
                this.allScanOF.push([_workOrder.workOrder, part.idNomTracaOf])
            } else if (part.workOrder.length == parseInt(part.quantite)) {
                msg = `Vous avez déjà scanné suffisemment d'article de cette référence`;
            }
        } else {
            msg = "La référence que vous avez scannée n'appartient pas à l'assemblage";
        }
        if (msg != "") {
            alert(msg);
        }
    }
}

class Matiere {
    constructor(scanInput) {
        this.scanProcessing = scanProc(scanInput);
        this.article = this.scanProcessing[1][0];
        this.shelflifeDate = new Date(this.scanProcessing[1][2]);
        this.batchNumber = this.scanProcessing[1][1];
    }
    isMaterial() {
        if (this.scanProcessing[0] === "MAT") {
            return true;
        } else {
            return false;
        }
    }
    associateMaterialToIdFac() {
        //Ajouter check article
        if (this.checkShelfLifeDate()) {
            this.saveEntryMaterial();
        }
    }
    saveEntryMaterial() {}
    checkShelfLifeDate() {
        if (Date.parse(this.shelflifeDate) < new Date()) {
            setTimeout(() => {
                window.alert("Produit périmé");
            }, 300);
            return false;
        } else {
            console.log("true");
            return true;
        }
    }
    checkOpenLifeDate() {

    }
}
class IdFac {
    constructor(_scanInput) {
        this.scanInput = _scanInput;
    }
    static checkValue(scanInput) {
        return true;
    }
}



function testScore(opScore, nbOfObjectToTrace) {
    if (opScore == nbOfObjectToTrace) {
        return true;
    } else {
        return false;
    }
}

class SanctionChoice {
    constructor() {
        this.sanction = [];
    }
    buildSanctionChoice() {
        const divSanctionChoice = document.createElement('div');
        divSanctionChoice.id = 'sanction-choice';
        const btnCompliant = document.createElement('div');
        btnCompliant.id = 'btn-compliant';
        btnCompliant.classList.add('rect-button');
        btnCompliant.innerHTML = 'CONFORME';
        btnCompliant.onclick = () => {
            if (btnCompliant.classList.contains('btn-compliant-selected')) {
                btnCompliant.classList.remove('btn-compliant-selected');
            } else {
                btnCompliant.classList.add('btn-compliant-selected');
            }
            btnNotCompliant.classList.remove('btn-not-compliant-selected')
            this.sanction = 1;
        }
        const btnNotCompliant = document.createElement('div');
        btnNotCompliant.id = 'btn-not-compliant';
        btnNotCompliant.classList.add('rect-button');
        btnNotCompliant.innerHTML = 'NON-CONFORME';
        btnNotCompliant.onclick = () => {
            if (btnNotCompliant.classList.contains('btn-not-compliant-selected')) {
                btnNotCompliant.classList.remove('btn-not-compliant-selected');
            } else {
                btnNotCompliant.classList.add('btn-not-compliant-selected');
            }
            btnCompliant.classList.remove('btn-compliant-selected')
            this.sanction = 0;
        }
        divSanctionChoice.append(btnCompliant, btnNotCompliant);
        return divSanctionChoice;
    }
};

function checkControlTool(_inputScanTool, _toolToUse) {
    const transformedScanInput = scanProc(_inputScanTool);
    if (transformedScanInput[0] == 'CTRL-TOOL') {
        return transformedScanInput;
    } else {
        return false;
    }

}





/**
 *Change le texte en haut de l'écran
 *
 * @param {string} _text
 */
function changeInstructionText(_text) {
    const divIstructionText = document.getElementById('instruction-text');
    divIstructionText.innerHTML = _text;
}