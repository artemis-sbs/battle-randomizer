import "./bat-board.js"
import "./bat-splash.js"
import "./bat-picked.js"
import { BattleModel } from './bat-model.js'




class SoundManager {
    constructor(urls) {
       this.manifest = [{id: 'picked', url: 'assets/sounds/picked.ogg'},
       {id: 'pick-done', url: 'assets/sounds/pick-done.ogg'},
       {id: 'picking', url: 'assets/sounds/pyl-board2.ogg'}]
    }

    async  init() {
        this.buffers = {}
        this.decoded = false
        for await (let item of this.manifest) {
            this.buffers[item.id] = await this.load(item.url)
        }
    }
    async decode() {
        if (this.decoded) {
            return
        }
        this.context = new AudioContext()
        for await (let kv of Object.entries(this.buffers)) {
            this.buffers[kv[0]] = await this.context.decodeAudioData(kv[1])
        }
        this.decoded = true;
    }
    
    async play(id, loop, cb){
        
        if (this.current) {
           await this.current.stop()
        } else {
            await this.decode()
        }
        try {
        let source = this.context.createBufferSource();
        source.loop = loop
        source.buffer = this.buffers[id]
        source.connect(this.context.destination);
        
        this.current = source
        if (cb) {
            source.addEventListener('ended', cb)
        }
        source.start(0)
        }
        catch (e) {
            console.log('Freaking sound')
        }
    }
    async  load(url) {
        var myRequest = new Request(url);
        let response = await fetch(myRequest)
        return await response.arrayBuffer();
        
    }
}







const template = document.createElement('template');
template.innerHTML = `

<style>
    :host {
        display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 0;
            margin: 0;
            background-image: url('assets/background.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
    }
    </style>
    <div id="host">
        <bat-splash id="splash"></bat-splash>
    <div>
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
        this.host = this.root.querySelector('#host')
        this.state = STATE_SPLASH_LOADING

    }
    connectedCallback() {
        let splash  = this.host.querySelector('#splash');
        this.sounds = new SoundManager();
        this.sounds.init().then(()=>{
            splash.loaded()
            this.allowClick()
        })
        this.resize()
        window.addEventListener('resize', ()=> this.resize())
    }

    allowClick() {

        if (this.clickable) {
            return;
        }
        this.addEventListener('mousedown', () => this.endSplash())
        this.clickable = true
    }

    resize() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        const contentSize = {width:1450, height: 810}

        let windowRatio = w/h;
        let content = contentSize
        let ratio = content.width / content.height;
        let scale = w/content.width;
        if (windowRatio >= ratio) {
            scale = h/content.height;
        }
        this.host.style.transform = `scale(${scale})`
    }

    disallowClick() {
        if (!this.clickable) {
            return;
        }
        this.removeEventListener('clickdown', () => this.endSplash())
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
        this.host.innerHTML = `<bat-board id="board"></bat-board>`
        this.board = this.host.querySelector('#board');
    }
    shuffleBoard() {
        this.board.pick = this.model.pick()
    }

    playPickSound() {
        let me = this
        this.sounds.play('picked', false, ()=> {
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
            this.activateBoard();
            this.shuffleBoard();
            this.state = STATE_PICKING

            this.allowClick()
            this.allowTick()

        } else if (this.state === STATE_PICKING) {
            this.host.innerHTML = `<bat-picked></bat-picked>`
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

