

async function refreshToken() {
    const refresh_token_url = url_to_server + "/backend/user/refresh"
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return;
    return fetch(refresh_token_url, {
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



async function get_user_data_request(use_refresh=true) {
    const get_user_data_url = url_to_server + "/backend/user"

    let response = await fetch(get_user_data_url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    })

    if (response.status !== 200) {
        if (!use_refresh) {
            return null
        }
        const refreshment_is_success = await refreshToken()

        if (!refreshment_is_success) {
            return null
        }

        return await get_user_data_request(false)
    }
    else {
        return await response.json()
    }
}

// fetch(get_user_data_url, {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + localStorage.getItem('token')
//     },
// })
//     .then(res => {
//         if (res.status !== 200) {
//             refreshToken()
//                 .then(result => {
//                     if (result) {
//                         return fetch(get_user_data_url, {
//                             method: 'GET',
//                             headers: {
//                                 'Content-Type': 'application/json',
//                                 'Authorization': 'Bearer ' + localStorage.getItem('token')
//                             },
//                         }).then(res => res.json())
//                             .then(data => {
//                                 if (data.success) {
//                                     document.getElementById('user_out').textContent = JSON.stringify(data.user, null, 2);
//                                 }
//                             })
//                     } else {
//                         window.location.href = '/game/signin';
//                         return ''
//                     }
//                 });
//         }
//         res.json().then(body => {
//             document.getElementById('user_out').textContent = JSON.stringify(body.user, null, 2);
//         })


// })
