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