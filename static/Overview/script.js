let curentData = new Date()
let listCurentDate = String(curentData).split(' ')

let date = document.querySelector('.section01').querySelector('span')
let data2 = document.querySelector('.data')

date.textContent = `>> ${listCurentDate[1]} ${listCurentDate[2]}, ${listCurentDate[3]}`
data2.textContent = `${listCurentDate[1]}, ${listCurentDate[3]}` 

let samizne = document.querySelector('#sum')
let sasurveliTanxa = '$1000'
let change = document.querySelector('#change')
change.addEventListener('click', () => {
  
}) 