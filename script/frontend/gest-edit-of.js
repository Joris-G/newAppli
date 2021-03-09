let datas;

function uploadDealcsv() {};

/*------ Method for read uploded csv file ------*/
uploadDealcsv.prototype.getCsv = function(e) {
    let input = document.getElementById('csv-article-of');
    input.addEventListener('change', function() {

        if (this.files && this.files[0]) {

            var myFile = this.files[0];
            var reader = new FileReader();

            reader.addEventListener('load', function(e) {
                let csvdata = e.target.result;
                datas = parseCsv.getParsecsvdata(csvdata); // calling function for parse csv data 
            });
            reader.readAsBinaryString(myFile);
        }
    });
}

/*------- Method for parse csv data and display --------------*/
uploadDealcsv.prototype.getParsecsvdata = function(data) {

    let parsedata = [];

    let newLinebrk = data.split("\n");
    for (let i = 0; i < newLinebrk.length; i++) {
        parsedata.push(newLinebrk[i].split(";"))
    }
    console.table(parsedata);
    return parsedata;
}



var parseCsv = new uploadDealcsv();
parseCsv.getCsv();

const btnPrint = document.getElementById('btn-print');
btnPrint.addEventListener('click', () => {
    console.log(datas);
    const template = window.open('../public/Templates/composite-stickers-template.html');
    template.onload = () => {
        const printArea = template.document.getElementById('print-area');
        datas.forEach((data, index) => {
            const divStickerPan = document.createElement('div');
            if (!!index) {
                for (let index = 0; index < data[2]; index++) {
                    const divStickers = document.createElement('div');
                    divStickers.classList.add('sticker');
                    const divTextData = document.createElement('div');
                    const divQrCode = document.createElement('div');

                    const divArticle = document.createElement('div');
                    const article = data[0];
                    divArticle.innerText = `Article: ${article}`;
                    const divWorkorder = document.createElement('div');
                    const workorder = data[1];
                    divWorkorder.innerText = `OF: ${workorder}`;

                    divTextData.append(divArticle, divWorkorder);
                    if (data[3].length > 1) {
                        const divEbauche = document.createElement('div');
                        divEbauche.innerText = `Eb : ${data[3]}`;
                        divTextData.appendChild(divEbauche);
                    }
                    new QRCode(divQrCode, { text: `OF ${data[0]},${data[1]}`, width: 75, height: 75 });
                    divStickers.append(divQrCode, divTextData);
                    divStickerPan.appendChild(divStickers);

                }
                printArea.appendChild(divStickerPan);
            }
        });
    }

});