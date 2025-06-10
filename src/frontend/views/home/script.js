async function refreshToken() {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return;
    return fetch('/backend/user/refresh', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({refresh: refresh})
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refresh', data.refresh);
                return true;
            } else {
                console.error(data);
                return false;
            }
        }).catch(err => {
            console.error(err);
            return false;
        });
}



fetch('/backend/user', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
})
    .then(res => {
        if (res.status !== 200) {
            refreshToken()
                .then(result => {
                    if (result) {
                        return fetch('/backend/user', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                        }).then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    document.getElementById('user_out').textContent = JSON.stringify(data.user, null, 2);
                                }
                            })
                    } else {
                        window.location.href = '/game/signin';
                        return ''
                    }
                });
        }
        res.json().then(body => {
            document.getElementById('user_out').textContent = JSON.stringify(body.user, null, 2);
        })


})
