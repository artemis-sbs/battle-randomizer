
(function(exports){

const contentSize = {width:1450, height: 810}
exports.App = class App {
    constructor() {
        this.labels = {
            difficulty: 'Difficulty',
            scenarios: 'Scenario',
            terrain: 'Terrain',
            lethalTerrain: 'Lethal Terrain',
            friendlyShips: 'Friendly Ships',
            anomalies: 'Anomalies',
            monsters: 'Monsters'
        }
        this.picking = false;
        this.difficulty = 0;
        this.props = {
            difficulty:  [1,2,3,4,5,6,7,8,9,10,11],
            scenarios: [
                {id: 'siege', description: 'Siege'},
                {id: 'single', description: 'Single Front'},
                {id: 'double', description: 'Double Front'},
                {id: 'deep', description: 'Deep Strike'}
                //{id: 'border', description: 'Border War'},   
                //{id: 'peace', description: 'Peacetime'}
                ],
            terrain: [
                {id: 'none', description: 'None'},
                {id: 'few', description: 'Few'},
                {id: 'some', description: 'Some'},
                {id: 'lots', description: 'Lots'},
                {id: 'many', description: 'Many'}
            ],
            lethalTerrain: [
                {id: 'none', description: 'None'},
                {id: 'few', description: 'Few'},
                {id: 'some', description: 'Some'},
                {id: 'lots', description: 'Lots'},
                {id: 'many', description: 'Many'}
            ],
            friendlyShips: [
                {id: 'none', description: 'None'},
                {id: 'few', description: 'Few'},
                {id: 'some', description: 'Some'},
                {id: 'lots', description: 'Lots'},
                {id: 'many', description: 'Many'}
            ],
            anomalies: [
                {id: 'none', description: 'None'},
                {id: 'few', description: 'Few'},
                {id: 'some', description: 'Some'},
                {id: 'lots', description: 'Lots'},
                {id: 'many', description: 'Many'}
            ],
            monsters: [
                {id: 'none', description: 'None'},
                {id: 'few', description: 'Few'},
                {id: 'some', description: 'Some'},
                {id: 'lots', description: 'Lots'},
                {id: 'many', description: 'Many'}
            ]
        }

                
        this.races = [
                {id: 'tsn', description: 'TSN', ships: [
                    {id: 'tsn-light', description: 'TSN Light Cruiser', src:"assets/TSN_Light_Cruiser_Pic.png"},
                    {id: 'tsn-scout', description: 'TSN Scout', src:"assets/TSN_Scout_Pic.png"},
                    {id: 'tsn-battleship', description: 'TSN Battleship', src:"assets/TSN_Battleship_Pic.png"},
                    {id: 'tsn-missle', description: 'TSN Missle Cruiser', src:"assets/TSN_Missile_Cruiser_Pic.png"},
                    {id: 'tsn-dreadnought', description: 'TSN Dreadnought', src:"assets/TSN_Dreadnought_Pic.png"},
                    {id: 'tsn-carrier', description: 'TSN Carrier', src:"assets/TSN_Medium_Carrier.png"},
                    {id: 'tsn-mine', description: 'TSN Mine Layer', src:"assets/TSN_Mine_Layer.png"},
                    {id: 'tsn-juggernaut', description: 'TSN Juggernaut', src:"assets/TSN_Juggernaut_Pic.png"}            
                ]},
                {id: 'ximni', description: 'Ximni', ships: [
                    {id: 'ximni-light', description: 'Ximni Light Cruiser', src:"assets/Ximni_Light_Cruiser.png"},
                    {id: 'ximni-scout', description: 'Ximni Scout', src:"assets/Ximni_Scout.png"},
                    {id: 'ximni-battleship', description: 'Ximni Battleship', src:"assets/Ximni_Battleship.png"},
                    {id: 'ximni-missle', description: 'Ximni Missle Cruiser', src:"assets/Ximni_Missile_Cruiser.png"},
                    {id: 'ximni-dreadnought', description: 'Ximini Dreadnought', src:"assets/Ximni_Dreadnought.png"},
                    {id: 'ximni-carrier', description: 'Ximni Carrier', src:"assets/Ximni_Carrier.png"}
                ]},
                , 
                {"id": "pirate", "description": "Pirate", "ships": [
                    {"id": "pirate-light", "description": "Pirate Strongbow Cruiser", "src":"assets/Pirate_Strongbow.png"},
                    {"id": "pirate-scout", "description": "Pirate Longbow Scout", "src":"assets/Pirate_Longbow.png"},
                    {"id": "prate-carrier", "description": "Pirate Brigantine Carrier", "src":"assets/Pirate_Brigantine.png"}
                ]}     
            ]
        
  
        this.drives = [
            {id: 'warp', description: 'Warp Drive'},
            {id: 'jump', description: 'Jump Drive'},
        ]
      //  this.propKeys = ['difficulty', 'scenario', 'terrain', 'lethalTerrain', 'friendlyShips', 'anomalies', 'monsters'];
        
        this.layout = {

        } 
        this.createLayout();

      
    }
   

    testPick() {
        var overall = {
        }
        let keys = Object.keys(this.props);
        for (let key of keys){
            overall[key] = {min:99, max:0};
        }

        for(var i=0;i<100000; i++) {
            let pick = this.pick();
            keys.forEach((key)=>{
                overall[key].min = Math.min(overall[key].min, pick[key])
                overall[key].max = Math.max(overall[key].max, pick[key])
            })        
        }
        keys.forEach((key)=>{
            console.log( `${key}: ${overall[key].min} - ${overall[key].max}` )
        })     
    }


    pick () {
        let race = this.psuedoRandom(0,this.races.length-1);
        let drive = this.psuedoRandom(0,this.drives.length-1);
        let ship = 
            this.races[race].ships[this.psuedoRandom(0, this.races[race].ships.length-1)] 
   
        let props = this.props;

        return {
            difficulty: this.gaussianRandom(0,props.difficulty.length-1),
            scenarios: this.psuedoRandom(0, props.scenarios.length-1),
            terrain: this.psuedoRandom(0, props.terrain.length-1),
            lethalTerrain: this.psuedoRandom(0, props.lethalTerrain.length-1),
            friendlyShips: this.psuedoRandom(0, props.friendlyShips.length-1),
            anomalies: this.psuedoRandom(0, props.anomalies.length-1),
            monsters: this.psuedoRandom(0, props.monsters.length-1),
            race: race,
            drive: drive,
            ship: ship
        }
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

    createSplashScreen() {
        // Spalsh Screen
        let title = new createjs.Text("Artemis: Battle Randomizer", "70px Arial", "#ff7700");
        title.x = 0;
        title.y = 50;
        this.splash.addChild(title);

        var txt = new createjs.Text("", "24px Arial", "#ff7700");
        txt.text = 
`
To set the min and max difficulty reload page using a query string.
For example: https://randomizer-2b7d4.firebaseapp.com/index.html?min=4&max=9
`;
		txt.lineWidth = 850;
		txt.lineHeight = 30;
		txt.textBaseline = "top";
		txt.textAlign = "left";
		txt.y = 250;
		txt.x = (1024 - txt.lineWidth) / 2;
		this.splash.addChild(txt);

        this.loading = new createjs.Text("Loading...", "30px Arial", "#ff7700");
        this.loading.y =700
        this.loading.x = (1450 - this.loading.getBounds().width) / 2;
        this.splash.addChild(title);
        this.splash.addChild(this.loading);
        
    }

    createLayout() {

        this.stage = new createjs.Stage("slot");
        this.container = new createjs.Container();
        this.getReady = new createjs.Container();
        this.splash = new createjs.Container();
        this.holder = new createjs.Container();


        this.getReady.visible = false;
        this.container.visible = false;

        this.getReadyText = new createjs.Text("Set your settings to...", "70px Arial", "#ff7700");
        this.createSplashScreen();
        
       // this.getReadyText.y = 450
      //  this.getReadyText.x = 50

        this.getReady.addChild(this.getReadyText)
        this.background = new createjs.Bitmap();
        this.background.scaleX = 1.5
        this.background.scaleY = 1.5
        //this.background.alpha = 0.5

        

        this.logo = new createjs.Bitmap();
        this.logo.x = 60
        this.logo.y = 550
        this.logo.scaleX = 0.5
        this.logo.scaleY = 0.5


        this.holder.addChild(this.container, this.getReady, this.splash);
        this.stage.addChild(this.background, this.holder);
        
        //Create a Shape DisplayObject.
        this.shipBitmap = new createjs.Bitmap();
        this.shipBitmap.x = 50;
        this.shipBitmap.y = -25;
       // this.shipCycle = 0;
        //this.stage.addChild(this.shipBitmap);
        //Update stage will render next frame
        
        this.shipTypeText = new createjs.Text("TSN Missile Cruiser", "50px Arial", "#ff7700");
        this.shipTypeText.y = 430;
        this.shipTypeText.x = 25;
        //this.stage.addChild(this.shipTypeText); 

        this.shipDrive = new createjs.Text("Drive", "50px Arial", "#ff7700");
        this.shipDrive.y = 480;
        this.shipDrive.x = 25;
        //this.container.addChild(this.shipDrive); 
        
        this.container.addChild(this.logo, this.shipBitmap, this.shipTypeText, this.shipDrive)
        
        let xLabel =  700
        let xValue = 1050
        let y = 25

        for (let key of Object.keys(this.props)) {
            this.layout[key] = {} 
            let item = this.layout[key];
            
            item.label = new createjs.Text(this.labels[key], "40px Arial", "#ff7700");
            item.value = new createjs.Text("012345678901", "40px Arial", "#ff7700");
            item.label.x = xLabel
            item.label.y = y
            item.value.x = xValue
            item.value.y = y
            y += 100
            this.container.addChild(item.label)
            this.container.addChild(item.value)

        }
       

        this.stage.canvas.addEventListener('click', (evt)=> {this.onClick(evt)})
        window.addEventListener('keydown' , (e) => {
            if ([82,71,66,32].includes(e.keyCode)) {
                return this.onClick();
            }
        }, true)
        createjs.Ticker.addEventListener("tick", ()=> {this.handleTick()});
        this.resize()
    }
    getParams (query)  {
        if (!query) {
            query = window.location.search;
        }

        return (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
            let [ key, value ] = param.split('=');
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
            }, { });
    }

    getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
        };
        xhr.send();
    };

    loadAssets () {
        window.addEventListener('resize', (resize)=> {this.resize()}, false);
        this.resize();
        this.getJSON('config.json', (err, data) => {
            if (data && data.difficulty ) {
                this.props.difficulty = data.difficulty;
            }
            if (data && data.races ) {
                this.races = data.races;
            }
            let params = this.getParams();
            if (params.min || params.max) {
                params.min = Number(params.min);
                params.max = Number(params.max);
                if (!params.min ) params.min = 1;
                
                if (!params.max) params.max = 11;
                if (params.min < 1) params.min = 1;
                if (params.max > 11) params.max = 11;
                
                this.props.difficulty = [];
                for (let x = params.min; x < params.max+1; x++) { //params.min; x < params.max; x++ ) {
                    this.props.difficulty.push(x);
                }
                
            }
            console.log(data);
            var queue = new createjs.LoadQueue();
            queue.installPlugin(createjs.Sound);
            queue.on("complete", (evt)=> {this.handleComplete(evt)});
            
            
            let manifest = [
                {id: "tsn-light", src:"assets/TSN_Light_Cruiser_Pic.png"},
                {id: "tsn-scout", src:"assets/TSN_Scout_Pic.png"},
                {id: "tsn-battleship", src:"assets/TSN_Battleship_Pic.png"},
                {id: "tsn-missle", src:"assets/TSN_Missile_Cruiser_Pic.png"},
                {id: "tsn-dreadnought", src:"assets/TSN_Dreadnought_Pic.png"},
                {id: "tsn-carrier", src:"assets/TSN_Medium_Carrier.png"},
                {id: "tsn-mine", src:"assets/TSN_Mine_Layer.png"},
                {id: "tsn-juggernaut", src:"assets/TSN_Juggernaut_Pic.png"},
                {id: "ximni-light", src:"assets/Ximni_Light_Cruiser.png"},
                {id: "ximni-scout", src:"assets/Ximni_Scout.png"},
                {id: "ximni-battleship", src:"assets/Ximni_Battleship.png"},
                {id: "ximni-missle", src:"assets/Ximni_Missile_Cruiser.png"},
                {id: "ximni-dreadnought", src:"assets/Ximni_Dreadnought.png"},
                {id: "ximni-carrier", src:"assets/Ximni_Carrier.png"},

                {id: "logo", src:'assets/artemis-logo.png'},
                {id: "background", src:'assets/background.png'},
                {id: 'picked', src: 'assets/sounds/picked.mp3'},
                {id: 'pick-done', src: 'assets/sounds/pick-done.mp3'},  
                {id: 'sound', src: 'assets/sounds/pyl-board2.mp3'}
            
            ];


            for (let race  of this.races) {
                for (let ship of race.ships) {
                manifest.push({id: ship.id, src:ship.src});
                }
            }
            queue.loadManifest(manifest);
  
        })

          }
    handleComplete(evt) {
        for (let race  of this.races) {
            for (let ship of race.ships) {
                let image = evt.target.getResult(ship.id);
            
                ship.image = image;
            }
        }
        
        this.logo.image = evt.target.getResult('logo');
        this.background.image = evt.target.getResult('background');

        
        this.backgroundSound = createjs.Sound.play("sound", {loop: -1});
        this.backgroundSound.paused = true;
        this.loading.text = "Click to continue...";
        this.loading.alpha = 1.0;
         
        this.resize(); 
         
    }
    handleTick() {
        if (this.picking) {
            let pick = this.pick();

            let ship = pick.ship;
            
          //  this.shipCycle += 1;
          //  this.shipCycle %= this.tsnShips.length;
            this.shipBitmap.image = ship.image;
            this.shipTypeText.text = ship.description;
            this.shipDrive.text = this.drives[pick.drive].description

            for(let key of Object.keys(this.props) ) {
                if (key !== 'difficulty'){
                    this.layout[key].value.text = this.props[key][pick[key]].description
                } else {
                    this.layout[key].value.text = this.props[key][pick[key]]
                }
            }
            this.stage.update();
        } else if (!this.loaded) {
            this.loading.alpha -= 0.1;
            this.loaded = true;
            if (this.loading.alpha < 0.3) {
                this.loading.alpha = 1.0;
            }
            this.stage.update();
        }
    }

    onClick(evt) {
        if (!this.loaded) {
            return false;
        } else if (!this.started) {
            this.started = true;
            this.container.visible = true;
            this.getReady.visible=false

            this.splash.visible = false;
            this.backgroundSound.paused = false;
            this.picking = true;
            this.resize()
            
            return false;
        } 
        if (this.pickSound) {
            this.pickSound.stop();
            this.container.visible = true
            this.getReady.visible=false
        }
        this.picking = !this.picking;
        this.backgroundSound.paused = !this.picking;
        if (!this.picking) {
            
            this.pickSound = createjs.Sound.play("picked");
            this.container.visible = false;
            this.getReady.visible = true
            this.resize()
            this.pickSound.on("complete", () => {
                this.container.visible = true;
                this.getReady.visible = false
                createjs.Sound.play("pick-done");
                this.resize()
            })
        } 
        return false;
    }

    resize() {
        let w = 640; // window.innerWidth;
        let h = 480; // window.innerHeight;

        this.stage.canvas.width = w;
        this.stage.canvas.height = h;
        let windowRatio = w/h;
        let content = contentSize
        let ratio = content.width / content.height;
        let scale = w/content.width;
        if (windowRatio >= ratio) {
            scale = h/content.height;
        }
        this.holder.scaleX = 1;
        this.holder.scaleY = 1;
        this.holder.x = w - (content.width/2)
        this.holder.y = h - (content.width /2)
        this.holder.scaleX = scale;
        this.holder.scaleY = scale;
        this.holder.x = (w - this.holder.getBounds().width * scale) / 2;
        this.holder.y = (h - this.holder.getBounds().height * scale) / 2;
        this.stage.update();
    }
}

})(typeof exports === 'undefined'? this['App']={}: exports);

var r = new App.App()
//r.printPick()
r.loadAssets();

/*
Difficulty
1-11.  Note - 11 should probably be rare.  Maybe a bell curve random with 4-8 weighted higher?  Maybe a minimum level?  Doesn't matter for roulette?

Scenario
Siege, Single Front, Double Front, Deep Strike, Peacetime, Border War.  Note - I don't think we'll want Peacetime, and I dunno about Border War.

Terrain
None, Few, Some, Lots, Many

Lethal Terrain
None, Few, Some, Lots, Many

Friendly Ships
None, Few, Some, Lots, Many

Monsters
None, Few, Some, Lots, Many

Anomalies
None, Few, Some, Lots, Many

Time Limit
Algorithmically determined, in whole minute increments.

Other Settings
Network Speed, enemy shield strength, player beam damage etc - probably force all to 100% standard, no random.

Player Race
TSN, Ximni

TSN:
Light Cruiser, Scout, Battleship, Missile Cruiser, Dreadnought*, Carrier*, Mine Layer, Juggernaut*

Ximni:
Light Cruiser, Scout, Missile Cruiser, Battleship, Carrier*, Dreadnought*

* - has fighter capability, don't know if that should be considered.

Also, I don't know if it should be divided equally between races or total ships - thoughts?

Drive
Warp Drive, Jump Drive.  Note - Ximni has special Jump Drive abilities, TSN not so.  Don't know if that matters on the roulette.

*/
