async function display_user_data() {
    const user_data = await get_user_data_request()

    if (!user_data) {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
        window.location.href = '/login';
        return
    }
    console.log(user_data)
    document.querySelector('.username').textContent = user_data.user.name
    document.querySelector('.avatar_wrapper img').src = url_to_server + user_data.user.avatar
    document.querySelector('.group_avatar_input_preview').src = url_to_server + user_data.user.avatar
    // put_data_on_page(user_data.user)
}

display_user_data()

document.querySelector('.add_photo').addEventListener(
    'click',
    () => {
        document.querySelector('#dialog_wrapper').style.display = 'flex'
        document.querySelector('#dialog_wrapper').style['z-index'] = '1000'
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

async function upload_new_avatar(event) {
    event.preventDefault()

    const fileInput = document.querySelector('form#dialogbox input')

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

    await fetch(url_to_server + "/backend/user/upload", requestOptions)
    window.location.reload()
}

document.querySelector('form#dialogbox').addEventListener(
    "submit",
    upload_new_avatar
);

document.querySelector('form#dialogbox .cancel').addEventListener(
    "click",
    (event) => {
        event.preventDefault()
        document.querySelector('#dialog_wrapper').style.display = 'none'
        document.querySelector('#dialog_wrapper').style['z-index'] = '0'
    }
);

document.querySelector('.link_to_battle_wrapper a').addEventListener(
    'click',
    async (event) => {
        event.preventDefault()
        await refreshToken()
        localStorage.removeItem('reconnectionToken')
        localStorage.removeItem('enemyData')

        window.location.href = '/battlefield'
    }
)