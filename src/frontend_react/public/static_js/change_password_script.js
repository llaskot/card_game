async function check_user_data() {
    const user_data = await get_user_data_request()

    if (!user_data) {
        window.location.href = '/login';
        return
    }
}

check_user_data()

async function make_request() {
    const data = getFormJSON(document.querySelector('form'))
    delete data['confirm']

    const raw = JSON.stringify(data)

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + localStorage.getItem('token'));

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

    let response = await fetch(url_to_server + "/backend/user/password_change", requestOptions)

    return await response.json();
}

async function form_submited_event(event) {
    event.preventDefault()

    const old_password = document.querySelector('#old_password').value
    const new_password = document.querySelector('#pass').value
    const confirm = document.querySelector('#confirm').value

    if (old_password === new_password) {
        document.querySelector('#password_error').textContent 
        = 'New password is same as old.'
        return
    }
    else if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(new_password))){
        document.querySelector('#password_error').textContent 
        = 'The password must contain at least one letter, one digit, and must be between eight and sixteen characters in length.'
        return
    }
    else {
        document.querySelector('#password_error').textContent = ''
    }

    if (new_password !== confirm) {
        document.querySelector('#confirm_error').textContent 
        = 'Passwords do not match.'
        return
    }
    else {
        document.querySelector('#confirm_error').textContent = ''
    }

    const response = await make_request()
    console.log(response)

    if (!response.success) {
        if (response.message === 'Incorrect login or password') {
            response.message = 'Incorrect password'
        }
        document.querySelector('#old_password_error').textContent = response.message
    }
    else {
        window.location.href = '/settings'
    }


}

document.querySelector('form').addEventListener(
    'submit',
    form_submited_event
)

document.querySelector('.back_to_settings').addEventListener(
    'click',
    (event) => {
        event.preventDefault()
        window.location.href = '/settings'
    }
)