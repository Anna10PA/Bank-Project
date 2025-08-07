let Send = document.querySelector('#send')

Send.addEventListener('click', async () => {
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
        alert('Not found this accaunt')
    }else {
        alert('found')
        document.querySelector('#to').innerHTML = to.name
        document.querySelector('#card-number').innerHTML = to.cards['card-01'].number

    }
})