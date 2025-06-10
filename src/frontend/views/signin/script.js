const result = document.getElementById('result');


document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const dada = {};
    for (const key of formData.keys()) {
        if (key === 'set') {
            dada[key] = formData.getAll(key)
            continue;
        }
        dada[key] = formData.get(key);

    }
    console.log(dada)

    fetch('/backend/user', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dada)
    })
        .then(res => {
            return res.json().then(body => {
                if (res.status !== 200) {
                    const span = document.createElement('span');
                    span.textContent = body.message;
                    result.appendChild(span);
                    throw new Error(body.message);
                } else {
                    // обработка успешного ответа
                    const span = document.createElement('span');
                    span.textContent = 'Success';
                    result.appendChild(span);
                    return body;
                }
            })
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('refresh', data.refresh);
        }).catch(err => {
            console.error(err);
    })
})