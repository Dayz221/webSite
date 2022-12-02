function widget_settings_btn(e) {
    settings = e.closest(".widget").querySelector(".widget_settings")
    settings.classList.toggle('disable')

    json.forEach(element => {
        if (element.id == e.closest(".widget").id) {
            let json_widget = element
            let widget_type = json_widget.widget
            let widget = e.closest(".widget")

            if (settings.classList.contains('disable')) {
                xhr_request('POST', '/update_data', true, 'json=' + JSON.stringify(json), null)
            }

            if (widget_type == 'button') {
                widget.querySelector(".option_text").value = json_widget.text
                widget.querySelector(".option_text_on").value = json_widget.text_on
                widget.querySelector(".option_text_off").value = json_widget.text_off
                widget.querySelector(".option_toggle").checked = json_widget.toggle

            } else if (widget_type == 'slider') {
                widget.querySelector(".option_min").value = json_widget.minimum
                widget.querySelector(".option_max").value = json_widget.maximum
                widget.querySelector(".option_visiable").checked = json_widget.visiable

            }

            widget.querySelector(".option__title").value = json_widget.title
            widget.querySelector(".option_virtual").checked = json_widget.virtual
            widget.querySelector(".option_port").value = json_widget.port

            return
        }
    })
}

function option_input(e) {
    let widget = e.closest(".widget")

    json.forEach(element => {
        if (element.id == widget.id) {
            let json_widget = element
            let option_type = e.getAttribute('name')

            if (e.getAttribute('type') == 'checkbox') json_widget[option_type] = e.checked
            else json_widget[option_type] = e.value
            view_widget(widget)

            return
        }
    })
}

function btn_click(e) {
    json.forEach(element => {
        if (element.id == e.closest(".widget").id) {
            let json_widget = element

            if (json_widget.toggle) {
                if (json_widget.toggle) {
                    json_widget.last_value = !json_widget.last_value 
                    if (!used_widgets.includes(json_widget.id)) used_widgets.push(json_widget.id)
                }
                view_widget(e.closest(".widget"))
            }
        }
    })
}

function btn_down(e) {
    json.forEach(element => {
        if (element.id == e.closest(".widget").id) {
            if (!element.toggle) {
                if (element.last_value == false) {
                    element.last_value = true
                    e.classList.add('btn_active')
                    if (!used_widgets.includes(element.id)) used_widgets.push(element.id)
                }
            }
        }
    })
}

function btn_up(e) {
    json.forEach(element => {
        if (element.id == e.closest(".widget").id) {
            if (!element.toggle) {
                if (element.last_value == true) {
                    element.last_value = false
                    e.classList.remove('btn_active')
                    if (!used_widgets.includes(element.id)) used_widgets.push(element.id)
                }
            }
        }
    })
}

function slider_input(e) {
    let widget = e.closest(".widget")
    let output = widget.querySelector(".range_output")

    json.forEach(element => {
        if (element.id == widget.id) {
            let json_widget = element
            output.innerHTML = e.value
            json_widget.last_value = e.value
            if (!used_widgets.includes(json_widget.id)) used_widgets.push(json_widget.id)
        }
    })
}

function view_widget(widget) {
    json.forEach(element => {
        if (element.id == widget.id) {
            let json_widget = element
            let widget_type = json_widget.widget

            if (widget_type == 'button') {
                widget.querySelector(".widget__title").innerHTML = json_widget.title
                if (json_widget.toggle) {
                    if (json_widget.last_value) {
                        widget.querySelector('.widget__inner').classList.add('btn_active')
                        widget.querySelector('.widget__inner').innerHTML = json_widget.text_on
                    } else {
                        widget.querySelector('.widget__inner').classList.remove('btn_active')
                        widget.querySelector('.widget__inner').innerHTML = json_widget.text_off
                    }
                } else {
                    widget.querySelector('.widget__inner').innerHTML = json_widget.text
                }

            } else if (widget_type == 'slider') {
                widget.querySelector('.widget__inner').setAttribute('max', json_widget.maximum)
                widget.querySelector('.widget__inner').setAttribute('min', json_widget.minimum)
                widget.querySelector('.widget__inner').setAttribute('value', json_widget.last_value)
                widget.querySelector('.range_output').innerHTML = json_widget.last_value

                if (json_widget.visiable) {
                    widget.querySelector('.range_output').classList.remove('disable')
                } else {
                    widget.querySelector('.range_output').classList.add('disable')
                }
            }

            widget.querySelector('.widget__title').innerHTML = json_widget.title

            return
        }
    })
}

function add_widget_menu() {
    menu = document.querySelector("#widget_prefabs")
    menu.classList.remove("disable")
}

function add_board_btn() {
    menu = document.querySelector("#add_board_menu")
    menu.classList.remove("disable")
}

// function register_board_btn() {
//     menu = document.querySelector("#register_board_menu")
//     menu.classList.remove("disable")
// }

function exit_prefabs() {
    menu = document.querySelector("#widget_prefabs")
    menu.classList.add("disable")
}

function exit_add_board() {
    menu = document.querySelector("#add_board_menu")
    menu.classList.add("disable")
}

// function exit_register_board() {
//     menu = document.querySelector("#register_board_menu")
//     menu.classList.add("disable")
// }

let isMain = true
let main_page_btn = document.querySelector("#main_page_btn")
let boards_page_btn = document.querySelector("#boards_page_btn")

let main_page = document.querySelector("#main_page")
let boards_page = document.querySelector("#boards_page")

main_page_btn.addEventListener('click', function () {
    if (!isMain) {
        isMain = true
        main_page.classList.remove('disable')
        boards_page.classList.add('disable')

        main_page_btn.classList.add('active')
        boards_page_btn.classList.remove('active')
    }
})

boards_page_btn.addEventListener('click', function () {
    if (isMain) {
        isMain = false
        main_page.classList.add('disable')
        boards_page.classList.remove('disable')

        main_page_btn.classList.remove('active')
        boards_page_btn.classList.add('active')
    }
})