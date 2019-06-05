const template = document.createElement('template');
template.innerHTML = `

<style>
    :host {
        display: block;
        font-family: "Aria";
        text-align: left;
        color: #ff7700;
        height: 100%
    }
    .main_container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        vertical-align:middle;
        height: 100%
      }

    #title {
        color: #ff7700;
        font-size: 70px;
        margin-bottom:25px
    }
  </style>
  <div class="main_container">
        <div id="title">Set your settings to...</div>
  </div>

`

class BattlePicked extends HTMLElement {
    constructor() {
        super()
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(template.content.cloneNode(true));
    }
}
window.customElements.define('bat-picked', BattlePicked);