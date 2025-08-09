// date
let curentData = new Date()
let listCurentDate = String(curentData).split(' ')

let date = document.querySelector('.section01').querySelector('span')

date.textContent = `>> ${listCurentDate[1]} ${listCurentDate[2]}, ${listCurentDate[3]}`


// open/close

let menuBar = document.querySelector('#fa-bars')
let remove = document.querySelector('#fa-xmark')
let aside = document.querySelector('aside')

menuBar.addEventListener('click', ()=> {
    aside.style.transform = 'translateX(0)'
})

remove.addEventListener('click', ()=> {
    aside.style.transform = 'translateX(-500px)'
})