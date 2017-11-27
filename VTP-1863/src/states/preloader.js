import * as CrossBlast from '../const/cross-blast';
 import * as Util from '../utils/util';

 class Preloader extends Phaser.State {

     constructor() {
         super();
         this.asset = null;
     }

     preload() {
         //setup loading bar
         // this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
         // this.load.setPreloadSprite(this.asset);

         //Setup loading and its events
         this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
         this.loadResources();
     }

     update() {}

     loadResources() {

         this.atlasData = {
             'cross-blast': CrossBlast.default
         };

         this.game.load.spritesheet('tiles', PiecSettings.assetsDir + 'icons.png', PiecSettings.iconsFrameWidth, PiecSettings.iconsFrameWidth);

         this.game.load.image('energy-stripe', PiecSettings.assetsDir + 'energy-stripe.png');

         if (PiecSettings.destroyAnimation) {
             this.game.load.spritesheet(
                 PiecSettings.destroyAnimation.name,
                 PiecSettings.assetsDir + PiecSettings.destroyAnimation.img,
                 PiecSettings.destroyAnimation.frameWidth,
                 PiecSettings.destroyAnimation.frameHeight,
                 PiecSettings.destroyAnimation.frames);
         }

         if (PiecSettings.combineAnimation) {
             this.game.load.spritesheet(
                 PiecSettings.combineAnimation.name,
                 PiecSettings.assetsDir + PiecSettings.combineAnimation.img,
                 PiecSettings.combineAnimation.frameWidth,
                 PiecSettings.combineAnimation.frameHeight,
                 PiecSettings.combineAnimation.frames);
         }

         if (PiecSettings.selfAnimation) {
             this.game.load.spritesheet(
                 PiecSettings.selfAnimation.name,
                 PiecSettings.assetsDir + PiecSettings.selfAnimation.img,
                 PiecSettings.selfAnimation.frameWidth,
                 PiecSettings.selfAnimation.frameHeight,
                 PiecSettings.selfAnimation.frames);
         }

         if (PiecSettings.enemyAnimation) {
             this.game.load.spritesheet(
                 PiecSettings.enemyAnimation.name,
                 PiecSettings.assetsDir + PiecSettings.enemyAnimation.img,
                 PiecSettings.enemyAnimation.frameWidth,
                 PiecSettings.enemyAnimation.frameHeight,
                 PiecSettings.enemyAnimation.frames);
         }

         PiecSettings.animations = PiecSettings.animations || [];

         PiecSettings.animations.forEach(function(a) {

             if (a.atlas === true) {

                 this.game.load.atlas(
                     a.name,
                     PiecSettings.assetsDir + a.img,
                     null,
                     this.atlasData[a.name]);

             } else {

                 this.game.load.spritesheet(
                     a.name,
                     PiecSettings.assetsDir + a.img,
                     a.frameWidth,
                     a.frameHeight,
                     a.frames);
             }
         }, this);
     }

     onLoadComplete() {
         this.game.state.start('endcard');
     }
 }

 export default Preloader;
