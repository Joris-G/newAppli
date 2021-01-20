import { Div, Cellule, SelectItem } from "./toolBox.js"

export const tracaTable = document.createElement('table')
export const divTracaTable = document.createElement('div')
divTracaTable.classList.add('displayNone')



async function makeRequest(method, url, _responseType) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = _responseType
    return new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 300) {
                    reject("Error, status code = " + xhr.status)
                } else {
                    resolve(xhr.response);
                }
            }
        }
        xhr.open(method, url, true)
        xhr.send();
    });
}
async function doAjaxThings(url, responseType) {
    try {
        let user = await makeRequest('GET', url, responseType)
    } catch (err) {
        console.log(err)
    }
}

// let listOfImpactedItem = []
// for (let index = Math.min(draggingRowIndex, endRowIndex); index <= Math.max(draggingRowIndex, endRowIndex); index++) {
//     listOfImpactedItem.push(Traca.JsonDataAllTraca[index - 1]);
// }
// console.log(listOfImpactedItem)
// listOfImpactedItem.forEach((element, index) => {
//     let newId
//     switch (draggingRowIndex < endRowIndex) {
//         case true:
//             if (index === 0) {
//                 newId = endRowIndex
//             } else {
//                 newId = parseInt(element.ID_FAC) - 1
//             }
//             break;
//         case false:
//             console.log('je remonte')
//             if (index === listOfImpactedItem.length - 1) {
//                 newId = endRowIndex
//             } else {
//                 newId = parseInt(element.ID_FAC) + 1
//             }
//             break;
//         default:
//             break;
//     }
//     const xmlhttp = new XMLHttpRequest()
//     xmlhttp.open('GET', `../script/php/updateTraca.php?article=${element.ARTICLE}&id=${element.ID}&newIdFac=${newId}`, true)
//     xmlhttp.onreadystatechange = function () {
//         if (this.readyState == 4) {
//             const btn = document.getElementById('btnUpdateArticle')
//             btn.click()
//         }
//     }
//     xmlhttp.send()
// })