import './Settings.css';
// import { UseScript } from '../utilities/use_script'
import { useLoadScripts } from '../utilities/use_scripts';

function Settings() {
  useLoadScripts([
    '/static_js/show_page_loader.js',
    '/static_js/url_to_server.js',
    '/static_js/get_data_from_form.js',
    '/static_js/get_user_data.js',
    '/static_js/edit_data_request.js',
    '/static_js/settings_script.js',
    '/static_js/show_page.js'
  ])
  // UseScript(document, 'show_page_loader.js')
  // UseScript(document, 'get_data_from_form.js')
  // UseScript(document, 'get_user_data.js')
  // UseScript(document, 'edit_data_request.js')
  // UseScript(document, 'settings_script.js')
  // UseScript(document, 'show_page.js')

  return (
    <div className="background" id="settings">
      <div id="dialog_wrapper">
          <div id="dialog_overlay"></div>
          <div id="dialogbox">
            Are you sure about that?
            <div id="dialog_choices">
              <button id="cancel_delete" className="cancel">Cancel</button>
              <button id="agree_delete" className="agree">Yes, delete my account</button>
            </div>
          </div>
        </div>
    <div className="container" >
        
        <h3>You are logged in now</h3>
        <div id="form_wrapper">
            <p>Login:<br/><span id="login"></span></p>
            <p>Full Name:<br/><span id="fullname"></span></p>
            <p>Email Address:<br/><span id="email"></span></p>
            <p>Total matches played:<br/><span id="matches"></span></p>
            <p>Victories:<br/><span id="victories"></span></p>
            <p className="info">
                Want to change your password?<a href="./change_passwords">Click here!</a>
            </p>
            <button className="btn" id="change_to_form">Edit user data</button>
        </div>
        <button className="btn" onClick={() => window.location.href='/'}>Home page</button>
        <form id="logout" action="./logout" method="POST"><button className="btn">Log out</button></form>
        <button className="btn" id="delete_account">Delete my account</button>
    </div>
    </div>
  );
}

export default Settings;