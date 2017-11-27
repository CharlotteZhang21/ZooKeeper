import * as CustomTileEvents from '../utils/custom-tile-events';
import CustomBounce from '../utils/custom-bounce';
import * as Util from '../utils/util';

class Tile extends Phaser.Sprite {

    //initialization code in the constructor
    constructor(game, x, y, frame, tileSize) {

        super(
            game,
            x * tileSize + tileSize / 2,
            y * tileSize + tileSize / 2,
            'tiles',
            frame);

        this.anchor.setTo(0.5, 0.5);

        this.properties = {
            x: x,
            y: y,
            tileSize: tileSize,
            swipeMinDistance: 30,
            tileType: frame,
            color: PiecSettings.tiles[frame].color
        };

        this.inputEnabled = true;

        this.input.useHandCursor = true;

        this.events.onInputDown.add(this.onDown, this);

        if (PiecSettings.isSwipe === true) {
            this.events.onInputUp.add(this.onUp, this);
        }

        this.resize();
    }

    resize() {

        var newScale = this.properties.tileSize / this._frame.width;

        this.scale.x = newScale;
        this.scale.y = newScale;
    }

    explode(game, grid) {

        //remove repeating explosions
        grid.batchExplode = grid.batchExplode || [];

        Util.remove(grid.batchExplode, this);

        var isTileMissing = false;

        var delay = 0;

        var tileInfo = PiecSettings.tiles[this.properties.tileType];

        var explodeSeq = this.properties.explodeSeq;

        if (typeof this.properties.explodeSeq !== 'undefined') {

            if (explodeSeq > 0) {
                explodeSeq--;
            }

            delay = PiecSettings.staggerDestroyDelay * explodeSeq;
        }

        game.time.events.add(delay, function() {

            PiecSettings.gridShape.forEach(function(mt) {

                if (mt.x === this.properties.x && mt.y === this.properties.y) {
                    isTileMissing = true;
                }
            }, this);

            if (isTileMissing === false && this.properties.surpressExplodeAnimation !== true) {


                if (!tileInfo.explode) {

                    var anim = this.getAnimation(tileInfo.color + 'DestroyTile');
                    console.log(anim);

                    if (anim === null) {
                        anim = this.getAnimation('DestroyTile');
                    }

                    this.playAnimation(game, grid, anim, true);

                } else {

                    this.playAnimation(game, grid, this.getAnimation(tileInfo.animation));                    
                }

                CustomTileEvents.onTileDestroy(this, tileInfo);
            }

            if (isTileMissing === false) {


                // var x = this.properties.x;
                // var y = this.properties.y;


                this.destroy();

                // game.global.tiles[y][x] = null;
            }

        }, this);
    }

    getAnimation(name) {

        for (var i = 0; i < PiecSettings.animations.length; i++) {
            if (PiecSettings.animations[i].name === name) {
                return PiecSettings.animations[i];
            }
        }

        return null;
    }

    
    swapImg(frame) {

        var tileInfo = PiecSettings.tiles[frame];

        if (tileInfo.idleAnimation) {

            this.loadTexture(tileInfo.id, 0);

            this.animations.add('idle');

            this.animations.play('idle', 30, true);

        } else {

            this.frame = frame;
        }

        this.properties.tileType = frame;
    }

    combine(game, grid) {

        if (PiecSettings.combineAnimation) {

            var sprite = this.playAnimation(game, grid, PiecSettings.combineAnimation);

            game.add.tween(sprite).to({ angle: 270 }, 800, Phaser.Easing.Linear.None, true);
        }
    }

    playAnimation(game, grid, animation, rotateRandom, x, y) {

        if (!animation) {
            return;
        }

        var x = typeof x !== 'undefined' ? x : grid.x + this.x;
        var y = typeof y !== 'undefined' ? y : grid.y + this.y;

        var sprite = game.add.sprite(x, y, animation.name);

        sprite.height = this.height * animation.scale;
        sprite.width = this.width * animation.scale;

        sprite.anchor.set(0.5, 0.5);

        sprite.alpha = animation.alpha || 1;

        if (rotateRandom === true) {
            sprite.angle = Util.rndInt(360, 0);
        }

        var explode = sprite.animations.add(animation.name);

        var loop = animation.looped === true ? true : false;

        sprite.animations.play(animation.name, animation.frameRate, loop, true); //false stops loop

        if (animation.startFrame) {

            sprite.animations.currentAnim.setFrame(animation.startFrame, true);
        }

        return sprite;
    }

    onDown() {

        if (PiecSettings.isSwipe === true) {

            this.swipeCoord = {
                x: this.game.input.activePointer.position.x,
                y: this.game.input.activePointer.position.y
            };

            return;
        }

        this.parent.pickTile(this);
    }

    onUp() {


        if (this.game.input.activePointer.position.x < this.swipeCoord.x - this.properties.swipeMinDistance) {
            this.parent.swipeTile(this, 'left');
        } else if (this.game.input.activePointer.position.x > this.swipeCoord.x + this.properties.swipeMinDistance) {
            this.parent.swipeTile(this, 'right');
        } else if (this.game.input.activePointer.position.y < this.swipeCoord.y - this.properties.swipeMinDistance) {
            this.parent.swipeTile(this, 'up');
        } else if (this.game.input.activePointer.position.y > this.swipeCoord.y + this.properties.swipeMinDistance) {
            this.parent.swipeTile(this, 'down');
        }
    }

    fall(game, distance, tileSize) {

        var x = this.properties.x;
        var y = this.properties.y;

        if (x === null || y == null) {
            return;
        }

        this.properties.isFalling = true;

        game.global.fallingTiles++;

        var tween = game.add.tween(this);

        this.properties.x = null;
        this.properties.y = null;

        var yTo = (y + distance) * tileSize + tileSize / 2;

        this.properties.fallTo = y + distance;

        var cb = new CustomBounce({ strength: PiecSettings.TileBounceStrength });

        tween.to({
                y: yTo
            },
            Util.calcQuadTime(this.y - yTo) * PiecSettings.TileBounceStrength * PiecSettings.TileBounceScalar,
            function(k) {
                return cb.Bounce.Ease(k);
            },
            true);

        tween.onComplete.add(function() {

            // tile landed!
            // check props and then matches (if swipe)

            if (PiecSettings.tileSquash === true) {

                var yScale = this.scale.y * 0.9;

                var yTranslateScale = this.scale.y * 0.95;

                var currentHeight = this.scale.y * this.height;

                var squashedHeight = yTranslateScale * this.height;

                var yDelta = this.y + currentHeight - squashedHeight;

                var tween2 = game.add.tween(this.scale).to({ x: this.scale.x, y: yScale }, 110, "Linear", true, 0);

                var tween3 = game.add.tween(this).to({ y: yDelta }, 110, "Linear", true, 0);

                //  And this tells it to yoyo, i.e. fade back to zero again before repeating.
                //  The 3000 tells it to wait for 3 seconds before starting the fade back.
                tween2.yoyo(true, 0);
                tween3.yoyo(true, 0);
            }

            this.properties.isFalling = false;
            this.properties.x = x;
            this.properties.y = y + distance;

            if (PiecSettings.isSwipe === true) {

                game.state.states.endcard.grid.removeDupes(this);

                game.time.events.add(10, function() {

                    game.global.fallingTiles--;
                    game.state.states.endcard.grid.matchAllTiles(); // recursively
                }, this);

            } else {
                game.global.fallingTiles--;
                game.state.states.endcard.grid.onMoveComplete();
            }

            CustomTileEvents.onTileLand(this);

        }, this);


        if (game.global.tiles[y] &&
            game.global.tiles[y][x]) {

            game.global.tiles[y + distance][x] = game.global.tiles[y][x];
            game.global.tiles[y][x] = null;
        }

    }

    moveTo(game, x, y, duration, callback) {

        var tween = game.add.tween(this);

        tween.to({ x: x, y: y },
            duration,
            Phaser.Easing.Linear.None,
            true);

        tween.onComplete.add(callback, this);

    }

    wiggle() {

        var tween = this.game.add.tween(this);

        this.bringToTop();

        var angle = 15;

        tween.to({
                angle: [-1 * angle,
                    angle, -1 * angle,
                    angle, -1 * angle,
                    0
                ]
            },
            500,
            Phaser.Easing.Linear.None,
            true);

        tween.onComplete.add(function() {

            piec.unlockGame();

        }, this);
    }

    jiggle() {

        var tween = this.game.add.tween(this);

        this.bringToTop();

        var angle = 4;

        tween.to({
                angle: [-1 * angle,
                    angle, -1 * angle,
                    angle, -1 * angle,
                    0
                ]
            },
            500,
            Phaser.Easing.Linear.None,
            true).loop(true);
    }
}

export default Tile;
