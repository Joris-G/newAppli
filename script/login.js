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



let loginTextArea = document.createElement('textarea')
loginTextArea.classList.add('hidden')
loginTextArea.name = 'username'
loginTextArea.onkeypress = (event) => {
    if (event.keyCode === 13) {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.open("GET", '../script/php/authentification.php?matricule=' + loginTextArea.value, true)
        xmlhttp.onload = () => {
            if (xmlhttp.status >= 200 && xmlhttp.status < 400) {
                var user = JSON.parse(xmlhttp.responseText)
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
        }
        xmlhttp.send()
    }
}




document.addEventListener('click', function(event) {
    loginTextArea.focus()
})

let keys = {};
onkeydown = onkeyup = function(e) {
    e = e || event;
    e.which = e.which || e.keyCode;
    keys[e.which] = e.type === 'keydown'
    if (keys[17] && keys[18] && keys[69]) {
        loginTextArea.value = 204292
    }
}
onclick = function() {
    if (keys[17] && keys[16] && keys[69]) {}
}

body.appendChild(loginTextArea)
    //body.appendChild(divMsgBox)
loginTextArea.focus();