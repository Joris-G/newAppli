import {
    doAjaxThings,
    Div,
    Cellule,
    SelectItem,
    DownArrowStatus,
    Bouton
} from "../toolBox.js";


const teamNumber = document.getElementById('teamNumber').innerText;
const btnTeamUser = document.getElementById('btn-team-user');
btnTeamUser.onclick = () => {
        showAllUsersQrCode(teamNumber);
    }
    //PAGE CONSTRUCTION
function showAllUsersQrCode(teamNumber) {
    let promUser;
    if (!!teamNumber) {
        promUser = doAjaxThings(`../script/php/getTeamUsers.php?teamNumber=${teamNumber}`, 'json');
    } else {
        promUser = doAjaxThings(`../script/php/getAllUsers.php?`, 'json');
    }
    promUser.then(listuser => {
        listuser.forEach(user => {
            const divUser = document.createElement('div');
            const divQrCode = document.createElement('div');
            divUser.classList.add('divUser');
            const matricule = user.MATRICULE;
            const txtQrCode = `${matricule}`;
            const divTxtHuman = document.createElement('div');
            const divTextRef = document.createElement('div');
            const txtRef = `${user.NOM} ${user.PRENOM}`;
            divTextRef.innerText = txtRef
            const divTextDes = document.createElement('div');
            divTextDes.innerText = matricule;
            divTxtHuman.append(divTextRef, divTextDes);
            divTxtHuman.classList.add('txt-human');
            new QRCode(divQrCode, { text: txtQrCode, width: 75, height: 75 });
            divUser.append(divQrCode, divTxtHuman);
            document.querySelector('body').appendChild(divUser);
        });
    });
}