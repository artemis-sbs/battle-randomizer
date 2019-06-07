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
        flex-direction: row;
        align-items: center;
      }
      
    .settings_container {
      display: flex;
      flex-direction: column;
      font-size: 40px;
    }
    
    .item_container {
        display: flex;
        flex: 2
        flex-direction: row;
        margin-bottom: 20px;
        margin-top: 20px;
      }
      .item_label {
        width: 350px;
        text-align: left;
      }
      .item_value {
        text-align: left;
        width: 350px;
      }
      
      .details_container {
        display: flex;
        flex-direction: column;
        font-size: 40px;
        margin-right: 100px;
        margin-left: 100px
      }
      #ship_image {
          width:512px;
          height:512px;
          background-image: url('assets/TSN_Light_Cruiser_Pic.png'); 
          background-position: center;
      }
      #logo {
        width:400px;
        height:193px;
        background-image: url('assets/artemis-logo.png'); background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    #ship_type {
        color: #ff7700;
        font-size: 40px;
    }
    #ship_drive {
        font-size: 40px;

    }
  </style>
  <div class="main_container">
    <div id="ship" class="details_container">
      <div id="ship_image"></div>
        <div id="ship_type">TSN Missile Cruiser</div>
        <div id="ship_drive">Jump Drive</div>
        <div id="logo"></div>
        <canvas id="slot">
    </div>
    <div id="list" class="settings_container"> </div> 
  </div>

`


class BattleBoard extends HTMLElement {

    static labels = {
        difficulty: 'Difficulty',
        scenarios: 'Scenario',
        terrain: 'Terrain',
        lethalTerrain: 'Lethal Terrain',
        friendlyShips: 'Friendly Ships',
        anomalies: 'Anomalies',
        monsters: 'Monsters'
    }
    constructor() {
        super()
        this.root = this.attachShadow({ mode: 'open' });

        this.root.appendChild(template.content.cloneNode(true));
        this.itemList = this.root.querySelector('#list');
        this.shipType = this.root.querySelector('#ship_type');
        this.shipDrive = this.root.querySelector('#ship_drive');
        this.shipImage = this.root.querySelector('#ship_image');
    }
    _renderItems() {
        this.itemList.innerHTML = '';
        //BattleBoard.labels
        Object.entries(this._pick.settings).forEach((kv, index) => {
            let row = document.createElement('div');
            row.className = 'item_container'

            let label = document.createElement('div');
            label.className = 'item_label'
            let value = document.createElement('div');
            value.className = 'item_value'
            label.innerHTML = BattleBoard.labels[kv[0]];
            value.innerHTML = this.pick.settings[kv[0]]
            


            row.appendChild(label);
            row.appendChild(value);

            this.itemList.appendChild(row);
        });
        this.shipType.innerHTML = this.pick.ship
        this.shipDrive.innerHTML = this.pick.drive
        
        this.shipImage.style.backgroundImage =  `url(${this.pick.src})`;
    }

    render() {
        this._renderItems()
        //this.root.innerHTML = '<div class='>Hello Shadow DOM</h1>';
    }

    set pick(value) {
        this._pick = value
        this.render()
    }
    get pick () {
        return this._pick
    }


}
window.customElements.define('bat-board', BattleBoard);