import {
    doAjaxThings,
    Div,
    Cellule,
    SelectItem,
    DownArrowStatus,
    Bouton,
} from "../toolBox.js";


//PAGE CONSTRUCTION
const body = document.querySelector("body");
const divPrepAssy = new Div("module", body);
const divContent = new Div("content", divPrepAssy);
divContent.id = "divContent";
const inputTest = document.createElement('input');
divContent.appendChild(inputTest);
const tableTest = [];
inputTest.onkeypress = (event) => {
    tableTest.push(event);
    console.log(tableTest);
    if (tableTest[0] == tableTest[1]) {
        console.log(true);
    } else { console.log(false); }
    console.log(event);
}