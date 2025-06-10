async function edit_data_request(dada) {
    const edit_data_url = url_to_server + "/backend/user"

    let response = await fetch(edit_data_url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(dada)
    })

    return await response.json();
}