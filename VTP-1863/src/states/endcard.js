 import Grid from '../prefabs/grid';
 import Lightning from '../prefabs/lightning';
 import * as SvgUtil from '../utils/svg-util';
 import * as TileUtil from '../utils/tile-util';

 class Endcard extends Phaser.State {

     constructor() {
         super();
     }

     create() {

         //this.game.time.advancedTiming = true;

         this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
         this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

         this.grid = new Grid(this.game, PiecSettings.grid);

         if (PiecSettings && PiecSettings.resizeContainers) {
             PiecSettings.resizeContainers(); // call out externally
         }

         this.game.time.events.add(200, function() {

             this.game.add.tween(this.grid).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
         }, this);

         if (PiecSettings.createBackGroundGrid === true) {

             this.createBackgroundSvg();
         }
        
         // var sprite1 = this.playAnimation(game, grid, PiecSettings.selfAnimation);
         // sprite1.animations.play(animation.name, animation.frameRate, loop, true); //false stops loop

         // var sprite2 = this.playAnimation(game, grid, PiecSettings.selfAnimation);
         // sprite2.animations.play(animation.name, animation.frameRate, loop, true); //false stops loop

         this.game.onCompleteLevel.add(this.onCompleteLevel, this);
         // this.game.onCreatedRewardTiles.add(this.onCreatedRewardTiles, this);
         this.game.onGameComplete.add(this.onGameComplete, this);
     }

     createBackgroundSvg() {

         var edges = SvgUtil.arrayToPolygonEdges(PiecSettings.fieldSize, PiecSettings.gridShape);

         var lines = SvgUtil.getLines(edges);

         document.getElementById('polygon').setAttribute('d', SvgUtil.linesToSvgPolygon(lines, PiecSettings.fieldSize));
     }

     onCompleteLevel() {

         this.grid.createRewardTiles();
     }

     onCreatedRewardTiles() {

         this.game.createdRewardTiles = true;

         // this.grid.explodeRewardTiles();
     }

     onGameComplete() {

         if (PiecSettings && PiecSettings.onGameComplete) {

            // this.game.add.tween(this.grid).to({ y: 2000 }, 3000, Phaser.Easing.Linear.None, true);

            this.game.time.events.add(500, function() {

                 this.game.add.tween(this.grid).to({ y: 2000 }, 1000, Phaser.Easing.Linear.None, true);
             }, this);
             PiecSettings.onGameComplete(); // call out externally
         }
     }

     resize() {

         this.grid.destroy();

         this.grid = new Grid(this.game, PiecSettings.grid);


         this.game.time.events.add(200, function() {

             this.game.add.tween(this.grid).to({ alpha: 1 }, 40, Phaser.Easing.Linear.None, true);
         }, this);

     }

     render() {
         // this.game.debug.text('FPS - ' + this.game.time.fps || '--', 2, 14, "#00ff00");
     }


 }

 export default Endcard;
