

export class BattleModel {
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
        let race = this.psuedoRandom(0, BattleModel.races.length - 1);
        let drive = this.psuedoRandom(0, BattleModel.drives.length - 1);
        let ship =
            BattleModel.races[race].ships[this.psuedoRandom(0, BattleModel.races[race].ships.length - 1)]

        let props = BattleModel.props;

        return {
            settings: {
                difficulty: this.gaussianRandom(0, props.difficulty.length - 1),
                scenarios: this.psuedoRandom(0, props.scenarios.length - 1),
                terrain: this.psuedoRandom(0, props.terrain.length - 1),
                lethalTerrain: this.psuedoRandom(0, props.lethalTerrain.length - 1),
                friendlyShips: this.psuedoRandom(0, props.friendlyShips.length - 1),
                anomalies: this.psuedoRandom(0, props.anomalies.length - 1),
                monsters: this.psuedoRandom(0, props.monsters.length - 1)
            },
            race: race,
            drive: drive,
            ship: ship
        }
    }
    static props = {
        difficulty: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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
        ]
    }
    static races = [
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
    ]


    static drives = [
        { id: 'warp', description: 'Warp Drive' },
        { id: 'jump', description: 'Jump Drive' },
    ]
}
