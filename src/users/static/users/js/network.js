function xhr_request(method, target, async, data, function_) {
    xhr = new XMLHttpRequest()
    xhr.open(method, target, async)
    xhr.onreadystatechange = function_
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(data)
}


login_form_btn = document.querySelector('#login_form').querySelector('.form__button')
register_form_btn = document.querySelector('#register_form').querySelector('.form__button')

login_form_btn.addEventListener('click', function() {
    let username = this.closest('.auth_form').querySelector('.user_name_input')
    let password = this.closest('.auth_form').querySelector('.user_password_input')
    let response = this.closest('.auth_form').querySelector('.serv_response')
    
    let data_ = 'username=' + username.value + '&password=' + password.value
    xhr_request('POST', '/auth/login', false, data_, function() {
        if (xhr.readyState == 4) {
            if (xhr.responseText == 'login or password is incorrect') {
                response.classList.remove('disable')
                response.innerHTML = 'Логин или пароль неверны'
            } else {
                window.location.href = '/'
            }
        }
    })
})

register_form_btn.addEventListener('click', function() {
    let username = this.closest('.auth_form').querySelector('.user_name_input')
    let password = this.closest('.auth_form').querySelector('.user_password_input')
    
    let data_ = 'username=' + username.value + '&password=' + password.value
    on_name_input(username)
    on_password_input(password)
    if (!(register_name_error | register_password_error)) {
        xhr_request('POST', '/auth/register', false, data_, function() {
            if (xhr.readyState == 4) {
                if (xhr.responseText == 'this name is already registered') {
                    username.closest('.auth_form').querySelector('.name_error').innerHTML = '* Это имя уже занято'
                    username.classList.add('error')
                } else {
                    window.location.href = '/'
                }
            }
        })   
    }
})