const template = document.createElement('template');
template.innerHTML = `

<style>
    :host {
        display: block;
        font-family: "Aria";
        text-align: left;
        color: #ff7700;
    }
    .main_container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        vertical-align:middle;
      }

    #title {
        color: #ff7700;
        font-size: 70px;
        margin-bottom:25px
    }
    #desc {
        color: #ff7700;
        font-size: 14px;
        margin-top:100px;
        margin-bottom:100px;
        margin-left:50px;
        margin-right:50px;
        justify-content: center;
    }
    #action {
        font-size: 20px;
        margin-left:25px
    }
  </style>
  <div class="main_container">
        <div id="title">Artemis: Battle Randomizer</div>
        <div id="desc">Jump Drive</div>
        <div id="action">Loading...</div>
    </div>
  </div>

`


class BattleSplash extends HTMLElement {
    constructor() {
        super()
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(template.content.cloneNode(true));
        this.action  = this.root.querySelector('#action');
    }
    loaded() {
        this.action.innerHTML = "Click to continue";
      }
}
window.customElements.define('bat-splash', BattleSplash);