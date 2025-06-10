function login_request(dada) {
    const login_url = url_to_server + "/backend/user"

    return fetch(login_url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dada)
    })
    .then(res => {
        return res.json().then(body => {
            if (res.status !== 200) {
                throw new Error(body.message);
            } else {
                return body;
            }
        })
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh', data.refresh);
    })
    .catch(err => {
        console.error(err);
    })
}

async function sync_login_request(dada) {
    const login_url = url_to_server + "/backend/user"

    let response = await fetch(login_url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dada)
    })

    return await response.json();
}