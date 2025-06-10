import './App.css';
import { useLoadScripts } from './utilities/use_scripts';

function App() {
  useLoadScripts([
    '/static_js/url_to_server.js',
    '/static_js/get_user_data.js',
    '/static_js/home_script.js'
  ])
  return (
    <div className="background">
      <div id="dialog_wrapper">
          <div id="dialog_overlay"></div>
          <form id="dialogbox" method="put">
            <div className="avatar_input">
              <input name="file" type="file" accept="image/png, image/jpeg"/>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                  <path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/>
              </svg>
              <img className="group_avatar_input_preview" src="#"/>
            </div>
            <div id="dialog_choices">
              <button id="cancel_delete" className="cancel">Cancel</button>
              <button id="agree_delete" className="agree">Change avatar</button>
            </div>
          </form>
        </div>
    <div className="content">
    {/* <div class="profile_info">
        <div class="profile_photo">
            <img src="/images/avatar/profile-ironman.jpg" alt="avatar"></img>
        </div>
        <div class="profile_text_info">
            <div class="profile_name">Cool User</div>
            <div class="profile_meta">
                <div class="members_counter_container"><span class="members_counter">176</span> members</div>
            </div>
        </div>
        <div class="background_gradient"></div>
    </div> */}
      <div className="avatar_wrapper">
        <div className="settings_btns">
          <button className="add_photo">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/></svg>
          </button>
          <a className="to_settings" href='/settings'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
          </a>
        </div>
        <img style={{height: '100%'}} src="/images/avatar/profile-ironman.jpg" alt="avatar"></img>
        <div className="username"></div>
        {/* <div className="statistic"><span class="vict"></span> victories out of <span class='battles'></span> battles</div> */}
        <div className="background_gradient"></div>
        <div className="background_gradient_top"></div>
      </div>
      <div className="link_to_ratting_wrapper">
          <a href="/rating">Check out rating</a>
      </div>
      <div className="link_to_battle_wrapper">
          <a href="/battlefield">To Battle!</a>
      </div>
      
    </div>

    </div>
  );
}

export default App;
