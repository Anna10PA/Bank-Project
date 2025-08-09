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
let cross02 = document.querySelector('#second')
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
let list = document.querySelector('#list')
let alarm = document.querySelector('.alarm')
let transactionDiv = document.querySelector('#transaction-div')
let transactionStoryDiv = document.querySelector('.transaction-story')


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


let is_open = false
cardInfo.addEventListener('click', () => {
    is_open = !is_open
    if (is_open) {
        div02.style.opacity = '1'
        div02.style.zIndex = '3'
    }
})

cross02.addEventListener('click', () => {
    is_open = !is_open
    if (!is_open) {
        div02.style.opacity = '0'
        div02.style.zIndex = '-3'
    }
})

save.addEventListener('click', async () => {
    let targetMoney = Number(div.querySelector('input').value);
    let curentMoney = Number(div.querySelectorAll('input')[1].value);

    if (!targetMoney || !curentMoney || targetMoney <= curentMoney) {
        alert('Not correct info');
        div.style.zIndex = '-2';
        div.style.opacity = '0';
        return;
    }

    try {
        const response = await fetch('/update_goal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target: targetMoney, curent: curentMoney })
        });

        if (!response.ok) {
            alert('Failed to update goal on server.');
            return;
        }

        const data = await response.json();
        console.log('Update response data:', data);

        // განახლე UI მხოლოდ წარმატებული შენახვის შემდეგ
        for (let i of target) i.textContent = targetMoney;
        for (let i of curentM) i.textContent = curentMoney;

        function formatMoney(amount) {
            const units = ['', 'K', 'M', 'B', 'T'];
            let unitIndex = 0;
            while (amount >= 1000 && unitIndex < units.length - 1) {
                amount /= 1000
                unitIndex++
            }
            return `${Math.floor(amount)}${units[unitIndex]}`
        }

        document.querySelectorAll('.type01')[0].textContent = formatMoney(curentMoney)
        document.querySelectorAll('.type01')[1].textContent = formatMoney(targetMoney)

        div.style.opacity = '0'
        div.style.zIndex = '-2'

    } catch (error) {
        alert('Error')
        console.error(error)
    }
    window.location.reload()
})

async function getGoal() {
    try {
        let url = await fetch('/get_goal')
        let info = await url.json()
        console.log(info)

        let targetMoney = info.target
        let curentMoney = info.curent

        let percentage = (curentMoney / targetMoney) * 100
        isari.style.transform = `rotate(${(percentage * 1.8) - 90}deg)`

        // 
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

        percentage = (curentMoney / targetMoney) * 100
        isari.style.transform = `rotate(${(percentage * 1.8) - 90}deg)`

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
    } catch (error) {
        console.error('Failed to load goal data', error)
    }


}

getGoal()


// render notification
async function renderNotifications() {
    try {
        let url = await fetch('/curent_user')
        let info = await url.json()

        let message = info.notification.message
        let isRead = info.notification.read


        for (let date in message) {
            let li = document.createElement('li')
            let txt = document.createElement('p')
            let time = document.createElement('span')

            txt.textContent = message[date]
            time.textContent = date

            li.appendChild(txt)
            li.appendChild(time)
            list.appendChild(li)

            // notification open
            let is_open_notification = false
            alarm.addEventListener('click', () => {
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
                        body: JSON.stringify({
                            read: true
                        })
                    })
                } else {
                    transactionDiv.style.transform = 'translateY(-500px)'
                    transactionDiv.style.zIndex = '-3'
                    transactionDiv.style.opacity = '0'
                    window.location.reload()
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}
renderNotifications()

// 
async function renderTransactions(Type) {
    try {
        const url = await fetch('/curent_user')
        const user = await url.json()
        const userImg = user.profile
        const transactions = user.transactions[Type.toLowerCase()]

        transactionStoryDiv.innerHTML = ''

        if (!transactions || Object.keys(transactions).length === 0) {
            transactionStoryDiv.innerHTML = '<li>No transactions available.</li>'
        }

        for (let sender in transactions) {
            let tx = transactions[sender]

            let li = document.createElement('li')
            let div = document.createElement('div')
            let div02 = document.createElement('div')
            let div03 = document.createElement('div')

            let senderName = document.createElement('p')
            senderName.textContent = sender

            let tx_reason = document.createElement('span')
            tx_reason.textContent = tx.reason

            let money = document.createElement('p')
            money.textContent = `$${tx.send_money}`
            money.classList = 'money_div'

            let date = document.createElement('span')
            date.textContent = tx.date

            let img = document.createElement('img')
            img.src = userImg
            
            div.appendChild(senderName)
            div.appendChild(tx_reason)
            div.className = 'just-div'
            
            div03.appendChild(img)
            div03.appendChild(div)
            div03.className = 'profile-img-txt'

            div02.appendChild(money)
            div02.appendChild(date)

            div02.className = 'money-div'
            div.className = 'just-div'

            li.appendChild(div03)
            li.appendChild(div02)

            transactionStoryDiv.appendChild(li)
        }

    } catch (error) {
        console.error('Error loading transaction story:', error)
        transactionStoryDiv.innerHTML = '<li>Error loading transactions</li>'
    }
}
let navItems = document.querySelectorAll('.navigation li')

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('curent_page'))
        item.classList.add('curent_page')

        let type = item.id.toLowerCase()
        renderTransactions(type)
    })
})

renderTransactions('All')


let menuBar = document.querySelector('#fa-bars')
let remove = document.querySelector('#fa-xmark')
let aside = document.querySelector('aside')

menuBar.addEventListener('click', ()=> {
    aside.style.transform = 'translateX(0)'
})

remove.addEventListener('click', ()=> {
    aside.style.transform = 'translateX(-500px)'
})