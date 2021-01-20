import {
    doAjaxThings,
} from "./toolBox.js";

class MenuModel {
    constructor() {

    }

    async getMenu(_userRole) {
        return doAjaxThings("../data/menu.json", "json")
            .then(completeMenu => {
                completeMenu.forEach(menu => {
                    menu.item.forEach((subMenu, index) => {
                        if (subMenu.roles.includes(_userRole)) {} else {
                            menu.item.splice(index, 1);
                        }
                    });
                });
                return completeMenu;
            })

    }
}

/**
 *
 *
 * @class NavMenu
 */
class MenuView {

    constructor() {
        //this.buildMenu();
    }

    /**
     *Constuit le menu principal
     *
     */
    displayMenu(menu) {
        //Data of the menu
        const menuBar = document.createElement("nav");
        this.getElement('body').appendChild(menuBar);
        menuBar.classList.add("nav");
        const ul = document.createElement('ul')
        ul.classList.add('menu')
        Object.keys(menu).forEach(levelOneMenu => {
            //premier niveau
            const menus = document.createElement('li')
            menus.classList.add('levelOneMenu')
            menus.innerHTML = menu[levelOneMenu]['name']
            ul.appendChild(menus)
            const dropDownMenu = document.createElement('ul')
            dropDownMenu.classList.add('dropDownMenu')
            menus.appendChild(dropDownMenu)
            Object.keys(menu[levelOneMenu]['item']).forEach(levelTwoMenu => {
                //deuxième niveau
                const item = document.createElement('li')
                item.classList.add('dropDownItem')
                const links = document.createElement('a')
                links.setAttribute('href', `./${menu[levelOneMenu]['item'][levelTwoMenu]['file']}`)
                links.innerHTML = menu[levelOneMenu]['item'][levelTwoMenu]['name']
                links.onclick = () => {
                    this.title = links.innerText
                }
                item.appendChild(links)
                dropDownMenu.appendChild(item)
            })
        })
        menuBar.appendChild(ul)



        menuBar.appendChild(this.builInstructionBar());

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
        menuBar.appendChild(divUser);

        const divTime = document.createElement('div');
        let time = this.syncTime();
        divTime.innerHTML = `${time.hour}:${time.minute}`;
        setTimeout(() => {
            time = this.syncTime();
            divTime.innerHTML = `${time.hour}:${time.minute}`;
            setInterval(() => {
                time = this.syncTime();
                divTime.innerHTML = `${time.hour}:${time.minute}`;
            }, 60000);
        }, (60 - time.second) * 1000);
        menuBar.appendChild(divTime);
    }

    syncTime() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        return { 'hour': hour, 'minute': minute, 'second': second }
    }

    /**
     *Construit la zone de texte qui clignote pour indiquer une instruction utilisateur
     *
     * @return {HTMLElement} 
     */
    builInstructionBar() {
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
    changeInstructionText(_text) {
        const divIstructionText = document.getElementById('instruction-text')
        divIstructionText.innerHTML = _text;
    }

    // Retrieve an element from the DOM
    getElement(selector) {
        const element = document.querySelector(selector);
        return element;
    }

    // Retrieve list of elements from the DOM
    getElements(selector) {
        const elements = document.querySelectorAll(selector);
        return elements;
    }
}
class MenuController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.onLoad();


    }

    onLoad() {
        this.model.getMenu(this.view.getElement('#role').innerHTML).then(menu => {
            this.view.displayMenu(menu);
        });

    }

    onGroupClick(_groupId) {
        this.view.displayGroupOperations(_groupId);
    }

}
export const menu = new MenuController(new MenuModel(), new MenuView());