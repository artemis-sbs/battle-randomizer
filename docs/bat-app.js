import "./bat-board.js"
import "./bat-splash.js"
import "./bat-picked.js"
import { BattleModel } from './bat-model.js'
import { SoundManager } from './sound-manager.js'




const template = document.createElement('template');
template.innerHTML = `

<style>
    :host {
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
    #content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: calc(100% - 26px);
        padding: 0;
        margin: 0;
        margin-top: 25px;
    }
    #header {
        flex: 1 100%;
        display: flex;
        flex-direction: row;
        color: white;
        width: 100%;
        height: 25px;
        padding: 0;
        margin: 0;
    }
    </style>
    <div id="header">
        <span>Header</span>
        <span>test</span>
    </div>
    <div id="content">
        <bat-splash id="splash"></bat-splash>
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
        this.state = STATE_SPLASH_LOADING

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

    allowClick() {

        if (this.clickable) {
            return;
        }
        this.content.addEventListener('mousedown', () => this.endSplash())
        this.clickable = true
    }

    resize() {
        let w = window.innerWidth;
        let h = window.innerHeight - 100;
        const contentSize = { width: 1450, height: 810 }

        let windowRatio = w / h;
        let content = contentSize
        let ratio = content.width / content.height;
        let scale = w / content.width;
        if (windowRatio >= ratio) {
            scale = h / content.height;
        }
        this.content.style.transform = `scale(${scale})`
    }

    disallowClick() {
        if (!this.clickable) {
            return;
        }
        this.content.removeEventListener('clickdown', () => this.endSplash())
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

        }

    }
}

window.customElements.define('bat-app', BattleApp);

