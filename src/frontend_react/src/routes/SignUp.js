// import { useEffect } from 'react';
import './SignUp.css';
// import { UseScript } from '../utilities/use_script'
import { useLoadScripts } from '../utilities/use_scripts';

function SignUp() {
  useLoadScripts([
    '/static_js/show_page_loader.js',
    '/static_js/url_to_server.js',
    '/static_js/bypass_enter_or_show_page.js',
    '/static_js/login_request.js',
    '/static_js/get_data_from_form.js',
    '/static_js/sign_up_input_validation.js'
  ])
  // UseScript(document, 'show_page_loader.js')
  // UseScript(document, 'bypass_enter_or_show_page.js')
  // UseScript(document, 'login_request.js')
  // UseScript(document, 'get_data_from_form.js')
  // UseScript(document, 'sign_up_input_validation.js')
  // UseScript(document, 'show_page.js') not using because bypass_enter 

  return (
    <div className="background">
    <div>
      
      <form action="./sign_up" method="POST" id="signup_form">
        <h1>Create Account</h1>

        <div className="avatar_input">
            <input type="file" accept="image/png, image/jpeg"/>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/>
            </svg>
            <img className="group_avatar_input_preview" src="#"/>
        </div>

        <label htmlFor="login">Login</label>
        <p className="error" id="login_error"></p>
        <input type="text" name="login" id="login" required />

        <label htmlFor="fullname">Your Full Name</label>
        <input type="text" name="name" id="fullname" required />

        
        <label htmlFor="mail">Email</label>
        <p className="error" id="mail_error"></p>
        <input type="email" name="email" id="mail" required />

        <label htmlFor="pass">Password</label>
        <p className="error" id="password_error"></p>
        <input type="password" name="password" id="pass" required />

        <label htmlFor="confirm">Confirm password</label>
        <p className="error" id="confirm_error"></p>
        <input type="password" name="confirm" id="confirm" required />

        <button className="btn" type="submit">Sign up</button>

        <p className='link'>Already have an account? <a href="/login">Click here!</a></p>
    </form>
    
    </div>
    </div>
  );
}

export default SignUp;