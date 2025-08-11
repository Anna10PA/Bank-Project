let Send = document.querySelector('#send')
Send.textContent = 'Check'
let messageP = document.querySelector('#message')

Send.addEventListener('click', async () => {
    messageP.innerHTML = ''

    if (Send.textContent === 'Check') {
        let accountInput = document.querySelector('#account')
        url = await fetch('/get_all_users')
        all_user = await url.json()
        console.log(all_user)
        let to
    
        let is_found = false
        for (let card of all_user) {
            if (card.cards['card-01'].accaunt_number === accountInput.value) {
                to = card
                is_found = true
                console.log(to)
                break
            }
        }
        if (!is_found) {
            messageP.textContent = 'Not found'
            messageP.style.color = 'red'
            messageP.style.fontSize = '1.2rem'
        } else {
            document.querySelector('#to').innerHTML = to.name
            document.querySelector('#card-number').innerHTML = to.cards['card-01'].number
            Send.textContent = 'Send'
            accountInput.style.border = '1px solid #f00'
            accountInput.style.color = 'black'
            accountInput.disabled = true

        }
    }else {
        transformMoney()
    }
})


// date
let curentData = new Date()
let listCurentDate = String(curentData).split(' ')
let date = document.querySelector('.section01').querySelector('span')
date.textContent = `>> ${listCurentDate[1]} ${listCurentDate[2]}, ${listCurentDate[3]}`


// open/close
let menuBar = document.querySelector('#fa-bars')
let remove = document.querySelector('#fa-xmark')
let aside = document.querySelector('aside')

menuBar.addEventListener('click', () => {
    aside.style.transform = 'translateX(0)'
})

remove.addEventListener('click', () => {
    aside.style.transform = 'translateX(-500px)'
})


// notification
let Alarm = document.querySelector('.fa-bell')
let list = document.querySelector('#list')
let transactionDiv = document.querySelector('#transaction-div')
let is_open_notification = false

async function renderNotifications() {
    try {
        let url = await fetch('/curent_user')
        let info = await url.json()

        let message = info.notification.message

        list.innerHTML = ''

        for (let date in message) {
            let li = document.createElement('li')
            let txt = document.createElement('p')
            let time = document.createElement('span')
            txt.textContent = message[date]

            time.textContent = date

            li.appendChild(txt)
            li.appendChild(time)
            list.appendChild(li)
        }

    } catch (error) {
        console.log(error)
    }
}

Alarm.addEventListener('click', () => {
    is_open_notification = !is_open_notification
    if (is_open_notification) {
        transactionDiv.style.transform = 'translateY(0px)'
        transactionDiv.style.zIndex = '1'
        transactionDiv.style.opacity = '1'

        fetch('/read_notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                { read: true }
            )
        })

        renderNotifications()

    } else {
        transactionDiv.style.transform = 'translateY(-500px)'
        transactionDiv.style.zIndex = '-3'
        transactionDiv.style.opacity = '0'
    }
})

renderNotifications()

// transform money 
async function transformMoney() {
    let moneyValue = document.querySelector('#price')
    messageP.textContent = ''
    let url = await fetch('/curent_user')
    let user = await url.json()

    if (moneyValue.value <= 0 || moneyValue.value > user['cards']['card-01'].money) {
        messageP.textContent = 'Enter normal money'
    } else {
        if (user['cards']['card-01'].code == code.value) {
            await fetch('/transformMoneyToSomeone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    money: moneyValue.value,
                    code: code.value,
                    to_account: document.querySelector('#account').value
                })
            })
            messageP.textContent = 'Success!'
            messageP.style.color = 'green'
        } else {
            messageP.textContent = 'Card Code is not corect'
            messageP.style.color = 'red'
        }
    }
}