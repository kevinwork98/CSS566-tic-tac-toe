import { GameEngine, BaseTypes, TwoVector, DynamicObject, SimplePhysicsEngine } from 'lance-gg';

// /////////////////////////////////////////////////////////
//
// GAME OBJECTS
//
// /////////////////////////////////////////////////////////
const PADDING = 5;
const WIDTH = 150;
const HEIGHT = 100;

class PlayerController extends DynamicObject {

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.score = 0;
    }

    static get netScheme() {
        return Object.assign({
            score : { type: BaseTypes.TYPES.INT16 }
        }, super.netScheme);
    }

    syncTo(other) {
        super.syncTo(other);
        this.score = other.score;
    }
}

// A paddle has a health attribute
class Square extends DynamicObject {

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.status = 0;
    }

    static get netScheme() {
        return Object.assign({
            status: { type: BaseTypes.TYPES.INT16 }
        }, super.netScheme);
    }

    syncTo(other) {
        super.syncTo(other);
        this.status = other.status;
    }
}

// /////////////////////////////////////////////////////////
//
// GAME ENGINE
//
// /////////////////////////////////////////////////////////
export default class Game extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });

        // common code
        this.on('postStep', this.gameLogic.bind(this));

        // server-only code
        this.on('server__init', this.serverSideInit.bind(this));
        this.on('server__playerJoined', this.serverSidePlayerJoined.bind(this));
        this.on('server__playerDisconnected', this.serverSidePlayerDisconnected.bind(this));

        // client-only code
        this.on('client__rendererReady', this.clientSideInit.bind(this));
        this.on('client__draw', this.clientSideDraw.bind(this));

        this.mouseX = null;
        this.mouseY = null;

        document.addEventListener("click", myFunction);
    }

    registerClasses(serializer) {
        serializer.registerClass(PlayerController);
        serializer.registerClass(Square);
    }

    /* 0 1 2
       3 4 5
       6 7 8 */
    gameLogic() {
        winner = 0
        let controllers = this.world.queryObjects({ instanceType: PlayerController });
        let squares = this.world.queryObjects({ instanceType: Square });
        if(squares[0].state == squares[1].state && squares[0].state == squares[2].state) {
            winner = squares[0] == 1 ? 2 : 1;
        }
        else if(squares[0].state == squares[3].state && squares[0].state == squares[6].state) {
            winner = squares[0] == 1 ? 2 : 1;
        }
        else if(squares[0].state == squares[4].state && squares[0].state == squares[8].state) {
            winner = squares[0] == 1 ? 2 : 1;
        }
        else if(squares[1].state == squares[4].state && squares[1].state == squares[7].state) {
            winner = squares[1] == 1 ? 2 : 1;
        }
        else if(squares[2].state == squares[4].state && squares[2].state == squares[6].state) {
            winner = squares[2] == 1 ? 2 : 1;
        }
        else if(squares[2].state == squares[5].state && squares[2].state == squares[8].state) {
            winner = squares[2] == 1 ? 2 : 1;
        }
        else if(squares[3].state == squares[4].state && squares[3].state == squares[5].state) {
            winner = squares[3] == 1 ? 2 : 1;
        }
        else if(squares[6].state == squares[6].state && squares[6].state == squares[8].state) {
            winner = squares[6] == 1 ? 2 : 1;
        }
        if (winner != 0) {
            console.log("Player " + winner + " has won!");
        }
    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);
        
        let squares = this.world.queryObjects({ instanceType: Square });
        // let playerController = this.world.queryObject({ playerId });
        // if (playerController) {
        //     if (!Number.isNaN(parseInt(inputData.input))) {
        //         squares[parseInt(inputData.input)].state = playerId;
        //     }
        // }
        if (!Number.isNaN(parseInt(inputData.input))) {
            squares[parseInt(inputData.input)].state = playerId;
        }
    }

    // /////////////////////////////////////////////////////////
    //
    // SERVER ONLY CODE
    //
    // /////////////////////////////////////////////////////////
    serverSideInit() {
        // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING, PADDING) }));
        // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + 5, PADDING) }));
        // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + WIDTH + 10, PADDING) }));
        // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING, PADDING + HEIGHT + 5) }));
        // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + 5, PADDING + HEIGHT + 5) }));
        // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + WIDTH + 10,  PADDING + HEIGHT + 5) }));
        // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING, PADDING + HEIGHT + HEIGHT + 10) }));
        // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + 5, PADDING + HEIGHT + HEIGHT + 10) }));
        // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + WIDTH + 10, PADDING + HEIGHT + HEIGHT + 10) }));
        this.addObjectToWorld(new PlayerController(this, null, { playerID: 0, position: new TwoVector(40, 40) }));
        this.addObjectToWorld(new PlayerController(this, null, { playerID: 0, position: new TwoVector(50, 50) }));
        this.addObjectToWorld(new Square(this, null, { position: new TwoVector(5, 5) }));
        this.addObjectToWorld(new Square(this, null, { position: new TwoVector(110, 5) }));
        this.addObjectToWorld(new Square(this, null, { position: new TwoVector(215, 5) }));
        this.addObjectToWorld(new Square(this, null, { position: new TwoVector(5, 110) }));
        this.addObjectToWorld(new Square(this, null, { position: new TwoVector(110, 110) }));
        this.addObjectToWorld(new Square(this, null, { position: new TwoVector(215, 110) }));
        this.addObjectToWorld(new Square(this, null, { position: new TwoVector(5, 215) }));
        this.addObjectToWorld(new Square(this, null, { position: new TwoVector(110, 215) }));
        this.addObjectToWorld(new Square(this, null, { position: new TwoVector(215, 215) }));
    }

    // attach newly connected player to next available paddle
    serverSidePlayerJoined(ev) {
        let controllers = this.world.queryObjects({ instanceType: PlayerController });
        if (controllers[0].playerId === 0) {
            controllers[0].playerId = ev.playerId;
        } else if (controllers[1].playerId === 0) {
            controllers[1].playerId = ev.playerId;
        }
    }

    serverSidePlayerDisconnected(ev) {
        let controllers = this.world.queryObjects({ instanceType: PlayerController });
        if (controllers[0].playerId === ev.playerId) {
            controllers[0].playerId = 0;
        } else if (controllers[1].playerId === ev.playerId) {
            controllers[1].playerId = 0;
        }
    }

    // /////////////////////////////////////////////////////////
    //
    // CLIENT ONLY CODE
    //
    // /////////////////////////////////////////////////////////
    clientSideInit() {
        document.getElementsByClassName('square1').addEventListener("click", changeState('square1'));
        document.getElementsByClassName('square2').addEventListener("click", changeState('square2'));
        document.getElementsByClassName('square3').addEventListener("click", changeState('square3'));
        document.getElementsByClassName('square4').addEventListener("click", changeState('square4'));
        document.getElementsByClassName('square5').addEventListener("click", changeState('square5'));
        document.getElementsByClassName('square6').addEventListener("click", changeState('square6'));
        document.getElementsByClassName('square7').addEventListener("click", changeState('square7'));
        document.getElementsByClassName('square8').addEventListener("click", changeState('square8'));
        document.getElementsByClassName('square9').addEventListener("click", changeState('square9'));
    }

    changeState(squareName) {
        // change state of square
    }

    clientSideDraw() {
        function updateSquare(el, obj) {
            var squareColor = {
                0: "white",
                1: "red",
                2: "blue"
            };
            let state = obj.state>0?obj.state:0;
            el.style.top = obj.position.y + 10 + "px";
            el.style.left = obj.position.x + "px";
            el.style.background = squareColor[state]
        }

        function updateController(el, obj) {
            el.style.top = obj.position.y + 10 + "px";
            el.style.left = obj.position.x + "px";
        }
    
        let squares = this.world.queryObjects({ instanceType: Square });
        let controllers = this.world.queryObjects({ instanceType: PlayerController });
        updateSquare(document.querySelector('.square1'), squares[0]);
        updateSquare(document.querySelector('.square2'), squares[1]);
        updateSquare(document.querySelector('.square3'), squares[2]);
        updateSquare(document.querySelector('.square4'), squares[3]);
        updateSquare(document.querySelector('.square5'), squares[4]);
        updateSquare(document.querySelector('.square6'), squares[5]);
        updateSquare(document.querySelector('.square7'), squares[6]);
        updateSquare(document.querySelector('.square8'), squares[7]);
        updateSquare(document.querySelector('.square9'), squares[8]);
        updateController(document.querySelector('.controller1'), controllers[0]);
        updateController(document.querySelector('.controller2'), controllers[1]);
    }
}
