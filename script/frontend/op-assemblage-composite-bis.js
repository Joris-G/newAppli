import {
    doAjaxThings,
    addLoader,
    removeLoader,
    Bouton,
    Input,
    SanctionBouton,
    ModalBox,
    DownArrowStatus,
    LabelText,
} from "../toolBox.js";

class Model {
    constructor() {
        // The state of the model, an array of todo objects, prepopulated with some data
    }

    async getProcess(_articleSap) {
        return doAjaxThings(`../script/php/getNomTraca.php?article=${_articleSap}`, 'json');
    }
    getAllUsers() {
        return doAjaxThings(`../script/php/getALlUsers.php`, 'json');
    }

    getAllTools() {
        return doAjaxThings(`../script/php/getToolList.php?secteur=3`, 'json');
    }

    getAllECME() {
        return doAjaxThings(`../script/php/getECMEToolList.php?secteur=3`, 'json');
    }

    getArrow(_status) {
        let status;
        if (_status == 1) {
            status = 1;
        } else if (_status > 0) {
            status = 2;
        } else {
            status = 3;
        }

        const arrow = new DownArrowStatus(status, 'S');
        arrow.drawArrow().then(arrowResult => {
            arrow.changeColor();
        })
        return arrow;

        // const xhr = new XMLHttpRequest();
        // xhr.open("GET", `../public/src/img/fleche-S.svg`, true);
        // xhr.overrideMimeType("image/svg+xml")
        // xhr.onload = () => {
        //     this.arrow = xhr.responseXML.documentElement;
        //     resolve(this.arrow);
        // }
        // xhr.send();

    }

    getGroup(_idGroup) {
        let group;
        this.process.then(groups => {
            group = groups.find(group => group.ID === _idGroup);
            return group;
        });
    }
    async getProgress(_workOrder, _articleSap) {
        this.progress = await doAjaxThings(`../script/php/getTracaAssembly.php?of=${_workOrder}&article=${_articleSap}`, 'json');
        return this.progress;
    }

    getTraca(_id) {
        let traca;
        this.progress.forEach(group => {
            group.items.forEach(tracaItem => {
                if (tracaItem.ID == _id) traca = tracaItem;
            });
        });
        return traca;
    }

    /**
     * 
     * @param {Number} _article 
     */
    getAssyPart(_article) {
        return doAjaxThings(`../script/php/getArticle.php?article=${_article}`, 'json');
    }

    /**
     *
     *
     * @param {Number} _articleSap
     * @param {Number} _workOrder
     * @return {*} 
     * @memberof Model
     */
    getAssemblyStatus(_articleSap, _workOrder) {
        return new Promise((resolve, reject) => {
            const promProcess = this.getProcess(_articleSap);
            const promProgress = this.getProgress(_workOrder, _articleSap);
            const data = Promise.all([promProcess, promProgress]);
            data.then(result => {
                const process = result[0];
                const progress = result[1];
                progress.forEach(group => {
                    let groupProgress = 0;
                    group.items.forEach(item => {

                        if (item.traca) {
                            groupProgress = groupProgress + 1;
                            item.STATUS = 1;
                        } else {
                            item.STATUS = 0;
                        }
                    });
                    group.PROGRESS = (groupProgress / group.items.length).toFixed(2);
                });
                console.log(progress);
                resolve(progress);
            });
        });

    }


    saveTracaOf(_workOrder, _idFAC, _currentTraca, _userMatricule) {
        return doAjaxThings(`../script/php/saveTraca.php?typeTraca=OF&of=${_workOrder}&listOf=${JSON.stringify(_currentTraca)}&idFac=${_idFAC}&matricule=${_userMatricule}`, 'text');
        // if (boxName != undefined) {
        //     doAjaxThings(`../script/php/saveTraca.php?typeTraca=OF&of=${this.workOrder}&listOf=${JSON.stringify(allTraca.allScanOF)}&idFac=${allTraca.tracaDatas[0]['ID TRACA']}&boxName=${boxName.value}&matricule=${matricule}`, 'text')
        //         .then((msg) => {

        //         });
        // } else {
        //     doAjaxThings(`../script/php/saveTraca.php?typeTraca=OF&of=${this.workOrder}&listOf=${JSON.stringify(allTraca.allScanOF)}&idFac=${allTraca.tracaDatas[0]['ID TRACA']}&matricule=${matricule}`, 'text')
        //         .then((msg) => {

        //         });
        // }
    }
    saveTracaMatiere(_workOrder, _idFAC, _currentTraca, _userMatricule) {
        return doAjaxThings(`../script/php/saveTraca.php?typeTraca=MATIERE&of=${_workOrder}&listOf=${JSON.stringify(_currentTraca)}&idFac=${_idFAC}&matricule=${_userMatricule}`, 'text')
    }
    saveTracaControle(_workOrder, _idFAC, _currentTraca, _userMatricule, _sanction = null) {
        return doAjaxThings(`../script/php/saveTraca.php?typeTraca=Controle&of=${_workOrder}&listOf=${JSON.stringify(_currentTraca)}&idFac=${_idFAC}&matricule=${_userMatricule}&sanction=${_sanction}`, 'text');
    }

    getGroupStatus(_groupId) {

    }
    getOpStatus(_idOp) {

    }

    getOperation(_idOpe) {
        let operation;
        console.log(_idOpe);
        this.progress.forEach(group => {
            const result = group.items.find(item => item.ID == _idOpe);
            if (result) {
                operation = result;
            }
        });
        return operation;

    }

    /**
     *
     *
     * @param {Number} _matId Material id du registre des matières ouvertes
     * @memberof Model
     */
    getShelflifeDate(_matId) {
        return doAjaxThings(`../script/php/getShelflifeDate.php?idMat=${_matId}`, 'json');
    }
}
class ViewContent {
    constructor() {}

    /**
     *Create an element with an optional CSS class
     *
     * @param {*} tag
     * @param {String} className
     * @return {*} 
     * @memberof ViewContent
     */
    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) element.classList.add(className);
        return element;
    }

    /**
     *
     *
     * @param {String} textArrow
     * @param {Number} progress
     * @return {HTMLDivElement} 
     * @memberof ViewContent
     */
    createGroupElement(textArrow, progress) {
        const groupArrow = this.createElement('div', 'group-arrow');
        const divProgress = this.createElement('div', 'progressRate');
        divProgress.innerHTML = `avancement : ${(progress*100).toFixed(0)} %`;
        groupArrow.append(textArrow, divProgress);
        return groupArrow;
    }

    createOperation(_operation) {
        const promGetAllECME = doAjaxThings(`../script/php/getECMEToolList.php?secteur=3`, 'json');
        console.log(_operation);
        const operation = this.createElement('div', 'operation');
        operation.id = `operation-${_operation.ID}`;
        const operationTopBar = this.createElement('div', 'operation-top-bar');
        const btnScan = new Bouton('scan');
        btnScan.setEnable();
        const divGroupTitle = this.createElement('div', 'groupe-title');
        const assemblyStatus = this.controller.getProcess(this.getElement('.part-article').innerHTML);
        assemblyStatus.then(process => {
            const currentGroup = process.find(group => group.ID == _operation.GROUPE);
            divGroupTitle.innerHTML = currentGroup.DESCRIPTION;
        });

        const operationType = this.createElement('div', 'operation-type');
        const operationTypeText = this.createElement('div', 'ope-type');
        operationTypeText.innerText = _operation.TYPE_TRACA;
        const divImgType = this.createElement('img', 'operation-type-img');
        operationType.append(divImgType, operationTypeText);
        operationTopBar.append(divGroupTitle, operationType);
        const operationInstruction = this.createElement('div', 'operation-instruction');
        operationInstruction.innerHTML = _operation.INSTRUCTIONS;
        const operationDetails = this.createElement('div', 'operation_details');
        const btnConfirm = new Bouton('confirm');
        const table = document.createElement('table');
        const tableHeader = document.createElement('thead');
        const tableBody = document.createElement('tbody');
        const trHeader = document.createElement('tr');

        const tdDelete = document.createElement('td');
        tdDelete.innerHTML = "SUPPRIMER";
        const tdDeleteCell = document.createElement('td');
        const btnDelete = document.createElement('img');
        btnDelete.src = "../public/src/img/poub_daher_bleue-03.png";
        tdDeleteCell.classList.add('delete-cell');
        btnDelete.classList.add('tbl-img');
        tdDeleteCell.appendChild(btnDelete);
        const role = this.getElement('#role').innerHTML;
        switch (_operation.TYPE_TRACA) {
            case 'OF':
                //operation.appendChild(btnScan.drawButton());
                operationDetails.innerHTML = "";
                //HEADER
                const tdArticle = document.createElement('td');
                const tdHeaderPartDesignation = document.createElement('td');
                const tdQuantity = document.createElement('td');
                const tdScanWorkOrder = document.createElement('td');
                tdArticle.innerHTML = "ARTICLE";
                tdHeaderPartDesignation.innerHTML = "DESIGNATION";
                tdQuantity.innerHTML = "QUANTITE";
                tdScanWorkOrder.innerHTML = "SCAN OF";
                trHeader.append(tdArticle, tdHeaderPartDesignation, tdQuantity, tdScanWorkOrder);

                if (role == 'CONTROLE') trHeader.appendChild(tdDelete);
                tableHeader.appendChild(trHeader);
                //BODY
                _operation.nomTracaDetail.forEach(element => {
                    const trPartToRecord = document.createElement('tr');
                    const tdPartArticle = document.createElement('td');
                    const tdPartDesignation = document.createElement('td');
                    const tdPartQuatity = document.createElement('td');
                    const tdWorkOrder = document.createElement('td');
                    tdDeleteCell.onclick = () => {
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
                    tdDeleteCell.onmouseover = () => {
                        btnDelete.src = "../public/src/img/poub_daher_rouge-03.png";
                        trPartToRecord.classList.add('delete');
                    }
                    tdDeleteCell.onmouseleave = () => {
                        btnDelete.src = "../public/src/img/poub_daher_bleue-03.png";
                        trPartToRecord.classList.remove('delete');
                    }

                    tdPartArticle.innerHTML = element.ARTICLE;
                    tdPartDesignation.innerHTML = element.DESIGNATION;
                    tdPartQuatity.innerHTML = element.QUANTITE;
                    for (let index = 1; index <= element.QUANTITE; index++) {
                        const tdWorkOrderItem = document.createElement('td');
                        tdWorkOrderItem.id = index;
                        tdWorkOrderItem.classList.add('traca');
                        tdWorkOrder.appendChild(tdWorkOrderItem);
                        if (_operation.STATUS == 1) {
                            const listOf = _operation.traca.tracaDetails.filter(part => part.ID_TRACA_OF == element.ID);
                            tdWorkOrderItem.innerHTML = listOf[index - 1]['OF'];
                        }
                    }
                    tdWorkOrder.id = element.ID;
                    trPartToRecord.append(tdPartArticle, tdPartDesignation, tdPartQuatity, tdWorkOrder);
                    if (role == "CONTROLE") trPartToRecord.appendChild(tdDeleteCell);
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

                //BOUTON CONFIRMER ACTION
                const confirmOfAction = () => {
                    this.controller.confirmTracaAction(_operation, this.getElement('.part-workorder').innerHTML, this.getElement('#matricule').innerHTML);
                };
                btnConfirm.setAction(confirmOfAction);
                break;
            case 'Controle':
                divImgType.src = "../public/src/img/shield.svg";
                operationDetails.innerHTML = "";
                //HEADER
                const tdHeaderToolDesignation = document.createElement('td');
                const tdScanTool = document.createElement('td');
                tdHeaderToolDesignation.innerHTML = "DESIGNATION";
                tdScanTool.innerHTML = "SCAN TOOL";
                trHeader.append(tdHeaderToolDesignation, tdScanTool);
                if (role == 'CONTROLE') trHeader.appendChild(tdDelete);
                tableHeader.appendChild(trHeader);

                //BODY
                _operation.nomTracaDetail.forEach(element => {
                    const trToolToRecord = document.createElement('tr');
                    const tdToolDesignation = document.createElement('td');
                    const tdTool = document.createElement('td');
                    tdDeleteCell.onclick = () => {
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
                    tdDeleteCell.onmouseover = () => {
                        btnDelete.src = "../public/src/img/poub_daher_rouge-03.png";
                        trToolToRecord.classList.add('delete');
                    }
                    tdDeleteCell.onmouseleave = () => {
                        btnDelete.src = "../public/src/img/poub_daher_bleue-03.png";
                        trToolToRecord.classList.remove('delete');
                    }
                    tdToolDesignation.innerHTML = element.DESIGNATION;
                    tdTool.id = element.ID;

                    if (_operation.traca) {
                        const usedToolRef = _operation.traca.tracaDetails.find(recordedTraca => recordedTraca.ID_NOM_CONTROLE == element.ID);
                        promGetAllECME.then(allECME => {
                            const ECME = allECME.find(ecme => ecme.ID == usedToolRef.OUTIL);
                            tdTool.innerHTML = ECME.REFERENCE;
                        })

                    }

                    if (element.DESIGNATION == 'Visuel') {
                        table.classList.add('hidden');
                        tdTool.innerHTML = "N/A";
                        trToolToRecord.classList.add('full');
                    } else {
                        //operation.appendChild(btnScan.drawButton());
                    }

                    tdTool.classList.add('traca');
                    trToolToRecord.append(tdToolDesignation, tdTool);
                    if (role == "CONTROLE") trToolToRecord.appendChild(tdDeleteCell);
                    tableBody.appendChild(trToolToRecord);
                });
                const sanctionChoice = new SanctionBouton();
                operationDetails.appendChild(sanctionChoice.drawButton());
                //Remplissage
                if (_operation.traca) {
                    const sanction = _operation.traca.SANCTION;
                    if (sanction) {
                        sanctionChoice.btnConform.click();
                    } else {
                        sanctionChoice.btnNonConform.click();
                    }
                }
                //BOUTON CONFIRMER ACTION
                const confirmToolAction = () => {
                    this.controller.confirmTracaAction(_operation, this.getElement('.part-workorder').innerHTML, this.getElement('#matricule').innerHTML, sanctionChoice.sanction);
                };
                btnConfirm.setAction(confirmToolAction);
                break;
            case 'Matiere':

                divImgType.src = "../public/src/img/flask.svg";
                //operation.appendChild(btnScan.drawButton());
                operationDetails.innerHTML = "";
                //HEADER
                const tdHeaderMaterialDesignation = document.createElement('td');
                const tdScanMat = document.createElement('td');
                tdHeaderMaterialDesignation.innerHTML = "DESIGNATION";
                tdScanMat.innerHTML = "MATIERE SCANNEE";
                trHeader.append(tdHeaderMaterialDesignation, tdScanMat);
                if (role == 'CONTROLE') trHeader.appendChild(tdDelete);
                tableHeader.appendChild(trHeader);

                //BODY
                _operation.nomTracaDetail.forEach(element => {
                    const trMatToRecord = document.createElement('tr');
                    const tdMatDesignation = document.createElement('td');
                    const tdMat = document.createElement('td');
                    tdMatDesignation.innerHTML = element.DESIGNATION;
                    tdMat.id = element.ID;
                    tdMat.classList.add('traca');

                    tdDeleteCell.onmouseover = () => {
                        btnDelete.src = "../public/src/img/poub_daher_rouge-03.png";
                        trMatToRecord.classList.add('delete');
                    }
                    tdDeleteCell.onmouseleave = () => {
                        btnDelete.src = "../public/src/img/poub_daher_bleue-03.png";
                        trMatToRecord.classList.remove('delete');
                    }
                    trMatToRecord.append(tdMatDesignation, tdMat);
                    if (role == "CONTROLE") trMatToRecord.appendChild(tdDeleteCell);
                    if (_operation.traca) {
                        const tracaToFill = _operation.traca.tracaDetails.find(traca => traca.ID_NOM_MATIERE == element.ID);
                        console.log(_operation.traca);
                        const promMat = doAjaxThings(`../script/php/getAllMaterialEntry.php?id=${tracaToFill['ID MAT ENTRY']}`, 'json');
                        promMat.then(mat => {
                            const datePer = new Date(mat['DATE DE PEREMPTION']);
                            const today = new Date();
                            console.log(datePer);
                            tdMat.innerText = datePer.toLocaleString();
                            if (datePer < today) {
                                trMatToRecord.classList.add('out-of-date');
                            } else {
                                trMatToRecord.classList.add('full');
                            }
                        });
                        tdDeleteCell.onclick = () => {
                            ///////////////////////////
                            //ajouter un êtes vous sur !!!
                            //////////////////////////
                            const promDeleteTraca = doAjaxThings(`../script/php/deleteTraca.php?id=${_operation.traca.ID}`, 'json')
                            promDeleteTraca.then(() => {

                            })
                        }
                    }
                    tableBody.appendChild(trMatToRecord);
                });
                //BOUTON CONFIRMER ACTION
                const confirmMatAction = () => {
                    this.controller.confirmTracaAction(_operation, this.getElement('.part-workorder').innerHTML, this.getElement('#matricule').innerHTML);
                };
                btnConfirm.setAction(confirmMatAction);
                break;
            default:
                break;
        }
        //TABLE
        table.append(tableHeader, tableBody);
        operationDetails.appendChild(table);
        operation.append(operationTopBar, operationInstruction, operationDetails);
        operation.appendChild(btnConfirm.drawButton());
        return operation;
    }

    /**
     *Retrieve an element from the DOM
     *
     * @param {string} selector exemple pour une classe '.content' ,  exemple pour un ID '#content' ,  exemple pour un TAG  'BODY'
     * @return {HTMLElement} 
     * @memberof ViewContent
     */
    getElement(selector) {
        const element = document.querySelector(selector);
        return element;
    }

    /**
     *Retrieve list of elements from the DOM
     *
     * @param {*} selector exemple pour une classe '.content' ,  exemple pour un ID '#content' ,  exemple pour un TAG  'BODY'
     * @return {NodeList} 
     * @memberof ViewContent
     */
    getElements(selector) {
        const elements = document.querySelectorAll(selector);
        return elements;
    }


    addScanInput() {
        const scanInput = new Input('scan', this.controller);
        this.appendElement('.module', scanInput.drawInput());
    }
    addScanButton() {
        const btnScan = new Bouton('scan', null, null, 'S');
        const content = this.getElement('.rightSideBar');
        content.appendChild(btnScan.drawButton());
    }

    addFacButton() {
        const getBtnFac = this.getElement('.facButton');
        if (getBtnFac) {
            return getBtnFac;
        } else {
            const btnFac = new Bouton('default', 'FAC', null, 'S');
            const content = this.getElement('.rightSideBar');
            const drawBtn = btnFac.drawButton();
            drawBtn.classList.add('facButton', 'btn-primary');
            content.appendChild(drawBtn);
            return drawBtn;
        }
    }

    displayGroup(_group, _arrow) {
        // BOUTON QUITTER ASSY
        const btnExitAssy = this.getElement('.divCommand');
        btnExitAssy.innerText = "QUITTER L'ASSEMBLAGE"
        btnExitAssy.classList.add('btn', 'btn-L', 'btn-primary');
        btnExitAssy.onclick = () => {
            const modalBox = new ModalBox('YES_NO', `êtes-vous sûr de vouloir quitter cet assemblage ?`);
            modalBox.yesButton.onclick = () => {
                modalBox.removeBox();
                document.location.reload();
            }
            modalBox.noButton.onclick = () => {
                modalBox.removeBox();
                this.getElement('.operation').remove();
                this.controller.assyWorkorderAction(this.getElement('.part-article').innerText, this.getElement('.part-workorder').innerText);
            }


        }

        //ADD ARROWS TO LEFTSIDEBAR
        const oldGroup = this.getElement(`#group-${_group.ID}`)
        if (oldGroup) {
            oldGroup.remove();
        }
        const groupElement = this.createGroupElement(_group.ID_GROUP, _group.PROGRESS);
        groupElement.id = `group-${_group.ID}`;
        groupElement.onclick = () => {
            this.displayGroupOperations(_group.ID);
        }
        this.appendElement('.divGroupStatus', groupElement);

        //ADD GROUPS OF OPERATIONS TO OPERATIONS BAR
        const groupOp = this.getElement(`#group-operations-${_group.ID}`);
        if (groupOp) groupOp.remove();

        const groupOfOperations = this.createElement('div', 'group-operations');
        groupOfOperations.id = `group-operations-${_group.ID}`;
        groupElement.appendChild(groupOfOperations);

        //FILL GROUPS WITH OPERATIONS & CREATE OPERATIONS
        _group.items.forEach(operation => {
            //FILL OPERATIONS GROUP
            const operationElement = this.createElement('div', 'group-operation');
            this.appendElement(`#group-operations-${_group.ID}`, operationElement);
            //const divOpState = this.createElement('div');
            //const round = this.createElement('div', 'round');
            //divOpState.appendChild(round);

            const divImgType = this.createElement('img', 'operation-type-img');
            divImgType.id = `op-${operation.ID}`;
            switch (operation.TYPE_TRACA) {
                case 'OF':
                    divImgType.src = "../public/src/img/build.svg";
                    break;
                case 'Matiere':
                    divImgType.src = "../public/src/img/flask.svg";
                    break;
                case 'Controle':
                    divImgType.src = "../public/src/img/shield.svg";
                    break;
            }
            const divInfo = this.createElement('div', 'info');
            const opeType = new LabelText("Type d'opération :", operation.TYPE_TRACA);
            const opeInstruction = new LabelText("Instruction :", operation.INSTRUCTIONS);
            divInfo.append(opeType.drawLabelText(), opeInstruction.drawLabelText());
            operationElement.appendChild(divInfo);

            operationElement.onmouseover = () => {
                divInfo.classList.toggle('visible');
            }

            switch (operation.STATUS) {
                case 1:
                    operationElement.classList.add('op-completed');
                    break;
                case 0:
                    operationElement.classList.add('op-not-initiated');
                    break;
                default:
                    break;
            }
            if (operation.traca) {
                if (operation.traca.SANCTION == 1) {
                    operationElement.classList.add('op-conform');
                } else {
                    operationElement.classList.add('op-not-conform');
                }
            }

            operationElement.append(divImgType);
            operationElement.onclick = () => {
                const currentOp = this.getElement('.current-operation');
                if (currentOp) {
                    currentOp.classList.remove('current-operation');
                }
                operationElement.classList.add('current-operation');
                this.controller.idFacAction(operation);
            }
        });
    }

    displayGroupOperations(_groupId) {
        //IF A GROUP IS DISPLAYED
        const currentGroup = this.getElement('.current-group-operations');
        if (currentGroup) currentGroup.classList.remove('current-group-operations');
        this.getElement(`#group-operations-${_groupId}`).classList.add('current-group-operations');
        //this.exitCurrentOperation()
    }

    displayOperation(operation) {
        this.exitCurrentOperation()
            //CREATE OPERATION
        const divOperation = this.getElement('.section-operations');
        divOperation.appendChild(this.createOperation(operation));
    }

    // this.getElement(`#operation-${_idOpe}`).style.display = 'flex';
    // this.getElement(`#operation-${_idOpe}`).classList.add('current-ope');
    displayPartDescription(_part, _workOrder) {
        const designation = _part.desSimplifee;
        const article = _part.numArticleSap;
        this.getElement('.part-article').innerHTML = article;
        this.getElement('.part-designation').innerHTML = designation;
        this.getElement('.part-workorder').innerHTML = _workOrder
    }

    exitCurrentOperation() {
        if (this.getElement('.operation')) this.getElement('.operation').remove();
    }

    appendElement(selector, element) {
        this.getElement(selector).appendChild(element);
    }

    /**
     *
     *
     * @param {string} _title
     * @memberof ViewContent
     */
    addTitle() {
        const divPartDescription = this.getElement('.partDescription');
        const title = this.createElement('div', 'module-title');
        const divPartDes = this.createElement('div', 'part-description');
        const divPartArticle = this.createElement('div', 'part-article');
        const divPartDesignation = this.createElement('div', 'part-designation');
        const divWorkorder = this.createElement('div', 'part-workorder');
        const divBoxName = this.createElement('div', 'box-name');
        const divProgress = this.createElement('div', 'assembly-progress');
        divPartDes.append(divPartArticle, divPartDesignation, divWorkorder, divBoxName, );
        divPartDescription.append(divPartDes, title, divProgress);
    }
}
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.controller = this;
        this.initPage();
    }
    initPage() {
        this.view.addScanInput();
        this.view.addTitle();
        this.view.getElement('.scan-input').focus();
        this.view.addScanButton();
    }

    getProcess(_article) {
        return this.model.getProcess(_article);
    }

    /**
     *
     *
     * @param {Array} _inputOf [article,OF]
     * @memberof Controller
     */
    ofAction(_inputOf) {
        //SI on est sur une page début assy
        if (this.view.getElement('.part-workorder').innerHTML != "") {
            this.addOfAction(_inputOf);
        } else {
            this.assyWorkorderAction(_inputOf[0], _inputOf[1]);
        }

    }

    ctrlToolAction(_inputCtrlTool) {
        const idOperation = this.view.getElement('.operation').id;
        const id = idOperation.split('-')[1];
        const traca = this.model.getTraca(id)
        console.log(traca);
        if (traca) {
            let toolStatus = false;
            console.log('coucou');
            traca.nomTracaDetail.forEach(tracaDetail => {
                if (tracaDetail['ID TRACA'] == id) {
                    const tableRows = this.view.getElement('TBODY').childNodes;
                    if (Array.from(tableRows).every(row => row.classList.contains('full'))) {
                        //ALERTER PUIS VEROUILLER LES BOUTONS SAUF POUR ROLE QUALITE
                        console.error(`La traçabilité est déjà complète. Voulez-vous modifier la traçabilité de cette opération ?`);
                    } else {
                        console.log('traca pas complete');
                        if (tracaDetail.OUTILLAGE == _inputCtrlTool[0]) {
                            toolStatus = true;
                            const tracaCells = document.getElementById(tracaDetail['ID']);
                            console.log(tracaCells);
                            const tracaRow = document.getElementById(tracaDetail['ID']).parentElement;
                            console.log(tracaRow);
                            if (tracaCells.innerHTML == "") {
                                const promGetECMEToolsType = doAjaxThings(`../script/php/getECMEToolList.php?`, 'json');
                                promGetECMEToolsType.then(ecmeList => {
                                    const scannedTool = ecmeList.find(tool => tool.ID == _inputCtrlTool[1]);
                                    tracaCells.innerHTML = scannedTool.REFERENCE;
                                    tracaRow.classList.add('full');
                                });
                            }
                            if (Array.from(tableRows).every(row => row.classList.contains('full'))) {
                                console.log(`La traçabilité est maintenant complète. On dévérouille le bouton pour confirmer l'opération`);
                                const btn = new Bouton();
                                btn.setEnable();
                            }
                        } else {
                            console.error(`L'outillage scanné semble ne pas être celui qu'il faut utiliser`);
                        }
                    }
                }
            });
            if (toolStatus == false) {
                const promGetECMEToolsType = doAjaxThings(`../script/php/getECMEToolTypeList.php?`, 'json');
                promGetECMEToolsType.then(typeList => {
                    const scannedTool = typeList.find(tool => tool.ID == _inputCtrlTool[0]);
                    console.log(scannedTool);
                    const msgModal = new ModalBox('ALERT', "Ce n'est pas le bon outillage");
                    this.view.getElement('.text-footer').innerHTML = `L'outillage que vous avez scanné est : ${scannedTool.TYPE}`;
                    msgModal.okButton.setAction(() => {
                        msgModal.removeBox();
                    });
                });
            }
        }
    }


    materialAction(_inputMaterial) {
        const idOperation = this.view.getElement('.operation').id;
        const id = idOperation.split('-')[1];
        const traca = this.model.getTraca(id)
        console.log(traca);
        if (traca) {
            let mat = false;
            console.log('coucou');
            traca.nomTracaDetail.forEach(tracaDetail => {
                if (tracaDetail['ID TRACA'] == id) {
                    const tableRows = this.view.getElement('TBODY').childNodes;
                    if (Array.from(tableRows).every(row => row.classList.contains('full'))) {
                        console.error(`La traçabilité est déjà complète. Voulez-vous modifier la traçabilité de cette opération ?`);
                    } else {
                        console.log('traca pas complete');
                        console.log(_inputMaterial);
                        console.log(tracaDetail.ARTICLE);
                        if (tracaDetail.ARTICLE == _inputMaterial[0]) {
                            mat = true;
                            console.log("C'est la bonne matiere");
                            const tracaCells = document.getElementById(tracaDetail['ID']);
                            console.log(tracaCells);
                            const tracaRow = document.getElementById(tracaDetail['ID']).parentElement;
                            console.log(tracaRow);
                            if (tracaCells.innerHTML == "") {
                                const shelflifeDate = this.model.getShelflifeDate(_inputMaterial[1]);
                                shelflifeDate.then(response => {
                                    const shelflifeDate = new Date(response['DATE DE PEREMPTION']);
                                    const formatShelflifeDate = shelflifeDate.toLocaleString();
                                    const today = new Date();
                                    tracaCells.setAttribute('id-mat', _inputMaterial[1]);
                                    tracaCells.innerText = `Date de péremption : ${formatShelflifeDate}, \n lot : ${response['N LOT']}`;
                                    if (shelflifeDate > today) {
                                        console.log('pas périmé');
                                        tracaRow.classList.add('full');
                                        if (Array.from(tableRows).every(row => row.classList.contains('full'))) {
                                            console.log(`La traçabilité est maintenant complète. On dévérouille le bouton pour confirmer l'opération`);
                                            const btn = new Bouton();
                                            btn.setEnable();
                                        }
                                    } else {
                                        const msgModal = new ModalBox('ALERT', "La matière est périmée. Veuillez alerter un controleur.", "QUALITY");
                                        this.view.getElement('.text-footer').innerHTML = `La matière que vous avez scannée est périme le : ${formatShelflifeDate}`;
                                        msgModal.okButton.setAction(() => {
                                            msgModal.removeBox();
                                        });
                                        console.log('périmé');
                                        tracaRow.classList.add('out-of-date');
                                    }
                                });

                            }
                        } else {
                            console.error(`La matière scannée semble ne pas être celle qu'il faut utiliser`);
                        }
                    }
                }
            });
            if (mat == false) {
                const promGetMatList = doAjaxThings(`../script/php/getMaterialsList.php?secteur=ASSEMBLAGE COMPOSITE`, 'json');
                promGetMatList.then(matList => {
                    const scannedMat = matList.find(tool => tool.ID == _inputMaterial[0]);
                    console.log(scannedMat);
                    const msgModal = new ModalBox('ALERT', "Ce n'est pas la bonne matière");
                    this.view.getElement('.text-footer').innerHTML = `La matière que vous avez scannée est : ${scannedMat['DESIGNATION SIMPLIFIEE']}`;
                    msgModal.okButton.setAction(() => {
                        msgModal.removeBox();
                    });
                });
            }
        }
    }

    async assyWorkorderAction(_article, _OF) {
        this.article = _article;
        this.OF = _OF;
        const assyPart = this.model.getAssyPart(_article);
        const assemblyStatus = this.model.getAssemblyStatus(_article, _OF);
        return Promise.all([assyPart, assemblyStatus]).then(values => {
            const part = values[0];
            const process = values[1];
            this.view.displayPartDescription(part, _OF);
            this.process = process;
            const btnFac = this.view.addFacButton();
            btnFac.onclick = () => {
                this.generateFac();
            }
            process.forEach(group => {
                this.view.displayGroup(group);
            });
        })
    }

    addOfAction(_inputOf) {
        const idOperation = this.view.getElement('.operation').id;
        const id = idOperation.split('-')[1];
        const traca = this.model.getTraca(id)
        console.log(traca);
        if (traca) {
            let isArticle = false;
            traca.nomTracaDetail.forEach(tracaDetail => {
                if (tracaDetail['ID TRACA'] == id) {
                    const tableRows = this.view.getElement('TBODY').childNodes;
                    if (Array.from(tableRows).every(row => row.classList.contains('full'))) {
                        console.error(`La traçabilité est déjà complète. Voulez-vous modifier la traçabilité de cette opération ?`);
                    } else {
                        if (tracaDetail.ARTICLE == _inputOf[0]) {
                            isArticle = true;
                            const tracaCells = document.getElementById(tracaDetail['ID']).childNodes;
                            const tracaRow = document.getElementById(tracaDetail['ID']).parentElement;
                            for (let ofPlace = 0; ofPlace <= tracaCells.length - 1; ofPlace++) {
                                if (tracaCells[ofPlace].innerHTML == "") {
                                    tracaCells[ofPlace].innerHTML = _inputOf[1];
                                    if (ofPlace == tracaCells.length - 1) tracaRow.classList.add('full');
                                    break;
                                }
                            }
                            if (Array.from(tableRows).every(row => row.classList.contains('full'))) {
                                console.log(`La traçabilité est maintenant complète. On dévérouille le bouton pour confirmer l'opération`);
                                const btn = new Bouton();
                                btn.setEnable();
                                const boxName = this.view.getElement('#input-box-name');
                                console.log(boxName);
                                if (boxName != undefined) {
                                    console.log('save data with box');
                                    if (boxName.value == "") {
                                        console.error(`Veuillez remplir le nom de la box`);
                                        boxName.style.border = "2px solid red";
                                    }
                                    //     doAjaxThings(`../script/php/saveTraca.php?typeTraca=OF&of=${this.workOrder}&listOf=${JSON.stringify(allTraca.allScanOF)}&idFac=${allTraca.tracaDatas[0]['ID TRACA']}&boxName=${boxName.value}&matricule=${matricule}`, 'text')
                                    //         .then((msg) => {
                                    //             removeLoader();
                                    //             console.log(msg);
                                    //             //si message traça done 
                                    //             upDateTracaPage(newAssembly.workOrder);
                                    //         });

                                } else {
                                    console.log('save data without box');
                                    //     doAjaxThings(`../script/php/saveTraca.php?typeTraca=OF&of=${this.workOrder}&listOf=${JSON.stringify(allTraca.allScanOF)}&idFac=${allTraca.tracaDatas[0]['ID TRACA']}&matricule=${matricule}`, 'text')
                                    //         .then((msg) => {
                                    //             removeLoader();
                                    //             console.log(msg);
                                    //             //si message traça done 
                                    //             upDateTracaPage(newAssembly.workOrder);
                                    //         });
                                }
                                // btn.setAction(this.model.);

                            }
                        }

                    }
                }
            });
            if (isArticle == false) {
                const modalBox = new ModalBox('YES_NO', `L'article scanné semble ne pas appartenir à l'assemblage. Voulez-vous quitter l'assemblage et effectuer la traçabilité de cet OF ?`, `NO`);
                modalBox.yesButton.onclick = () => {
                    modalBox.removeBox();
                    this.view.exitCurrentOperation();
                    this.assyWorkorderAction(_inputOf[0], _inputOf[1]);
                }
                modalBox.noButton.onclick = () => {
                    modalBox.removeBox();
                }
            }
        }

    }

    getTraca() {
        const listOf = [];
        const listCellsOf = this.view.getElements('.traca');
        listCellsOf.forEach(cellOf => {
            const parentRow = cellOf.parentElement.parentElement;
            console.log(parentRow);
            let IdNomTracaOf = cellOf.parentElement.id;
            console.log(IdNomTracaOf);
            if (!IdNomTracaOf) {
                IdNomTracaOf = cellOf.id;
            }
            console.log(IdNomTracaOf);
            if (parentRow.firstChild.innerHTML == '7172242' || parentRow.firstChild.innerHTML == '7172275') {
                listOf.push({ 'NomTracaOf': IdNomTracaOf, 'of': cellOf.innerHTML, 'boxName': this.view.getElement('#input-box-name').value });
            } else if (cellOf.getAttribute("id-mat")) {
                listOf.push({ 'NomTracaOf': IdNomTracaOf, 'of': cellOf.getAttribute("id-mat") });
            } else {
                listOf.push({ 'NomTracaOf': IdNomTracaOf, 'of': cellOf.innerHTML });
            }

        });
        return listOf;
    }

    onGroupClick(_groupId) {
        this.view.displayGroupOperations(_groupId);
    }

    idFacAction(_operation) {
        this.operation = _operation;
        if (_operation.ID == undefined) {
            //OP PROVENANT D'UN SCAN
            this.operation = this.model.getOperation(this.operation);
        } else {
            //OP PROVENANT D'UN CLIC
            this.operation;
        }
        const promRole = new Promise((resolve, reject) => {
            // TEST ROLE
            const role = this.view.getElement('#role').innerHTML;
            if (role != 'CONTROLE') {
                console.log('roleReject');
                reject('role');
            } else {
                console.log('promRole OK');
                resolve(true);
            }
        });

        const promStatus = new Promise((resolve, reject) => {
            //TEST STATUT DE L'OPERATION
            if (this.operation.STATUS != 1) {
                console.log('promStatus OK');
                resolve(true);
            } else {
                reject('status');
            }
        });
        Promise.allSettled([promStatus, promRole]).then(values => {
            console.log(values);
            if (this.operation.nomTracaDetail[0].ROLE == 1) {
                if (values[1].status == "fulfilled") this.view.displayOperation(this.operation);
            } else {
                if (values[0].status == "fulfilled") {
                    this.view.displayOperation(this.operation);
                } else {
                    const role = this.view.getElement('#role').innerHTML;
                    if (role == "CONTROLE") {
                        this.view.displayOperation(this.operation);
                    } else {
                        this.qualityUserNeed('role');
                    }
                }
            }


        });



        // promStatus.then(() => {
        //     console.log('Status OK');
        //     this.view.displayOperation(this.operation);
        // }, () => {
        //     promRole.then(() => {
        //         this.view.displayOperation(this.operation);
        //     }, () => {
        //         console.log('role No OK');
        //         this.qualityUserNeed('role');
        //     });
        // });

        // Promise.allSettled([promStatus, promRole]).then(values => {
        //     //OUVERTURE DE L 'OP
        //     console.log(values);
        //     this.view.displayOperation(this.operation);
        // }, reject => {
        //     console.log(reject);
        //     if (reject[0] == )
        // }).catch(type => {
        //     console.log(type);
        //     promRole.then(value => {
        //         console.log(value);
        //         if (value != true) {
        //             this.qualityUserNeed(type);
        //         } else {
        //             this.view.displayOperation(this.operation);
        //         }
        //     })
        // });

    }


    //ACTION SI ROLE PAS BON
    qualityUserNeed(_type) {
        console.log(_type);
        let txtModal;
        switch (_type) {
            case 'role':
                txtModal = "Vous n'avez pas le bon rôle pour effectuer cette opération";
                break;
            case 'status':
                txtModal = "Cette opération est déjà réalisée";
                break;
            default:
                break;
        }
        const msgModal = new ModalBox('ALERT', txtModal, 'QUALITY');
        const role = this.view.getElement('#role').innerHTML;
        this.view.getElement('.text-footer').innerHTML = `Votre rôle est : ${role}`;
        msgModal.okButton.setAction(() => {
            msgModal.removeBox();
        });
        msgModal.btnQualityScan.setAction(() => {
            msgModal.btnQualityScan.btn.classList.add('flashScan');
            this.view.getElement('.divSecondaryUser').focus();
            msgModal.getResponse().then(response => {
                console.log(response);
                if (response.ROLE == 'CONTROLE') {
                    msgModal.removeBox();
                    this.alternateUser = response;
                    this.view.displayOperation(this.operation);
                    return true;
                } else {
                    return false;
                }
            });
        });;
    }

    // ACTION SI STATUT PAS BON
    wrongStatusAction() {
        const msgModal = new ModalBox('ALERT', "Cette opération est déjà effectuée. Vous devez avoir un rôle CONTROLE pour pouvoir la modifier");
        this.view.getElement('.text-footer').innerHTML = `Votre rôle est : ${role}`;
        msgModal.okButton.setAction(() => {
            msgModal.removeBox();
        });
        return 'wrong status';
    }


    ofScanAction() {
        const operation = this.view.getElement('.current-ope');
        operation.getElementById('')
    }


    confirmTracaAction(_operation, _workOrder, _userMatricule, sanction = null) {
        const btnExitAssy = this.view.getElement('.divCommand');
        switch (_operation.TYPE_TRACA) {
            case 'OF':
                const boxName = document.getElementById('input-box-name');
                const listOf = this.getTraca();
                this.model.saveTracaOf(_workOrder, _operation.ID, listOf, _userMatricule).then(() => {
                    this.afterSaveData();
                });
                break;
            case 'Controle':
                const getAllTools = this.model.getAllECME();
                const listTool = this.getTraca();
                getAllTools.then(tools => {
                    listTool.forEach((tool, index) => {
                        console.log(tool, index);
                        console.log(tools);
                        const newToolOf = tools.find(toolOf => toolOf.REFERENCE == tool.of);
                        console.log(newToolOf);
                        listTool[index].of = newToolOf.ID;
                    });
                    console.log(listTool);
                    this.model.saveTracaControle(_workOrder, _operation.ID, listTool, _userMatricule, sanction).then(() => {
                        this.afterSaveData();
                    });
                });


                break;
            case 'Matiere':
                const listMatiere = this.getTraca();
                this.model.saveTracaMatiere(_workOrder, _operation.ID, listMatiere, _userMatricule).then(() => {
                    this.afterSaveData();
                });
                break;
            default:
                break;
        }


    }
    afterSaveData() {
        const currentGroup = this.process.find(group => group.ID === this.operation.GROUPE);
        const indexCurrentOp = currentGroup.items.indexOf(currentGroup.items.find(op => op.ID === this.operation.ID));
        const nextOperation = currentGroup.items[indexCurrentOp + 1];
        this.assyWorkorderAction(this.article, this.OF).then(() => {

            this.view.getElement(`#group-${currentGroup.ID}`).click();
            this.view.displayOperation(nextOperation);

        });
    }

    generateFac() {
        const promGetAllUsers = this.model.getAllUsers();
        const promGetAllTools = this.model.getAllTools();
        const facWindow = window.open('../public/Templates/fac.html')
        facWindow.onload = () => {
            //HEADER


            //CONTENT
            const divContent = facWindow.document.querySelector('.content');
            console.log(this.process);
            this.process.forEach(group => {
                //HEADER GROUP
                const divHeaderGroup = document.createElement('div');
                divHeaderGroup.classList.add('header-group');
                divHeaderGroup.innerText = group.ID_GROUP + ' - ' + group.DESCRIPTION;
                divContent.appendChild(divHeaderGroup);
                //CONTENT GROUP
                group.items.forEach(step => {
                    //STEP TYPE
                    const divStep = document.createElement('div');
                    divStep.classList.add('step');
                    const stepFirstRow = document.createElement('div');
                    stepFirstRow.classList.add('type')
                    stepFirstRow.innerText = step.TYPE_TRACA;
                    //STEP INSTRUCTION
                    const stepSecondRow = document.createElement('div');
                    stepSecondRow.classList.add('instruction');
                    stepSecondRow.innerText = step.INSTRUCTIONS;
                    //STEP DETAILS
                    const stepThirdRow = document.createElement('div');
                    stepThirdRow.classList.add('stepContent');
                    const stepForthRow = document.createElement('div');
                    stepForthRow.classList.add('signature');

                    switch (step.TYPE_TRACA) {
                        case 'Controle':
                            console.log(step);
                            console.log(step.nomTracaDetail);
                            if (step.nomTracaDetail[0].OUTILLAGE != 26) {
                                const tableTools = document.createElement('table');
                                //TABLE TOOL HEADER
                                const tbHeader = document.createElement('thead');
                                const trHeader = document.createElement('tr');
                                const tdDes = document.createElement('td');
                                tdDes.innerText = 'GO-NoGO';
                                const tdSN = document.createElement('td');
                                tdSN.innerText = 'S/N'

                                trHeader.append(tdDes, tdSN);
                                tbHeader.appendChild(trHeader);
                                //TABLE TOOLS BODY
                                const tbBody = document.createElement('tbody');
                                step.nomTracaDetail.forEach(tracaDetail => {
                                    const trDetail = document.createElement('tr');
                                    const tdDetailDes = document.createElement('td');
                                    promGetAllTools.then(tools => {
                                        const tool = tools.find(tool => tool.ID == tracaDetail.OUTILLAGE);
                                        tdDetailDes.innerText = tool.TYPE;
                                    });
                                    const tdDetailSN = document.createElement('td');
                                    if (step.traca) {
                                        //step.traca.tracaDetails.find();
                                        trDetail.append(tdDetailDes, tdDetailSN);
                                        tbBody.appendChild(trDetail);
                                    }
                                });
                                //TABLE TOOLS FOOTER
                                const tbFooter = document.createElement('tfoot');

                                //TABLE APPEND ELEMENT
                                tableTools.append(tbHeader, tbBody, tbFooter);
                                stepThirdRow.appendChild(tableTools);
                            } else {
                                const divVisual = document.createElement('div');
                                divVisual.innerText = 'CONTROLE VISUEL';
                                stepThirdRow.appendChild(divVisual);
                            }
                            //STEP FINAL
                            if (step.traca) {
                                const operator = document.createElement('div');
                                operator.classList.add('operator');
                                const operatorName = document.createElement('div');
                                operatorName.classList.add('opName');
                                const operatorMatricule = document.createElement('div');
                                operatorMatricule.classList.add('opMat');
                                operatorMatricule.innerText = 'Matricule : ' + step.traca.USER;
                                promGetAllUsers.then(users => {
                                    const theUser = users.find(user => user.MATRICULE == step.traca.USER);
                                    operatorName.innerText = 'NOM : ' + theUser.NOM + ' ' + theUser.PRENOM;
                                });
                                operator.append(operatorName, operatorMatricule);
                                const sanction = document.createElement('div');
                                sanction.classList.add('sanction');
                                const sanctionDate = document.createElement('div');
                                sanctionDate.classList.add('sanctionDate');
                                sanctionDate.innerText = 'Date : ' + step.traca['DATE DE CREATION'];
                                const sanctionValue = document.createElement('div');
                                sanctionValue.classList.add('sanctionValue');
                                if (step.traca.SANCTION == 1) {
                                    sanctionValue.innerText = 'CONFORME';
                                } else {
                                    sanctionValue.innerText = 'NON-CONFORME';
                                }
                                sanction.append(sanctionDate, sanctionValue);

                                stepForthRow.append(operator, sanction);
                            } else {
                                const divNA = document.createElement('div');
                                divNA.innerText = "Opération non réalisée";
                                stepForthRow.append(divNA);
                            }

                            break;

                        case 'Matiere':
                            const tableMat = document.createElement('table');
                            //TABLE TOOL HEADER
                            const tbMatHeader = document.createElement('thead');
                            const trMatHeader = document.createElement('tr');
                            const tdMatDes = document.createElement('td');
                            tdMatDes.innerText = 'Matière';
                            const tdMatSN = document.createElement('td');
                            tdMatSN.innerText = 'Matière'

                            trMatHeader.append(tdMatDes, tdMatSN);
                            tbMatHeader.appendChild(trMatHeader);
                            //TABLE TOOLS BODY
                            const tbMatBody = document.createElement('tbody');
                            step.nomTracaDetail.forEach(tracaDetail => {
                                const trMatDetail = document.createElement('tr');
                                const tdMatDetailDes = document.createElement('td');
                                promGetAllTools.then(tools => {
                                    const tool = tools.find(tool => tool.ID == tracaDetail.OUTILLAGE);
                                    tdMatDetailDes.innerText = tool.TYPE;
                                });
                                const tdMatDetailSN = document.createElement('td');
                                trMatDetail.append(tdMatDetailDes, tdMatDetailSN);
                                tbMatBody.appendChild(trMatDetail);
                            });
                            //TABLE TOOLS FOOTER
                            const tbMatFooter = document.createElement('tfoot');

                            //TABLE APPEND ELEMENT
                            tableMat.append(tbMatHeader, tbMatBody, tbMatFooter);
                            stepThirdRow.appendChild(tableMat);



                            //STEP FINAL
                            if (step.traca) {
                                const operator = document.createElement('div');
                                operator.classList.add('operator');
                                const operatorName = document.createElement('div');
                                operatorName.classList.add('opName');
                                const operatorMatricule = document.createElement('div');
                                operatorMatricule.classList.add('opMat');
                                operatorMatricule.innerText = 'Matricule : ' + step.traca.USER;
                                promGetAllUsers.then(users => {
                                    const theUser = users.find(user => user.MATRICULE == step.traca.USER);
                                    operatorName.innerText = 'NOM : ' + theUser.NOM + ' ' + theUser.PRENOM;
                                });
                                operator.append(operatorName, operatorMatricule);
                                const sanction = document.createElement('div');
                                sanction.classList.add('sanction');
                                const sanctionDate = document.createElement('div');
                                sanctionDate.classList.add('sanctionDate');
                                sanctionDate.innerText = 'Date : ' + step.traca['DATE DE CREATION'];
                                const sanctionValue = document.createElement('div');
                                sanctionValue.classList.add('sanctionValue');
                                if (step.traca.SANCTION == 1) {
                                    sanctionValue.innerText = 'CONFORME';
                                } else {
                                    sanctionValue.innerText = 'NON-CONFORME';
                                }
                                sanction.append(sanctionDate, sanctionValue);

                                stepForthRow.append(operator, sanction);
                            } else {
                                const divNA = document.createElement('div');
                                divNA.innerText = "Opération non réalisée";
                                stepForthRow.append(divNA);
                            }

                            break;


                        case 'OF':
                            // const tableParts = document.createElement('table');
                            // //TABLE TOOL HEADER
                            // const tbHeader = document.createElement('thead');
                            // const trHeader = document.createElement('tr');
                            // const tdPN = document.createElement('td');
                            // tdPN.innerText = 'P/N';
                            // const tdQty = document.createElement('td');
                            // tdQty.innerText = 'Quantité';
                            // const tdDes = document.createElement('td');
                            // tdDes.innerText = 'Description';
                            // const tdSN = document.createElement('td');
                            // tdSN.innerText = 'S/N'

                            // trHeader.append(tdPN, tdQty, tdDes, tdSN);
                            // tbHeader.appendChild(trHeader);
                            // //TABLE TOOLS BODY
                            // const tbBody = document.createElement('tbody');
                            // step.nomTracaDetail.forEach(tracaDetail => {
                            //     const trDetail = document.createElement('tr');
                            //     const tdDetailPN = document.createElement('td');
                            //     const tdDetailQty = document.createElement('td');
                            //     const tdDetailDes = document.createElement('td');
                            //     const tdDetailSN = document.createElement('td');
                            // });
                            // //TABLE TOOLS FOOTER
                            // const tbFooter = document.createElement('tfoot');

                            // //TABLE APPEND ELEMENT
                            // tableTools.append(tbHeader, tbBody, tbFooter);
                            break;
                        default:
                            break;
                    }

                    //APPEND ELEMENTS
                    divStep.append(stepFirstRow, stepSecondRow, stepThirdRow, stepForthRow);
                    divContent.appendChild(divStep);
                })
            });
            //FOOTER

        }
        console.log(this.process);
    }
}

const processOperatorAPI = new Controller(new Model(), new ViewContent());