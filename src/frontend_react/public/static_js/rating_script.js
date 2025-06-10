document.querySelector('.back_to_home').addEventListener(
    'click',
    () => {
        window.location.href = '/'
    }
)

async function get_users_data() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", 'Bearer ' + localStorage.getItem('token'));

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const response = await fetch(url_to_server + "/backend/user/all/rate", requestOptions)

    return await response.json()
}

async function populate_table() {
    await get_user_data_request();
    const data = await get_users_data();

    // Sort users by KPD, then by games_qty
    data.users.sort((a, b) => {
        const kpdA = a.games_qty === 0 ? 0 : a.victories_qty / a.games_qty;
        const kpdB = b.games_qty === 0 ? 0 : b.victories_qty / b.games_qty;

        if (kpdB !== kpdA) {
            return kpdB - kpdA; // Higher KPD first
        }
        return b.games_qty - a.games_qty; // Higher games_qty first if KPD equal
    });

    let html = '';

    for (let user_data of data.users) {
        let kpd = user_data.games_qty === 0
            ? '-'
            : (user_data.victories_qty / user_data.games_qty * 100).toFixed(2) + '%';

        html += `
        <tr>
            <td><img style="width: 50px; height: 50px;" src="${url_to_server + user_data.avatar}"></td>
            <td>${user_data.name}</td>
            <td>${user_data.victories_qty}</td>
            <td>${user_data.games_qty}</td>
            <td>${kpd}</td>
        </tr>
        `;
    }

    document.querySelector('table tbody').innerHTML = html;
}

populate_table()