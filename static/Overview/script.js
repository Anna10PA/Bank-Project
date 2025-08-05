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
let userProfile = document.querySelector('#profile')
let card_number = document.querySelector('#card_number')
let card = document.querySelector('.card')
let mon = document.querySelectorAll('.type01')
let cardInfo = document.querySelector('#arrow')
let div02 = document.querySelector('#div02')

change.addEventListener('click', () => {
    div.style.zIndex = '2'
    div.style.opacity = '1'
})

cross.addEventListener('click', () => {
    div.style.zIndex = '-2'
    div.style.opacity = '0'
})

let is_show = true
let num = card_number.textContent


let numberView = () => {
    is_show = !is_show
    if (!is_show) {
        card_number.textContent = `**** **** **** ${card_number.textContent.slice(card_number.textContent.length - 4)}`
    } else {
        card_number.textContent = num
    }
}
numberView()
card.addEventListener('click', numberView)


save.addEventListener('click', async () => {
    let targetMoney = Number(div.querySelector('input').value)
    let curentMoney = Number(div.querySelectorAll('input')[1].value)

    div.style.zIndex = '2'
    div.style.opacity = '1'
    if (!targetMoney || !curentMoney || targetMoney <= curentMoney) {
        alert('Not correct info')
        div.style.zIndex = '-2'
        div.style.opacity = '0'
    } else {

        for (let i of target) {
            i.textContent = targetMoney
        }

        for (let i of curentM) {
            i.textContent = curentMoney
        }

        let count = 0
        let str = String(curentMoney)
        let formatted = str

        let count1 = 0
        let str1 = String(curentMoney)
        let formatted01 = str1

        while (formatted.length > 3) {
            formatted = formatted.slice(0, -3)
            count++
        }
        while (formatted01.length > 3) {
            formatted01 = formatted01.slice(0, -3)
            count1++
        }

        fetch('/update_goal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                target: targetMoney,
                curent: curentMoney
            })
        })
        
        function formatMoney(amount) {
            const units = ['', 'K', 'M', 'B', 'T']
            let unitIndex = 0

            while (amount >= 1000 && unitIndex < units.length - 1) {
                amount = amount / 1000
                unitIndex++
            }

            return `${Math.floor(amount)}${units[unitIndex]}`
        }

        document.querySelectorAll('.type01')[0].textContent = formatMoney(curentMoney)
        document.querySelectorAll('.type01')[1].textContent = formatMoney(targetMoney)


        div.style.opacity = '0'
        div.style.zIndex = '-2'
        window.location.reload()
    }

})



async function getGoal() {
    try {
        let url = await fetch('/get_goal')
        let info = await url.json()
        console.log(info)

        let targetMoney = info.target   
        let curentMoney = info.curent

        // მიზნის და მიმდინარე თანხის პირდაპირი ჩასმა
        for (let i of document.querySelectorAll('.target')) {
            i.textContent = targetMoney
        }
        for (let i of document.querySelectorAll('.curent')) {
            i.textContent = curentMoney
        }
        
        
        function formatMoney(amount) {
            const units = ['', 'K', 'M', 'B', 'T']
            let unitIndex = 0
            
            while (amount >= 1000 && unitIndex < units.length - 1) {
                amount = amount / 1000
                unitIndex++
            }
            
            return `${Math.floor(amount)}${units[unitIndex]}`
        }
        
        document.querySelectorAll('.type01')[0].textContent = formatMoney(curentMoney)
        document.querySelectorAll('.type01')[1].textContent = formatMoney(targetMoney)

        let percentage = Math.min((curentMoney / targetMoney) * 100, 100)
        isari.style.transform = `rotate(${(percentage * 1.8) - 90}deg)`
        
        
        
    } catch (error) {
        console.error('Failed to load goal data', error)
    }
    
}

getGoal()


cardInfo.addEventListener('click', ()=> {

})