function form_template(login, name, email) {
    const html 
    = '<form action="edit_data" method="POST">' +
        '<p class="error" id="unknown_error"></p>' +
        '<label for="login">Login</label>' +
        '<p class="error" id="login_error"></p>' +
        '<input type="text" name="login" id="login" value="' + login + '" required>' +
        '<label for="fullname">Your Full Name</label>' +
        '<input type="text" name="name" id="fullname" value="' + name + '" required>' +
        '<label for="mail">Email</label>' +
        '<p class="error" id="mail_error"></p>' +
        '<input type="email" name="email" id="mail" value="' + email + '" required>' +
        '<button class="btn" id="change_to_data">Cancel</button>' +
        '<button class="btn" type="submit" id="save_button">Save</button>' +
    '</form>' 

    return html
}

function is_login_invalid(response) {
    return !response.success
           && response.message.includes("for key 'users.login'")
}
function display_login_exists_msg(input_login) {
    document.querySelector('#login_error').textContent 
    = 'Login "' + input_login + '" already exists'
}
function clear_login_exists_msg() {
    document.querySelector('#login_error').textContent = ''
}

function is_email_invalid(response) {
    return !response.success
           && response.message.includes("for key 'users.email'")
}
function display_email_exists_msg(input_email) {
    document.querySelector('#mail_error').textContent 
    = 'Account with such email "' + input_email + '" already exists'
}
function clear_email_exists_msg() {
    document.querySelector('#mail_error').textContent = ''
}

async function form_submit_listener(event) {
    event.preventDefault()

    display_load_icon()

    const data = getFormJSON(document.querySelector('#form_wrapper form'))
    data.avatar = Avatar;
    console.log('Input: ', data)

    const response = await edit_data_request(data)

    console.log("response", response)

    if (response.success) {
        window.location.reload();
        return
    }

    if (is_login_invalid(response)) {
        const input_login = document.querySelector('#login').value
        display_login_exists_msg(input_login)
    }
    else {
        clear_login_exists_msg()
    }

    if (is_email_invalid(response)) {
        const input_email = document.querySelector('#mail').value
        display_email_exists_msg(input_email)
    }
    else {
        clear_email_exists_msg()
    }

    if (!is_login_invalid(response) && !is_email_invalid(response)) {
        document.querySelector('#unknown_error').textContent = response.message
    }

    hide_load_icon()
}


function display_load_icon() {
    document.querySelector('#save_button').innerHTML = "<div class='load_icon'></div>"
}

function hide_load_icon() {
    document.querySelector('#save_button').innerHTML = "Save"
}

function change_to_data(event) {
    event.preventDefault()
    window.location.reload();
}

function change_to_form() {
    const wrapper = document.querySelector('#form_wrapper')
    // user_data.login = wrapper.querySelector('#login').textContent
    // user_data.email = wrapper.querySelector('#email').textContent

    const form_html = form_template(
        wrapper.querySelector('#login').textContent,
        wrapper.querySelector('#fullname').textContent,
        wrapper.querySelector('#email').textContent
    )
    
    wrapper.innerHTML = form_html
    document.querySelector('#form_wrapper form').addEventListener(
        'submit',
        form_submit_listener
    )

    document.querySelector('#change_to_data').addEventListener(
        'click',
        change_to_data
    )
}

function put_data_on_page(user_data) {
    document.querySelector('#login').textContent = user_data.login
    document.querySelector('#fullname').textContent = user_data.name
    document.querySelector('#email').textContent = user_data.email
    document.querySelector('#matches').textContent = user_data.games_qty
    document.querySelector('#victories').textContent = user_data.victories_qty
}

let Avatar;

async function display_user_data() {
    const user_data = await get_user_data_request()

    if (!user_data) {
        window.location.href = '/login';
        return
    }
    console.log(user_data)
    put_data_on_page(user_data.user)
    Avatar = user_data.user.avatar;
}

function logout(event) {
    event.preventDefault()
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    window.location.href = '/login'
}

async function delete_request() {
    const delete_url = url_to_server + "/backend/user"

    let response = await fetch(delete_url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })

    return await response.json();
}

async function delete_account(event) {
    console.log('account deleted')

    const response = await delete_request()
    console.log(response)

    localStorage.removeItem('token')
    localStorage.removeItem('refresh')

    window.location.href = '/signup'
}

display_user_data()

document.querySelector('#change_to_form').addEventListener(
    'click',
    change_to_form
)

document.querySelector('#logout').addEventListener(
    'submit',
    logout
)

document.querySelector('#dialog_overlay').addEventListener(
    'click',
    (event) => {
        event.preventDefault()
    }
)

document.querySelector('#delete_account').addEventListener(
    'click',
    () => {
        document.querySelector('#dialog_wrapper').style.display = 'flex'
    }
)

document.querySelector('#cancel_delete').addEventListener(
    'click',
    () => {
        document.querySelector('#dialog_wrapper').style.display = 'none'
    }
)

document.querySelector('#agree_delete').addEventListener(
    'click',
    delete_account
)