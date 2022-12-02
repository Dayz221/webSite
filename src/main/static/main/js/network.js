function xhr_request(method, target, async, data, function_) {
    xhr = new XMLHttpRequest()
    xhr.open(method, target, async)
    xhr.onreadystatechange = function_
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(data)
}

function add_widget(e) {
    e.closest("#widget_prefabs").classList.add('disable')
    widgets_container = document.querySelector("#widgets")
    widgets_container.innerHTML += e.innerHTML
    element = widgets_container.lastElementChild
    element.querySelector(".widget__settings_btn").classList.remove("disable")
    element.setAttribute('id', 'w' + max_id)
    json_widget = get_json_widget(e.firstElementChild.classList[1], max_id)
    json_widget.id = 'w' + max_id

    json.push(json_widget)
    console.log(json)

    view_widget(element)
    xhr_request('POST', '/update_data', true, 'json=' + JSON.stringify(json), null)
    max_id += 1
}

function get_json_widget(widget_name, id) {
    switch (widget_name) {
        case "button":
            return {
                id: id,
                widget: "button",
                title: "Кнопка",
                text: "Кнопка",
                text_on: "On",
                text_off: "Off",
                toggle: true,
                virtual: false,
                port: "0",
                last_value: false
            }

        case "slider":
            return {
                id: id,
                widget: "slider",
                title: "Ползунок",
                maximum: 100,
                minimum: 0,
                visiable: false,
                virtual: false,
                port: "0",
                last_value: "0"
            }

        case "output":
            return {
                id: id,
                widget: "output",
                title: "Вывод",
                virtual: false,
                port: "0",
                last_value: "Вывод"
            }
    }
}

function render_widgets() {
    max_id = 0

    json.forEach(json_widget => {
        if (json_widget.id.slice(1) > max_id) {
            max_id = json_widget.id.slice(1)
        }
    })

    let prefabs = document.querySelector("#widget_prefabs")
    let widgets = document.querySelector("#widgets")
    widgets.innerHTML = ""

    let button = prefabs.querySelector(".button_prefab").innerHTML
    let slider = prefabs.querySelector(".slider_prefab").innerHTML
    let output = prefabs.querySelector(".output_prefab").innerHTML

    json.forEach(json_widget => {
        let widget = json_widget.widget

        switch (widget) {
            case "button":
                widgets.innerHTML += button
                break

            case "slider":
                widgets.innerHTML += slider
                break

            case "output":
                widgets.innerHTML += output
                break
        }

        let element = widgets.lastElementChild

        element.setAttribute('id', json_widget.id)
        element.querySelector(".widget__settings_btn").classList.remove("disable")
        view_widget(element)

        max_id++
    })
}

function delete_widget(e) {
    for (let i = 0; i < json.length; i++) {
        if (json[i].id == e.closest(".widget").id) {
            json.splice(i, 1)
            xhr_request('POST', '/update_data', true, 'json=' + JSON.stringify(json), null)
            render_widgets()
        }
    }
}

function new_task(id, board_id, value) {
    return {
        widget_id: id,
        board_id, board_id,
        value: value,
    }
}

function logout() {
    xhr_request('POST', 'auth/logout', false, null, null)
    window.location.href = '/'
}

function add_board() {
    let menu = document.querySelector('#add_board_menu')
    let board_id = menu.querySelector('#board_id').value
    let board_password = menu.querySelector('#board_password').value
    let response = menu.querySelector('.serv_response')
    xhr_request('POST', '/add_board', false, 'board_id=' + board_id + '&board_password=' + board_password, function () {
        if (xhr.readyState == 4) {
            if (xhr.responseText == 'board id or password is incorrect') {
                response.classList.remove('disable')
                response.innerHTML = 'Пароль или id платы введены неверно'
            } else {
                board_id = ''
                board_password = ''
                response.classList.add('disable')
                exit_add_board()
                renderBoards()
            }
        }
    })
}

function delete_board(e) {
    let board = e.closest('.board')
    let board_id = board.getAttribute('id')
    xhr_request('POST', '/delete_board', false, 'board_id=' + board_id, null)
    renderBoards()
}

function set_cur_board(e) {
    let board = e
    let board_id = board.getAttribute('id')
    let boards = document.querySelectorAll('.board')
    xhr_request('POST', '/set_cur_board', false, 'board_id=' + board_id, null)
    boards.forEach(board_ => {
        board_.classList.remove('cur_board')
    })
    board.classList.add('cur_board')
}

// function register_board() {
//     exit_register_board()
//     let menu = document.querySelector('#register_board_menu')
//     let board_name = menu.querySelector('#board_name').value
//     let board_id = menu.querySelector('#board_id').value
//     let board_password = menu.querySelector('#board_password').value
//     console.log(board_id)
//     console.log(board_name)
//     console.log(board_password)
//     xhr_request('POST', '/register_board', false, 'board_name=' + board_name + '&board_id=' + board_id + '&board_password=' + board_password, null)
//     renderBoards()
// }

let json = {}
let boards = {}
let max_id = 0
let used_widgets = []


xhr_request('GET', '/get_widgets', false, null, () => {
    if (xhr.readyState == 4) {
        json = JSON.parse(xhr.responseText)
        render_widgets()
    }
})

function renderBoards() {
    xhr_request('GET', '/get_boards', false, null, () => {
        if (xhr.readyState == 4) {
            boards = JSON.parse(xhr.responseText)
        }
    })

    let boards_menu = document.querySelector('#boards')
    let board_prefab = document.querySelector(".board__prefab")
    boards_menu.innerHTML = ""

    boards.forEach(board => {
        boards_menu.innerHTML += board_prefab.innerHTML
        let cur_board = boards_menu.lastElementChild
        cur_board.querySelector(".board__name").innerHTML = board.board_name
        cur_board.querySelector(".board__id").innerHTML = board.board_id
        cur_board.setAttribute('id', board.board_id)
        if (board.isCurrent) {
            cur_board.classList.add('cur_board')
        }
    })
}
renderBoards()

setInterval(function () {
    let tasks = {}
    let used_ports = []
    let used_virtual_ports = []

    used_widgets.forEach(id => {
        json.forEach (element => {
            if (element.id == id) {
                let id = element.id
                let lv = element.last_value
                if ((!element.virtual) && (!used_ports.includes(element.port))) tasks[id] = lv; used_ports.push(element.port)
                if ((element.virtual) && (!used_virtual_ports.includes(element.port))) tasks[id] = lv; used_virtual_ports.push(element.port)
            }
        })
    })

    used_widgets = []
    if (Object.keys(tasks).length != 0) xhr_request('POST', '/send_tasks', true, 'tasks=' + JSON.stringify(tasks), null)
}, 100)