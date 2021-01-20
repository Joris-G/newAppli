export class Kit {
    /**
     * 
     * @param {boolean} validate 
     * @param {number} refSap 
     * @param {string} desArticle 
     * @param {string} workOrder 
     * @param {Date} shelfLifeDate 
     * @param {Date} layUpLimDate 
     * @param {Date} curingLimDate 
     * @param {number} kitId 
     */
    constructor(refSap, desArticle, workOrder, shelfLifeDate, layUpLimDate, curingLimDate, kitId = 0) {
        if (expired(shelfLifeDate) || expired(layUpLimDate) || expired(curingLimDate)) {
            this.validate = false
        } else {
            this.validate = true
        }
        this.refSap = refSap
        this.desArticle = desArticle
        this.workOrder = workOrder
        this.shelfLifeDate = shelfLifeDate
        this.layUpLimDate = layUpLimDate
        this.curingLimDate = curingLimDate
        this.kitId = kitId
    }
    set refSap(ref) { this._refSap = ref }
    get refSap() { return this._refSap }

    set idKit(id) {
        this.kitId = id
    }
    get idKit() {
        return this.kitId
    }
    registerInBase(numOt, numMolding) {
        var xmlhttp = new XMLHttpRequest()
        xmlhttp.open("GET", '../scriptPhp/BDDKitScript.php?of=' + this.workOrder + '&refSap=' + this.refSap + '&designation=' + this.desArticle + '&ot=' + numOt + '&dateDra=' + this.layUpLimDate.toISOString().slice(0, 19).replace('T', ' ') + '&datePol=' + this.curingLimDate.toISOString().slice(0, 19).replace('T', ' ') + '&date18=' + this.shelfLifeDate.toISOString().slice(0, 19).replace('T', ' '), false);
        xmlhttp.onload = () => {
            if (xmlhttp.status >= 200 && xmlhttp.status < 400) {
                this.kitId = xmlhttp.responseText
            }
        }
        xmlhttp.send()
    }
}
function displayKitDate(date) {
    var jour = formatZero(date.getDate())
    var mois = formatZero(date.getMonth() + 1)
    var annee = date.getFullYear()
    var heure = formatZero(date.getHours())
    var minute = formatZero(date.getMinutes())
    var formatDate = jour + '-' + mois + '-' + annee + ' à  ' + heure + ':' + minute
    return formatDate
}
function expired(date) {
    if (date < Date.now()) {
        return true
    } else {
        return false
    }
}
function formatZero(datePart) {
    if (datePart < 10) {
        dateZero = "0" + datePart
    } else {
        dateZero = datePart
    }
    return dateZero
}
function changeName(kit) {
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open("GET", '../scriptPhp/getDesignationWithArticleSap.php?articleSap=' + kit.refSap, false)
    xmlhttp.onload = () => {
        if (xmlhttp.status >= 200 && xmlhttp.status < 400) {
            kit.desArticle = xmlhttp.responseText
        }
    }
    xmlhttp.send()
}