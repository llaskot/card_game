const url_to_server = 'http://localhost:2567'
let current_state = null
let enemy_data = null // Store enemy data persistently
// For coin
let coinFlipShown = false;
let gameStartDetected = false;
let coinFlipStarted = false;
let isInitialGamePhase = true;

const log = document.getElementById('0');
const time = document.querySelector('#timer span');

function logMsg(msg) {
    // console.log(msg + "\n");
}

function updateTime(msg) {
    time.textContent = msg
}


document.querySelector('#root > div > div.game-board > button').addEventListener(
    'click',
    moveEnd
)

// Function to safely start coin flip animation
function startCoinFlipAnimation() {    
    if (window.coinFlipComponent && typeof window.coinFlipComponent.startCoinFlip === 'function') {
        coinFlipStarted = true;
        window.coinFlipComponent.startCoinFlip();
    } else {        
        // Retry after a short delay
        setTimeout(() => {
            if (!coinFlipStarted && window.coinFlipComponent) {
                startCoinFlipAnimation();
            }
        }, 100);
    }
}

// Function to show coin flip result
function showCoinFlipResult(playerGoesFirst) {    
    if (window.coinFlipComponent && typeof window.coinFlipComponent.showResult === 'function') {
        coinFlipShown = true;
        window.coinFlipComponent.showResult(playerGoesFirst);
    } else {
        console.log('Coin flip component not ready for result');
    }
}

function disable_cards() {
    const cards = document.querySelector('.cards-container')
    if (cards) {
        cards.style.filter = 'grayscale(1)'
        cards.style.pointerEvents = 'none' // Prevent clicking
    }
}

function enable_cards() {
    const cards = document.querySelector('.cards-container')
    if (cards) {
        cards.style.filter = 'none'
        cards.style.pointerEvents = 'auto' // Allow clicking
    }
}

function enable_fight() {
    const cards = document.querySelector('.cards-onboard')
    if (cards) {
        cards.style.filter = 'none'
        cards.style.pointerEvents = 'auto' // Allow clicking
    }
    const cardsEnemy = document.querySelector('.cards-onboard-enemy')
    if (cardsEnemy) {
        cardsEnemy.style.filter = 'none'
        cardsEnemy.style.pointerEvents = 'auto' // Allow clicking
    }
}

function disable_fight() {
    const cards = document.querySelector('.cards-onboard')
    if (cards) {
        cards.style.filter = 'grayscale(1)'
        cards.style.pointerEvents = 'none' // Prevent clicking
    }
    const cardsEnemy = document.querySelector('.cards-onboard-enemy')
    if (cardsEnemy) {
        cardsEnemy.style.filter = 'grayscale(1)'
        cardsEnemy.style.pointerEvents = 'none' // Prevent clicking
    }
}

let currentMessage = null;
let lastMessageText = '';
let lastMessageTime = 0;
const MESSAGE_COOLDOWN = 3000; // 3 second cooldown between any messages
const SAME_MESSAGE_COOLDOWN = 5000; // 5 second cooldown for identical messages

function log_message(message, isWarning = true) {
    const now = Date.now();
    // Check for spam prevention
    const timeSinceLastMessage = now - lastMessageTime;
    const isSameMessage = message === lastMessageText;

    // Apply cooldowns
    if (isSameMessage && timeSinceLastMessage < SAME_MESSAGE_COOLDOWN) {
        console.log('Same message ignored due to spam prevention:', message);
        return;
    }

    if (!isSameMessage && timeSinceLastMessage < MESSAGE_COOLDOWN) {
        console.log('Message ignored due to cooldown:', message);
        return;
    }
    
    // Update tracking variables
    lastMessageText = message;
    lastMessageTime = now;

    const content = document.querySelector('.battlefield-container')

    // Remove existing message if any (prevents overlap)
    if (currentMessage && currentMessage.parentNode) {
        // Stop the current animation by removing the element immediately
        currentMessage.remove();
        currentMessage = null;
    }

    const msg_element = document.createElement("div");
    msg_element.id = 'messages'
    msg_element.style.right = '-50vw';
    msg_element.style.transition = 'transform 5s linear';
    if(message.length > 25){
        msg_element.style.right = '-120vw';
        msg_element.style.transition = 'transform 7s linear'; // Make animation slower
    }


    const messageClass = isWarning ? 'warning' : 'notification';
    msg_element.insertAdjacentHTML('afterbegin', `<span class="${messageClass}">${message}</span>`);

    // Store reference to current message
    currentMessage = msg_element;

    content.insertAdjacentElement('afterbegin', msg_element)

    // Force a reflow to ensure initial position is applied
    void msg_element.offsetWidth;


    // Animate the message moving to the left
    if(message.length > 20){
        msg_element.style.transform = 'translateX(-235vw)';
    }else{
        msg_element.style.transform = 'translateX(-200vw)';
    }

    // Remove the element after it exits the screen
    setTimeout(() => {
        if (msg_element.parentNode) {
            msg_element.remove();
        }
        // Clear reference if this is still the current message
        if (currentMessage === msg_element) {
            currentMessage = null;
        }
    }, 8500);
}

function disable_endturn_btn() {
    const cards = document.querySelector('.end-turn-button')
    if (cards) {
        cards.style.filter = 'grayscale(1)'
        cards.style.pointerEvents = 'none' // Prevent clicking
    }
}

function enable_endturn_btn() {
    const cards = document.querySelector('.end-turn-button')
    if (cards) {
        cards.style.filter = 'none'
        cards.style.pointerEvents = 'auto' // Allow clicking
    }
}

let lastDisplayedLogMessage = null;

function log_if_changed(message, isWarning = true) {
    if (lastDisplayedLogMessage !== message) {
        lastDisplayedLogMessage = message;
        log_message(message, isWarning);
    }
}

function update_board(data) {
    current_state = data
    
    if ((!data.my.turn && !data.my.fight)
        || (!data.my.turn && data.my.fight)) {
        // Not my turn, can't play cards or fight
        disable_cards()
        disable_fight()
        disable_endturn_btn()
        log_if_changed("Opponent turn", false)
    } else if (data.my.turn && !data.my.fight) {
        // My turn to play cards, but can't fight yet
        enable_cards()
        disable_fight()
        enable_endturn_btn()
        log_if_changed("My turn to play cards", false)
    } else if (data.my.fight) {
        // Fighting phase - can't play new cards but can attack with existing ones
        disable_cards()
        enable_fight()
        enable_endturn_btn()
        log_if_changed("My turn to fight", false)
    }

    updateGameState('setCardsInHand', data.my.hand)
    updateGameState('setPlayerEnergy', data.my.energy)
    updateGameState('setPlayerHealth', data.my.hp)
    updateGameState('setEnemyHealth', data.his.hp)
    display_cards_mine(data.my.table, data.my.table_conditions)
    display_cards_his(data.his.table, data.his.table_conditions)
}

// Helper function to safely use React state setters
function updateGameState(setterName, ...args) {
    const setterFn = window.gameStateSetters?.[setterName];
    if (typeof setterFn === 'function') {
        setterFn(...args);
    } else {
        console.warn(`${setterName} is not available. Make sure React component is loaded.`);
    }
}

const client = new Colyseus.Client("ws://localhost:2567");
let room = null;

const reconnectionToken = localStorage.getItem("reconnectionToken");
if (reconnectionToken) {
    coinFlipShown = false;
    gameStartDetected = false;
    coinFlipStarted = false;
    isInitialGamePhase = false;

    logMsg(`Reconnecting using sessionId... ${reconnectionToken}`);
    client.reconnect(reconnectionToken)
        .then(res => {
            if (room) {
                room.leave();
                room.removeAllListeners();
            }
            room = res;
            setupRoom(room);
            logMsg("Reconnected successfully to room: " + room.roomId);
        }).catch((err) => {
        logMsg("Catch part");
        logMsg("Reconnect error: " + err.message);
        connectNew();
    });
} else {
    connectNew();
}

function setupRoom(room) {
    logMsg("Room set UP ");
    logMsg("Connected to room: " + room.roomId);
    // Only reset coin flip flags if this is a new connection (not reconnection)
    if (isInitialGamePhase) {
        coinFlipShown = false;
        coinFlipStarted = false;
    }

    // Сохраняем sessionId
    localStorage.setItem("reconnectionToken", room.reconnectionToken);
    room.onMessage('status', message => {
        if (message === 'You lose') {
            display_death()
            document.querySelector('.player-health-bar').remove()
            document.querySelector('.player-nickname-bar').remove()
            const player = document.querySelector('canvas.player-avatar')
            player.style.transition = 'linear 3.5s'
            player.style.opacity = '0'
            setTimeout(
                () => { window.location.href = '/' },
                5000
            )
        }
        else if (message === 'You win') {
            display_win()
            document.querySelector('.enemy-health-bar').remove()
            document.querySelector('.enemy-nickname-bar').remove()
            const enemy_avatar = document.querySelector('canvas.enemy-avatar')
            enemy_avatar.style.transition = 'linear 3.5s'
            enemy_avatar.style.opacity = '0'
            setTimeout(
                () => { window.location.href = '/' },
                5000
            )
        }
        logMsg("Status: " + message);
    });

    room.onMessage('stage', message => {
        // If coin flip is running and we get turn info, show the result
        if (coinFlipStarted && !coinFlipShown && message.my && typeof message.my.turn !== 'undefined') {
            console.log('Got turn information, showing coin flip result');
            showCoinFlipResult(message.my.turn);
        }

        update_board(message)
        logMsg("Stage: " + JSON.stringify(message, 0, 2));
        updateGameState('setPlayerEnergy', message.my.energy); 
    });

    room.onMessage('warning', message => {
        log_message(message)
        logMsg("WARNING: " + message);
    });

    room.onMessage('enemy', message => {
        console.log(message)
        display_enemy_data(message)
    })

    room.onMessage('countdown', message => {
        updateTime(message);

        // Start coin flip animation when countdown begins (at 5 seconds)
        if (message === 5 && !coinFlipStarted && !gameStartDetected && isInitialGamePhase) {
            gameStartDetected = true;
            console.log('Game start detected with countdown 5, starting coin flip animation');
            startCoinFlipAnimation();
        }
    })

    room.onLeave(code => {
        logMsg("Left the room, code: " + code);
    });
}

function sendTable(val) {
    room.send('table', {table: val});
}

function attack(val ) {
    room.send('attack', {table: val});
}

function connectNew() {
    coinFlipShown = false;
    gameStartDetected = false;
    coinFlipStarted = false;
    isInitialGamePhase = true;

    client.joinOrCreate("my_room", {
        token: localStorage.getItem('token')
    }).then(res => {
        setupRoom(res);
        room = res;
        // console.log(res);
    }).catch(e => {
        logMsg("Join error: " + e.message);            
    });
}

function moveEnd() {
    if (!current_state 
        || !current_state.my.turn) {
            return
    }
    room.send('moveEnd', '')
}

document.querySelector('.cards-wrapper').addEventListener(
    'click', 
    (event) => {
        if (!current_state 
            || !current_state.my.turn) {
                return
        }
        const card = event.target.closest('.card')

        if (current_state.my.table.length >= 4) {
            log_message("Battlefield is full")
            return
        }
        
        if (card) {
            sendTable([+(card.getAttribute('number'))])
        }
    }
)

function display_cards_mine(data, table_conditions) {

    let myTable;
    if (Array.isArray(data)) {
        // Already an array.
        myTable = data;
    } else if (typeof data === 'string') {
        // Expecting a comma-separated string, e.g., "9,3"
        myTable = data.split(',')
            .map(str => parseInt(str.trim(), 10))
            .filter(n => !isNaN(n));
    } else if (typeof data === 'number') {
        // If data is a single number, create an array with one element.
        myTable = [data];
    } else {
        // If data is not in an expected format, default to an empty array.
        console.warn("Unexpected data type for cards:", data);
        myTable = [];
    }

    if (Array.isArray(table_conditions)) {
            table_conditions.forEach(card => {
            const id = Number(card.id); // Just in case it's a string
            const hp = Number(card.hp); // This is where NaN might happen if card.hp is undefined or not a number

            if (!isNaN(id) && !isNaN(hp)) {
                updateGameState('updateCardHP', id, hp);
            } else {
                console.warn("Invalid card data:", card);
            }
        });
    } else {
        console.warn("table_conditions is not an array:", table_conditions);
    }
    updateGameState('setCardsOnBoard', myTable);
    
}

function display_cards_his(data_table, table_conditions) {

    let hisTable;
    if (Array.isArray(data_table )) {
        // Already an array.
        hisTable = data_table;
    } else if (typeof data_table === 'string') {
        // Expecting a comma-separated string, e.g., "9,3"
        hisTable = data_table.split(',')
            .map(str => parseInt(str.trim(), 10))
            .filter(n => !isNaN(n));
    } else if (typeof data_table === 'number') {
        // If data is a single number, create an array with one element.
        hisTable = [data_table];
    } else {
        // If data is not in an expected format, default to an empty array.
        console.warn("Unexpected data type for cards:", data_table);
        hisTable = [];
    }

    
    if (Array.isArray(table_conditions)) {
            table_conditions.forEach(card => {
            const id = Number(card.id); // Just in case it's a string
            const hp = Number(card.hp); // This is where NaN might happen if card.hp is undefined or not a number

            if (!isNaN(id) && !isNaN(hp)) {
                updateGameState('updateCardEnemyHP', id, hp);
            } else {
                console.warn("Invalid card data:", card);
            }
        });
    } else {
        console.warn("table_conditions is not an array:", table_conditions);
    }

    updateGameState('setCardsOnBoardEnemy', hisTable);
}

function chose_attacker_card_event(event) {
    if (!current_state 
        || !current_state.my.turn
        || !current_state.my.fight) {
        return
    }

    const chosen_card = event.target.closest('.card-onboard')

    if (!chosen_card
        || chosen_card.classList.remove("selected")) {
        return
    }

    const all_my_cards = document.querySelectorAll('.cards-onboard .card-onboard')

    all_my_cards.forEach((el) => {
        el.classList.remove("selected");
    })

    chosen_card.classList.add("selected")
}

document.querySelector('.cards-onboard').addEventListener(
    'click',
    chose_attacker_card_event
)


function chose_card_to_attack_event(event) {
    if (!current_state 
        || !current_state.my.turn
        || !current_state.my.fight) {
        return
    }

    const chosen_attacker_card = document.querySelector('.cards-onboard .card-onboard.selected')

    if (!chosen_attacker_card) {
        return
    }

    const chosen_card = event.target.closest('.card-onboard')

    if (!chosen_card) {
        return
    }

    attack([+chosen_attacker_card.getAttribute('number'), +chosen_card.getAttribute('number')])
}

document.querySelector('.cards-onboard-enemy').addEventListener(
    'click',
    chose_card_to_attack_event
)


document.querySelector('.enemy-avatar.avatar').addEventListener(
    'click',
    (event) => {
        if (!current_state 
            || !current_state.my.fight) {
            return
        }
        const chosen_card = document.querySelector(
            '.cards-onboard .card-onboard.selected'
        )

        if (chosen_card) {
            attack([+chosen_card.getAttribute('number'), -1])
        }
        
    }
) 

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
            'Content-Type': 'application/json',
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


async function display_user_data() {
    const user_data = await get_user_data_request()

    if (!user_data) {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
        window.location.href = '/login';
        return
    }
    updateGameState('setPlayerNickname', user_data.user.name)
    draw_img(user_data.user.avatar)

}

// This function to restore enemy data from localStorage
async function display_enemy_data_from_storage() {
    const storedEnemyData = localStorage.getItem('enemyData');
    if (storedEnemyData) {
        try {
            const enemyData = JSON.parse(storedEnemyData);
            console.log('Restoring enemy data from storage:', enemyData);
            display_enemy_data(enemyData);
        } catch (e) {
            console.warn('Failed to parse stored enemy data:', e);
        }
    } else {
        console.log('No enemy data found in storage');
    }
}

// Modified display_enemy_data function with better error handling
function display_enemy_data(data) {
    console.log('display_enemy_data called with:', data);
    
    // Store enemy data persistently
    enemy_data = data;
    localStorage.setItem('enemyData', JSON.stringify(data));
    
    // Update enemy nickname
    const nicknameElement = document.querySelector('#root > div > div.game-board > div.enemy-nickname-bar.bar-container > div > span');
    if (nicknameElement && data.enemy && data.enemy.name) {
        nicknameElement.textContent = data.enemy.name;
    }
    
    // Draw enemy avatar
    if (data.enemy && data.enemy.avatar) {
        draw_enemy_avatar(data.enemy.avatar);
    }
}

// New dedicated function for drawing enemy avatar (similar to draw_img for player)
function draw_enemy_avatar(avatarUrl) {
    console.log('draw_enemy_avatar called with:', avatarUrl);
    
    // Use the drawAvatarOnCanvas function from the React component
    const drawAvatarFn = window.gameStateSetters?.drawAvatarOnCanvas;
    const enemyCanvas = window.gameStateSetters?.enemyCanvasRef?.current;
    
    if (drawAvatarFn && enemyCanvas) {
        const imageUrl = url_to_server + avatarUrl;
        console.log('Drawing enemy avatar with URL:', imageUrl);
        drawAvatarFn(enemyCanvas, imageUrl);
    } else {
        console.warn('drawAvatarOnCanvas or enemyCanvasRef not available, retrying...');
        // Retry after a short delay
        setTimeout(() => {
            const retryDrawAvatarFn = window.gameStateSetters?.drawAvatarOnCanvas;
            const retryEnemyCanvas = window.gameStateSetters?.enemyCanvasRef?.current;
            
            if (retryDrawAvatarFn && retryEnemyCanvas) {
                const imageUrl = url_to_server + avatarUrl;
                console.log('Retrying enemy avatar draw with URL:', imageUrl);
                retryDrawAvatarFn(retryEnemyCanvas, imageUrl);
            } else {
                console.error('Still unable to draw enemy avatar after retry');
            }
        }, 500);
    }
}

function draw_img(url) {
    // Use the drawAvatarOnCanvas function from the React component
    const drawAvatarFn = window.gameStateSetters?.drawAvatarOnCanvas;
    const playerCanvas = window.gameStateSetters?.playerCanvasRef?.current;
    
    if (drawAvatarFn && playerCanvas) {
        const imageUrl = url_to_server + url;
        drawAvatarFn(playerCanvas, imageUrl);
    } else {
        console.warn('drawAvatarOnCanvas or playerCanvasRef not available, will retry when ready');
    }
}

display_user_data()
display_enemy_data_from_storage()


function display_death() {
    const content = document.querySelector('.battlefield-container')
    content.insertAdjacentHTML(
        'afterbegin',
        `<div class="death-background"> 
            <p>YOU DIED</p>
        </div>`
    )
}

function display_win() {
    const content = document.querySelector('.battlefield-container')
    content.insertAdjacentHTML(
        'afterbegin',
        `<div class="win-background"> 
            <p>ENEMY FELLED</p>
        </div>`
    )
    
}