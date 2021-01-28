import { divTracaTable } from "../traca.js";
import { Div, Cellule, SelectItem, doAjaxThings } from "../toolBox.js";

const body = document.querySelector('body');
let traca;
const promMaterialList = doAjaxThings('../script/php/getMaterialsList.php?secteur=ASSEMBLAGE COMPOSITE', 'json');
const promToolList = doAjaxThings('../script/php/getToolList.php?secteur=3', 'json');
//const promSectorsList = doAjaxThings('../script/php/getTypeList.php?', 'json');

const divPrepAssy = new Div('module', body);
// TITLE
const divTitle = new Div('title-top', divPrepAssy);
const title = 'Preparation assemblage';
divTitle.innerHTML = title.toUpperCase();
divTitle.classList.add('title-font');

const divContent = new Div('content', divPrepAssy);
const divLeftSideBar = new Div('leftSideBar', divContent);
document.querySelector('.leftSideBar').style.width = '200px';
const divSelectArticle = document.createElement('div');
divSelectArticle.id = 'selectArticle';
//ARTICLE
const lblArticle = document.createElement('label');
lblArticle.innerText = "Article SAP";
const articleAss = document.createElement('input');
articleAss.value = "7172294";
const divDes = document.createElement('div');
divDes.id = 'designation';
const separator = document.createElement('div');
separator.classList.add('separator')

const btnValidate = document.createElement('div');
btnValidate.id = 'btnUpdateArticle';
btnValidate.innerText = "GO";
divSelectArticle.append(lblArticle, articleAss, divDes, btnValidate);

divLeftSideBar.append(divSelectArticle, separator);
//CONTENT
divContent.id = "divContent";

//CREATION
const workWindow = document.createElement('div');
workWindow.id = 'workWindow'
divContent.appendChild(workWindow);
workWindow.classList.add('workWindow', 'hide');

const buildEditTracaForm = function() {
    if (document.getElementById('editTracaForm')) {
        document.getElementById('editTracaForm').remove();
    }
    if (document.getElementById('editGroupForm')) {
        document.getElementById('editGroupForm').remove();
    }
    const divFormEditTraca = document.createElement('div');
    divFormEditTraca.id = 'editTracaForm';
    workWindow.appendChild(divFormEditTraca);

    //NEW TRACA ITEM
    const divNewOp = document.createElement('div');
    divNewOp.id = 'newOp';
    const divTitleNewOp = document.createElement('div');
    divTitleNewOp.id = 'titleNewOp';
    divTitleNewOp.innerText = "Nouvelle Opération";
    divTitleNewOp.classList.add('hide');
    const divGroup = document.createElement('div');
    divGroup.id = 'divGroup';
    divGroup.classList.add('flex-row', 'selected-group', 'hide');
    const divItem = document.createElement('div');
    divItem.id = 'divItem';
    divItem.classList.add('flex-row', 'selected-item', 'hide');
    divNewOp.append(divTitleNewOp, divGroup, divItem);

    ////GROUPE
    const lblgroupInput = document.createElement('label');
    lblgroupInput.innerHTML = `Groupe`;
    lblgroupInput.classList.add('align-right');
    const inputGroup = document.createElement('div');
    inputGroup.id = 'inputGroup';
    inputGroup.classList.add('align-center');
    divGroup.append(lblgroupInput, inputGroup);
    ////ITEM
    const lblitemInput = document.createElement('label');
    lblitemInput.innerHTML = `Item`;
    lblitemInput.classList.add('align-right')
    const itemInput = document.createElement('div');
    itemInput.id = 'itemInput';
    itemInput.classList.add('align-center')
    divItem.append(lblitemInput, itemInput);

    ////DIV OPERATION DEFINITION
    const divOperationDef = document.createElement('div');
    divOperationDef.id = 'op-def';
    divFormEditTraca.append(divNewOp, divOperationDef);

    ////TYPE
    const divType = document.createElement('div');
    divType.id = 'div-type-op';
    divType.classList.add('hide');
    const tracaType = new SelectItem(['Sélectionner le type', 'Matiere', 'Controle', 'OF']);
    tracaType.id = 'select-typeTraca';
    tracaType.classList.add('select');
    divType.appendChild(tracaType);

    ////OPERATION DETAILS
    const divOperationDetails = document.createElement('div');
    divOperationDetails.id = "ope-details";
    divOperationDetails.classList.add('hide')

    ////INSTRUCTIONS
    const divInstruction = document.createElement('div');
    divInstruction.id = 'divInstructions';
    const lblInstruction = document.createElement('label');
    lblInstruction.innerHTML = 'Instructions : ';
    const inputInstructions = document.createElement('input');
    inputInstructions.id = 'inputInstructions';
    divInstruction.append(lblInstruction, inputInstructions);

    ////TRACAOPTION
    const divTracaOption = document.createElement('div');
    divTracaOption.id = 'divTracaOption';
    ////BOUTON
    const btnValidateTraca = document.createElement('div');
    btnValidateTraca.id = 'btnValidateTraca';
    btnValidateTraca.innerHTML = 'TERMINER';
    btnValidateTraca.classList.add('perso-bouton', 'pointer', 'bouton-disable');


    divOperationDef.append(divType, divOperationDetails, btnValidateTraca);
    divOperationDetails.append(divInstruction, divTracaOption);

    return divFormEditTraca;
}
const buildEditGroupForm = function() {
    if (document.getElementById('editTracaForm')) {
        document.getElementById('editTracaForm').remove();
    }
    if (document.getElementById('editGroupForm')) {
        document.getElementById('editGroupForm').remove();
    }
    const divFormEditGroup = document.createElement('div');
    divFormEditGroup.id = 'editGroupForm';
    workWindow.appendChild(divFormEditGroup);

    const divGroupName = document.createElement('div');
    const lblGroupName = document.createElement('label');
    lblGroupName.innerHTML = "Nom du groupe : "
    const inputGroupName = document.createElement('input');
    inputGroupName.id = "input-groupName";
    divGroupName.append(lblGroupName, inputGroupName);

    const divShortName = document.createElement('div');
    const lblShortName = document.createElement('label');
    lblShortName.innerHTML = "Nom court du groupe : "
    const inputShortName = document.createElement('input');
    inputShortName.id = "input-groupShortName";
    divShortName.append(lblShortName, inputShortName)


    const btnAddGroup = document.createElement('div');
    btnAddGroup.id = 'btn-addGroup';
    btnAddGroup.innerHTML = "TERMINER";
    btnAddGroup.classList.add('perso-bouton', 'pointer', 'bouton-disable');

    divFormEditGroup.append(divGroupName, divShortName, btnAddGroup);

    return divFormEditGroup;
}

////OF
const buildPartSelection = function() {
    const divPartSelector = document.createElement('div');
    divPartSelector.id = 'partSelector';
    const divPartList = document.createElement('div');
    divPartList.id = 'listItems';
    const divSelectedParts = document.createElement('div');
    divSelectedParts.id = 'selectedParts';
    divPartSelector.append(divPartList, divSelectedParts);
    return divPartSelector;
}

//////OPTION PIECE
const removeOption = function() {
    if (divTracaOption.childNodes.length != 0) {
        divTracaOption.childNodes.forEach(tracaOptionChild => {
            tracaOptionChild.remove()
        });
    }
    (document.getElementById('partSelector')) ? document.getElementById('partSelector').remove(): "";

}
const generateOption = function(type) {
        removeOption();
        const inputInstructions = document.getElementById('inputInstructions')
        switch (type) {
            case 'Matiere':
                divInstructionText.innerHTML = `Sélectionner la matière à utiliser`;
                let arrayListMaterials = [];
                promMaterialList.then((materialsList) => {
                    const testMinimumFilled = function() {
                        if (articleMat.selectedIndex != 0 && inputInstructions.value != "") {
                            btnValidateTraca.classList.add('bouton-enable');
                            btnValidateTraca.classList.remove('bouton-disable');
                        } else {
                            btnValidateTraca.classList.remove('bouton-enable');
                            btnValidateTraca.classList.add('bouton-disable');
                        }
                    }
                    materialsList.forEach(element => {
                        arrayListMaterials.push([element['DESIGNATION SIMPLIFIEE'], element.ID]);
                    });
                    arrayListMaterials.unshift('Choisir une matière')
                    const articleMat = new SelectItem(arrayListMaterials);
                    articleMat.id = 'select-mat'
                    articleMat.onchange = () => {
                        testMinimumFilled();
                    }
                    divTracaOption.appendChild(articleMat);

                    inputInstructions.oninput = () => {
                        testMinimumFilled();
                    }

                });
                break;
            case 'Controle':
                divInstructionText.innerHTML = `Sélectionner l'outil de contrôle à utiliser`;
                const divControle = document.createElement('div');
                divControle.id = 'divControle';
                const divNeedTool = document.createElement('div');
                const divSelectTool = document.createElement('div');
                const divRole = new SelectItem([
                    ['Choisir un rôle', 0],
                    ['COMPAGNON', 3],
                    ['CONTROLE', 1]
                ]);
                divRole.id = 'select-role';
                divRole.onchange = () => {
                    testMinimumFilled();
                }
                divControle.append(divNeedTool, divSelectTool, divRole);
                let tool;
                promToolList.then((toolsList) => {
                    const arrayListTools = [];
                    toolsList.forEach(element => {
                        arrayListTools.push([element.TYPE, element.ID]);
                    });
                    arrayListTools.unshift(['Choisir un outillage', 0])
                    tool = new SelectItem(arrayListTools);
                    tool.id = 'tool';
                    tool.classList.add('hide');
                    divSelectTool.appendChild(tool);
                    tool.onchange = () => {
                        testMinimumFilled();
                    }
                });
                const lblNeedTool = document.createElement('label');
                lblNeedTool.classList.add('label');
                lblNeedTool.innerHTML = 'outillage ?';
                const inputCheckbox = document.createElement('input');
                inputCheckbox.type = 'checkbox';
                divNeedTool.append(lblNeedTool, inputCheckbox);
                inputCheckbox.onchange = () => {
                    testMinimumFilled();
                    if (inputCheckbox.checked === true) {
                        tool.classList.remove('hide')
                    } else {
                        tool.value = null;
                        tool.classList.add('hide')
                    };
                };
                divTracaOption.appendChild(divControle)
                inputInstructions.oninput = () => {
                    testMinimumFilled();
                }
                const testMinimumFilled = function() {
                    switch (inputCheckbox.checked) {
                        case true:
                            if (divRole.selectedIndex != 0 && tool.selectedIndex != 0 && inputInstructions.value != "") {
                                btnValidateTraca.classList.add('bouton-enable');
                                btnValidateTraca.classList.remove('bouton-disable');
                            } else {
                                btnValidateTraca.classList.remove('bouton-enable');
                                btnValidateTraca.classList.add('bouton-disable');
                            }

                            break;
                        case false:
                            if (divRole.selectedIndex != 0 && inputInstructions.value != "") {
                                btnValidateTraca.classList.add('bouton-enable');
                                btnValidateTraca.classList.remove('bouton-disable');
                            } else {
                                btnValidateTraca.classList.remove('bouton-enable');
                                btnValidateTraca.classList.add('bouton-disable');
                            }
                            break;
                        default:
                            break;
                    }

                }
                break;
            case 'OF':
                divInstructionText.innerHTML = `Sélectionner la(les) pièce(s) à tracer`
                const selectedParts = []
                const promPartList = doAjaxThings(`../script/php/getPartsList.php?categorie=PIECE&parent=${articleAss.value}`, 'json')
                promPartList.then((partsList) => {
                    workWindow.appendChild(buildPartSelection());
                    const divPartList = document.getElementById('listItems');
                    const divSelectedParts = document.getElementById('selectedParts')
                    if (divPartList.childNodes.length != 0) {
                        divPartList.childNodes.forEach((itemToClear) => {
                            itemToClear.remove();
                        })
                    }

                    divSelectedParts.appendChild(createTable());
                    divPartList.style.display = 'flex';
                    let divTableTraca = document.getElementById('tableTraca');
                    divTableTraca.classList.add('hide');
                    const listOfPartJSON = partsList;
                    listOfPartJSON.forEach(currentItem => {
                        const divListItem = document.createElement('div');
                        divListItem.classList.add('item');
                        const articleItem = document.createElement('div');
                        articleItem.innerHTML = currentItem.Article
                        const desArticleItem = document.createElement('div')
                        desArticleItem.innerHTML = currentItem.Designation
                        divListItem.append(articleItem, desArticleItem)
                        divPartList.appendChild(divListItem)
                        divListItem.onclick = function() {
                            if (!divListItem.classList.contains('selectedItem')) {
                                divListItem.classList.add('selectedItem');
                                selectedParts.push(currentItem.Article);
                                addPartToTable(currentItem);
                                testMinimumFilled();
                            } else {
                                divListItem.classList.remove('selectedItem');
                                const indexToDelete = selectedParts.indexOf(currentItem.Article);
                                selectedParts.splice(indexToDelete, 1);
                                removePartToTable(currentItem);
                                testMinimumFilled();
                            }
                        }
                    });

                    inputInstructions.oninput = () => {
                        testMinimumFilled();
                    }
                    const testMinimumFilled = function() {
                        if (selectedParts.length != 0 && inputInstructions.value != "") {
                            btnValidateTraca.classList.add('bouton-enable');
                            btnValidateTraca.classList.remove('bouton-disable');
                        } else {
                            btnValidateTraca.classList.remove('bouton-enable');
                            btnValidateTraca.classList.add('bouton-disable');
                        }
                    }
                });
                break;
        }
    }
    //TABLE OF SELECTED PARTS
const createTable = function() {
    const table = document.createElement('table');
    table.id = 'tableOfSelectedParts';
    const thead = document.createElement('thead');
    table.appendChild(thead)
    const trHeader = document.createElement('tr');
    thead.appendChild(trHeader);
    const tdArticle = document.createElement('td');
    tdArticle.innerHTML = 'ARTICLE';
    trHeader.appendChild(tdArticle);
    const tdDesignation = document.createElement('td');
    tdDesignation.innerHTML = 'DESIGNATION';
    trHeader.appendChild(tdDesignation);
    const tdQuantity = document.createElement('td');
    tdQuantity.innerHTML = 'QUANTITE';
    trHeader.appendChild(tdQuantity);
    const tbody = document.createElement('tbody');
    tbody.id = 'bodyOfSelectedParts';
    table.appendChild(tbody);
    return table;
}
const addPartToTable = function(elementToAdd) {
    const tbody = document.getElementById('bodyOfSelectedParts');
    const tr = document.createElement('tr');
    tr.id = elementToAdd.Article;
    const tdRef = document.createElement('td');
    tdRef.innerHTML = elementToAdd.Article;
    tr.appendChild(tdRef);
    const tdDesignation = document.createElement('td');
    tdDesignation.innerHTML = elementToAdd.Designation;
    tr.appendChild(tdDesignation);
    const tdQuantity = document.createElement('td');
    const inputQuantity = document.createElement('input');
    //Default value
    inputQuantity.value = elementToAdd.Quantite;
    tdQuantity.appendChild(inputQuantity);
    tr.appendChild(tdQuantity);
    tbody.appendChild(tr);
}
const removePartToTable = function(elementToRemove) {
    const trToremove = document.getElementById(elementToRemove.Article)
    trToremove.remove();
}


//TOOLBAR
const divToolBar = document.createElement('div');
divToolBar.id = 'tracaToolBar';
//toolBarItem


//ITEM
const item = document.createElement('div');
item.classList.add('toolBarItemTitle');
item.innerText = 'ITEM';
////SubItem
const btnNewItem = document.createElement('div');
btnNewItem.innerHTML = 'NEW';
btnNewItem.classList.add('toolBarSubItem');
const btnMoveItem = document.createElement('div');
btnMoveItem.innerHTML = 'MOVE';
btnMoveItem.classList.add('toolBarSubItem', 'bouton-disable');
item.append(btnNewItem, btnMoveItem);

//GROUP
const group = document.createElement('div');
group.classList.add('toolBarItemTitle');
group.innerHTML = 'GROUPE';
////SubGroup
const btnNewGroup = document.createElement('div');
btnNewGroup.innerHTML = 'NEW';
btnNewGroup.classList.add('toolBarSubItem');
const btnMoveGroup = document.createElement('div');
btnMoveGroup.innerHTML = 'MOVE';
btnMoveGroup.classList.add('toolBarSubItem', 'bouton-disable');
group.append(btnNewGroup, btnMoveGroup);


divToolBar.append(item, group);

//toolBarSubItems conteneur
const toolBarSubItems = document.createElement('div');
toolBarSubItems.classList.add('toolBarSubItems');
//toolBarItems.appendChild(toolBarSubItems)

//INSTRUCTION
const divInstructions = document.createElement('div');
divInstructions.classList.add('instructionsBar');
const divInstructionText = document.createElement('div');
divInstructionText.classList.add('fontWeightFlash');
divInstructions.appendChild(divInstructionText);

//Event
btnValidate.onclick = () => {
    addLoader();
    const promDesignation = doAjaxThings(`../script/php/getDesignation.php?article=${articleAss.value}`, 'text');
    promDesignation.then(des => {
        divDes.innerHTML = des;
    });
    divInstructionText.innerHTML = "";
    const promNomTraca = doAjaxThings(`../script/php/getNomTraca.php?article=${articleAss.value}`, 'json');
    if (document.getElementById('editTracaForm')) {
        document.getElementById('editTracaForm').remove();
    }
    if (document.getElementById('editGroupForm')) {
        document.getElementById('editGroupForm').remove();
    }
    promNomTraca.then((value) => {
        removeLoader();
        workWindow.classList.remove('hide');
        const nomTraca = value;
        console.log(nomTraca, articleAss.value);
        traca = new Traca(nomTraca, articleAss.value);
        divLeftSideBar.appendChild(divToolBar);
        traca.initTraca();
        divTracaTable.classList.remove('displayNone');
    });
}

btnNewItem.onclick = () => {
    const divNewTraca = buildEditTracaForm();
    const newItem = new TracaItem(articleAss.value);
    document.addEventListener('click', clickGroup);
    const divNewOp = document.getElementById('newOp');
    const btnValidateTraca = document.getElementById('btnValidateTraca');
    const divTitleNewOp = document.getElementById('titleNewOp');
    const divType = document.getElementById('div-type-op');
    divNewOp.style.display = 'flex';
    btnValidateTraca.display = 'flex';
    divTitleNewOp.classList.remove('hide');
    divInstructionText.innerHTML = `Cliquer sur le groupe dans lequel vous voulez intégrer cette étape`;
    const itemRows = document.getElementsByClassName('trItem');
    Array.from(itemRows).forEach(row => {
        row.classList.add('hide');
    });

    function clickGroup(event) {
        if (event.target.parentNode.classList.contains("trGroup")) {
            const divGroup = document.getElementById('divGroup');
            divGroup.classList.remove('hide');
            const selectedGroup = event.target.parentElement;
            const inputGroup = document.getElementById('inputGroup');
            inputGroup.innerHTML = selectedGroup.firstElementChild.innerText;
            newItem.group = parseInt(selectedGroup.id);
            document.removeEventListener('click', clickGroup);
            if (document.querySelector('.trItem')) {
                divInstructionText.innerHTML = `Cliquer sur l'item précédent la nouvelle étape`;
                document.addEventListener('click', clickEvent);
                const groupItemsToShow = document.getElementsByClassName(`trItem-group-${selectedGroup.firstElementChild.innerText}`);
                Array.from(groupItemsToShow).forEach(groupItem => {
                    groupItem.classList.remove('hide');
                });
            } else {
                const divItem = document.getElementById('divItem');
                divItem.classList.remove('hide')
                divType.classList.remove('hide')
                const itemInput = document.getElementById('itemInput');
                itemInput.innerHTML = 1;
                newItem.ordre = 1;
                divInstructionText.innerHTML = `Sélectionner le type de traça`;
                const divOperationDef = document.getElementById('op-def');
                divOperationDef.style.display = 'flex';
                btnValidateTraca.style.display = 'flex';
            }

            function clickEvent(event) {
                if (event.target.parentNode.classList.contains("trItem")) {
                    const divItem = document.getElementById('divItem');
                    divItem.classList.remove('hide')
                    divType.classList.remove('hide')
                    const selectedItem = parseInt(event.target.parentElement.firstElementChild.innerText) + 1;
                    const itemInput = document.getElementById('itemInput');
                    itemInput.innerHTML = selectedItem;
                    newItem.ordre = selectedItem;
                    document.removeEventListener('click', clickEvent);
                    divInstructionText.innerHTML = `Sélectionner le type de traça`;
                    const divOperationDef = document.getElementById('op-def');
                    divOperationDef.style.display = 'flex';
                    btnValidateTraca.style.display = 'flex';
                }
            }
        }
    }
    const tracaType = document.getElementById('select-typeTraca');
    tracaType.onchange = () => {
        const divOperationDetails = document.getElementById('ope-details');
        divOperationDetails.classList.remove('hide');
        newItem.type = tracaType.value;
        removeOption();
        generateOption(newItem.type);

        // CLICK ON ADD NEW TRACA
        btnValidateTraca.onclick = () => {
            addLoader();
            const promUpdateItems = new Promise((resolve, reject) => {
                traca.nomTraca.forEach(element => {
                    element.items.forEach(currentItem => {
                        if (currentItem.ID_FAC >= newItem.ordre) {
                            const newId = parseInt(currentItem.ID_FAC) + 1;
                            doAjaxThings(`../script/php/updateTraca.php?article=${currentItem.ARTICLE}&id=${currentItem.ID}&newIdFac=${newId}`, 'text')
                        }
                        resolve();
                    });
                });
            });
            switch (newItem.type) {
                case 'Matiere':
                    const _mat = document.getElementById('select-mat');
                    TracaItem.prototype.matiere = null;
                    newItem.mat = _mat.value;
                    newItem.instruction = inputInstructions.value;
                    promUpdateItems
                        .then(doAjaxThings(`../script/php/addNewTraca.php?article=${newItem.article}&typeTraca=${newItem.type}&material=${newItem.mat}&instructions=${newItem.instruction}&idFAC=${newItem.ordre}&group=${newItem.group}`, 'text')
                            .then(() => {
                                removeLoader();
                                const btnUpdate = document.getElementById('btnUpdateArticle');
                                btnUpdate.click();
                            })
                        );
                    break;
                case 'Controle':
                    TracaItem.prototype.tool = null;
                    newItem.tool = document.getElementById('tool').value;
                    TracaItem.prototype.role = null;
                    newItem.role = document.getElementById('select-role').value;
                    newItem.instruction = inputInstructions.value;
                    promUpdateItems
                        .then(doAjaxThings(`../script/php/addNewTraca.php?article=${newItem.article}&typeTraca=${newItem.type}&tool=${newItem.tool}&instructions=${newItem.instruction}&idFAC=${newItem.ordre}&group=${newItem.group}&role=${newItem.role}`, 'text')
                            .then(() => {
                                removeLoader();
                                const btnUpdate = document.getElementById('btnUpdateArticle')
                                btnUpdate.click();
                            })
                        );
                    break;
                case 'OF':
                    TracaItem.prototype.listOfPart = null;
                    const selectedParts = function() {
                        const seletedPartsArray = [];
                        const tbody = document.getElementById('bodyOfSelectedParts');
                        const listOfPart = tbody.childNodes;
                        listOfPart.forEach(element => {
                            seletedPartsArray.push({
                                'article': element.firstChild.innerHTML,
                                'quantity': element.lastChild.firstChild.value
                            });
                        });
                        console.log(seletedPartsArray);
                        return seletedPartsArray;
                    }
                    newItem.listOfPart = JSON.stringify(selectedParts());
                    newItem.instruction = inputInstructions.value;
                    promUpdateItems
                        .then(doAjaxThings(`../script/php/addNewTraca.php?article=${newItem.article}&typeTraca=${newItem.type}&partList=${newItem.listOfPart}&instructions=${newItem.instruction}&idFAC=${newItem.ordre}&group=${newItem.group}`, 'text')
                            .then(() => {
                                removeLoader();
                                const btnUpdate = document.getElementById('btnUpdateArticle');
                                btnUpdate.click();
                            })
                        );
                    document.getElementById('partSelector').remove();
                    break
                default:
                    break
            }
            removeOption();
            inputInstructions.value = "";
            divType.classList.add('hide');
            divNewOp.style.display = 'none';
            divOperationDetails.classList.add('hide')
            inputGroup.innerHTML = "";
            itemInput.innerHTML = "";
            tracaType.selectedIndex = 0;
            divNewTraca.remove();
        }
    }
}
btnNewGroup.onclick = () => {
    const itemRows = document.getElementsByClassName('trItem');
    Array.from(itemRows).forEach(row => {
        row.classList.add('hide');
    });
    const divNewGroup = buildEditGroupForm();
    const inputGroupName = document.getElementById('input-groupName');
    const inputGroupShortName = document.getElementById('input-groupShortName');
    const btnAddGroup = document.getElementById('btn-addGroup');
    const testMinimumFilled = function() {
        if (inputGroupShortName.value != "" && inputGroupName.value != "") {
            btnAddGroup.classList.add('bouton-enable');
            btnAddGroup.classList.remove('bouton-disable');
        } else {
            btnAddGroup.classList.remove('bouton-enable');
            btnAddGroup.classList.add('bouton-disable');
        }
    }
    inputGroupName.oninput = () => { testMinimumFilled() }
    inputGroupShortName.oninput = () => { testMinimumFilled() }

    btnAddGroup.onclick = () => {
        const ordre = document.getElementById('group').innerHTML;
        doAjaxThings(`../script/php/addNewGroup.php?article=${articleAss.value}&descript=${inputGroupName.value}&ordre=${ordre}&shortName=${inputGroupShortName.value}`, 'text')
            .then(() => {
                btnValidate.click();
                divInstructionText.innerHTML = "";
                divNewGroup.remove();
            })
    }
    const divEditGroupForm = document.getElementById('editGroupForm');
    const divGroup = document.createElement('div');
    divGroup.id = 'group';
    divEditGroupForm.appendChild(divGroup);
    if (document.querySelector('tbody').childElementCount == 0) {
        divGroup.innerHTML = `1`;
        divInstructionText.innerHTML = `Remplir les champs puis valider`;
    } else {
        divInstructionText.innerHTML = `Cliquer sur le groupe après lequel vous voulez intégrer ce nouveau groupe`;
        document.addEventListener('click', clickGroup);
    }

    function clickGroup(event) {
        if (event.target.parentNode.classList.contains("trGroup")) {
            const selectedGroup = event.target.parentElement;
            const newGroupNumber = Number.parseInt(selectedGroup.firstElementChild.innerText) + 1;
            divGroup.innerHTML = `Groupe : ${newGroupNumber}`;
            divInstructionText.innerHTML = `Remplir les champs puis valider`;
            document.removeEventListener('click', clickGroup);
        }
    }

}
class TracaItem {
    constructor(_article, _group = 0, _ordre = 0, _type = null, _instruction = null) {
            this.article = _article;
            this.group = _group;
            this.ordre = _ordre;
            this.type = _type;
            this.instruction = _instruction;
        }
        /**
         *Supprime une traca et réordonne les traca restantes 
         *
         * @static
         * @param {int} id
         * @param {int} ordreNumber
         * @param {int} article
         * @return {Promise} 
         * @memberof TracaItem
         */
    static remove(id, ordreNumber, article) {
        return doAjaxThings(`../script/php/deleteTracaID.php?id=${id}&ordre=${ordreNumber}&article=${article}`, 'text');
    }
}
class Traca {

    static JsonDataAllTraca;
    static tracaTable;
    static nbTracaArticle;
    static articleSap;

    constructor(_nomTraca, _article) {
        this.nomTraca = _nomTraca;
        this.article = _article;
    }
    numberOfItem() {
        let cmpt = 0;
        this.nomTraca.forEach(currentItem => {
            currentItem['item'].forEach(currentItem => {
                cmpt++;
            });
        });
        return cmpt;
    }
    initTraca() {
        //Creer la toolBar
        this.buildToolBar();
        workWindow.appendChild(this.buildTable());
    }
    buildToolBar() {
        const divEditTracaGroupForm = document.getElementById('editTracaGroupForm')
        if (divEditTracaGroupForm != null) {
            divEditTracaGroupForm.remove()
        }

        // function newFormEditTracaGroup() {

        //     const btnNewGroup = document.createElement('button')
        //     const lblDescription = document.createElement('label')
        //     lblDescription.innerText = "Description du groupe : "
        //     divEditTracaGroup.appendChild(lblDescription)
        //     const descriptionInput = document.createElement('input')
        //     descriptionInput.type = 'text'
        //     descriptionInput.id = 'descriptionInput'
        //     descriptionInput.value = 'Group test 3'
        //     divEditTracaGroup.appendChild(descriptionInput)
        //     const lblWhereInput = document.createElement('label')
        //     lblWhereInput.innerText = "Ajouter après : "
        //     divEditTracaGroup.appendChild(lblWhereInput)
        //     const whereInput = document.createElement('input')
        //     whereInput.type = 'number'
        //     whereInput.id = 'whereInput'
        //     whereInput.value = 3
        //     divEditTracaGroup.appendChild(whereInput)
        //         //BOUTON NEW TRACA
        //     divEditTracaGroup.appendChild(btnNewGroup)
        //     btnNewGroup.innerText = 'VALIDER'
        //     btnNewGroup.onclick = () => {
        //         const newGroup = new GroupOfTracaItem(Traca.articleSap, whereInput.value, descriptionInput.value)
        //         newGroup.add()
        //         setTimeout(() => {
        //             const btnUpdate = document.getElementById('btnUpdateArticle')
        //             btnUpdate.click()
        //         }, 300);
        //     }
        // }
    }
    buildTable() {
        const listItem = [];
        let divTableTraca = document.getElementById('tableTraca');
        if (divTableTraca != null) { divTableTraca.remove() }
        divTableTraca = document.createElement('div');
        divTableTraca.id = 'tableTraca';
        const tracaTable = document.createElement('table');
        divTableTraca.appendChild(tracaTable);
        //HEADER
        const divHeader = document.createElement('div');
        divHeader.classList.add('header');
        const tableHeader = document.createElement('thead');
        tracaTable.appendChild(tableHeader);
        //tracaTable.appendChild(divHeader);
        const trHeader = document.createElement('tr');
        tableHeader.appendChild(trHeader);
        const arrayHeader = ['ID DE TRACA', 'TYPE DE TRACA', 'INSTRUCTIONS', 'QR CODE', 'EDITER', 'SUPPRIMER', 'EDITER FAC', 'IMAGE']
        arrayHeader.forEach(headerItem => {
                const tdHeader = document.createElement('td');
                trHeader.appendChild(tdHeader);
                tdHeader.innerText = headerItem;
                //Item QRCode
                if (headerItem === arrayHeader[3]) {
                    tdHeader.classList.add('pointer', 'underligne-red')
                    tdHeader.onclick = () => {
                        const TdQrCode = document.getElementsByClassName('QRCODE')
                        Array.from(TdQrCode).forEach(currentItem => {
                            currentItem.parentElement.childNodes.forEach(td => {
                                td.classList.toggle('minify')
                                if (td.classList.contains('minify')) {
                                    currentItem.lastChild.width = 10;
                                } else {
                                    currentItem.lastChild.width = 40;
                                }
                            });
                        });
                    }
                };
                //EDITER FAC
                if (headerItem === arrayHeader[6]) {
                    tdHeader.classList.add('pointer', 'underligne-red')
                    tdHeader.onclick = () => {
                        const newWindow = window.open('../public/prep-fac-operations.php');
                        newWindow.onload = () => {
                            listItem.forEach(item => {
                                newWindow.document.getElementById('content').appendChild(this.buildTracaFAC(item));
                            })
                        }
                    }
                };
            })
            //BODY
        const tbody = document.createElement('tbody');
        tracaTable.appendChild(tbody);

        this.nomTraca.forEach(group => {
            const trGroup = document.createElement('tr');
            trGroup.classList.add('trGroup');
            trGroup.id = group['ID'];
            tbody.appendChild(trGroup);
            trGroup.onclick = () => {}
            const tdGroupId = document.createElement('td');
            tdGroupId.classList.add('pointer');
            tdGroupId.innerHTML = group.ORDRE;
            tdGroupId.onclick = () => {
                const itemRows = document.getElementsByClassName('trItem');
                Array.from(itemRows).forEach(row => {
                    row.classList.toggle('hide');
                });
            }
            trGroup.appendChild(tdGroupId);
            const tdGroupName = document.createElement('td');
            tdGroupName.innerHTML = group.ID_GROUP;
            trGroup.appendChild(tdGroupName);
            const tdGroup = document.createElement('td');
            tdGroup.innerText = group.DESCRIPTION;
            tdGroup.colSpan = 6;
            trGroup.appendChild(tdGroup);
            const tracaItems = group['items'];
            tracaItems.forEach(item => {
                listItem.push(item);
                const trItem = document.createElement('tr');
                trItem.id = item.ID;
                trItem.classList.add('trItem', `trItem-group-${group.ORDRE}`);
                tbody.appendChild(trItem);
                const itemPropertyToShow = [item['ID_FAC'], item['TYPE_TRACA'], item['INSTRUCTIONS']];
                itemPropertyToShow.forEach(itemProperty => {
                    const tdItem = document.createElement('td');
                    trItem.appendChild(tdItem);
                    tdItem.innerText = itemProperty;
                });
                const tdQRCode = document.createElement('td');
                tdQRCode.classList.add('QRCODE');
                trItem.appendChild(tdQRCode);
                switch (item['TYPE_TRACA']) {
                    case "Controle":
                        if (item.details[0].ROLE == 1) {
                            new QRCode(tdQRCode, {
                                text: item['ID'],
                                width: 40,
                                height: 40,
                                colorDark: "#1eb965",
                                colorLight: "#FFFFFF",
                                correctLevel: QRCode.CorrectLevel.L
                            });
                        } else {
                            new QRCode(tdQRCode, {
                                text: item['ID'],
                                width: 40,
                                height: 40,
                                colorDark: "#000000",
                                colorLight: "#FFFFFF",
                                correctLevel: QRCode.CorrectLevel.L
                            });
                        }

                        break;

                    default:
                        new QRCode(tdQRCode, {
                            text: item['ID'],
                            width: 40,
                            height: 40,
                            colorDark: "#000000",
                            colorLight: "#FFFFFF",
                            correctLevel: QRCode.CorrectLevel.L
                        });
                        break;
                }
                tdQRCode.onclick = () => {
                    generateFacOperation();
                }
                const tdEdit = document.createElement('td')
                tdEdit.classList.add('redHover', 'align-center');
                const btnEdit = document.createElement('img')
                btnEdit.src = "../public/src/img/crayon_daher-03.png";
                btnEdit.classList.add('tbl-img');
                tdEdit.onclick = () => {
                    const pageFac = window.open('../public/test_FAC.html', 'coucou')
                    pageFac.onload = function() {
                        const title = this.getElementById('title-op');
                        title.innerHTML = 'coucou';
                    };
                }
                tdEdit.appendChild(btnEdit);
                const tdDelete = document.createElement('td');
                tdDelete.classList.add('delete-cell');
                const btnDelete = document.createElement('img');
                btnDelete.src = "../public/src/img/poub_daher_bleue-03.png";
                tdDelete.onclick = () => {
                    ///////////////////////////
                    //ajouter un êtes vous sur !!!
                    //////////////////////////
                    divTableTraca.remove();
                    addLoader();
                    TracaItem.remove(item.ID, item.ID_FAC, item.ARTICLE).then(() => {
                        removeLoader();
                        btnValidate.click();
                    })
                }
                tdDelete.onmouseover = () => {
                    btnDelete.src = "../public/src/img/poub_daher_rouge-03.png";
                    trItem.classList.add('delete');
                }
                tdDelete.onmouseleave = () => {
                    btnDelete.src = "../public/src/img/poub_daher_bleue-03.png";
                    trItem.classList.remove('delete');
                }
                btnDelete.classList.add('tbl-img');
                tdDelete.appendChild(btnDelete);
                const tdEditFac = document.createElement('td');
                const btnEditFac = document.createElement('img');
                btnEditFac.classList.add('tbl-img');
                btnEditFac.src = "../public/src/img/outillagemod_icone_bleu-03.png";
                btnEditFac.onclick = () => {
                    const newWindow = window.open('../public/prep-fac-operations.php');
                    newWindow.onload = () => {
                        newWindow.document.getElementById('content').appendChild(this.buildTracaFAC(item));
                    }
                }
                tdEditFac.appendChild(btnEditFac);
                const tdAddPictures = document.createElement('td');
                const lblAddPicture = document.createElement('label');
                lblAddPicture.for = 'img-input';
                lblAddPicture.innerText = '';
                const imgAddPicture = document.createElement('img');
                imgAddPicture.src = "../public/src/img/upload.png";
                imgAddPicture.classList.add('tbl-img');
                const inputImgFile = document.createElement('input');
                inputImgFile.type = "file";
                inputImgFile.id = 'img-input';
                inputImgFile.style.display = 'none';
                inputImgFile.oninput = () => {
                    const endpoint = "../script/php/uploadPrepAssImg.php";
                    const formData = new FormData();
                    formData.append("inputFile", inputImgFile.files[0]);
                    formData.append('idOp', item.ID);

                    fetch(endpoint, { method: "post", body: formData }).catch(console.error)
                }
                lblAddPicture.append(imgAddPicture, inputImgFile);

                tdAddPictures.append(lblAddPicture);
                trItem.append(tdEdit, tdDelete, tdEditFac, tdAddPictures);
                trItem.onmouseover = () => {
                    const elementToShow = document.getElementsByClassName(`${item['ID']}`);
                    Array.from(elementToShow).forEach(elem => {
                        elem.classList.remove('hide');
                    })
                }
                trItem.onmouseleave = () => {
                    const elementToShow = document.getElementsByClassName(`${item['ID']}`);
                    Array.from(elementToShow).forEach(elem => {
                        elem.classList.add('hide');
                    })
                }
                if (item.details.length > 0) {
                    switch (item['TYPE_TRACA']) {
                        case 'OF':
                            item.details.forEach(detail => {
                                const trDetail = document.createElement('tr');
                                trDetail.classList.add('trDetail', 'hide', item['ID']);
                                const tdArticle = document.createElement('td');
                                tdArticle.innerHTML = `Article : ${detail.ARTICLE}`;
                                tdArticle.colSpan = 2;
                                const tdNombre = document.createElement('td');
                                tdNombre.innerHTML = `Quantité : ${detail.QUANTITE}`;
                                tdNombre.colSpan = 2;
                                trDetail.append(tdArticle, tdNombre);
                                tbody.appendChild(trDetail);
                            })

                            break;
                        case 'Controle':
                            item.details.forEach(detail => {
                                const trDetail = document.createElement('tr');
                                trDetail.classList.add('trDetail', 'hide', item['ID']);
                                const tdOutillage = document.createElement('td');
                                promToolList.then((value) => {
                                    const resultat = value.find(outillage => outillage.ID === detail.OUTILLAGE);
                                    tdOutillage.innerHTML = `Outillage : ${resultat.TYPE}`;
                                })
                                tdOutillage.colSpan = 2;
                                const tdRole = document.createElement('td');
                                tdRole.innerHTML = `Role : ${detail.ROLE}`;
                                tdRole.colSpan = 2;
                                trDetail.append(tdOutillage, tdRole);
                                tbody.appendChild(trDetail);
                            });
                            break;
                        case 'Matiere':
                            item.details.forEach(detail => {
                                const trDetail = document.createElement('tr');
                                trDetail.classList.add('trDetail', 'hide', item['ID']);
                                const tdArticle = document.createElement('td');
                                tdArticle.innerHTML = `Article : ${detail.ARTICLE}`;
                                tdArticle.colSpan = 2;
                                const tdTemp = document.createElement('td');
                                tdTemp.innerHTML = `Température : ${detail.TEMPERATURE}`;
                                tdTemp.colSpan = 2;
                                const tdHygro = document.createElement('td');
                                tdHygro.innerHTML = `Hygrométrie : ${detail.HYGROMETRIE}`;
                                tdHygro.colSpan = 2;
                                trDetail.append(tdArticle, tdTemp, tdHygro);
                                tbody.appendChild(trDetail);
                            });
                            break;
                        default:
                            break;
                    }
                }
            });
        });
        return divTableTraca
    }
    buildTracaFAC(facItem) {
        const divFac = document.createElement('div');
        divFac.id = 'fac-operation';
        const divTopBar = document.createElement('div');
        divTopBar.id = 'top-bar';
        const divTitleOp = document.createElement('div');
        divTitleOp.id = 'op-title';
        let opRole;
        switch (facItem.TYPE_TRACA) {
            case 'OF':
                opRole = "LE COMPAGNON";
                break;
            case "Matiere":
                opRole = "LE COMPAGNON";
                break;
            case 'Controle':
                (facItem.details[0].ROLE == 1) ? opRole = "LE CONTROLEUR": opRole = "LE COMPAGNON"
                break;
            default:
                break;
        }

        divTitleOp.innerHTML = `Traçabilité digitale à réaliser par ${opRole}`;
        const divTypeOp = document.createElement('div');
        divTypeOp.id = 'op-type';
        switch (facItem.TYPE_TRACA) {
            case 'OF':
                divTypeOp.innerHTML = "Traçabilité d'OF";
                break;

            default:
                divTypeOp.innerHTML = "A définir";
                break;
        }
        divTopBar.append(divTitleOp, divTypeOp);

        const divOperationDetails = document.createElement('div');
        divOperationDetails.id = 'op-details';
        const divQrcode = document.createElement('div');
        divQrcode.id = 'qrcode';
        const listOfChildren = document.getElementById(facItem.ID).childNodes;
        divQrcode.innerHTML = listOfChildren[3].innerHTML;
        const divDetails = document.createElement('div');
        divDetails.id = 'details';
        divOperationDetails.append(divQrcode, divDetails);
        const divInstructionDetail = document.createElement('div');
        divInstructionDetail.id = 'instruction-detail';
        divInstructionDetail.innerHTML = `Instruction : ${facItem.INSTRUCTIONS}`;
        const divOptionDetail = document.createElement('div');
        divOptionDetail.id = 'opt-detail';
        switch (facItem.TYPE_TRACA) {
            case 'OF':
                const listOFPart = [];
                facItem.details.forEach(pce => {
                    listOFPart.push(pce.ARTICLE);
                })
                divOptionDetail.innerText = `Details : Vous devez effectuer la traçabilité des pièces ci après : \n${listOFPart}`;
                break;

            default:
                divOptionDetail.innerHTML = `A définir !`;
                break;
        }
        divDetails.append(divInstructionDetail, divOptionDetail);
        divFac.append(divTopBar, divOperationDetails);
        return divFac;
    }
    addItemToTable(bodyOfTable) {
        const tdBtnDelete = new Cellule('string', tr, "delete")
        tdBtnDelete.classList.add('redHover')
        tdBtnDelete.onclick = () => {
            bodyOfTable.removeChild(tr)
            const xmlhttp = new XMLHttpRequest()
            xmlhttp.open('GET', `../script/php/deleteTracaID.php?IdTraca=${this.idTraca}`)
            xmlhttp.send()
        }
    }
    addNewTraca(articleAss, texte) {
        Traca.articleSap = articleAss
        const xmlhttp = new XMLHttpRequest()
        xmlhttp.open("GET", `../script/php/addNewTraca.php?article=${articleAss}&typeTraca=CONTROLE&instructions=${texte}`, true)
        xmlhttp.send()
    }

    //DIV NEW TRACA
    static buildNewControle() {
        const divNewControl = new Div('divNewControl', divNewTraca);
        let arrayListControlTools = [];
        const promToolList = doAjaxThings('../script/php/getToolList.php?secteur=ASSEMBLAGE COMPOSITE', 'json');
        promToolList.then((value) => {
            const result = value;
            result.forEach(element => {
                arrayListControlTools.push(element.DESIGNATION);
            })
            const articleMat = new SelectItem(arrayListControlTools);
            const textDescriptif = document.createElement('input');
            const btnValidation = document.createElement('button');
            btnValidation.innerText = 'CREER';
            btnValidation.onclick = () => {
                this.addNewTraca(articleAss.value, textDescriptif.value);
                updateTracaTable(articleAss.value);
                divNewTraca.removeChild(divNewControl);
            }
            divNewControl.appendChild(articleMat);
            divNewControl.appendChild(textDescriptif);
            divNewControl.appendChild(btnValidation);
        })
    }

    static buildNewAutoControle() {
        const divNewAutoControl = new Div('divNewAutoControl', divNewTraca);
        const textDescriptif = document.createElement('input');
        const btnValidation = document.createElement('button');
        btnValidation.innerText = 'CREER';
        btnValidation.onclick = () => {
            this.addNewTraca(articleAss.value, textDescriptif.value);
            updateTracaTable(articleAss.value);
            divNewTraca.removeChild(divNewAutoControl);
        }
        divNewAutoControl.appendChild(textDescriptif);
        divNewAutoControl.appendChild(btnValidation);

    }
}
class GroupOfTracaItem {

    constructor(_article, _ordNumber, _name, _listOfItem = null) {
        this.article = _article;
        this.orderNumber = _ordNumber;
        this.name = _name;
        this.listOfItem = _listOfItem;
    }
    add() {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', `../script/php/tracaGroup.php?typeOfEdit=new&article=${this.article}&orderNumber=${this.orderNumber}&name=${this.name}&listOfItem=${this.lisOfItem}`, true);
        xmlhttp.send();
    }
    editOrder(newOrderNumber) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', `typeOfEdit=editOrder&article=${this.article}&oldOrderNumber=${this.ordernumber}&newOrderNumber=${newOrdernumber}`, true);
        xmlhttp.onload = () => { this.orderNumber = newOrderNumber }
        xmlhttp.send();
    }
    editName(newName) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', `typeOfEdit=editName&article=${this.article}&orderNumber=${this.ordernumber}&newName=${newName}`, true);
        xmlhttp.onload = () => { this.name = newName }
        xmlhttp.send();
    }
    editOrder(newListOfItem) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', `typeOfEdit=editListOfItem&article=${this.article}&orderNumber=${this.ordernumber}&newListOfItem=${newListOfItem}`, true);
        xmlhttp.onload = () => { this.listOfItem = newListOfItem }
        xmlhttp.send();
    }
}



class Controle {
    constructor() {
        this.idFac
        this.controlToolNumber
        this.controlToolValidityDate
        this.controleur
    }

    createNewTraca() {



    }
}

function addLoader() {
    const body = document.querySelector('body');
    const divLoader = document.createElement('div');
    divLoader.id = 'loader';
    divLoader.classList.add('loader');
    body.appendChild(divLoader)
}

function removeLoader() {
    const loader = document.getElementById('loader');
    loader.remove();
}

// for Each element in JSON traca sur l'article
// new traca 
//     ajouter une ligne dans le tableau
//         cellule bouton déplaceur

//         cellule ID
//         cellule type
//         cellule description
//         cellule QRCode

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