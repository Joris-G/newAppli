import { Assembly, Group, Operation } from "../assembly.js";
import {
    doAjaxThings,
    Div,
    Cellule,
    SelectItem,
    DownArrowStatus,
    Bouton
} from "../toolBox.js";

//AJAX START REQUESTS
const promMenu = doAjaxThings("../data/menu.json", "json");
const promAllOpenMaterials = doAjaxThings('../script/php/getAllOpenMaterials.php', 'json');
const promListMatiere = doAjaxThings('../script/php/getMaterialsList.php?secteur=ASSEMBLAGE COMPOSITE', 'json');
//PAGE CONSTRUCTION
const body = document.querySelector("body");
const btnConfirm = new Bouton('confirm');
const divMain = new Div("module", body);
const divContent = new Div("content", divMain);
divContent.id = "divContent";

function initPage() {
    addLoader();
    setTimeout(() => {
        const activeInput = document.querySelector(".active-input");
        (activeInput) ? activeInput.focus(): false;
        divMain.addEventListener("click", focusOnActiveInput);
        upDateTracaPage()
        removeLoader();
    }, 1000);
}

const buildTitleTopBar = function() {
    let titleTopBar = document.querySelector('.title-top')
    if (titleTopBar) {
        titleTopBar.remove();
    }
    titleTopBar = document.createElement('div');
    titleTopBar.classList.add('title-top');
    const divTitle = document.createElement('div');
    const title = "Registre des matières";
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
initPage();


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
    divContent.appendChild(buildOpenRecorder());
}

function buildOpenRecorder() {
    const divRecorder = document.createElement('div');
    divRecorder.id = "recorder";
    const inputMateial = document.createElement('input');
    inputMateial.id = 'input-material';
    inputMateial.classList.add('active-input', 'hidden');
    inputMateial.onchange = () => {
        const input = scanProc(inputMateial.value);
        console.log(input);
        if (input[0] == "MAT") {
            recordMaterial(input[1]);
        }
    }
    divRecorder.appendChild(inputMateial);
    return divRecorder;
}

function buildLimiteUse(materialId, idMat) {
    const divLimiteUseTime = document.createElement('div');
    const scanedMaterial = document.createElement('div');
    scanedMaterial.id = 'scaned-material';
    const divRecorder = document.getElementById("recorder");
    divRecorder.append(scanedMaterial);
    const divMaterialArticle = document.createElement('div');
    const materialArticle = document.createElement('div');
    materialArticle.id = 'material-article';
    const lblMaterialArticle = document.createElement('label');
    lblMaterialArticle.innerHTML = 'ARTICLE';
    divMaterialArticle.append(lblMaterialArticle, materialArticle);

    const divMaterialDesignation = document.createElement('div');
    const materialDesignation = document.createElement('div');
    materialDesignation.id = 'material-designation';
    const lblMaterialDesignation = document.createElement('label');
    lblMaterialDesignation.innerHTML = 'DESIGNATION';
    divMaterialDesignation.append(lblMaterialDesignation, materialDesignation);

    const divPeremption = document.createElement('div');
    const shelflifeDate = document.createElement('div');
    shelflifeDate.id = 'shelflifeDate';
    const lblShelflifeDate = document.createElement('label');
    lblShelflifeDate.innerHTML = 'Date de péremption';
    divPeremption.append(lblShelflifeDate, shelflifeDate);

    scanedMaterial.append(divMaterialArticle, divMaterialDesignation, divPeremption);
    promListMatiere.then(materials => {
        const usedMat = materials.find(mat => mat.ID == materialId);
        materialArticle.innerHTML = usedMat.ARTICLE;
        materialDesignation.innerHTML = usedMat['DESIGNATION SIMPLIFIEE'];
        const promAllMatEntry = doAjaxThings(`../script/php/getAllMaterialEntry.php?id=${idMat[1]}`, 'json');
        promAllMatEntry.then(mat => {
            console.log(mat);
            shelflifeDate.innerHTML = mat['DATE DE PEREMPTION'];
        });
        const today = new Date();
        const potLife = parseInt(usedMat['DUREE DE VIE']) * 60 * 60 * 1000;
        const endLife = new Date(today.getTime() + potLife);
        const msg = `Vous avez jusqu'au : ${endLife.getDate()}/${endLife.getMonth()+1}/${endLife.getFullYear()} à ${endLife.getHours()}h${endLife.getMinutes()}`;
        divLimiteUseTime.innerText = msg;
    })
    return divLimiteUseTime;
}

function recordMaterial(materialInput) {

    divContent.appendChild(btnConfirm.drawButton());
    console.log(materialInput);
    const mat = materialInput[0];
    const idMat = materialInput[1];
    divContent.appendChild(buildLimiteUse(mat, materialInput));
    const btnConf = document.getElementById('confirm-button');
    btnConf.onclick = () => {
        addLoader();
        doAjaxThings(`../script/php/openMaterial.php?idMat=${idMat}`, 'text')
            .then(() => {
                removeLoader();
            });
    }
    promAllOpenMaterials.then(allOpenMat => {
        console.log(allOpenMat);
        if (allOpenMat != null) {
            if (allOpenMat.find(openMat => openMat['ID MATERIAL ENTRY'] == idMat)) {
                console.log('mat déjà ouvert');
            } else {
                btnConfirm.setEnable();
            }
        } else {
            console.log('coucou');
            btnConfirm.setEnable();
        }
    });
}