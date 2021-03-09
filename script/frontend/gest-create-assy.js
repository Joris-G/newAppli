import {
    doAjaxThings,
    addLoader,
    removeLoader,
    Bouton,
    Input,
    SanctionBouton,
    ModalBox,
    DownArrowStatus,
    SelectItem,
} from "../toolBox.js";

class Model {
    constructor() {
        // The state of the model, an array of todo objects, prepopulated with some data
    }
    getChild(_articleOrdo) {
        return doAjaxThings(`../script/php/getChild.php?article=${_articleOrdo}`, 'json');
    }
    saveAssyOrdo(_workorderOrdo, _listToRecord, _matGestionnaire, _boxName) {
        return doAjaxThings(`../script/php/saveAssyOrdo.php?articlePere=${_workorderOrdo[0]}&ofpere=${_workorderOrdo[1]}&listWorkorder=${_listToRecord.toString()}&matGestionnaire=${_matGestionnaire}&elevatorName=${_boxName}`, 'json');
    }
}

class ViewContent {
    constructor() {}

    addScanInput() {
        const scanInput = new Input('scan', this.controller);
        this.appendElement('.content', scanInput.drawInput());
    }

    drawInitPage(_listRefOrdo) {
        const content = this.getElement('.content');
        const divOfOrdo = this.createElement('div', 'divOrdo');
        const divOrdoChil = this.createElement('div', 'divOrdoChild');
        const ordoTitle = this.createElement('h1');
        ordoTitle.innerText = 'OF ORDO :';
        const lblRefOrdo = this.createElement('label', 'label');
        lblRefOrdo.innerText = 'Référence ordo : ';
        const refOrdo = new SelectItem(_listRefOrdo);
        refOrdo.classList.add('article-ordo', 'select');
        divOfOrdo.append(ordoTitle, lblRefOrdo, refOrdo);
        content.append(divOfOrdo, divOrdoChil);
        refOrdo.onchange = (value) => {
            const child = this.getElements('.ordo-child');
            if (child) {
                child.forEach(element => {
                    content.removeChild(element);
                });
            }
            this.controller.inputArticleOrdoChangeAction(value.target.value);
        };
    }

    drawOrdoChild(_listChildArticle, _btnConfirm) {
        const divOrdoChild = this.getElement('.divOrdoChild');
        const ordoChildTitle = this.createElement('h1');
        ordoChildTitle.innerText = 'OF ENFANTS :';
        divOrdoChild.appendChild(ordoChildTitle);
        const lblOfOrdo = this.createElement('label', 'label');
        lblOfOrdo.innerText = "Of ordo : ";
        const ofOrdo = this.createElement('input', ["ordo-child", "of-ordo"]);
        ofOrdo.setAttribute('maxlength', 8);
        ofOrdo.setAttribute('minlength', 8);
        const lblBoxName = this.createElement('label', 'label');
        lblBoxName.innerText = "Nom de l'elevator : ";
        const boxName = this.createElement('input', 'boxName');
        ofOrdo.id = this.getElement('.article-ordo').value;
        this.getElement('.divOrdo').append(lblOfOrdo, ofOrdo, lblBoxName, boxName);
        console.log(_listChildArticle);
        _listChildArticle.forEach((childArticle, index) => {
            const divChild = this.createElement('div', 'ordo-child');
            const article = this.createElement('div', 'article');
            article.innerHTML = `${childArticle.Article}`;
            const designation = this.createElement('div', 'designation');
            designation.innerHTML = `ST${index} ${childArticle.Designation}`;
            const workorder = this.createElement('input', 'workorder');
            workorder.setAttribute('maxlength', 8);
            workorder.id = childArticle.Article;
            divChild.append(article, designation, workorder);
            const content = this.getElement('.content');

            divOrdoChild.appendChild(divChild);

            workorder.oninput = () => {
                const allInput = this.getElements('.workorder');
                if (Array.from(allInput).every(input => input.value != "")) _btnConfirm.setEnable();
            }
        });

    }
    drawConfirmButton() {
        const content = this.getElement('.content');
        const btnConfirm = new Bouton('confirm');
        content.appendChild(btnConfirm.drawButton());
        return btnConfirm;
    }

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
        if (className) {
            if (Array.isArray(className)) {
                className.forEach(strClass => {
                    element.classList.add(strClass);
                });

            } else {
                element.classList.add(className);
            }

        }
        return element;
    }

    appendElement(selector, element) {
        this.getElement(selector).appendChild(element);
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
        //this.view.addTitle("Création de l'assemblage");
        const _listRefOrdo = [
            ['ELEVATOR LH - ORDO', 7259753],
            ['ELEVATOR RH - ORDO', 7259754]
        ];
        this.view.drawInitPage(_listRefOrdo);

    }

    inputArticleOrdoChangeAction(_articleOrdo) {
        const promGetChild = this.model.getChild(_articleOrdo);
        promGetChild.then(child => {
            const btnConfirm = this.view.drawConfirmButton();
            this.view.drawOrdoChild(child, btnConfirm);
            btnConfirm.setAction(() => {
                const workorderInputs = this.view.getElements('.workorder');
                const listToRecord = [];
                workorderInputs.forEach(input => {
                    listToRecord.push([input.id, input.value]);
                });
                console.log(listToRecord);
                const matGest = this.view.getElement('#matricule').innerHTML;
                const boxName = this.view.getElement('.boxName').value;
                const ofOrdo = this.view.getElement('.of-ordo').value;
                const selectArticleOrdo = this.view.getElement('.article-ordo');
                const article = selectArticleOrdo.value;
                const desOrdo = selectArticleOrdo.options[selectArticleOrdo.selectedIndex].innerText;
                const elevator = { 'box name': boxName, 'of ordo': ofOrdo, 'article': article, 'designation': desOrdo };
                console.log(elevator);
                const workorderOrdo = [this.view.getElement('.of-ordo').id, this.view.getElement('.of-ordo').value];
                this.model.saveAssyOrdo(workorderOrdo, JSON.stringify(listToRecord), matGest, boxName)
                    .then(() => {
                        this.openPrintPage(elevator, listToRecord);
                    });
            });
        });
    }

    openPrintPage(ElevatorOrdoObject, listOfChildrenObject) {
        const recapWindow = window.open('../public/Templates/ordoElevator.html')
        recapWindow.onload = () => {
            const articles = recapWindow.document.querySelectorAll('.article');
            articles.forEach((divArticle, key) => {
                divArticle.innerHTML = listOfChildrenObject[key][0];
            });
            const ofs = recapWindow.document.querySelectorAll('.of');
            ofs.forEach((divOf, key) => {
                divOf.innerHTML = listOfChildrenObject[key][1];
            });
            const stations = recapWindow.document.querySelectorAll('.station');
            stations.forEach((station, index) => {
                new QRCode(station, {
                    text: `OF ${listOfChildrenObject[index][0]},${listOfChildrenObject[index][0]}`,
                    width: 100,
                    height: 100,
                    colorDark: "#000000",
                    colorLight: "#FFFFFF",
                    correctLevel: QRCode.CorrectLevel.L
                });

            });
            console.log(ElevatorOrdoObject, listOfChildrenObject);
            recapWindow.document.querySelector('.elevatorName').innerHTML = ElevatorOrdoObject['box name'];
            recapWindow.document.querySelector('.side').innerHTML = ElevatorOrdoObject.designation;
            recapWindow.document.querySelector('.ofOrdo').innerText = ElevatorOrdoObject['of ordo'];
            recapWindow.print();
        }

    }
}
const processOperatorAPI = new Controller(new Model(), new ViewContent());