// date
let curentData = new Date()
let listCurentDate = String(curentData).split(' ')
let date = document.querySelector('.section01').querySelector('span')
date.textContent = `>> ${listCurentDate[1]} ${listCurentDate[2]}, ${listCurentDate[3]}`
let choosen = JSON.parse(localStorage.getItem('number'))

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
        console.error(error)
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
            body: JSON.stringify({ read: true })
        })

        renderNotifications()

    } else {
        transactionDiv.style.transform = 'translateY(-500px)'
        transactionDiv.style.zIndex = '-3'
        transactionDiv.style.opacity = '0'
    }
})

renderNotifications()

// render card info
let bankInfo = document.querySelectorAll('.info')
async function renderCardInfo() {
    try {
        let url = await fetch('/curent_user')
        let curent_user = await url.json()
        for (let key in curent_user.cards) {
            if (curent_user.cards[key].number === choosen) {
                bankInfo[0].querySelector('p').textContent = curent_user.cards[key].bank_name
                bankInfo[1].querySelector('p').textContent = curent_user.cards[key].account_type
                bankInfo[2].querySelector('p').textContent = `$${curent_user.cards[key].money}`
                bankInfo[3].querySelector('p').textContent = 'TBILISI'
                bankInfo[4].querySelector('p').textContent = choosen
                bankInfo[5].querySelector('p').textContent = curent_user.cards[key].accaunt_number
                bankInfo[6].querySelector('p').textContent = curent_user.cards[key].code
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}

renderCardInfo()

// story
let story = document.querySelector('.story')
async function renderStory() {
    let url = await fetch('/curent_user')
    let curent_user = await url.json()

    if (curent_user.cards['card-01'].transaction.all.length !== 0) {
        for (let item in curent_user.cards['card-01'].transaction.all) {
            let li = document.createElement('li')

            let div_date = document.createElement('div')
            let div_status = document.createElement('div')
            let div_money = document.createElement('div')

            div_date.textContent = curent_user.cards['card-01'].transaction.all[item]['date']
            div_status.textContent = curent_user.cards['card-01'].transaction.all[item]['status'] === true ? 'Completed' : 'Rejected'
            div_money.textContent = `$${curent_user.cards['card-01'].transaction.all[item]['money']}`

            li.appendChild(div_date)
            li.appendChild(div_status)
            li.appendChild(div_money)

            story.appendChild(li)
            console.log(li)
        }
    }
}
renderStory()

// edit card code
let editBtn = document.querySelector('.edit')
let is_open = false
let code = document.querySelector('#code')
let errorMessage = document.querySelector('#message')

editBtn.addEventListener('click', () => {
    let isGood = true
    let oldValue = code.textContent
    errorMessage.textContent = ''
    code.style.border = 'none'

    if (!is_open) {
        is_open = true
        code.setAttribute('contenteditable', true)
        code.focus()
        code.style.padding = '5px 10px'
        editBtn.textContent = 'Change'
    } else {
        let value = code.textContent.trim()
        let isOnlyNumbers = true

        for (let i of value) {
            if (!'0123456789'.includes(i)) {
                isOnlyNumbers = false
                break
            }
        }

        if (!isOnlyNumbers) {
            errorMessage.textContent = 'Must be number'
            code.style.border = '1px solid red'
            isGood = false
        }

        if (value.length !== 4 && value.length > 0) {
            errorMessage.textContent = 'Length must be 4 symbols'
            code.style.border = '1px solid red'
            isGood = false
        }

        if (value.length === 0) {
            errorMessage.textContent = 'Code cannot be empty'
            isGood = false
        }

        if (isGood) {
            is_open = false
            code.setAttribute('contenteditable', false)
            code.style.padding = '0'
            code.style.border = 'none'
            editBtn.textContent = 'Edit Details'

            async function changeCardCode() {
                try {
                    let user = await fetch('/cardCodeUpdate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(
                            {
                                number: choosen,
                                code: code.textContent
                            }
                        )
                    })
                    if (!user.ok) {
                        return 'error'
                    }else {
                        renderCardInfo()
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            changeCardCode()
        }
    }
})
