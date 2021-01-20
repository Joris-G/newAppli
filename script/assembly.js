import {
    Div,
    Cellule,
    SelectItem,
    doAjaxThings,
    addLoader,
    removeLoader,
    Bouton,
} from "./toolBox.js"

export class Assembly {
    constructor() {}
    getListOfTraca() {
        return doAjaxThings(`../script/php/getNomTraca.php?article=${this.article}`, 'json');
    }

    getAssemblyProgress() {
        return doAjaxThings(`../script/php/getTracaAssembly.php?of=${this.workOrder}`, 'json')
    }
    updateGroupStatus() {
        console.log(this.listOfNomTraca, this.assyProgress);
    }
    async loadAssembly(_workOrder) {
        addLoader();
        this.article = _workOrder[0];
        this.workOrder = _workOrder[1];
        return Promise.all([this.getListOfTraca(), this.getAssemblyProgress()])
            .then((value) => {
                this.listOfNomTraca = value[0];
                this.progress = value[1];
                console.log(this);
                removeLoader();
            });
    }


    upDateTracaPage() {
        this.buildTitleTopBar();
        addLoader();
        console.log(this);
        this.getBoxName(this.workOrder, "LH").then(boxName => {
            this.boxName = boxName
            this.addBoxName();
            removeLoader();
        });

        builLeftSideBar();
        const divGroupStatus = document.createElement('div');
        divGroupStatus.id = 'groupStatus';
        divGroupStatus.classList.add('divGroupStatus');
        const divLeftSideBar = document.getElementById('leftSideBar');
        divLeftSideBar.appendChild(divGroupStatus);

        buildWorkWindow();

        divGetIdFac.classList.remove("inactive");
        inputFacId.focus();
        inputFacId.classList.add("active-input");
        changeInstructionText("Scanner le QR Code de l'opération de la FAC");
        const listOfArrow = [];
        newAssembly.loadAssembly(newWorkOrder)
            .then(() => {
                //GLOBAL PROGRESS %
                let totalOp = 0;
                console.log(newAssembly);
                newAssembly.listOfNomTraca.forEach(group => {
                    totalOp += group.items.length;
                });
                const globalProgress = (newAssembly.progress.length / totalOp * 100).toFixed(0);
                addProgressAssembly(globalProgress);

                newAssembly.listOfNomTraca.forEach(group => {
                    let groupScore = 0;
                    //GROUPS OVERVIEW
                    //A DIV PER GROUP
                    const divItemGroup = document.createElement("div");
                    divItemGroup.classList.add("itemGroup");
                    divItemGroup.id = `itemGroup-${group.ORDRE}`;
                    const divOperationsOverview = document.getElementById('operationsOverview');
                    divOperationsOverview.appendChild(divItemGroup);
                    //A DIV PER OPERATION IN GROUPS
                    const listOfOperation = group.items;
                    listOfOperation.forEach((item) => {
                        item.STATE = new Operation(item).checkOpStatus(newAssembly.progress).state;
                        groupScore += item.STATE; // POUR DETERMINER LA COULEUR DU GROUPE ET CALCUL DU POURCENTAGE D'AVANCEMENT
                        const newOperation = new Operation(item);
                        const divOperation = newOperation.drawOperation();
                        divItemGroup.appendChild(divOperation);
                        divOperation.onclick = () => {
                            console.log(newOperation.checkOpStatus(newAssembly.progress));
                            newAssembly.showOperation(item.ID);
                            const previousSelectedItem = document.querySelector(".currentOperation");
                            if (previousSelectedItem != null) {
                                previousSelectedItem.classList.remove("currentOperation");
                            }
                            divOperation.classList.add("currentOperation");
                        };
                    });

                    //GROUP ARROWS
                    //ON AJOUTE UNE PROPRIETE STATE A CHAQUE GROUPE POUR STOCKER SON STATUT POUR DEFINIR SA COULEUR
                    switch (groupScore) {
                        case listOfOperation.length:
                            group.STATE = 1;
                            break;
                        case 0:
                            group.STATE = 3;
                            break;
                        default:
                            group.STATE = 2;
                            break;
                    }
                    const groupArrow = new DownArrowStatus(group.STATE, "S", group.ID_GROUP);
                    const groupProgress = (groupScore / listOfOperation.length * 100).toFixed(0);
                    groupArrow.drawArrow()
                        .then((arrow) => {
                            const divArrow = document.createElement("div");
                            divArrow.id = `arrow-${group.ORDRE}`;
                            divArrow.style.order = group.ORDRE;
                            if (group.ORDRE != 1) {
                                divArrow.style.top = `${(-50*group.ORDRE+50)}px`;
                            }
                            divArrow.onclick = () => {
                                const previousSelectedItem = document.querySelector(".currentItemGroup");
                                if (previousSelectedItem != null) {
                                    previousSelectedItem.classList.remove("currentItemGroup");
                                }
                                divItemGroup.classList.add("currentItemGroup");
                            };
                            divArrow.classList.add("arrow");
                            const textArrow = document.createElement("div");
                            textArrow.innerText = `${groupArrow.name}\n ${groupProgress} %`;
                            textArrow.classList.add("textArrow");
                            divArrow.append(arrow, textArrow);
                            groupArrow.changeColor();
                            listOfArrow.push([divArrow, groupArrow]);
                            const divGroupStatus = document.getElementById('groupStatus');
                            divGroupStatus.appendChild(divArrow);
                        });
                });
            });
    }

    /**
     *
     *
     * @return {Boolean} 
     * @memberof Assembly
     */
    addBoxName() {
        if (this.boxName) {
            const divBoxName = document.getElementById('box-name');
            divBoxName.innerHTML += this.boxName;
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     *
     * @param {Number} _progressAssembly
     */
    addProgressAssembly(_progressAssembly) {
        const divGlobalProgress = document.getElementById('global-progress');
        divGlobalProgress.innerHTML = `Progress : ${_progressAssembly}%`;
    }

    /**
     *Récupère le nom d'une box à partir du numéro d'OF de la pièce assemblée et du côté. 
     *Prévoir une modification lorsque la table des OF assemblage sera construite
     *
     * @param {WorkOrder} _workOrder
     * @param {string} _side
     * @return {Promise} 
     */
    getBoxName(_workOrder, _side) {
        this.programme = 'ELEVATOR';
        if (this.programme == 'ELEVAOTR') {
            let article;
            (_side === "LH") ? article = 7172242: article = 7172275;
            const promBoxName = doAjaxThings(`../script/php/getBoxName.php?of=${_workOrder}&article=${article}`, "text");
            return promBoxName;
        }
    }

    /**
     *Construit une "left sidebar" dans le content
     *
     */
    builLeftSideBar() {
        let divLeftSideBarToDelete = document.querySelector('.leftSideBar')
        if (divLeftSideBarToDelete) {
            divLeftSideBarToDelete.remove();
        }
        const divLeftSideBar = document.createElement("div");
        divLeftSideBar.id = 'leftSideBar';
        divLeftSideBar.classList.add("leftSideBar");
        divContent.appendChild(divLeftSideBar);
    }

    buildWorkWindow() {
        let divWorkWindow = document.querySelector('.workWindow')
        if (divWorkWindow) {
            divWorkWindow.remove();
        }
        divWorkWindow = document.createElement("div");
        divWorkWindow.classList.add("workWindow");
        divContent.appendChild(divWorkWindow);
        ////GROUP DESCRIPTION
        const divGroupDescription = document.createElement("div");
        divGroupDescription.classList.add("groupDesc");
        divGroupDescription.id = 'group-des';
        ////OPERATION
        const divOperation = document.createElement("div");
        divOperation.classList.add("operations");
        ////OPERATION COLUMN
        const divOperationsOverview = document.createElement("div");
        divOperationsOverview.id = "operationsOverview";
        ////OPERATION DETAILS
        const divOperationDetails = document.createElement("div");
        divOperationDetails.id = "operationDetails";
        divOperation.append(divOperationsOverview, divOperationDetails);
        divWorkWindow.append(divGroupDescription, divOperation);
        return divWorkWindow;
    }

    /**
     *Construit la barre de titre
     *
     */
    buildTitleTopBar() {
        let titleTopBar = document.querySelector('.title-top')
        if (titleTopBar) {
            titleTopBar.remove();
        }
        titleTopBar = document.createElement('div');
        titleTopBar.classList.add('title-top');
        const divTitle = document.createElement('div');
        const title = "Assemblage";
        divTitle.innerHTML = title.toUpperCase();
        divTitle.classList.add("title-font");
        const divBoxName = document.createElement('div');
        divBoxName.innerHTML = "Box Name : ";
        divBoxName.id = 'box-name';
        const divGlobalProgress = document.createElement('div');
        divGlobalProgress.id = "global-progress";
        titleTopBar.append(divBoxName, divTitle, divGlobalProgress)
        document.querySelector('.module').appendChild(titleTopBar);
    }

    showOperation(idOp) {
        addLoader();
        let operation;
        let currentGroup;
        this.listOfNomTraca.forEach(group => {
            group.items.forEach(item => {
                if (item.ID == idOp) {
                    operation = item;
                    const op = new Operation(operation);
                    op.checkOpStatus(this.progress);
                    currentGroup = group;
                }
            });
            const inputFacId = document.getElementById('input-idFac');
            inputFacId.style.display = "none";
            inputFacId.classList.remove("active-input");
            inputFacId.value = "";
            const previousSelectedItem = document.querySelector(".currentItemGroup");
            if (previousSelectedItem != null) {
                previousSelectedItem.classList.remove("currentItemGroup");
            }
            const divItemGroupToShow = document.getElementById(`itemGroup-${group.ORDRE}`);
            divItemGroupToShow.classList.add("currentItemGroup");
            const divGroupDescription = document.getElementById('group-des');
            divGroupDescription.innerHTML = `${currentGroup.ID_GROUP} - ${currentGroup.DESCRIPTION}`;
            divGroupDescription.classList.add('groupDesc');
            const tracaRecord = new TracaRecord(this.workOrder, operation);
            tracaRecord.tracaDetail.then(tracaDetails => {
                tracaRecord.initTraca(tracaDetails);
                removeLoader();
            });
        });

    }
}
export class Group {
    constructor(jsonGroup) {
        this.name = this.status = red;
    }
}
export class Operation {
    constructor(item) {
        this.shortName = item.TYPE_TRACA;
        this.idOp = item.ID_FAC;
        this.instructions = item.INSTRUCTIONS;
        this.state = item.STATE;
        this.item = item;
    }
    getType() { return this.shortName; }
    getInstructions() { return this.instructions; }
    getState() { return this.state; }

    drawOperation() {
        const divOp = document.createElement('div');
        const divOpState = document.createElement('div');
        const round = document.createElement('div');
        round.classList.add('round');
        divOpState.appendChild(round);
        const divOpDesc = document.createElement('div');
        switch (this.state) {
            case 1:
                round.classList.add('op-completed');
                break;
            case 0:
                round.classList.add('op-not-initiated');
                break;
            default:
                break;
        }
        round.classList.add('op-state');
        divOp.classList.add('operation');
        divOpDesc.id = `${this.idOp} - ${this.instructions}`;
        divOpDesc.innerHTML = divOpDesc.id;
        divOp.append(divOpState, divOpDesc);
        return divOp;
    }
    open() {
        const divStep = document.createElement('div');
        divStep.classList.add('step');
        const divOperationDetails = document.getElementById('operationDetails');
        const detailInstructions = this.instructions;
        return divStep
    }

    /**
     *
     *
     * @param {*} progress
     * @return {Object} state = statut de l'opération ET details = le détails des traça effecutées
     */
    checkOpStatus(progress) {
        let opState;
        const test = progress.find(test => test['ID FAC'] == this.idOp.ID);
        if (test) {
            opState = 1;
            return { 'state': opState, 'details': test.tracaDetails };
        } else {
            opState = 0;
            return { 'state': opState };
        }
    }
}
class TracaRecord {
    constructor(_workOrder, _operation) {
        this.workOrder = _workOrder;
        this.operation = _operation;
        this.details = this.operation.details;
        this.tracaDetail = doAjaxThings(`../script/php/getTraca.php?idTraca=${this.operation.ID}`, "json");
    }
    initTraca(tracaDatas) {
        const matricule = document.getElementById('matricule').innerHTML;
        console.log(this.operation, this.details);
        const previousDivTraca = document.getElementById("operationDetails");
        if (previousDivTraca.childNodes.length != 0) {
            previousDivTraca.childNodes.forEach((currentItem) => {
                currentItem.remove();
            });
        }
        const divOperationDetails = document.getElementById('operationDetails');
        const divTraca = new Div("operationDetails", divOperationDetails);
        const divTracaType = new Div("truc", divTraca);
        divTracaType.innerHTML = this.operation.TYPE_TRACA;
        const divInstructions = new Div("truc", divTraca);
        divInstructions.innerHTML = `INSTRUCTIONS FAC: ${this.operation.INSTRUCTIONS}`;
        const btnConfirm = new Bouton('confirm');
        const divButton = btnConfirm.drawButton();
        if (this.details.state == 1) {
            changeInstructionText('La traçabilité sur cette opération à déjà été faite');
            divTraca.classList.add('recorded-traca');
        }
        //const btnScan = buildBtnScan();
        divTraca.appendChild(btnScan);
        console.log(this.operation.TYPE_TRACA);
        console.log(this.operation);
        switch (this.operation.TYPE_TRACA) {
            case "Matiere":
                changeInstructionText(`Scanner le QR Code présent sur l 'étiquette du produit`);
                const inputMaterialTraca = document.createElement("input");
                inputMaterialTraca.id = "inputMaterial";
                inputMaterialTraca.classList.add("hidden", "active-input");
                console.log(inputMaterialTraca);
                divTraca.appendChild(inputMaterialTraca);
                const divDetails = document.createElement('div');
                divDetails.id = 'details';
                this.operation.details.forEach(detail => {
                    const divProduct = document.createElement('div');
                    divProduct.id = 'product';
                    const productRefSap = document.createElement('div');
                    productRefSap.innerHTML = detail.ARTICLE;
                    const lblProductRefSap = document.createElement('label');
                    lblProductRefSap.innerHTML = 'Référence SAP';
                    const productDesignation = document.createElement('div');
                    promListMatiere.then(matList => {
                        const matiere = matList.find(mat => mat.ARTICLE == detail.ARTICLE);
                        productDesignation.innerHTML = matiere['DESIGNATION SIMPLIFIEE'];
                    })
                    const lblProductDesignation = document.createElement('label');
                    lblProductDesignation.innerHTML = "Désignation";
                    const productRef = document.createElement('div');
                    const productDes = document.createElement('div');
                    productRef.append(lblProductRefSap, productRefSap);
                    productDes.append(lblProductDesignation, productDesignation);
                    divProduct.append(productRef, productDes);
                    divDetails.appendChild(divProduct);
                });
                divTraca.appendChild(divDetails);
                divTraca.appendChild(divButton);
                inputMaterialTraca.focus();
                inputMaterialTraca.onchange = () => {
                    const matiere = new Matiere(inputMaterialTraca.value);
                    if (matiere.isMaterial()) {
                        //SI MATIERE AVEC CALCUL TACK
                        const scanInput = scanProc(inputMaterialTraca.value);
                        promListMatiere.then(listOfMat => {
                            console.log(listOfMat);
                            const mat = listOfMat.find(mat => mat.ID == scanInput[1][0])
                            console.log(mat);
                            if (mat['DUREE DE VIE'] != null) {
                                promAllOpenMaterials.then(matList => {
                                    //TEST SI PERIME A L'AMBIANT
                                    const myOpenMat = matList.find(theOpenMat => theOpenMat['ID MATERIAL ENTRY'] == scanInput[1][1]);
                                    const initDate = new Date(myOpenMat['INIT DATE']);
                                    const potLife = parseInt(mat['DUREE DE VIE']) * 60 * 60 * 1000;
                                    const endLife = new Date(initDate.getTime() + potLife);
                                    if (new Date() > endLife) {
                                        console.log('produit périmé')
                                            //procédure validation qualité
                                            //ET
                                            // On enregistre la matière avec une statut 0
                                        doAjaxThings(`../script/php/saveTraca.php?typeTraca=MATIERE&of=${this.workOrder}&idFac=${this.idFac}&matricule=${matricule}&idMat=${scanInput[1][1]}&sanction=0`, 'text');
                                    } else {
                                        console.log('OK');
                                        const msg = `Vous avez jusqu'au : ${endLife.getDate()}/${endLife.getMonth()+1}/${endLife.getFullYear()} à ${endLife.getHours()}h${endLife.getMinutes()}`;
                                        console.log(msg);
                                        //on enregistre la matière avec le statut 1
                                        doAjaxThings(`../script/php/saveTraca.php?typeTraca=MATIERE&of=${this.workOrder}&idFac=${this.idFac}&matricule=${matricule}&idMat=${scanInput[1][1]}&sanction=1`, 'text');
                                    }
                                });
                            } else {
                                //On enregistre la matière avec le statut 1
                                doAjaxThings(`../script/php/saveTraca.php?typeTraca=MATIERE&of=${this.workOrder}&idFac=${this.idFac}&matricule=${matricule}&idMat=${scanInput[1][1]}&sanction=1`, 'text');
                            }
                        });
                        divButton.onclick = () => {
                            doAjaxThings(`../script/php/saveTraca.php?typeTraca=MATIERE&of=${this.workOrder}&idFac=${this.idFac}&matricule=204292&shelflifeDate=${matiere.shelflifeDate.toISOString()}&batchNumber=${matiere.batchNumber}`, 'text')
                                .then(() => {
                                    const trRecap = document.getElementById(`tr${this.idFac}`);
                                    trRecap.classList.add("step-done");
                                });
                            divTraca.remove();
                            divGetIdFac.style.display = "";
                            inputFacId.focus();
                        }
                    } else {
                        inputMaterialTraca.value = "";
                    }
                }

                const divMaterial = document.createElement('div');
                divMaterial.id = "material";
                const divArticle = document.createElement('div');
                const lblArticle = document.createElement('label');
                const usedArticle = document.createElement('div');
                const lblDesignationArticle = document.createElement('label');
                const designationArticle = document.createElement('div');

                if (this.details.state === 1) {
                    divTraca.classList.add('recorded-traca');
                }
                break;
            case "Controle":
                changeInstructionText(`Confirmer la conformité de l'opération`);

                tracaDatas.forEach(traca => {
                    if (traca.NeedTool == 1) {
                        changeInstructionText(`Identifier les outillages de contrôle et les scannant`);
                        const divTool = document.createElement('div');
                        divTool.id = 'tool';
                        const lblTool = document.createElement('label');
                        lblTool.innerHTML = `Outillage à utiliser : `
                        const toolToUse = document.createElement('span');
                        let toolList;
                        promToolList.then(_toolList => {
                            toolList = _toolList
                            const tool = _toolList.find(tool => traca.OUTILLAGE);
                            toolToUse.innerText = tool.TYPE;
                        });
                        const inputUsedTool = document.createElement('input');
                        inputUsedTool.classList.add('active-input', 'hidden');
                        inputUsedTool.id = 'input-used-tool';
                        inputUsedTool.onchange = () => {
                            if (checkControlTool(inputUsedTool.value, toolToUse)) {
                                this.usedToolNumber = scanProc(inputUsedTool.value)[1][0];
                                const usedTool = document.createElement('div');
                                usedTool.id = 'used-tool';
                                //Recherche dans la base ECME l'outillage utilisé en affichant son type et le numéro de comacola
                                promECME.then(listECME => {
                                    const usedToolECME = listECME.find(tool => this.usedToolNumber);
                                    const usedToolDef = toolList.find(usedToolDef => usedToolECME.TYPE_ID)
                                    const comacola = usedToolECME.REFERENCE;
                                    const desUsedTool = usedToolDef.TYPE;

                                    const divUsedToolDesignation = document.createElement('div');
                                    const lblUsedToolDes = document.createElement('label');
                                    lblUsedToolDes.innerHTML = 'Outillage de controle utilisé';
                                    const usedToolDesignation = document.createElement('div');
                                    usedToolDesignation.id = 'usedToolDesignation';
                                    usedToolDesignation.innerHTML = desUsedTool;
                                    divUsedToolDesignation.append(lblUsedToolDes, usedToolDesignation);

                                    const divUsedToolComacola = document.createElement('div');
                                    const lblComacola = document.createElement('label');
                                    lblComacola.innerHTML = 'COMACOLA';
                                    const usedToolComacola = document.createElement('div');
                                    usedToolComacola.id = 'usedToolComacola';
                                    usedToolComacola.innerHTML = comacola;
                                    divUsedToolComacola.append(lblComacola, usedToolComacola);

                                    usedTool.append(divUsedToolDesignation, divUsedToolComacola);
                                    divTool.appendChild(usedTool);
                                });

                                //déverouiller bouton confirmer si statut
                                if (traca.OUTILLAGE == this.usedToolNumber) {
                                    btnConfirm.setEnable();
                                }
                            }
                        }
                        divButton.onclick = () => {
                            doAjaxThings(`../script/php/saveTraca.php?typeTraca=Controle&of=${this.workOrder}&idFac=${tracaDatas[0]['ID TRACA']}&matricule=204292&idTracaControl=${tracaDatas[0].ID}&tool=${this.usedToolNumber}&sanction=${sanctionChoice.sanction}`, 'text')
                                .then(() => {
                                    upDateTracaPage(newAssembly.workOrder);
                                })
                        }
                        divTool.append(lblTool, toolToUse, inputUsedTool);
                        inputUsedTool.focus();
                        divTraca.appendChild(divTool);
                    }
                });

                const sanctionChoice = new SanctionChoice();
                divTraca.appendChild(sanctionChoice.buildSanctionChoice());

                divTraca.appendChild(divButton);
                break;
            case "OF":
                changeInstructionText(`Scanner le QR Code présent sur l'étiquette du  ???`);
                divTraca.appendChild(this.buildTableOfTable(tracaDatas));
                const allTraca = new TracaOFRecorder(tracaDatas);
                const inputOfTraca = document.createElement("input");
                inputOfTraca.id = "inputOf";
                inputOfTraca.value = ""
                inputOfTraca.classList.add("active-input", 'hidden');
                divTraca.appendChild(inputOfTraca);
                inputOfTraca.focus();
                inputOfTraca.onchange = (event) => {
                    const of = new WorkOrder(scanProc(event.target.value));
                    console.log(of);
                    allTraca.addOf(of);
                    inputOfTraca.focus();
                    inputOfTraca.value = "";
                    if (checkCompleteTraca()) {
                        btnConfirm.setEnable();
                    }
                };
                const boxName = document.getElementById('input-box-name');
                divButton.onclick = () => {
                    addLoader();
                    if (boxName != undefined) {
                        doAjaxThings(`../script/php/saveTraca.php?typeTraca=OF&of=${this.workOrder}&listOf=${JSON.stringify(allTraca.allScanOF)}&idFac=${allTraca.tracaDatas[0]['ID TRACA']}&boxName=${boxName.value}&matricule=${matricule}`, 'text')
                            .then((msg) => {
                                removeLoader();
                                console.log(msg);
                                //si message traça done 
                                upDateTracaPage(newAssembly.workOrder);
                            });
                    } else {
                        doAjaxThings(`../script/php/saveTraca.php?typeTraca=OF&of=${this.workOrder}&listOf=${JSON.stringify(allTraca.allScanOF)}&idFac=${allTraca.tracaDatas[0]['ID TRACA']}&matricule=${matricule}`, 'text')
                            .then((msg) => {
                                removeLoader();
                                console.log(msg);
                                //si message traça done 
                                upDateTracaPage(newAssembly.workOrder);
                            });
                    }

                }

                if (boxName != undefined) {
                    boxName.oninput = () => {
                        if (checkCompleteTraca()) {
                            btnConfirm.setEnable();
                        }
                    }
                }

                function checkCompleteTraca() {
                    //Si toutes les lignes sont vertes et si l'input BOX NAME est remplis s'il existe
                    const nbOfCompletedRows = document.getElementsByClassName('full').length;
                    if (tracaDatas.length == nbOfCompletedRows) {
                        if (document.getElementById('input-box-name') == undefined || document.getElementById('input-box-name').value != "") {
                            return true;
                        } else {
                            document.getElementById('input-box-name').style.border = "3px solid red";
                        }
                    } else {
                        return false;
                    }
                }
                // divGetIdFac.style.display = "";

                if (this.details.state == 1) {
                    this.fillTracaOf();
                }
                divTraca.appendChild(btnConfirm.drawButton());
                break;

            default:
                break;
        }
    }
    buildTableOfTable(_tracaDatas) {
        const divTableOfPartToRecord = document.createElement('div');
        const tableOfPartToRecord = document.createElement('table');
        const tableHeader = document.createElement('thead');
        const tableBody = document.createElement('tbody');
        //HEADER
        const trHeader = document.createElement('tr');
        const tdArticle = document.createElement('td');
        const tdDesignation = document.createElement('td');
        const tdQuantity = document.createElement('td');
        const tdScanWorkOrder = document.createElement('td');
        tdArticle.innerHTML = "ARTICLE";
        tdDesignation.innerHTML = "DESIGNATION";
        tdQuantity.innerHTML = "QUANTITE";
        tdScanWorkOrder.innerHTML = "SCAN OF";

        trHeader.append(tdArticle, tdDesignation, tdQuantity, tdScanWorkOrder);
        tableHeader.appendChild(trHeader);

        //BODY
        _tracaDatas.forEach(element => {
            const trPartToRecord = document.createElement('tr');
            const tdPartArticle = document.createElement('td');
            const tdPartDesignation = document.createElement('td');
            const tdPartQuatity = document.createElement('td');
            const tdWorkOrder = document.createElement('td');
            tdPartArticle.innerHTML = element.ARTICLE;
            tdPartDesignation.innerHTML = element.DESIGNATION;
            tdPartQuatity.innerHTML = element.QUANTITE;
            tdWorkOrder.id = element.ID;
            trPartToRecord.append(tdPartArticle, tdPartDesignation, tdPartQuatity, tdWorkOrder);

            if (element.ARTICLE == 7172242 || element.ARTICLE == 7172275) {
                const tdHeaderSupp = document.createElement('td');
                tdHeaderSupp.innerHTML = 'COMPLEMENTS';
                trHeader.appendChild(tdHeaderSupp);
                const tdBoxName = document.createElement('td');
                const lblTdBoxName = document.createElement('span');
                lblTdBoxName.innerHTML = 'Nom de la BOX';
                const inputBoxName = document.createElement('input');
                inputBoxName.id = 'input-box-name';
                tdBoxName.append(lblTdBoxName, inputBoxName);
                trPartToRecord.appendChild(tdBoxName);
            }

            tableBody.appendChild(trPartToRecord);
        });
        //TABLE
        tableOfPartToRecord.append(tableHeader, tableBody);

        divTableOfPartToRecord.appendChild(tableOfPartToRecord);

        return divTableOfPartToRecord;
    }

    /**
     *Rempli la traça existante
     *
     * @memberof TracaRecord
     */
    fillTracaOf() {
        console.log(this.details.details);
        this.details.details.forEach(tracaOf => {
            const itemToFill = document.getElementById(`${tracaOf.ID_TRACA_OF}`);
            if (itemToFill.innerHTML != "") {
                itemToFill.innerHTML += ',';
            }
            itemToFill.innerHTML += tracaOf.OF;
        });
    }
}