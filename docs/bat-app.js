import "./bat-board.js"
import "./bat-splash.js"
import "./bat-picked.js"
import "./bat-settings.js"
import { BattleModel } from './bat-model.js'
import { SoundManager } from './sound-manager.js'




const template = document.createElement('template');
template.innerHTML = `

<style>
    :host {
    }
    .main {
        display: flex;
        height: 100%;
        width: 100%;
        display: flex;  
        flex-flow: row wrap;
        padding: 0;
        margin: 0;
        background-image: url('assets/background.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

    }
    .content {
        display: none;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
    #header {
        flex: 1 100%;
        display: flex;
        flex-direction: row;
        color: white;
        width: 100%;
        height: 40px;
        padding: 0;
        margin: 0;
    }
    .cat_circle {
        margin: 3px;
        border: 3px solid #7E9CC2;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .cat_circle img {
        width: 80%;
        height: auto;
      }
     
      .active_tab {
        display: flex
    }
    </style>
    <div class="main">
        <div id="header">
            <span class="cat_circle">
                <img src="icons/favicon24.png">
            </span>
        </div>
        <div id="content" class="content active_tab" >
            <bat-splash id="splash"></bat-splash>
        </div>
        <div id="settingsHolder" class="content" >
            <bat-settings id="settings"></bat-settings>
        </div>
    </div>
`

const STATE_SPLASH_LOADING = 0
const STATE_SPLASH_LOADED = 1
const STATE_START_PICKING = 2
const STATE_PICKING = 3
const STATE_PICKED = 4
const STATE_SHOW_PICKED = 5
const STATE_SHOWING_PICKED = 6
const STATE_SETTINGS = 6

class BattleApp extends HTMLElement {
    constructor() {
        super()
        this.model = new BattleModel();
        this.root = this.attachShadow({ mode: 'open' });

        this.root.appendChild(template.content.cloneNode(true));
        this.content = this.root.querySelector('#content')
        this.settingsHolder = this.root.querySelector('#settingsHolder')
        this.settings = this.root.querySelector('#settings')
        this.state = STATE_SPLASH_LOADING
        this.header = this.root.querySelector('#header')

        this.root.addEventListener('mousedown', (e) => {
            console.log(`mouse: ${e.clientX} ${e.clientY}`)
            if (e.clientX < 45 && e.clientY < 45) {
                this.toggle()
            } else if (this.clickable) {
                this.endSplash();
            }

        })



    }
    connectedCallback() {
        let splash = this.content.querySelector('#splash');

        this.sounds = new SoundManager([{ id: 'picked', url: 'assets/sounds/picked.ogg' },
        { id: 'pick-done', url: 'assets/sounds/pick-done.ogg' },
        { id: 'picking', url: 'assets/sounds/pyl-board2.ogg' }]);
        this.sounds.init().then(() => {
            splash.loaded()
            this.state = STATE_SPLASH_LOADED
            this.endSplash()
        })
        this.resize()
        window.addEventListener('resize', () => this.resize())
    }

    toggle() {
        if (this.settingsHolder.classList.contains('active_tab')) {
            this.model.disabledItems = this.settings.disabledItems
            this.model.difficulty = this.settings.difficulty
            this.model.save()
            this.model.reset();


            this.settingsHolder.classList.remove("active_tab");
            this.content.classList.add("active_tab");
            this.allowClick();
        } else {
            this.settings.disabledItems = this.model.disabledItems
            this.settings.difficulty = this.model.difficulty
            this.disallowClick();
            this.disallowTick();
            this.sounds.stop();

            this.settings.render();

            this.content.classList.remove("active_tab");
            this.settingsHolder.classList.add("active_tab");

        }
    }

    allowClick() {
        this.clickable = true
    }

    resize() {
        if (this.board) {
            let w = window.innerWidth;
            let h = window.innerHeight;
            const contentSize = { width: 1450, height: 810 }
            let windowRatio = w / h;
            let content = contentSize
            let ratio = content.width / content.height;
            let scale = w / content.width;
            if (windowRatio >= ratio) {
                scale = h / content.height;
            }
            this.board.style.transform = `scale(${scale})`
        }
        
    }

    disallowClick() {
        if (!this.clickable) {
            return;
        }
        this.clickable = false
    }
    allowTick() {
        if (this.tick) {
            return;
        }
        this.tick = setTimeout(() => {
            this.shuffleBoard();
            this.tick = undefined
            this.allowTick()
        }, 100)
    }
    disallowTick() {
        if (this.tick) {
            clearTimeout(this.tick)
            this.tick = undefined;
        }
    }

    activateBoard() {
        this.content.innerHTML = `<bat-board id="board"></bat-board>`
        this.board = this.content.querySelector('#board');
        this.resize();
    }
    shuffleBoard() {
        this.board.pick = this.model.pick()
    }

    playPickSound() {
        let me = this
        this.sounds.play('picked', false, () => {
            me.endSplash();
        });
    }
    playPickDoneSound() {
        this.sounds.play('pick-done');
    }
    playPickingSound() {
        this.sounds.play('picking', true);
    }
    pausePickingSound() {
        this.pickingSound.pause();
    }


    endSplash() {
        if (this.state === STATE_SPLASH_LOADING) {
            this.state = STATE_SPLASH_LOADED
        } else if (this.state === STATE_SPLASH_LOADED) {
            this.state = STATE_START_PICKING
            this.allowClick()
        } else if (this.state === STATE_START_PICKING) {
            this.activateBoard();
            this.shuffleBoard();
            this.state = STATE_PICKING

            this.allowClick()
            this.allowTick()

        } else if (this.state === STATE_PICKING) {
            this.content.innerHTML = `<bat-picked></bat-picked>`
            this.board = undefined
            this.disallowTick()
            this.playPickSound()
            this.state = STATE_PICKED
        } else if (this.state === STATE_PICKED) {
            this.state = STATE_SHOW_PICKED;
            this.endSplash()
        } else if (this.state === STATE_SHOW_PICKED) {
            this.playPickDoneSound()
            this.activateBoard();
            this.board.pick = this.model.pick()
            this.state = STATE_SHOWING_PICKED;
        } else if (this.state === STATE_SHOWING_PICKED) {
            this.state = STATE_PICKING
            this.playPickingSound()
            this.allowClick()
            this.allowTick()
        } else if (this.state === STATE_SETTINGS) {
            this.state = STATE_START_PICKING
            this.allowClick()
        }


    }
}

window.customElements.define('bat-app', BattleApp);

