

export class BattleModel {
    constructor() {

        this.difficulty_range = { min: 1, max: 11 }
        this.disabled = {
        }
        this.load()
        this.reset();
    }

    load() {
        let jsonvalue = window.localStorage.getItem("artemis:battle:settings")
        if (jsonvalue) {
            let value = JSON.parse(jsonvalue);
            this.difficulty_range = value.difficulty_range?value.difficulty_range:{ min: 1, max: 11 };
            this.disabled = value.disabled?value.disabled:{}
        }
        
    }
    save() {
        let value = {difficulty_range: this.difficulty_range, disabled: this.disabled}
        window.localStorage.setItem("artemis:battle:settings", JSON.stringify(value))
    }

    set disabledItems(items){
        this.disabled = items;
    }
    get disabledItems() {
        return this.disabled
    }
    get difficulty() {
        return this.difficulty_range
    }
    set difficulty(value) {
        this.difficulty_range.min = value.min
        this.difficulty_range.max = value.max
    }
    //////////////////////////////////////
    // Build properties based on settings.
    reset() {
        this.props = {}
        this.props.difficulty = []
        for (let i = this.difficulty_range.min,
            l = this.difficulty_range.max;
            i <= l; i++) {
            this.props.difficulty.push(i)
        }
        ///////////////////////
        /// this.
        for (let key of Object.keys(BattleModel.props)) {
            this.props[key] = []
            let noValue = BattleModel.props[key][0];
            let count = 0;
            for (let i of BattleModel.props[key]) {
                let id = `${key}:${i.id}`
                if (!(id in this.disabled)) {
                    this.props[key].push(i);
                    count++
                }
            }
            if (!count) {
                this.props[key].push(noValue);
            }
        }
        ///// rebuild races and ships
        let races = []
        for (let race of this.props.races) {
            let newValue = {id: race.id, description: race.description, ships: []}
            let ships = 0
            for (let i of race.ships) {
                let id = `ship:${i.id}`
                if (!(id in this.disabled)) {
                    newValue.ships.push(i);
                    ships++
                }
            }
            // if no ships are enebled don't include
            if (ships) {
                races.push(newValue);
            }
        }
        // If all ships diabled default to artemis
        if (races.length === 0) {
            races = [{id: 'tsn', description: 'TSN', ships: [
                    { id: 'tsn-light', description: 'TSN Light Cruiser', src: "assets/TSN_Light_Cruiser_Pic.png" }]}]
        }
        this.props.races = races;

     
    }
    gaussianRand() {
        var rand = 0;

        for (var i = 0; i < 6; i += 1) {
            rand += Math.random();
        }
        return rand / 6;
    }
    gaussianRandom(start, end) {
        return Math.floor(start + this.gaussianRand() * (end - start + 1));
    }
    psuedoRandom(start, end) {
        return Math.floor(start + Math.random() * (end - start + 1));
    }
    pick() {
        let props = this.props;

        let race = props.races[this.psuedoRandom(0, props.races.length - 1)];
        let drive = props.drives[this.psuedoRandom(0, props.drives.length - 1)];
        let ship =race.ships[this.psuedoRandom(0, race.ships.length - 1)]

        return {
            settings: {
                difficulty: props.difficulty[this.gaussianRandom(0, props.difficulty.length - 1)],
                scenarios: props.scenarios[this.psuedoRandom(0, props.scenarios.length - 1)].description,
                terrain: props.terrain[this.psuedoRandom(0, props.terrain.length - 1)].description,
                lethalTerrain: props.lethalTerrain[this.psuedoRandom(0, props.lethalTerrain.length - 1)].description,
                friendlyShips: props.friendlyShips[this.psuedoRandom(0, props.friendlyShips.length - 1)].description,
                anomalies: this.props.anomalies[this.psuedoRandom(0, props.anomalies.length - 1)].description,
                monsters: this.props.monsters[this.psuedoRandom(0, props.monsters.length - 1)].description
            },
            race: race.description,
            drive: drive.description,
            ship: ship.description,
            src: ship.src
        }
    }
    static props = {
        scenarios: [
            { id: 'siege', description: 'Siege' },
            { id: 'single', description: 'Single Front' },
            { id: 'double', description: 'Double Front' },
            { id: 'deep', description: 'Deep Strike' }
            //{id: 'border', description: 'Border War'},   
            //{id: 'peace', description: 'Peacetime'}
        ],
        terrain: [
            { id: 'none', description: 'None' },
            { id: 'few', description: 'Few' },
            { id: 'some', description: 'Some' },
            { id: 'lots', description: 'Lots' },
            { id: 'many', description: 'Many' }
        ],
        lethalTerrain: [
            { id: 'none', description: 'None' },
            { id: 'few', description: 'Few' },
            { id: 'some', description: 'Some' },
            { id: 'lots', description: 'Lots' },
            { id: 'many', description: 'Many' }
        ],
        friendlyShips: [
            { id: 'none', description: 'None' },
            { id: 'few', description: 'Few' },
            { id: 'some', description: 'Some' },
            { id: 'lots', description: 'Lots' },
            { id: 'many', description: 'Many' }
        ],
        anomalies: [
            { id: 'none', description: 'None' },
            { id: 'few', description: 'Few' },
            { id: 'some', description: 'Some' },
            { id: 'lots', description: 'Lots' },
            { id: 'many', description: 'Many' }
        ],
        monsters: [
            { id: 'none', description: 'None' },
            { id: 'few', description: 'Few' },
            { id: 'some', description: 'Some' },
            { id: 'lots', description: 'Lots' },
            { id: 'many', description: 'Many' }
        ],
        races: [
            {
                id: 'tsn', description: 'TSN', ships: [
                    { id: 'tsn-light', description: 'TSN Light Cruiser', src: "assets/TSN_Light_Cruiser_Pic.png" },
                    { id: 'tsn-scout', description: 'TSN Scout', src: "assets/TSN_Scout_Pic.png" },
                    { id: 'tsn-battleship', description: 'TSN Battleship', src: "assets/TSN_Battleship_Pic.png" },
                    { id: 'tsn-missle', description: 'TSN Missle Cruiser', src: "assets/TSN_Missile_Cruiser_Pic.png" },
                    { id: 'tsn-dreadnought', description: 'TSN Dreadnought', src: "assets/TSN_Dreadnought_Pic.png" },
                    { id: 'tsn-carrier', description: 'TSN Carrier', src: "assets/TSN_Medium_Carrier.png" },
                    { id: 'tsn-mine', description: 'TSN Mine Layer', src: "assets/TSN_Mine_Layer.png" },
                    { id: 'tsn-juggernaut', description: 'TSN Juggernaut', src: "assets/TSN_Juggernaut_Pic.png" }
                ]
            },
            {
                id: 'ximni', description: 'Ximni', ships: [
                    { id: 'ximni-light', description: 'Ximni Light Cruiser', src: "assets/Ximni_Light_Cruiser.png" },
                    { id: 'ximni-scout', description: 'Ximni Scout', src: "assets/Ximni_Scout.png" },
                    { id: 'ximni-battleship', description: 'Ximni Battleship', src: "assets/Ximni_Battleship.png" },
                    { id: 'ximni-missle', description: 'Ximni Missle Cruiser', src: "assets/Ximni_Missile_Cruiser.png" },
                    { id: 'ximni-dreadnought', description: 'Ximini Dreadnought', src: "assets/Ximni_Dreadnought.png" },
                    { id: 'ximni-carrier', description: 'Ximni Carrier', src: "assets/Ximni_Carrier.png" }
                ]
            },
            {
                id: "pirate", description: "Pirate", ships: [
                    { "id": "pirate-light", "description": "Pirate Strongbow Cruiser", "src": "assets/Pirate_Strongbow.png" },
                    { "id": "pirate-scout", "description": "Pirate Longbow Scout", "src": "assets/Pirate_Longbow.png" },
                    { "id": "prate-carrier", "description": "Pirate Brigantine Carrier", "src": "assets/Pirate_Brigantine.png" }
                ]
            }
        ],
        drives: [
            { id: 'warp', description: 'Warp Drive' },
            { id: 'jump', description: 'Jump Drive' },
        ]
    }
}
