import './Login.css';
// import { UseScript } from '../utilities/use_script'
import { useLoadScripts } from '../utilities/use_scripts';

function Login() {
  useLoadScripts([
    '/static_js/show_page_loader.js',
    '/static_js/url_to_server.js',
    '/static_js/bypass_enter_or_show_page.js',
    '/static_js/get_data_from_form.js',
    '/static_js/login_request.js',
    '/static_js/login_script.js'
  ])
  // UseScript(document, 'show_page_loader.js')
  // UseScript(document, 'bypass_enter_or_show_page.js')
  // UseScript(document, 'get_data_from_form.js')
  // UseScript(document, 'login_request.js')
  // UseScript(document, 'login_script.js')
  // UseScript(document, 'show_page.js')

  return (
    <div className="background">
    <div>
    <form method="POST" id="login_form">
        <h1>Enter Your Account</h1>

        <p className="error" id="error"></p>

        <label htmlFor="login">Login</label>
        <input type="text" name="login" id="login" required/>

        <label htmlFor="pass">Password</label>
        <input type="password" name="password" id="pass" required/>

        <button className="btn" type="submit">Log In</button>

        <p className='link'>Don't have an account? <a href="/signup">Click here!</a></p>
    </form>
    
    </div>
    </div>
  );
}

export default Login;