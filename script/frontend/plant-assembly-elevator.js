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
    async getProgress(_program) {
        return doAjaxThings(`../script/php/getPlantProgress.php?program=${_program}`, 'json');
    }
}

class ViewContent {
    constructor() {}

    drawAssemblyLine(assemblyProgress) {
        const content = this.getElement('.content');
        const leftDatas = assemblyProgress[0];
        const rightDatas = assemblyProgress[1];
        const leftContainer = this.getElement('#line-left');
        const rightContainer = this.getElement('#line-right');
        assemblyProgress[0].forEach(woStation => {
            if (woStation.PROGRESS != 0) {

            }
        });
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
        const program = 1;
        const promGetProgress = this.model.getProgress(program);
        promGetProgress.then(progress => {
            console.log(progress);
            this.view.drawAssemblyLine(progress);
        });
    }
}
const processOperatorAPI = new Controller(new Model(), new ViewContent());