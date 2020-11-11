"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// /////////////////////////////////////////////////////////
//
// GAME OBJECTS
//
// /////////////////////////////////////////////////////////
var PADDING = 5;
var WIDTH = 150;
var HEIGHT = 100; // A paddle has a health attribute

var Square =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(Square, _DynamicObject);

  function Square(gameEngine, options, props) {
    var _this;

    _classCallCheck(this, Square);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Square).call(this, gameEngine, options, props));
    _this.status = 0;
    return _this;
  }

  _createClass(Square, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Square.prototype), "syncTo", this).call(this, other);

      this.status = other.status;
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        status: {
          type: _lanceGg.BaseTypes.TYPES.INT16
        }
      }, _get(_getPrototypeOf(Square), "netScheme", this));
    }
  }]);

  return Square;
}(_lanceGg.DynamicObject);

var PlayerController =
/*#__PURE__*/
function (_DynamicObject2) {
  _inherits(PlayerController, _DynamicObject2);

  function PlayerController(gameEngine, options, props) {
    var _this2;

    _classCallCheck(this, PlayerController);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(PlayerController).call(this, gameEngine, options, props));
    _this2.score = 0;
    return _this2;
  }

  _createClass(PlayerController, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(PlayerController.prototype), "syncTo", this).call(this, other);

      this.score = other.score;
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        score: {
          type: _lanceGg.BaseTypes.TYPES.INT16
        }
      }, _get(_getPrototypeOf(PlayerController), "netScheme", this));
    }
  }]);

  return PlayerController;
}(_lanceGg.DynamicObject); // /////////////////////////////////////////////////////////
//
// GAME ENGINE
//
// /////////////////////////////////////////////////////////


var Game =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(Game, _GameEngine);

  function Game(options) {
    var _this3;

    _classCallCheck(this, Game);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Game).call(this, options));
    _this3.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _assertThisInitialized(_this3)
    }); // common code

    _this3.on('postStep', _this3.gameLogic.bind(_assertThisInitialized(_this3))); // server-only code


    _this3.on('server__init', _this3.serverSideInit.bind(_assertThisInitialized(_this3)));

    _this3.on('server__playerJoined', _this3.serverSidePlayerJoined.bind(_assertThisInitialized(_this3)));

    _this3.on('server__playerDisconnected', _this3.serverSidePlayerDisconnected.bind(_assertThisInitialized(_this3))); // client-only code


    _this3.on('client__rendererReady', _this3.clientSideInit.bind(_assertThisInitialized(_this3)));

    _this3.on('client__draw', _this3.clientSideDraw.bind(_assertThisInitialized(_this3)));

    return _this3;
  }

  _createClass(Game, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(Square);
      serializer.registerClass(PlayerController);
    }
    /* 0 1 2
       3 4 5
       6 7 8 */

  }, {
    key: "gameLogic",
    value: function gameLogic() {// let squares = this.world.queryObjects({ instanceType: Square });
      // if(squares[0].state==1){
      //     // 0 1 2
      //     if(squares[0].state == squares[1].state && squares[1].state == squares[2].state){
      //         console.log("Player 1 wins");
      //     }
      //     // 0 3 6
      //     else if (squares[0].state == squares[3].state && squares[3].state == squares[6].state){
      //         console.log("Player 1 wins");
      //     }
      //     // 0 4 8
      //     else if (squares[0].state == squares[4].state && squares[4].state == squares[8].state){
      //         console.log("Player 1 wins");
      //     }
      // }
      // else if(squares[4].state==1){
      //     // 3 4 5
      //     if(squares[3].state==squares[4].state && squares[4].state==squares[5].state){
      //         console.log("Player 1 wins");
      //     }
      //     // 1 4 7
      //     else if (squares[1].state==squares[4].state && squares[4].state==squares[7].state){
      //         console.log("Player 1 wins");
      //     }
      //     // 6 4 2
      //     else if ((squares[6].state==squares[4].state && squares[4].state==squares[2].state)){
      //         console.log("Player 1 wins");
      //     }
      // }
      // else if(squares[8].state==1){
      //     // 6 7 8
      //     if(squares[6].state==squares[7].state && squares[7].state==squares[8].state){
      //         console.log("Player 1 wins");
      //     }
      //     // 2 5 8
      //     else if(squares[2].state==squares[5].state && squares[5].state==squares[8].state){
      //         console.log("Player 1 wins");
      //     }
      // }
      // else if(squares[0].state==2){
      //     // 0 1 2
      //     if(squares[0].state == squares[1].state && squares[1].state == squares[2].state){
      //         console.log("Player 2 wins");
      //     }
      //     // 0 3 6
      //     else if (squares[0].state == squares[3].state && squares[3].state == squares[6].state){
      //         console.log("Player 2 wins");
      //     }
      //     // 0 4 8
      //     else if (squares[0].state == squares[4].state && squares[4].state == squares[8].state){
      //         console.log("Player 2 wins");
      //     }
      // }
      // else if(squares[4].state==2){
      //     // 3 4 5
      //     if(squares[3].state==squares[4].state && squares[4].state==squares[5].state){
      //         console.log("Player 2 wins");
      //     }
      //     // 1 4 7
      //     else if (squares[1].state==squares[4].state && squares[4].state==squares[7].state){
      //         console.log("Player 2 wins");
      //     }
      //     // 6 4 2
      //     else if ((squares[6].state==squares[4].state && squares[4].state==squares[2].state)){
      //         console.log("Player 2 wins");
      //     }
      // }
      // else if(squares[8].state==2){
      //     // 6 7 8
      //     if(squares[6].state==squares[7].state && squares[7].state==squares[8].state){
      //         console.log("Player 2 wins");
      //     }
      //     // 2 5 8
      //     else if(squares[2].state==squares[5].state && squares[5].state==squares[8].state){
      //         console.log("Player 2 wins");
      //     }
      // }
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(Game.prototype), "processInput", this).call(this, inputData, playerId); // get the player paddle tied to the player socket


      var playerController = this.world.queryObject({
        playerId: playerId
      });

      if (playerController) {
        if (inputData.input === 'up') {
          playerController.position.y -= 5;
        } else if (inputData.input === 'down') {
          playerController.position.y += 5;
        }
      }
    } // /////////////////////////////////////////////////////////
    //
    // SERVER ONLY CODE
    //
    // /////////////////////////////////////////////////////////

  }, {
    key: "serverSideInit",
    value: function serverSideInit() {
      // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING, PADDING) }));
      // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + 5, PADDING) }));
      // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + WIDTH + 10, PADDING) }));
      // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING, PADDING + HEIGHT + 5) }));
      // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + 5, PADDING + HEIGHT + 5) }));
      // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + WIDTH + 10,  PADDING + HEIGHT + 5) }));
      // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING, PADDING + HEIGHT + HEIGHT + 10) }));
      // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + 5, PADDING + HEIGHT + HEIGHT + 10) }));
      // this.addObjectToWorld(new Square(this, null, { position: new TwoVector(PADDING + WIDTH + WIDTH + 10, PADDING + HEIGHT + HEIGHT + 10) }));
      this.addObjectToWorld(new Square(this, null, {
        position: new _lanceGg.TwoVector(WIDTH, 0)
      }));
      this.addObjectToWorld(new Square(this, null, {
        position: new _lanceGg.TwoVector(WIDTH - PADDING, 0)
      }));
      this.addObjectToWorld(new Square(this, null, {
        position: new _lanceGg.TwoVector(WIDTH, 0)
      }));
      this.addObjectToWorld(new Square(this, null, {
        position: new _lanceGg.TwoVector(WIDTH, 0)
      }));
      this.addObjectToWorld(new Square(this, null, {
        position: new _lanceGg.TwoVector(WIDTH, 0)
      }));
      this.addObjectToWorld(new Square(this, null, {
        position: new _lanceGg.TwoVector(WIDTH, 0)
      }));
      this.addObjectToWorld(new Square(this, null, {
        position: new _lanceGg.TwoVector(WIDTH, 0)
      }));
      this.addObjectToWorld(new Square(this, null, {
        position: new _lanceGg.TwoVector(WIDTH, 0)
      }));
      this.addObjectToWorld(new Square(this, null, {
        position: new _lanceGg.TwoVector(WIDTH, 0)
      }));
      this.addObjectToWorld(new PlayerController(this, null, {
        playerID: 0,
        position: new _lanceGg.TwoVector(WIDTH, 40)
      }));
      this.addObjectToWorld(new PlayerController(this, null, {
        playerID: 0,
        position: new _lanceGg.TwoVector(WIDTH, 50)
      }));
    } // attach newly connected player to next available paddle

  }, {
    key: "serverSidePlayerJoined",
    value: function serverSidePlayerJoined(ev) {
      var controllers = this.world.queryObjects({
        instanceType: PlayerController
      });

      if (controllers[0].playerId === 0) {
        controllers[0].playerId = ev.playerId;
      } else if (controllers[1].playerId === 0) {
        controllers[1].playerId = ev.playerId;
      }
    }
  }, {
    key: "serverSidePlayerDisconnected",
    value: function serverSidePlayerDisconnected(ev) {
      var controllers = this.world.queryObjects({
        instanceType: PlayerController
      });

      if (controllers[0].playerId === ev.playerId) {
        controllers[0].playerId = 0;
      } else if (controllers[1].playerId === ev.playerId) {
        controllers[1].playerId = 0;
      }
    } // /////////////////////////////////////////////////////////
    //
    // CLIENT ONLY CODE
    //
    // /////////////////////////////////////////////////////////

  }, {
    key: "clientSideInit",
    value: function clientSideInit() {
      this.controls = new _lanceGg.KeyboardControls(this.renderer.clientEngine);
      this.controls.bindKey('up', 'up', {
        repeat: true
      });
      this.controls.bindKey('down', 'down', {
        repeat: true
      }); // this.controls.bindKey('1', '0', { repeat: false } );
      // this.controls.bindKey('2', '1', { repeat: false } );
      // this.controls.bindKey('3', '2', { repeat: false } );
      // this.controls.bindKey('4', '3', { repeat: false } );
      // this.controls.bindKey('5', '4', { repeat: false } );
      // this.controls.bindKey('6', '5', { repeat: false } );
      // this.controls.bindKey('7', '6', { repeat: false } );
      // this.controls.bindKey('8', '7', { repeat: false } );
      // this.controls.bindKey('9', '8', { repeat: false } );
    }
  }, {
    key: "clientSideDraw",
    value: function clientSideDraw() {
      // function updateSquare(el, obj) {
      //     var squareColor = {
      //         0 : "white",
      //         1 : "red",
      //         2 : "blue"
      //     };
      //     let state = obj.state>0?obj.state:0;
      //     el.style.top = obj.position.y + 10 + "px";
      //     el.style.left = obj.position.x + "px";
      //     el.style.background = squareColor[state]
      // }
      // function updateController(el, obj) {
      //     el.style.top = obj.position.y + 10 + "px";
      //     el.style.left = obj.position.x + "px";
      // }
      // let squares = this.world.queryObjects({ instanceType: Square });
      // let controllers = this.world.queryObjects({ instanceType: PlayerController });
      // updateSquare(document.querySelector('.square1'), squares[0]);
      // updateSquare(document.querySelector('.square2'), squares[1]);
      // updateSquare(document.querySelector('.square3'), squares[2]);
      // updateSquare(document.querySelector('.square4'), squares[3]);
      // updateSquare(document.querySelector('.square5'), squares[4]);
      // updateSquare(document.querySelector('.square6'), squares[5]);
      // updateSquare(document.querySelector('.square7'), squares[6]);
      // updateSquare(document.querySelector('.square8'), squares[7]);
      // updateSquare(document.querySelector('.square9'), squares[8]);
      // updateController(document.querySelector('.controller1'), controllers[0]);
      // updateController(document.querySelector('.controller2'), controllers[1]);
      function updateEl(el, obj) {
        el.style.top = obj.position.y + 10 + "px";
        el.style.left = obj.position.x + "px";
      }

      var squares = this.world.queryObjects({
        instanceType: Square
      });
      var controllers = this.world.queryObject({
        instanceType: PlayerController
      });
      updateEl(document.querySelector('.square1'), squares[0]);
      updateEl(document.querySelector('.square2'), squares[1]);
      updateEl(document.querySelector('.square3'), squares[2]);
      updateEl(document.querySelector('.square4'), squares[3]);
      updateEl(document.querySelector('.square5'), squares[4]);
      updateEl(document.querySelector('.square6'), squares[5]);
      updateEl(document.querySelector('.square7'), squares[6]);
      updateEl(document.querySelector('.square8'), squares[7]);
      updateEl(document.querySelector('.square9'), squares[8]);
      updateEl(document.querySelector('.controller1'), controllers[0]);
      updateEl(document.querySelector('.controller2'), controllers[1]);
    }
  }]);

  return Game;
}(_lanceGg.GameEngine);

exports.default = Game;
//# sourceMappingURL=Game.js.map