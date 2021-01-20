export class Tool {
    constructor() {
        this.codeSap
        this.toolName
    }
    assignTool(codeSap) {
        const xmlhttp = new XMLHttpRequest()
        const requestURL = `../script/php/getTool.php?numOtSap=${codeSap.substring(2, 8)}`
        xmlhttp.responseType = 'json'
        xmlhttp.open('GET', requestURL)
        xmlhttp.onload = () => {
            this.codeSap = xmlhttp.response.numOtSap
            this.toolName = xmlhttp.response.desOutillage
        }
        xmlhttp.send()
    }
    toolChoice() {
        const divToolChoice = document.createElement('div')

        const instructionToolChoice = document.createElement('div')
        divToolChoice.appendChild(instructionToolChoice)
        instructionToolChoice.classList.add('centerContent')
        instructionToolChoice.innerText = "Scanner le code-barre outillage de l'OF ou bien le QRCode de l'outillage de moulage"
        instructionToolChoice.classList.add('fontWeightFlash')

        const inputTool = document.createElement('textarea')
        inputTool.value = "OT095904"
        divToolChoice.appendChild(inputTool)
        inputTool.focus()
        inputTool.classList.add('hidden')
        inputTool.onkeypress = (key) => {
            if (key.code === "Enter") {
                this.assignTool(inputTool.value)
                setTimeout(() => {
                    if (typeof (this.toolName) === "undefined") {
                        window.alert("L'outillage n'a pas été trouvé en base de donnée")
                        inputTool.value = ""
                    } else {
                        divToolChoice.remove()
                        const btnNext = document.getElementById("btnNext")
                        btnNext.click()
                    }
                }, 300);
            }
        }
        document.addEventListener("click", function () {
            inputTool.focus()
        })

        return divToolChoice
    }
}