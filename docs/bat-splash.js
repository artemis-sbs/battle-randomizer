const template = document.createElement('template');
template.innerHTML = `

<style>
    :host {
        display: block;
        font-family: "Arial";
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
        font-size: 24px;
        margin-top:100px;
        margin-bottom:100px;
        margin-left:150px;
        margin-right:150px;
        justify-content: center;
    }
    #action {
        font-size: 20px;
        margin-left:25px
    }
  </style>
  <div class="main_container">
        <div id="title">Artemis: Battle Randomizer</div>
        <div id="desc">Welcome to the Artemis Battle Randomizer. To adjust settings tap the icon in the upper left. This web page  can be installed as an offline standalone app. Select "Install in the browser Menu". </div>
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