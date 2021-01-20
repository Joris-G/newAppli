import { Tool } from "./tool.js"
import { Kit } from "./kit.js"
import { Bouton } from "./toolBox.js"

export class Moulage {
    constructor(tool) {
        this.tool = tool
        this.defKit = []
    }
    assignTool() {
        const tool = new Tool()
        const divToolChoice = tool.toolChoice()
        const divContent = document.getElementById('divContent')
        divContent.appendChild(divToolChoice)
    }
    initScan() {
        const focusTxtArea = (event) => {
            if (event) {
                if (Bouton.isOn(event)) {
                    btnTurnOff(event.target)
                } else {
                    btnTurnOn(event.target)
                    inputKit.focus()
                }
            } else {
                inputKit.focus()
            }
            //divManu.style.display = 'none'
        }
        const exitFocusScanAction = () => {
            btnTurnOff(btnScan)
        }
        const focusScanAction = () => {
            btnTurnOn(btnScan)
        }
        const exitFocusTxtArea = () => {
            console.log('exit focus');
            inputKit.blur()
        }
        const scanAction = (event, defKit) => {
            cptNbScan = +1
            if (cptNbScan == 1) {
                if (!event.target.value.substr(0, 2) === "Kit") {
                    alert('Tentez de scanner le QR code et pas le code barre. \n\nPlacer un papier devant le code barre')
                    return
                }

            }
            defKit.push(inputKit.value)
            if (defKit.length == 10) {
                this.newKitByScan(defKit)
            }
            inputKit.value = ""
        }
        const btnTurnOn = (btn) => {
            btn.classList.add('bouton-on')
            btn.classList.remove('bouton-off')
        }
        const btnTurnOff = (btn) => {
            btn.classList.remove('bouton-on')
            btn.classList.add('bouton-off')
        }
        //******ScanToolBar *********/
        const divToolBar = document.createElement('div')
        const instructionScanKit = document.createElement('div')
        divToolBar.appendChild(instructionScanKit)
        instructionScanKit.classList.add('centerContent')
        instructionScanKit.innerText = "Scanner le QRcode de la fiche de vie kit"
        instructionScanKit.classList.add('fontWeightFlash')
        const btnScan = document.createElement('button')
        btnScan.classList.add('btn', 'btn-red-green', 'bouton-on')
        btnScan.innerText = "SCAN"
        btnScan.addEventListener('click', focusTxtArea)
        const btnManual = document.createElement('button')
        btnManual.classList.add('btn', 'btn-red-green')
        btnManual.innerText = "AJOUT MANUEL"
        //btnManual.disabled = true
        divToolBar.append(btnScan, btnManual)
        const inputKit = document.createElement('input')
        divToolBar.appendChild(inputKit)
        //inputKit.classList.add('hidden')
        inputKit.addEventListener("focus", focusScanAction);
        inputKit.addEventListener("focusout", exitFocusScanAction);
        let cptNbScan
        inputKit.addEventListener('change', scanAction(event, this.defKit));
        const divContent = document.getElementById('divContent')
        divContent.appendChild(divToolBar)
    }

    newKitByScan() {
        const nbMatiere = () => {
            this.defKit.forEach(currentItem => {
                let result
                if (currentItem.substr(0, 2) === "MAT") {
                    result = +1
                }
            });
            return result
        }
        //Tableau des index de colonnes de la Fiche de Vie scanner, "RefSap : "
        // var TbIndex = ["Kit : ", "RÃ©fÃ©rence SAP : ", "DÃ©signation SAP : ", "Tack Life ( Heures ) : ",
        //     "Time Out ( Heures ) : ", "Date de pÃ©remption Ã -18Â°C : ", "KIT Ã draper avant : ",
        //     "KIT Ã cuire avant : ", "MatiÃ¨re pÃ©nalisante drapage : ", "MatiÃ¨re pÃ©nalisante cuisson : "]
        // for (let index = 0; index < nbMatiere; index++) {
        //     var val = "MAT" + (index + 1) + " : "
        //     TbIndex.push(val)
        // }

        //Fonction permettant d'insérer le saut de ligne entre les données
        const tableauSplit = this.defKit//CheckDataIndex($inputKit.value, TbIndex, '\n').split("\n")
        var tableauRes = []
        let k = 0
        for (let i = 0; i < tableauSplit.length; i++) {
            const tableauTampon = tableauSplit[i].split(" : ")
            tableauRes[k] = tableauTampon[0]
            tableauRes[k + 1] = tableauTampon[1]
            k = k + 2
        }
        console.log(tableauRes)

        var date18 = new Date()
        date18.setDate(tableauRes[11].substr(0, 2))
        date18.setMonth(tableauRes[11].substr(3, 2) - 1)
        date18.setFullYear(tableauRes[11].substr(6, 4))
        date18.setHours(tableauRes[11].substr(11, 2))
        date18.setMinutes(tableauRes[11].substr(14, 2))

        var dateDra = new Date()
        dateDra.setDate(tableauRes[13].substr(0, 2))
        dateDra.setMonth(tableauRes[13].substr(3, 2) - 1)
        dateDra.setFullYear(tableauRes[13].substr(6, 4))
        dateDra.setHours(tableauRes[13].substr(11, 2))
        dateDra.setMinutes(tableauRes[13].substr(14, 2))

        var datePol = new Date()
        datePol.setDate(tableauRes[15].substr(0, 2))
        datePol.setMonth(tableauRes[15].substr(3, 2) - 1)
        datePol.setFullYear(tableauRes[15].substr(6, 4))
        datePol.setHours(tableauRes[15].substr(11, 2))
        datePol.setMinutes(tableauRes[15].substr(14, 2))

        var listMatiere = []

        for (let index = 1; index == nbMatiere; index++) {
            const searchElement = (element) => element == "MAT" + index
            console.log(tableauRes.findIndex(searchElement))
            listMatiere.push(tableauRes[tableauRes.findIndex(searchElement) + 1])
        }
        console.log(listMatiere)
        if (nbMatiere > 1) {
            //ajoute autant de ligne que de matière. On précise cette info
            //On modifie la désignation par le nom de la matière
            for (let index = 1; index == nbMatiere; index++) {
                var scanKit = new Kit(tableauRes[3], null, tableauRes[1], date18, dateDra, datePol)
            }


        } else {
            console.log(tableauRes[3], tableauRes[5], tableauRes[1], date18, dateDra, datePol);
            const scanKit = new Kit(tableauRes[3], tableauRes[5], tableauRes[1], date18, dateDra, datePol)
            console.log(scanKit)
        }
        // afterNewKitActions(scanKit)

    }
}


