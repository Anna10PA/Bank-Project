let curentData = new Date()
let listCurentDate = String(curentData).split(' ')

let date = document.querySelector('.section01').querySelector('span')
let data2 = document.querySelector('.data')

date.textContent = `>> ${listCurentDate[1]} ${listCurentDate[2]}, ${listCurentDate[3]}`
data2.textContent = `${listCurentDate[1]}, ${listCurentDate[3]}`

let samizne = document.querySelector('#sum')
let sasurveliTanxa = '$1000'
let change = document.querySelector('#change')
let div = document.querySelector('.editCard')
let cross = document.querySelector('.fa-xmark')
let save = div.querySelector('button')
let isari = document.querySelector('.isari')
let target = document.querySelectorAll('.target')
let curentM = document.querySelectorAll('.curent')

change.addEventListener('click', () => {
    div.style.zIndex = '2'
    div.style.opacity = '1'
})

cross.addEventListener('click', () => {
    div.style.zIndex = '-2'
    div.style.opacity = '0'
})

save.addEventListener('click', () => {
    let targetMoney = Number(div.querySelector('input').value)
    let curentMoney = Number(div.querySelectorAll('input')[1].value)

    console.log(targetMoney / curentMoney)
    if (targetMoney > curentMoney) {
        isari.style.transform = `rotate(${-90 + (180 * ((Number(curentMoney) / Number(targetMoney)) * 100) / 100)}deg)`
        div.style.zIndex = '-2'
        div.style.opacity = '0'

        for (let i of target) {
            i.textContent = targetMoney
        }

        for (let i of curentM) {
            i.textContent = curentMoney
        }

        for (let i of document.querySelectorAll('.type01')) {
            let count = 0
            while (i.textContent.length > 3) {
                count++
                i.textContent = i.textContent.slice(0, i.textContent.length - 3 )
            }
            let moneyType = {
                1: 'K',
                2: 'M',
                3: 'B',
                4: 'T'
            }

            i.textContent = `${Number(i.textContent.slice(i.textContent.length - count * 3))}${moneyType[count]}`
        }
    }
})