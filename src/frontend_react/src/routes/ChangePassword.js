import './ChangePassword.css';
// import { UseScript } from '../utilities/use_script'
import { useLoadScripts } from '../utilities/use_scripts';

function ChangePassword() {
    useLoadScripts([
        '/static_js/show_page_loader.js',
        '/static_js/url_to_server.js',
        '/static_js/get_data_from_form.js',
        '/static_js/get_user_data.js',
        '/static_js/change_password_script.js',
        '/static_js/show_page.js'
    ])
    return (
    <div className="background">
    <div>
    <form method="POST" id="login_form">
    <button className="back_to_settings">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
    </button>
        <h1>Change Password</h1>

        <label htmlFor="old_password">Old Password</label>
        <p className="error" id="old_password_error"></p>
        <input type="password" name="old_pas" id="old_password" required/>

        <label htmlFor="pass">New Password</label>
        <p className="error" id="password_error"></p>
        <input type="password" name="new_pas" id="pass" required />

        <label htmlFor="confirm">Confirm new password</label>
        <p className="error" id="confirm_error"></p>
        <input type="password" name="confirm" id="confirm" required />

        <button className="btn" type="submit">Submit</button>
    </form>
    
    </div>
    </div>
  );

}

export default ChangePassword;