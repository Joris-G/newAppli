import NavMenu from "../menu.js"
import { Moulage } from "../moulage.js"
import { Div, Cellule, SelectItem } from "../toolBox.js"

//HTML ELEMENTS
const body = document.querySelector('body')
const divModule = new Div('module', body)
const lefSideBar = new Div('leftSideBar', divModule)
const divContent = new Div('content', divModule)
divContent.id = "divContent"
const btnNext = document.createElement('button')
btnNext.id = "btnNext"
btnNext.classList.add('hidden')
lefSideBar.appendChild(btnNext)
const tableRecap = document.createElement('table')
    //GLOBAL VARIABLES & CONSTANTS
let xmlhttp = new XMLHttpRequest()
const newMolding = new Moulage()



//FUNCTIONS
const initMoulage = function() {
    newMolding.assignTool()
}
btnNext.onclick = () => {
        newMolding.initScan()
    }
    //******MenuBar******
const createMenu = function() {
    const menuBar = document.createElement('nav')
    body.appendChild(menuBar)
    menuBar.classList.add('nav')
    const requestURL = '../data/menu.json'
    xmlhttp.responseType = 'json'
    xmlhttp.open('GET', requestURL)
    xmlhttp.onload = function() {
        const menu = new NavMenu(menuBar, xmlhttp.response)
        menu.buildMenu()
        menuBar.appendChild(buildUser());
    }
    xmlhttp.send()
}

const divTitle = new Div('title', divContent)
const title = 'Moulage'
divTitle.innerHTML = title.toUpperCase()
divTitle.classList.add('title-font')


//CODE
createMenu()
initMoulage()

function buildUser() {
    const divUser = document.createElement('div');
    divUser.id = 'div-user';
    const divUserName = document.createElement('div');
    divUserName.id = 'div-userName';
    console.log(sessionStorage);
    const userName = document.getElementById('userName').innerHTML;
    divUserName.innerHTML = userName;
    const divRole = document.createElement('div');
    divRole.id = 'div-role';
    const role = document.getElementById('role').innerHTML;
    divRole.innerHTML = role;

    divUser.append(divUserName, divRole);

    return divUser;
}