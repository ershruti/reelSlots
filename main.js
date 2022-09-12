//Dummy JSON responses
let data = [

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [2, 5, 2, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [5, 5, 5, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [0, 3, 1, 4]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [5, 4, 1, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 2,
                "symbolIDs": [1, 1, 5, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 4,
                "symbolIDs": [2, 2, 2, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 4,
                "symbolIDs": [5, 5, 2, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 3,
                "symbolIDs": [2, 2, 3, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [4, 5, 3, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [5, 5, 5, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 9,
                "symbolIDs": [3, 3, 3, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 6,
                "symbolIDs": [4, 4, 4, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 1,
                "symbolIDs": [0, 0, 3, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 5,
                "symbolIDs": [1, 1, 1, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [2, 5, 2, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 5,
                "symbolIDs": [2, 2, 2, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [4, 3, 0, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 6,
                "symbolIDs": [3, 3, 3, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [2, 2, 2, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [0, 1, 5, 4]
            }
        }
    }
]

let config  = {width: 1920, height: 1080}
let app
let bettingAmount = 10;
let depositAmount = 10000 - bettingAmount;
let betBG;
const depositBG = new PIXI.Graphics();

window.addEventListener('load', function() {
    //Create a Pixi Application
    app = new PIXI.Application(config);
    document.body.appendChild(app.view);

    app.loader
    .add('Cherry', 'assets/symbols/symbol_00.json')
    .add('Lemon', 'assets/symbols/symbol_01.json')
    .add('Orange', 'assets/symbols/symbol_02.json')
    .add('Plum', 'assets/symbols/symbol_03.json')
    .add('Grape', 'assets/symbols/symbol_04.json')
    .add('WaterMelon', 'assets/symbols/symbol_05.json')
    .load(onAssetsLoaded);
    
    app.ticker.add((delta) => {
        const now = Date.now();
        const remove = [];
        for (let i = 0; i < tweening.length; i++) {
            const t = tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);
    
            t.object[t.property] = spinBtn(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.propxerty] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            tweening.splice(tweening.indexOf(remove[i]), 1);
        }
    });
})

let pointerIsDown = false;
let pointerIsOver = false;
const normal = 0xffffff;
const over = 0x00ff00;
const down = 0xffff00;
let betData = [];
let currentBetIndex = 0;
let increasedBet = 0;

let Cherry = null;
let Lemon = null;
let Orange = null;
let Plum = null;
let Grape = null;
let WaterMelon = null;

const REEL_WIDTH = 385;
let SYMBOL_SIZE = 200;

function onAssetsLoaded(loader, res) {
    //cherry symbol
    Cherry = new PIXI.spine.Spine(res.Cherry.spineData);
    Cherry.skeleton.setToSetupPose();

    //lemon symbol
    Lemon = new PIXI.spine.Spine(res.Lemon.spineData);
    Lemon.skeleton.setToSetupPose();

    //orange symbol
    Orange = new PIXI.spine.Spine(res.Orange.spineData);
    Orange.skeleton.setToSetupPose();

    //plum symbol
    Plum = new PIXI.spine.Spine(res.Plum.spineData);
    Plum.skeleton.setToSetupPose();

    //grapes symbol
    Grape = new PIXI.spine.Spine(res.Grape.spineData);
    Grape.skeleton.setToSetupPose();

    //watermelon symbol
    WaterMelon = new PIXI.spine.Spine(res.WaterMelon.spineData);
    WaterMelon.skeleton.setToSetupPose();

    // Create different slot symbols.
    const slotTextures = [
        Cherry,
        Lemon,
        Orange,
        Plum,
        Grape,
        WaterMelon,
    ];
  
    // Build the reels
    const reels = [];
    const reelContainer = new PIXI.Container();
    for (let i = 0; i < 5; i++) {
        const rc = new PIXI.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        const reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter(),
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        // Build the symbols
        for (let j = 0; j < 4; j++) {
            const symbol = slotTextures[Math.floor(Math.random() * slotTextures.length)];
            //const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            // Scale the symbol to fit symbol area.
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);

            const localRect = symbol.getLocalBounds();
            symbol.position.set(385, 230);
        }
        reels.push(reel);
    }
    app.stage.addChild(reelContainer);

    // Build top & bottom covers and position reelContainer
    const margin = 150;
    reelContainer.y = 50;
    reelContainer.x = 50;
    const top = new PIXI.Graphics();
    top.beginFill(0x28231d);
    top.drawRect(0, 0, app.screen.width, margin);
    const bottom = new PIXI.Graphics();
    bottom.beginFill(0x28231d);
    bottom.drawRect(0, 930, app.screen.width, margin);

    // Add play text
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', 'green'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        wordWrap: true,
        wordWrapWidth: 440,
    });

    //creating SPIN button graphics
    const spinGraphics = new PIXI.Graphics();
    spinGraphics.lineStyle(0); 
    spinGraphics.beginFill(0xDE3249, 1);
    spinGraphics.drawCircle(100, 310, 75);
    spinGraphics.endFill();
    spinGraphics.x = Math.round((app.screen.width - spinGraphics.width) / 2);
    spinGraphics.y = Math.round((app.screen.height) / 2) + 150;
    bottom.addChild(spinGraphics);

    //SPIN text
    const spinBtnTxt = new PIXI.Text('Spin', style);
    spinBtnTxt.x = Math.round((app.screen.width - spinBtnTxt.width) / 2) + 25;
    spinBtnTxt.y = Math.round((app.screen.height) / 2) + 435;
    bottom.addChild(spinBtnTxt);   

    // Add header text
    const headerText = new PIXI.Text('Juicy Reels!', style);
    headerText.x = Math.round((app.screen.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    top.addChild(headerText);

    app.stage.addChild(top);
    
    app.stage.addChild(bottom);
    bet(); //bet values method
    deposit(); //deposit values method
    // Set the interactivity.
    bottom.interactive = true;
    bottom.buttonMode = true;
    bottom.addListener('pointerdown', () => {
        reelSpinStart();
    });

    app.ticker.add(() => {
    // update the spine animation, only needed if dragon.autoupdate is set to false
    Cherry.update(40); // HARDCODED FRAMERATE!
    Cherry.autoUpdate = false;
    Lemon.update(40); // HARDCODED FRAMERATE!
    Lemon.autoUpdate = false;
    Orange.update(40); // HARDCODED FRAMERATE!
    Orange.autoUpdate = false;
    Plum.update(40); // HARDCODED FRAMERATE!
    Plum.autoUpdate = false;
    Grape.update(40); // HARDCODED FRAMERATE!
    Grape.autoUpdate = false;
    WaterMelon.update(40); // HARDCODED FRAMERATE!
    WaterMelon.autoUpdate = false;
});
    
    let running = false;

    //method to start reel spinning
    function reelSpinStart() {
        if (running) return;
        running = true;

        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 3000 + i * 500 + extra * 500;
            tweenTo(r, 'position', target, time, spinStop(0.5), null, i === reels.length - 1 ? reelsComplete : null);
        }
    }

    // Reels done handler.
    function reelsComplete() {
        running = false;
        const dataJSON = JSON.stringify(data);
        const resData = JSON.parse(dataJSON);
        const randomWin = resData[Math.floor(Math.random() * resData.length)];
        let winningAmount = parseInt(randomWin.response.results.win);
        alert('Hooray!!! you won $'+winningAmount);      
        depositAmount = depositAmount + winningAmount;
        bettingAmount = 10;
        app.stage.removeChild(betBG);
        app.stage.removeChild(depositBG);
        bet();
        deposit();
    }

    // Listen for animate update.
    app.ticker.add((delta) => {
    // Update the slots.
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also. Now blur depends on frame rate.
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Update symbol positions on reel.
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    // Detect going over and swap a texture.
                    // This should in proper product be determined from some logical reel.
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }
    });
}

const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}
// Listen for animate update.
function spinBtn(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

function spinStop(amount) {
    return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}

function bet(){ 
    let styleBet = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff'], 
        stroke: '#4a1850',
        strokeThickness: 2
    });

    betBG = new PIXI.Graphics();
    betBG.beginFill(0x28231d, 1);
    betBG.drawRect(0, 0, 0, 0);

    //creating BET button graphics
    let betGraphics = new PIXI.Graphics();
    betGraphics.beginFill(0xDE3249);
    betGraphics.drawRect(10, 10, 230, 50);
    betGraphics.endFill();
    betGraphics.x = Math.round((betGraphics.width)) + 100;
    betGraphics.y = 51;
    betBG.addChild(betGraphics);
    
    //BET text 
    let betBtnTxt = new PIXI.Text('BET');
    betBtnTxt.x = Math.round((betBtnTxt.width)) + 353;
    betBtnTxt.y = 70;
    betBG.addChild(betBtnTxt);

    //let txtbetAmount = betAmount.toString(2);
    let betAmount = new PIXI.Text(bettingAmount, styleBet); 
    betAmount.x = Math.round((betAmount.width)/2) + 450;
    betAmount.y = 71;
    betBG.addChild(betAmount);
    
    app.stage.addChild(betBG);    
    buttonPlus(); //plus button
    buttonMinus(); //minus button
}

//deposit amount method
function deposit(){    
    const styleDeposit = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff'], 
        stroke: '#4a1850',
        strokeThickness: 2
    });   
    
    depositBG.beginFill(0x28231d, 1);
    depositBG.drawRect(10, 10, 50, 80);

    const depositBtnGraphics = new PIXI.Graphics();
    depositBtnGraphics.beginFill(0xDE3249);
    depositBtnGraphics.drawRect(10, 10, 270, 50);
    depositBtnGraphics.endFill();
    depositBtnGraphics.x = Math.round((app.screen.width - depositBtnGraphics.width)) - 250;
    depositBtnGraphics.y = 50;
    depositBG.addChild(depositBtnGraphics);

    const depositBtnTxt = new PIXI.Text('DEPOSIT');
    depositBtnTxt.x = Math.round((app.screen.width - depositBtnTxt.width)) - 260;
    depositBtnTxt.y = 70;
    depositBG.addChild(depositBtnTxt);

    const depoAmount = new PIXI.Text(depositAmount, styleDeposit);  
    depoAmount.x = Math.round((app.screen.width - depoAmount.width)) - 405;
    depoAmount.y = 65;
    depositBG.addChild(depoAmount);

    app.stage.addChild(depositBG);
}

//plus button for increasing bets
function buttonPlus(){  
    //betAmount   
    currentBetIndex = increasedBet++;
    if(currentBetIndex === -1){
        currentBetIndex = 0;
    }
    let plusSign = new PIXI.Graphics();    
    plusSign.beginFill(normal);
    plusSign.drawRect(510, 61, 50, 50);
    plusSign.endFill();
    plusSign.interactive = true;
    plusSign.buttonMode = true;
    plusSign.on("pointerup", doPointerUp);
    plusSign.on("pointerdown", onPlusPressed);
    plusSign.on("pointerover", doPointerOver);
    plusSign.on("pointerout", setPlusBtnStatus);
    plusSign.on("pointerupoutside", doPointerUpOutside);
    app.stage.addChild(plusSign);

    //increase bet sign
    let increaseBetTxt = new PIXI.Text('>');
    increaseBetTxt.x = 528;
    increaseBetTxt.y = 70;
    app.stage.addChild(increaseBetTxt);
}

function doPointerUp(){
    if(pointerIsOver){
        this.tint = over;
    }else{
        this.tint = normal;
    }    
    pointerIsDown = false;

}
function onPlusPressed(){
    console.log('onPlusPressed');
    
    this.tint = down;
    pointerIsDown = true;
    if(parseInt(bettingAmount) < parseInt(depositAmount))
    {
        bettingAmount = bettingAmount + 10;
        depositAmount = depositAmount - 10;
        app.stage.removeChild(betBG);
        app.stage.removeChild(depositBG);
        bet();
        deposit();
    }
    //increase the bet and update the value of bet data array
    if(currentBetIndex < betData.length-1){
        currentBetIndex++;
        betData[this.currentBetIndex];
    }
    setPlusBtnStatus();
}
function doPointerOver(){
    if(!pointerIsOver){
        this.tint = over;
        pointerIsOver = true;
    }    
}
function setPlusBtnStatus(){
    if(!pointerIsDown){
        this.tint = normal;
        pointerIsOver = false;
    }    
}
function doPointerUpOutside(){   
        this.tint = normal;
        pointerIsOver = false;
        pointerIsDown = false;
}

//minus button for decreasing bets
function buttonMinus(){      
    betData = [];
    betData = 33;       
    let minusSign = new PIXI.Graphics();
    minusSign.beginFill(normal);
    minusSign.drawRect(350, 61, 50, 50);
    minusSign.endFill();
    minusSign.interactive = true;
    minusSign.buttonMode = true;
    minusSign.on("pointerup", doPointerMinusUp);
    minusSign.on("pointerdown", onMinusPressed);
    minusSign.on("pointerover", doPointerMinusOver);
    minusSign.on("pointerout", setMinusBtnStatus);
    minusSign.on("pointerupoutside", doPointerMinusUpOutside);
    app.stage.addChild(minusSign);

    //decrease bet sign
    let decreaseBetTxt = new PIXI.Text('<');
    decreaseBetTxt.x = 367;
    decreaseBetTxt.y = 70;
    app.stage.addChild(decreaseBetTxt);
}

function doPointerMinusUp(){
    if(pointerIsOver){
        this.tint = over;
    }else{
        this.tint = normal;
    }    
    pointerIsDown = false;
}
function onMinusPressed(){

    if(parseInt(bettingAmount) > 10)
    {
        bettingAmount = bettingAmount - 10;
        depositAmount = depositAmount + 10;
        app.stage.removeChild(betBG);
        app.stage.removeChild(depositBG);
        bet();
        deposit();
    }

    this.tint = down;
    pointerIsDown = true;
    if(currentBetIndex > 0){
        currentBetIndex--;
        betData[currentBetIndex];
    }
    setMinusBtnStatus();
}
function doPointerMinusOver(){
    if(!pointerIsOver){
        this.tint = over;
        pointerIsOver = true;
    }    
}
function setMinusBtnStatus(){
    if(!pointerIsDown){
        this.tint = normal;
        pointerIsOver = false;
    }    
}
function doPointerMinusUpOutside(){   
        this.tint = normal;
        pointerIsOver = false;
        pointerIsDown = false;
}

