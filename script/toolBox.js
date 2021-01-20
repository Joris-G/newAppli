/**
 *
 *
 * @export
 * @class Div
 */
export class Div {
    /**
     * Creates an instance of Div.
     * @param {string} className
     * @param {HTMLElement} parentNode
     * @memberof Div
     */
    constructor(className, parentNode) {
        const div = document.createElement('div')
        div.classList.add(`${className}`)
        parentNode.appendChild(div)
        return div
    }
}

export class Cellule {
    constructor(contentType, ligne, val) {
        const td = document.createElement('td')
        switch (contentType) {
            case 'object':
                td.appendChild(val)
                break;
            case 'string':
                td.innerHTML = val
                break;
            default:
                break;
        }
        ligne.appendChild(td)
        return td
    }
}

/**
 *
 *
 * @export
 * @class SelectItem
 * @extends {HTMLSelectElement}
 */
export class SelectItem extends HTMLSelectElement {
    /**
     * Creates an instance of SelectItem.
     * @param {Array} arrayList Array of string or object {text, value}
     * @param {*} [event=null]
     * @memberof SelectItem
     */
    constructor(arrayList, event = null) {
        const list = document.createElement('select');
        arrayList.forEach(element => {
            if (typeof(element) === "string") {
                const option = new Option(element, element);
                list.options[list.options.length] = option;
            } else {
                const option = new Option(element[0], element[1]);
                list.options[list.options.length] = option;
            }
        });
        list.selectedIndex = -1;
        list.addEventListener('change', event);
        return list;
    }
}

export class SanctionBouton {

    constructor() {
        this.sanction = null;
        this.btnConform = null;
        this.btnNonConform = null;
    }
    drawButton() {
        const divButtons = document.createElement('div');
        divButtons.classList.add('sanction-choice');
        this.btnConform = document.createElement('div');
        this.btnConform.innerHTML = 'CONFORME';
        this.btnConform.classList.add('btn', 'btn-compliant', 'btn-primary', 'btn-L');
        this.btnNonConform = document.createElement('div');
        this.btnNonConform.innerHTML = 'NON-CONFORME';
        this.btnNonConform.classList.add('btn', 'btn-primary', 'btn-L', 'btn-not-compliant');
        divButtons.append(this.btnConform, this.btnNonConform);

        this.btnConform.onclick = () => {
            if (this.btnConform.classList.contains('btn-compliant-selected')) {
                this.btnConform.classList.remove('btn-compliant-selected');
            } else {
                this.btnConform.classList.add('btn-compliant-selected');
            }
            this.btnNonConform.classList.remove('btn-not-compliant-selected')
            this.sanction = 1;

            const btn = new Bouton();
            if (btn) btn.setEnable();
        }
        this.btnNonConform.onclick = () => {
            if (this.btnNonConform.classList.contains('btn-not-compliant-selected')) {
                this.btnNonConform.classList.remove('btn-not-compliant-selected');
            } else {
                this.btnNonConform.classList.add('btn-not-compliant-selected');
            }
            this.btnConform.classList.remove('btn-compliant-selected')
            this.sanction = 0;

            const btn = new Bouton();
            if (btn) btn.setEnable();
        }
        return divButtons;
    }


}


export class Bouton {

    /**
     * Creates an instance of Bouton.
     * @param {String} [_style=null] exemple : 'confirm', 'scan' , 'default'...
     * @param {String} [_txtbtn=null]
     * @param {*} [_action=null]
     * @param {String} [_size=null] 'S', 'M', 'L'
     * @memberof Bouton
     */
    constructor(_style = null, _txtbtn = null, _action = null, _size = 'M') {
        if (_style == null) {
            this.getButton();
        } else {
            this.btn = document.createElement('div');
            this.style = _style;
            this.txtbtn = _txtbtn;
            this.action = _action;
            this.size = _size;
        }
        this.setAction(this.action);
    }

    getButton() {
        this.btn = document.getElementById('confirm-button');
        if (this.btn) {
            this.style = this.btn.id.split('-')[0]
            if (this.btn) {
                return true
            } else {
                return false;
            }
        }
    }

    /**
     *return a button withe the style defined. Disable by default.
     *Err if not defined.
     *
     * @return {HTMLDivElement} 
     * @memberof Bouton
     */
    drawButton() {
        switch (this.style) {
            case 'confirm':
                this.btn.classList.add('btn', 'bouton-disable', 'btn-primary');
                this.btn.innerText = 'CONFIRMER';
                this.btn.id = 'confirm-button';
                break;
            case 'scan':
                this.btn.classList.add('btn', 'btn-radius', 'bouton-green');
                this.btn.innerText = 'SCAN';
                this.btn.id = 'id-btn-scan';
                break;
            case 'default':
                this.btn.classList.add('btn', 'btn-primary');
                this.btn.innerText = this.txtbtn;
                break;
            default:
                console.error(`${this.style} is not a valide style. List of valid style : 'confirm',...`)
                break;
        }
        this.btn.classList.add(`btn-${this.size}`);

        return this.btn
    }

    /**
     *Change state of the button. Set the state 'enable'.
     *
     * @memberof Bouton
     */
    setEnable() {
        if (this.btn) {
            this.btn.classList.add('bouton-enable');
            this.btn.classList.remove('bouton-disable');
        }
    }

    setDisable() {
        this.btn.classList.remove('bouton-enable');
        this.btn.classList.add('bouton-disable');
    }

    /**
     *
     *
     * @param {*} [action=null]
     * @memberof Bouton
     */
    setAction(action) {
        switch (this.style) {
            case 'scan':
                document.addEventListener('click', (ev) => {
                    if (ev.target != this.btn) {
                        if (this.btn.classList.contains('bouton-green')) {
                            this.btn.classList.add('bouton-red');
                            this.btn.classList.remove('bouton-green');
                            document.querySelector('.scan-input').blur();
                        }
                    }
                });
                this.btn.onclick = () => {
                    if (this.btn.classList.contains('bouton-red')) {
                        this.btn.classList.add('bouton-green');
                        this.btn.classList.remove('bouton-red');
                        document.querySelector('.scan-input').focus();
                    } else {
                        this.btn.classList.remove('bouton-green');
                        this.btn.classList.add('bouton-red');
                        document.querySelector('.scan-input').blur();
                    }
                }
                break;
            case 'confirm':
                this.btn.addEventListener('click', action);
                break;
            case 'default':
                this.btn.addEventListener('click', action);
                break;
            default:
                break;
        }
    }

    clickAction() {
        if (this.state) {
            this.state = 0;
        } else {
            this.state = 1;
        }
    }
    getState() {

    }

    /**
     *
     *
     * @static
     * @param {*} btn
     * @memberof Bouton
     */
    static isOn(btn) {
        const maListe = btn.target.classList.value.split(" ")
        let result
        for (const item of maListe) {
            if (item == "bouton-on") {
                result = true;
            } else {
                result = false;
            }
        }
        return result
    }
}

export class Input {
    /**
     * Creates an instance of Input.
     * @param {string} _style exemple : 'scan', ...
     * @memberof Input
     */
    constructor(_style, _controller) {
        this.input = document.createElement('input');
        this.style = _style;
        this.controller = _controller;
        this.setAction();
    }

    /**
     *return a button withe the style defined. Disable by default.
     *Err if not defined.
     *
     * @return {HTMLInputElement} 
     * @memberof Input
     */
    drawInput() {
        switch (this.style) {
            case 'scan':
                this.input.classList.add('scan-input', 'hidden');
                this.setEnable();
                break;
            default:
                console.error(`${this.style} is not a valide style. List of valid style : 'scan',...`)
                break;
        }
        return this.input
    }

    /**
     *Change state of the button. Set the state 'enable'.
     *
     * @memberof Bouton
     */
    setEnable() {
        this.input.classList.add('active-input');
        this.input.focus();
    }

    setDisable() {
        this.input.classList.remove('active-input');
    }
    setAction(action = null) {
        console.log(this.style);

        switch (this.style) {
            case 'scan':
                this.input.onchange = () => {
                    console.log(this.input.value);
                    switch (this.scanProcessing().TYPE) {
                        case 'IDFAC':
                            this.controller.idFacAction(this.input.value);
                            break;
                        case 'OF':
                            console.log('OF action');
                            this.controller.ofAction(this.scanProcessing().DATA);
                            break;
                        case 'CTRL-TOOL':
                            console.log('Control tool action');
                            this.controller.ctrlToolAction(this.scanProcessing().DATA);
                            break;
                        case 'MAT':
                            console.log('Material scan action');
                            this.controller.materialAction(this.scanProcessing().DATA);
                            break;
                        case 'USER':
                            console.log('User scan action');
                            document.querySelector('.divSecondaryUser').innerHTML = this.scanProcessing().DATA;
                            break;
                        default:
                            console.log('default');
                            this.controller.idFacAction(this.input.value);
                            break;
                    }
                    this.input.value = "";
                }
                break;
            default:
                break;
        }

    }

    /**
     *
     *
     * @return {Object} TYPE : OF, MAT, CTRL-TOOL, TOOL, IDFAC  & DATA Array of encoding datas 
     * @memberof Input
     */
    scanProcessing() {
        const inputValue = this.input.value;
        const indexOfFirstProperty = inputValue.indexOf(" ", 0) + 1;
        if (indexOfFirstProperty) {
            const materialPropertyValues = inputValue.substr(indexOfFirstProperty, inputValue.length - indexOfFirstProperty);
            const data = materialPropertyValues.split(",");
            const type = inputValue.substr(0, inputValue.indexOf(" ", 0));
            return { 'TYPE': type, 'DATA': data };
        } else {
            return { 'TYPE': 'IDFAC', 'DATA': inputValue }
        }

    }
}




/**
 *
 *
 * @export
 * @class DownArrowStatus
 */
export class DownArrowStatus {
    constructor(_status, _size, _name) {
        this.status = _status;
        this.size = _size;
        this.name = _name;
        //this.changeColor()
    }
    async drawArrow() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `../public/src/img/fleche-${this.size}.svg`, true);
        xhr.overrideMimeType("image/svg+xml")
        xhr.onload = () => {
            this.arrow = xhr.responseXML.documentElement;
            resolve(this.arrow);
        }
        xhr.send();
        // return new Promise((resolve, reject) => {
        //     const xhr = new XMLHttpRequest();
        //     xhr.open("GET", `../public/src/img/fleche-${this.size}.svg`, true);
        //     xhr.overrideMimeType("image/svg+xml")
        //     xhr.onload = () => {
        //         this.arrow = xhr.responseXML.documentElement;
        //         resolve(this.arrow);
        //     }
        //     xhr.send();
        // })
    }

    setStatus(_status) {
        this.status = _status
        this.changeColor()
    }
    changeColor() {
        // Store the SVG namespace for easy reuse.
        var svgns = 'http://www.w3.org/2000/svg';

        // Create <svg>, <defs>, <linearGradient> and <rect> elements using createElementNS to apply the SVG namespace.
        // (https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS)

        var svgObject = this.arrow
        console.log(svgObject);
        //var svg = svgObject.getElementById('Calque_1');
        var defs = document.createElementNS(svgns, 'defs');
        var gradient = document.createElementNS(svgns, 'linearGradient');
        var arrowShadow = svgObject.querySelector('#XMLID_3_');
        console.log(arrowShadow);
        var arrow = svgObject.querySelector("#fleche");

        // Store an array of stop information for the <linearGradient>
        let stops = []
        switch (this.status) {
            case 1:
                //green
                stops = [{
                    "color": "#0f0",
                    "opacity": "1",
                    "offset": "0%"
                }, {
                    "color": "#3AFF3A",
                    "opacity": ".784",
                    "offset": "21%"
                }, {
                    "color": "#C6FFC6",
                    "opacity": ".238",
                    "offset": "76%"
                }, {
                    "color": "#fff",
                    "opacity": "0",
                    "offset": "100%"
                }];
                // Apply the <lineargradient> to <defs>
                gradient.id = 'GradientGreen';
                break;
            case 2:
                //yellow
                stops = [{
                    "color": "#ff0",
                    "opacity": "1",
                    "offset": "0%"
                }, {
                    "color": "#FFFF3A",
                    "opacity": ".784",
                    "offset": "21%"
                }, {
                    "color": "#FFFFC6",
                    "opacity": ".238",
                    "offset": "76%"
                }, {
                    "color": "#fff",
                    "opacity": "0",
                    "offset": "100%"
                }];
                // Apply the <lineargradient> to <defs>
                gradient.id = 'GradientYellow';
                break;
            case 3:
                //red
                stops = [{
                    "color": "#f00",
                    "opacity": "1",
                    "offset": "0%"
                }, {
                    "color": "#FF3A3A",
                    "opacity": ".784",
                    "offset": "21%"
                }, {
                    "color": "#FFC6C6",
                    "opacity": ".238",
                    "offset": "76%"
                }, {
                    "color": "#fff",
                    "opacity": "0",
                    "offset": "100%"
                }];
                // Apply the <lineargradient> to <defs>
                gradient.id = 'GradientRed';
                break;
            case 4:

                break;
            default:
                break;
        }
        // Parses an array of stop information and appends <stop> elements to the <linearGradient>
        for (var i = 0, length = stops.length; i < length; i++) {

            // Create a <stop> element and set its offset based on the position of the for loop.
            var stop = document.createElementNS(svgns, 'stop');
            stop.setAttribute('offset', stops[i].offset);
            stop.setAttribute('stop-color', stops[i].color);
            stop.setAttribute('stop-opacity', stops[i].opacity);

            // Add the stop to the <lineargradient> element.
            gradient.appendChild(stop);
        }




        // x1 = "-292.77969"
        // y1 = "-75.469803"
        // x2 = "-292.77969"
        // y2 = "-177.50439"


        gradient.setAttribute('x1', '0');
        gradient.setAttribute('x2', '0');
        gradient.setAttribute('y1', '1');
        gradient.setAttribute('y2', '0');
        defs.appendChild(gradient);
        // Setup the <rect> element.
        arrowShadow.setAttribute('style', `fill:url(#${gradient.id})`); //url(#Gradient)');
        arrow.setAttribute('style', `fill:${stops[0].color}`)
        svgObject.appendChild(defs)
    }
}

/**
 *
 *
 * @export
 * @param {String} url
 * @param {String} responseType exemple : 'json', 'text'
 * @return {Promise} 
 */
export async function doAjaxThings(url, responseType) {
    // await code here
    let result = await makeRequest("GET", url, responseType)
    console.log(result);
    return result;
    // code below here will only execute when await makeRequest() finished loading

}

function makeRequest(method, url, responseType) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = responseType
        xhr.open(method, url);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function() {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}


export function addLoader() {
    const body = document.querySelector("body");
    const divLoader = document.createElement("div");
    divLoader.id = "loader";
    divLoader.classList.add("loader");
    body.appendChild(divLoader);
}

export function removeLoader() {
    const loader = document.getElementById("loader");
    loader.remove();
}

export class ModalBox {

    /**
     * Creates an instance of ModalBox.
     * @param {string} [_type='ALERT'] exemples : [default]'ALERTE', 'YES_NO'
     * @param {*} _msg
     * @param {string} [_alt="NO"] exemple "QUALITY" (permet de lancer une validation par badge qualité)
     * @memberof ModalBox
     */
    constructor(_type = 'ALERT', _msg, _alt = "NO") {
        this.type = _type;
        this.msg = _msg;
        this.opt = _alt;
        this.displayBox(this.type);
    }
    removeBox() {
        document.querySelector('.modal').remove();
    }

    displayBox() {
        const divModal = document.createElement('div');
        divModal.classList.add('modal');
        divModal.id = "myModal";

        const divModalContent = document.createElement('div');
        divModalContent.classList.add('modal-content');
        const divModalHeader = document.createElement('div');
        divModalHeader.classList.add('modal-header');
        const closeButton = document.createElement('span');
        closeButton.classList.add('close');
        // When the user clicks on <span> (x), close the modal
        closeButton.onclick = function() {
            divModal.style.display = "none";
        }
        const titleHeader = document.createElement('h2');
        switch (this.type) {
            case 'ALERT':
                titleHeader.innerHTML = "Message d'alerte :";
                break;
            case 'YES_NO':
                titleHeader.innerHTML = "Message de confirmation :";
                break;
            default:
                break;
        }

        divModalHeader.append(titleHeader, closeButton);

        const divModalBody = document.createElement('div');
        divModalBody.classList.add('modal-body');
        const textBody = document.createElement('p');
        textBody.innerHTML = this.msg;
        divModalBody.appendChild(textBody);

        const divModalFooter = document.createElement('div');
        divModalFooter.classList.add('modal-footer');
        const textFooter = document.createElement('h3');
        textFooter.classList.add('text-footer');
        textFooter.innerHTML = "pas de texte";

        divModalFooter.appendChild(textFooter);

        divModalContent.append(divModalHeader, divModalBody, divModalFooter);
        divModal.appendChild(divModalContent);

        const divButtonBox = document.createElement('div');
        divButtonBox.classList.add('button-box');
        switch (this.opt) {
            case 'NO':
                break;
            case 'QUALITY':
                const divSecondaryUser = document.createElement('input');
                divSecondaryUser.classList.add('hidden', 'divSecondaryUser');
                divSecondaryUser.onchange = () => {
                    console.log('change');
                    const promGetUser = doAjaxThings(`../script/php/getUser.php?matricule=${divSecondaryUser.value}`, 'json')
                    promGetUser.then(result => {
                        console.log(result);
                        if (result.ROLE == "CONTROLE") {
                            console.log('CONTROLE');
                            this.response = result;
                        }
                    });
                    divSecondaryUser.value = "";
                }
                const txtQuality = "Un contrôleur peut scanner son badge pour dévérouiller l'opération"
                const btnQualityScan = new Bouton('default', 'SCAN BADGE QUALITE');
                this.btnQualityScan = btnQualityScan;
                const divQuality = document.createElement('p');
                divQuality.innerHTML = txtQuality;
                divModalBody.append(divQuality, divSecondaryUser);
                divButtonBox.appendChild(btnQualityScan.drawButton());
                break;
        }
        switch (this.type) {
            case 'ALERT':
                const okButton = new Bouton('confirm');
                okButton.setEnable();
                this.okButton = okButton;
                divButtonBox.appendChild(okButton.drawButton());
                break;
            case 'YES_NO':
                const yesButton = document.createElement('div');
                yesButton.classList.add('yes-button');
                yesButton.innerHTML = 'OUI';
                this.yesButton = yesButton;
                const noButton = document.createElement('div');
                noButton.classList.add('no-button');
                noButton.innerHTML = 'NON';
                this.noButton = noButton;
                divButtonBox.append(yesButton, noButton);
                break;
            default:
                break;
        }
        divModalBody.appendChild(divButtonBox);
        const body = document.querySelector('BODY');
        body.appendChild(divModal);

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == divModal) {
                event.preventDefault();
                //divModal.style.display = "none";
            }
        }
    }
    async getResponse() {
        return await new Promise(resolve => {
            setInterval(() => {
                if (this.response) {
                    resolve(this.response);
                }
            }, 200);
        });
    }
}
export class LabelText {
    constructor(_label, _text) {
        this.label = _label;
        this.text = _text;
    }
    drawLabelText() {
        const divLabelText = document.createElement('div');
        const label = document.createElement('label');
        label.innerText = this.label;
        const span = document.createElement('span');
        span.innerText = this.text;
        divLabelText.append(label, span);
        return divLabelText;
    }
}

// export class SAPLOGON {
//     constructor(_user, _pswd) {
//         this.user = _user;
//         this.password = _pswd;
//         this.retcd = 0;
//         this.exceptions = 0;
//     }

//     SAPlogon() {
//         const fns = new ActiveXObject("SAP.Functions");
//         trans = fns.Transactions;
//         conn = fns.connection;
//         conn.System = "DNA";
//         conn.user = this.user;
//         conn.password = this.password;
//         conn.Client = "340";
//         conn.Language = "FR";
//         conn.tracelevel = 6;
//         conn.RFCWithDialog = 1;
//         conn.logon(0, 0);
//         this.exceptions = 0;
//     }

//     SAPlogoff() {
//         conn.logoff(0, 0);
//         this.exceptions = 0;
//     }

//     SAPcallTransaction(tcode) {
//         this.exceptions = 0;
//         callta = fns.add("RFC_CALL_TRANSACTION_USING");
//         callta.exports("TCODE") = "QM11";
//         callta.exports("MODE") = "E";
//         this.retcd = callta.call;
//         conn.logoff();
//         alert(this.retcd);
//         SAPcallTransaction = this.retcd;
//     }
// }