import { BattleModel } from './bat-model.js'

const template = document.createElement('template');
template.innerHTML = `

<style>
    :host {
        display: block;
        font-family: "Arial";
        text-align: left;
        color: #ff7700;
        margin:0;
    }
      
    .settings_container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      font-size: 10px;
      height: 100%;
    }
    .topic {
        font-size: 24px;
        font-weight: normal;
        flex: auto; 
        margin: 0.5em;
        color: white;
    }
    .setting {
        font-size: 18px;
        font-weight: normal;
        color: #ff7700;
    }
    
    .disabledItem {
        text-decoration: line-through;
        color: #775500;
    }
    .heading {
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
    }
    .getNumber {
        flex: auto; 
        flex-direction: row;
        display: flex
    }
    .label {
        font-size: 14px;
        font-weight: normal;
        color: #ff7700;
    }
    .in {
        font-size: 14px;
    }


    
  </style>
  <div class="heading" >Difficulty</div>
  <div class="settings_container">
    <div class="getnumber">
        <div class="label">Min</div>
        <div class="in" ><input type="number" id="min" min="1" max="11"></div>
    </div>
    <div class="getnumber">
        <div class="label">Max</div>
        <div class "in"><input type="number" id="max" min="1" max="11"></div>
    </div>
 </div>
 <div class="heading" >Settings (click to toggle)</div>
 <div id="list" class="settings_container"></div>
 <div class="heading" >Ships</div>
 <div id="ships" class="settings_container"></div>
`

class SettingPage extends HTMLElement {
    constructor() {
        super()
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(template.content.cloneNode(true));
        this.itemList = this.root.querySelector('#list');
        this.shipList = this.root.querySelector('#ships');
        this.min = this.root.querySelector('#min');
        this.max = this.root.querySelector('#max');
        this.disabled = {}
        this.render();
    }
    render() {
        ///////////////////////
        /// this.
        let innerHTML = '';
        let shipsInnerHTML = '';

        for (let r of BattleModel.props.races) {
            shipsInnerHTML += `<div class="topic"> ${r.description}`
            for (let i of r.ships) {
                let id = `ship:${i.id}`
                let dis = (id in this.disabled);
                shipsInnerHTML += `<div  class="setting  ${dis ? 'disabledItem' : ''}" id="${id}"> ${i.description}</div>`
            }
            shipsInnerHTML += '</div>'
        }

        for (let key of Object.keys(BattleModel.props)) {
            if (key == 'races') continue;
            innerHTML += `<div class="topic"> ${key}`
            for (let i of BattleModel.props[key]) {
                let id = `${key}:${i.id}`
                let dis = (id in this.disabled);
                innerHTML += `<div  class="setting ${dis ? 'disabledItem' : ''}" id="${id}"> ${i.description}</div>`
            }

            innerHTML += `</div>`
        }
        this.itemList.innerHTML = innerHTML;
        this.shipList.innerHTML = shipsInnerHTML;
        let setting = this.root.querySelectorAll('.setting');
        let me = this;
        Array.from(setting).forEach(link => {
            link.addEventListener('click', function (event) {
                me.toggleDisable(event);
                event.preventDefault();
            });
        });
    }
    toggleDisable(ev) {

        if (ev.target.classList.contains('disabledItem')) {
            delete this.disabled[ev.target.id]
            ev.target.classList.remove('disabledItem')
        } else {
            ev.target.classList.add('disabledItem')
            this.disabled[ev.target.id] = true
        }
    }
    get disabledItems() {
        return this.disabled
    }
    set disabledItems(items){
        this.disabled = items;
    }
    get difficulty() {
        let ret = {min: parseInt(this.min.value), max: parseInt(this.max.value)}
        if (!ret.min)  {
            ret.min = 1
        }
        if (!ret.max)  {
            ret.max = 11
        }
        if (ret.min < 1 || ret.min > 11) {
            ret.min =1
        }
        if (ret.max < 1 || ret.max > 11) {
            ret.max =11
        }

        if (ret.min > ret.max ) {
            let s = ret.min
            ret.min = ret.max
            ret.max = s
        }
        return ret;
    }
    set difficulty(diff){
        this.min.value = diff.min;
        this.max.value = diff.max;
    }

}
window.customElements.define('bat-settings', SettingPage);


