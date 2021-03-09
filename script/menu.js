import {
    doAjaxThings,
} from "./toolBox.js";

class MenuModel {
    constructor() {

    }

    async getMenu(_userRole) {
        return doAjaxThings("../data/menu.json", "json")
            .then(completeMenu => {
                const newMenu = [];
                completeMenu.forEach((menuItem, menuIndex) => {
                    if (menuItem.roles.includes(_userRole)) {
                        const subMenuItems = [];
                        menuItem.item.forEach((subMenuItem, subMenuIndex) => {
                            if (subMenuItem.roles.includes(_userRole)) {
                                subMenuItems.push(subMenuItem);
                            }
                        });
                        const newMenuItem = {
                            'id': menuItem.id,
                            'name': menuItem.name,
                            'item': subMenuItems
                        };
                        newMenu.push(newMenuItem);
                    }
                });
                return newMenu;
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
        const menuBar = document.createElement("nav");
        this.getElement('body').appendChild(menuBar);
        menuBar.classList.add("nav");

        //LOGO
        const divLogo = document.createElement('div');
        divLogo.classList.add('logoDaher');
        const imgLogo = document.createElement('img');
        imgLogo.src = '../public/src/img/logoDaherFondBleu.png';
        divLogo.appendChild(imgLogo);
        menuBar.appendChild(divLogo);

        //Data of the menu
        const ul = document.createElement('ul');
        ul.classList.add('menu');
        menu.forEach((levelOneMenu, index) => {
            //premier niveau
            const menus = document.createElement('li');
            menus.classList.add('levelOneMenu');
            menus.innerHTML = levelOneMenu['name'];
            ul.appendChild(menus);
            const dropDownMenu = document.createElement('ul');
            dropDownMenu.classList.add('dropDownMenu');
            menus.appendChild(dropDownMenu);
            levelOneMenu.item.forEach(levelTwoMenu => {
                //deuxième niveau
                const item = document.createElement('li');
                item.classList.add('dropDownItem');
                const links = document.createElement('a');

                links.setAttribute('href', `./${levelTwoMenu['file']}`);
                links.innerHTML = levelTwoMenu['name'];
                links.onclick = () => {
                    this.title = links.innerText;
                }
                item.appendChild(links);
                dropDownMenu.appendChild(item);
            });
        });
        menuBar.appendChild(ul);



        menuBar.appendChild(this.builInstructionBar());

        //USER
        const divUser = document.createElement('div');
        divUser.id = 'div-user';
        const divUserName = document.createElement('div');
        divUserName.id = 'div-userName';
        const userName = document.getElementById('userName').innerHTML;
        divUserName.innerHTML = userName;
        const divRole = document.createElement('div');
        divRole.id = 'div-role';
        const role = document.getElementById('role').innerHTML;
        divRole.innerHTML = `Rôle : ${role}`;
        const divTeam = document.createElement('div');
        divTeam.id = 'div-team';
        const teamNumber = document.getElementById('teamNumber').innerHTML;
        divTeam.innerHTML = `Equipe : ${teamNumber}`;
        const divAttributs = document.createElement('div');
        divAttributs.classList.add('user-attributes');
        divAttributs.append(divRole, divTeam);
        divUser.append(divUserName, divAttributs);
        menuBar.appendChild(divUser);

        //TIME
        const divTime = document.createElement('div');
        let time = this.syncTime();
        divTime.innerHTML = `${time.hour}:${time.minute}`;
        setTimeout(() => {
            time = this.syncTime();
            const minuteTxt = () => {
                if (time.minute < 10) {
                    return `0${time.minute}`;
                } else {
                    return time.minute;
                }
            }
            divTime.innerHTML = `${time.hour}:${minuteTxt()}`;
            setInterval(() => {
                time = this.syncTime();
                divTime.innerHTML = `${time.hour}:${minuteTxt()}`;
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