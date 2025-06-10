// is login unique block
function is_login_invalid(response) {
    return !response.success
           && response.message.includes("for key 'users.login'")
}
function display_login_exists_msg(input_login) {
    document.querySelector('#login_error').textContent 
    = `Login "${input_login}" already exists`
}
function clear_login_exists_msg() {
    document.querySelector('#login_error').textContent = ''
}

// is email unique block
function is_email_invalid(response) {
    return !response.success
           && response.message.includes("for key 'users.email'")
}
function display_email_exists_msg(input_email) {
    document.querySelector('#mail_error').textContent 
    = `Account with such email "${input_email}" already exists`
}
function clear_email_exists_msg() {
    document.querySelector('#mail_error').textContent = ''
}

// does passwords match block
function passwords_match() {
    const password = document.querySelector('#pass').value
    const confirm_password = document.querySelector('#confirm').value

    return password === confirm_password
}
function display_passwords_not_match_msg() {
    document.querySelector('#confirm_error').textContent 
    = 'Passwords do not match'
}
function clear_passwords_not_match_msg() {
    document.querySelector('#confirm_error').textContent = ''
}

// is password save block
function is_password_save() {
    const password = document.querySelector('#pass').value
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password)
}
function display_not_secure_password_msg() {
    document.querySelector('#password_error').textContent 
    = 'The password must contain at least one letter, one digit, and must be between eight and sixteen characters in length.'
}
function clear_not_secure_password_msg() {
    document.querySelector('#password_error').textContent = ''
}

async function registration_request() {
    const registration_url = url_to_server + "/backend/user"

    const data = getFormJSON(document.querySelector('form'))
    delete data['confirm']

    let response = await fetch(registration_url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        method: 'PUT',
    }).catch((e) => {});

    return await response.json();
}

function set_avatar_request() {
    const fileInput = document.querySelector('.avatar_input input')

    const myHeaders = new Headers();
    myHeaders.append("Authorization", 'Bearer ' + localStorage.getItem('token'));

    const formdata = new FormData();
    formdata.append("file", fileInput.files[0]);

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
    };

    return fetch(url_to_server + "/backend/user/upload", requestOptions)
}


document.querySelector('form').addEventListener(
    'submit',
    async (event) => {
        event.preventDefault()

        if (!is_password_save()) {
            display_not_secure_password_msg()
            return
        }
        else {
            clear_not_secure_password_msg()
        }
        
        if (!passwords_match()) {
            display_passwords_not_match_msg()
            return
        }
        else {
            clear_passwords_not_match_msg()
        }

        const response = await registration_request()

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

        if (response.success) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('refresh', response.refresh);
            await set_avatar_request()
            window.location.href='/'
        }
    }
)




function loadGroupAvatarPreview(event) {
    const avatar_input_container = event.currentTarget.closest('.avatar_input')
    let preview_element = avatar_input_container.querySelector(
        'img.group_avatar_input_preview'
    )
    const file = event.target.files[0]
    const maxSize = 2 * 1024 * 1024; // Maximum file size: 2MB
    if (file.size > maxSize) {
        return
    }
    if (file) {
        preview_element.src = URL.createObjectURL(file);
        preview_element.style.display = 'block'
    }
    else {
        preview_element.src = ''
        preview_element.style.display = 'none'
    }
}

document.querySelector('.avatar_input input').addEventListener(
    "change",
    loadGroupAvatarPreview
);