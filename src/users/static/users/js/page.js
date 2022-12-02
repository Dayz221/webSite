let login = document.querySelector('#login')
let register = document.querySelector('#register')

let login_btn = document.querySelector('#login_btn')
let register_btn = document.querySelector('#register_btn')

let register_name_error = false
let register_password_error = false

function in_list(list, obj) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] == obj) {
            return true
        }
    }
    return false
}

function on_name_input(e) {
    let name_error = e.closest('.auth_form').querySelector('.name_error')
    
    if (e.value.length < 3 | e.value.length > 30) {
        e.classList.add('error')
        name_error.innerHTML = '* Имя должно содержать от 3 до 30 символов'
        register_name_error = true
    } else {
        name_error.innerHTML = ''
        e.classList.remove('error')
        register_name_error = false
    }
}

function on_password_input(e) {
    let password_error = e.closest('.auth_form').querySelector('.password_error')
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'
    alphabet += alphabet.toUpperCase()
    alphabet += '1234567890'

    for (let i = 0; i < e.value.length; i++) {
        if (!in_list(alphabet, e.value[i]) | e.value.length < 5) {
            e.classList.add('error')
            password_error.innerHTML = '* Пароль может содержать только буквы латинского алфавита, цифры, быть не менее 5 символов'
            register_password_error = true
            break
        } else {
            password_error.innerHTML = ''
            e.classList.remove('error')
            register_password_error = false
        }
    }
}

login_btn.addEventListener('click', function () {
    if (!in_list(this.classList, 'active')) {
        login.classList.remove('disable')
        register.classList.add('disable')
        login_btn.classList.add('active')
        register_btn.classList.remove('active')
    }
})

register_btn.addEventListener('click', function () {
    if (!in_list(this.classList, 'active')) {
        login.classList.add('disable')
        register.classList.remove('disable')
        login_btn.classList.remove('active')
        register_btn.classList.add('active')
    }
})