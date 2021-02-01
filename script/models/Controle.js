export class Controle extends Traca {
    idTracaControle;
    toolNumber = null;

    constructor({ 'idTracaControle': idTracaControle, 'toolNumber': toolId }) {
        this.idTracaControle = idTracaControle;
        this.toolId = toolId;
    }
}

const testCtrl = new Controle({ 'toolNumber': 56, 'idTracaControle': 1 });