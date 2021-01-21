import {
    doAjaxThings,
    addLoader,
    removeLoader,
} from "./toolBox.js";

const body = document.querySelector('body')
    // const title = `AUTHENTIFICATION`
    // const msg = `VEUILLEZ SCANNER VOTRE BADGE POUR VOUS AUTHENTIFIER`
    // const divMsgBox = document.createElement('div')
    // divMsgBox.classList.add('middleScreen')
    // divMsgBox.id = 'msgBox'
    // const divTitle = document.createElement('div')
    // divTitle.classList.add('title-font')
    // divTitle.innerText = title
    // const divMsg = document.createElement('div')
    // divMsg.classList.add('fontWeightFlash')
    // divMsg.innerText = msg
    // divMsgBox.appendChild(divTitle)
    // divMsgBox.appendChild(divMsg)
function login(userName, password = null) {
    if (password === null) {
        doAjaxThings(`../script/php/authentification.php?matricule=${userName}`, 'json').then(
            user => {
                connexionAction(user);
            },
            error => { console.error(error); }
        );
    } else {
        doAjaxThings(`../script/php/authentification.php?userName=${userName}&password=${password}`, 'json').then(
            user => {
                connexionAction(user);
            },
            error => { console.error(error); }
        );
    }
}

function connexionAction(user) {
    console.log(user);
    switch (user['SECTEUR']) {
        case 'COMPOSITE':
            console.log('secteur composite')
            switch (user['ROLE']) {
                case 'COMPAGNON':
                    console.log('Rôle Compagnon');
                    open('./op-moulage-composite.php', true);
                    window.close();
                    break;
                case 'ADMIN':
                    console.log('Rôle Admin');
                    open('./index.php', true);
                    window.close();
                    break;
                case 'METHODE':
                    console.log('Rôle Préparateur');
                    open('./prep-moulage-composite.php', true);
                    window.close();
                    break;
                default:
                    console.log('defaut');
                    open('./index.php', true);
                    window.close();
                    break;
            }
            break;
        case 'METALLIQUE':
            console.log('secteur composite')
            switch (user['ROLE']) {
                case 'COMPAGNON':
                    console.log('Rôle Compagnon');
                    open('./index.php', true)
                    window.close();
                    break;
                case 'ADMIN':
                    console.log('Rôle Admin');
                    open('./index.php', true)
                    window.close();
                    break;
                case 'METHODE':
                    console.log('Rôle Préparateur');
                    open('./index.php', true)
                    window.close();
                    break;
                default:
                    console.log('defaut')
                    open('./index.php', true)
                    window.close();
                    break;
            }
            break;
        case 'ASSEMBLAGE COMPOSITE':
            console.log('secteur composite')
            switch (user['ROLE']) {
                case 'COMPAGNON':
                    console.log('Rôle Compagnon');
                    open('./op-assemblage-composite.php', true)
                    window.close();
                    break;
                case 'ADMIN':
                    console.log('Rôle Admin');
                    open('./index.php', true)
                    window.close();
                    break;
                case 'METHODE':
                    console.log('Rôle Préparateur');
                    open('./prep-assemblage-composite.php', true)
                    window.close();
                    break;
                default:
                    console.log('defaut')
                    open('./index.php', true)
                    window.close();
                    break;
            }
            break;
        case 'ASSEMBLAGE METALLIQUE':
            console.log('secteur composite')
            switch (user['ROLE']) {
                case 'COMPAGNON':
                    console.log('Rôle Compagnon');
                    open('./index.php', true)
                    window.close();
                    break;
                case 'ADMIN':
                    console.log('Rôle Admin');
                    open('./index.php', true)
                    window.close();
                    break;
                case 'METHODE':
                    console.log('Rôle Préparateur');
                    open('./index.php', true)
                    window.close();
                    break;
                default:
                    console.log('defaut')
                    open('./index.php', true)
                    window.close();
                    break;
            }
            break;
        default:
            break;
    }
}

let loginTextArea = document.createElement('textarea')
loginTextArea.classList.add('hidden')
loginTextArea.name = 'username'
loginTextArea.onkeypress = (event) => {
    const userName = loginTextArea.value;
    if (event.keyCode === 13) {
        login(userName)
    }
}

// let keys = {};
// onkeydown = onkeyup = function(e) {
//     e = e || event;
//     e.which = e.which || e.keyCode;
//     keys[e.which] = e.type === 'keydown'
//     if (keys[17] && keys[18] && keys[69]) {
//         loginTextArea.value = 204292
//     }
// }

// onclick = function() {
//     if (keys[17] && keys[16] && keys[69]) {}
// }

body.appendChild(loginTextArea)
    //body.appendChild(divMsgBox)
    //loginTextArea.focus();

const imgScan = document.getElementById('img-scan');
imgScan.onclick = () => {
    loginTextArea.focus();
}

const btnLogin = document.getElementById('btn-login');
btnLogin.onclick = () => {
    const userName = document.getElementById('login').value;
    const psw = document.getElementById('mdp').value;
    login(userName, psw);
}