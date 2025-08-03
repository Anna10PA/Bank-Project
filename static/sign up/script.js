let form = document.querySelector('form')
// let submit = form.querySelector('button')
let message = form.querySelector('span')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (form.name.value.trim() === '' || form.email.value.trim() === '' || form.password.value.trim() === '') {
        message.style.color = 'red'
        message.textContent = 'All inputs must be filled in !'
    } else {
        let isGood = false

        for (let element of '0123456789.!_-') {
            if (form.password.value.includes(element)) {
                isGood = true
                break
            }
        }
        if (form.password.value.length < 8 || !isGood) {
            message.style.color = 'red'
            message.textContent = 'Must be more then 8 symbol and has 0123456789.!_-'
        }else {
            form.submit()
        }
    }
})

// let sign_in = document.querySelector('.sign_in')
// sign_in.addEventListener('click', ()=> {
//     window.location.href = '../templates/sign_up.html'
// })