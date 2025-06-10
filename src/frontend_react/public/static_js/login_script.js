function display_error_msg() {
    document.querySelector('#error').textContent 
    = `Invalid login or password.`
}

document.querySelector('form').addEventListener(
    'submit',
    async (event) => {
        event.preventDefault()

        const dada = getFormJSON(document.querySelector('form'))
        const response = await sync_login_request(dada)

        if (response.success == false) {
            display_error_msg()
            return
        }
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('refresh', response.refresh);
        window.location.href='/'
    }
)