import Explosions from '../prefabs/explosions';
import Tile from '../prefabs/tile';
import * as CustomTileEvents from '../utils/custom-tile-events';
import * as TileUtil from '../utils/tile-util';
import * as Util from '../utils/util';

class Grid extends Phaser.Group {

    //initialization code in the constructor
    constructor(game, settings) {

        super(game);

        this.properties = {
            width: this.getWidth(),
            fieldSize: PiecSettings.fieldSize,
            settings: settings,
            fallDuration: PiecSettings.fallDuration
        };

        this.properties.tileSize = this.properties.width / PiecSettings.fieldSize;

        this.alpha = 0;

        game.add.existing(this);

        this.createGrid();

        this.resize();

        PiecSettings.pickInitialTile.add(this.pickInitialTile, this);

        window.globalCount = 0;
    }

    // debug method
    // checkTiles() {

    //     for (var j = 0; j < this.game.global.tiles.length; j++) {

    //         for (var i = 0; i < this.game.global.tiles[j].length; i++) {

    //             if (this.game.global.tiles[j][i] !== null) {

    //                 if (this.game.global.tiles[j][i].properties.x !== i ||
    //                     this.game.global.tiles[j][i].properties.y !== j) {

    //                     console.trace('j: ' + j);
    //                     console.trace('i: ' + j);
    //                     console.trace(this.game.global.tiles[j][i].properties);
    //                 }
    //             } else {
    //                 console.trace('null');
    //             }
    //         }
    //     }
    // }


    // resize() {

    //     var layout = Util.isPortrait() ? this.properties.settings.portrait : this.properties.settings.landscape;

    //     var newScale = this.getWidth(layout) / this.properties.width;

    //     this.scale.x = newScale;
    //     this.scale.y = newScale;

    //     this.x = layout.x * 0.01 * window.innerWidth * window.devicePixelRatio - (this.properties.width * 0.5 * newScale);
    //     this.y = layout.y * 0.01 * window.innerHeight * window.devicePixelRatio - (this.properties.width * 0.5 * newScale);

    //     this.applyMask();
    // }

    resize() {

        var newScale = this.getWidth() / this.properties.width;

        var rect = document.getElementById('game-mask').getBoundingClientRect();

        var coords = {
            x: rect.left * window.devicePixelRatio,
            y: rect.top * window.devicePixelRatio
        };

        this.scale.x = newScale;
        this.scale.y = newScale;

        // this.x = layout.x * 0.01 * window.innerWidth * window.devicePixelRatio - (this.properties.width * 0.5 * newScale);
        // this.y = layout.y * 0.01 * window.innerHeight * window.devicePixelRatio - (this.properties.width * 0.5 * newScale);

        this.x = coords.x;
        this.y = coords.y;

        this.applyMask();
    }

    applyMask() {

        //  A mask is a Graphics object
        var mask = this.game.add.graphics(this.x, this.y);

        //  Shapes drawn to the Graphics object must be filled.
        mask.beginFill(0xffffff);

        var tileSize = this.width / PiecSettings.fieldSize;

        var isTileMissing;

        for (var x = 0; x < PiecSettings.fieldSize; x++) {

            for (var y = 0; y < PiecSettings.fieldSize; y++) {

                isTileMissing = false;

                PiecSettings.gridShape.forEach(function(mt) {

                    if (mt.x === x && mt.y === y) {
                        isTileMissing = true;
                    }
                });

                if (isTileMissing === false) {

                    //  Here we'll draw a rectangle for each group sprite
                    mask.drawRect(
                        x * tileSize,
                        y * tileSize,
                        tileSize,
                        tileSize);
                }
            }
        }

        //  And apply it to the Group itself
        this.mask = mask;
    }

    getWidth(layout) {

        return document.getElementById('game-mask').offsetWidth * window.devicePixelRatio;

        // return layout.width * 0.01 * window.innerWidth * window.devicePixelRatio;
    }

    createGrid() {

        this.createEmptyGrid();

        this.applyStartingTiles();

        this.createTiles();
    }

    createEmptyGrid() {

        this.game.global.tiles = [];

        var shouldReGen, tileType, result;

        for (var i = 0; i < this.properties.fieldSize; i++) {

            this.game.global.tiles[i] = [];

            for (var j = 0; j < this.properties.fieldSize; j++) {

                //create tile
                this.game.global.tiles[i][j] = null;
            }
        }

    }

    applyStartingTiles() {

        var startingTiles = PiecSettings.startingTiles || [];

        var tile;

        startingTiles.forEach(function(st) {

            tile = new Tile(
                this.game,
                st.x, // x
                st.y, // y
                st.tileType, // tile type
                this.properties.tileSize // tile size
            );

            tile.properties.isStartingTile = false;

            this.game.global.tiles[st.y][st.x] = tile;

            this.add(tile);

        }, this);
    }

    createTiles() {

        var shouldReGen, tileType, result;

        for (var i = 0; i < this.properties.fieldSize; i++) {

            for (var j = 0; j < this.properties.fieldSize; j++) {

                shouldReGen = true;

                while (shouldReGen === true) {

                    result = this.genTileType(j, i);

                    tileType = result.tileType;

                    shouldReGen = result.shouldReGen;
                }

                if (this.game.global.tiles[i][j] === null) {

                    //create tile
                    this.game.global.tiles[i][j] = new Tile(
                        this.game,
                        j, // x
                        i, // y
                        tileType, // tile type
                        this.properties.tileSize // tile size
                    );

                    this.add(this.game.global.tiles[i][j]);
                }
            }
        }
    }

    genTileType(x, y) {

        var y1 = TileUtil.getItemAt(this.game.global.tiles, x, y - 1);
        var y2 = TileUtil.getItemAt(this.game.global.tiles, x, y - 2);

        var x1 = TileUtil.getItemAt(this.game.global.tiles, x - 1, y);
        var x2 = TileUtil.getItemAt(this.game.global.tiles, x - 2, y);

        var y3 = TileUtil.getItemAt(this.game.global.tiles, x, y + 1);
        var y4 = TileUtil.getItemAt(this.game.global.tiles, x, y + 2);

        var x3 = TileUtil.getItemAt(this.game.global.tiles, x + 1, y);
        var x4 = TileUtil.getItemAt(this.game.global.tiles, x + 2, y);

        var tileType = Math.floor(Math.random() * PiecSettings.tileTypes);

        var shouldReGen = false;

        if (y1 !== null &&
            y2 !== null &&
            y1.properties.color === y2.properties.color &&
            y1.properties.color === PiecSettings.tiles[tileType].color) {

            shouldReGen = true;
        }

        if (x1 !== null &&
            x2 !== null &&
            x1.properties.color === x2.properties.color &&
            x1.properties.color === PiecSettings.tiles[tileType].color) {

            shouldReGen = true;
        }

        if (y3 !== null &&
            y4 !== null &&
            y3.properties.color === y4.properties.color &&
            y3.properties.color === PiecSettings.tiles[tileType].color) {

            shouldReGen = true;
        }

        if (x3 !== null &&
            x4 !== null &&
            x3.properties.color === x4.properties.color &&
            x3.properties.color === PiecSettings.tiles[tileType].color) {

            shouldReGen = true;
        }

        if (PiecSettings.isSwipe === false) {
            shouldReGen = false;
        }

        return {
            shouldReGen: shouldReGen,
            tileType: tileType
        };
    }

    swipeTile(tile, direction) {

        if (this.game.global.locked === true) {
            return;
        }

        this.resetMoveStats();

        var adjTile = TileUtil.getAdjacent(this.game.global.tiles, tile, direction);

        var tmpCoords = {
            x: tile.properties.x,
            y: tile.properties.y,
            xCoord: tile.x,
            yCoord: tile.y
        };

        if (adjTile === null) {
            return;
        }

        for (var i = 0; i < PiecSettings.gridShape.length; i++) {

            if (PiecSettings.gridShape[i].x === adjTile.properties.x &&
                PiecSettings.gridShape[i].y === adjTile.properties.y) {
                return;
            }
        }

        piec.lockGame();

        tile.properties.x = adjTile.properties.x;
        tile.properties.y = adjTile.properties.y;

        adjTile.properties.x = tmpCoords.x;
        adjTile.properties.y = tmpCoords.y;

        // swap positions within the array
        this.game.global.tiles[tile.properties.y][tile.properties.x] = tile;
        this.game.global.tiles[adjTile.properties.y][adjTile.properties.x] = adjTile;

        var tileMatches = TileUtil.getLineMatches(this.game.global.tiles, tile, PiecSettings.minMatchSize);

        var adjTileMatches = TileUtil.getLineMatches(this.game.global.tiles, adjTile, PiecSettings.minMatchSize);

        var matchFound = tileMatches.tiles.length > 0 || adjTileMatches.tiles.length > 0;

        var swapSpeed = 150;

        var item1Tween = this.game.add.tween(tile).to({
            x: adjTile.x,
            y: adjTile.y
        }, swapSpeed, Phaser.Easing.Linear.None, true);

        var item2Tween = this.game.add.tween(adjTile).to({
            x: tile.x,
            y: tile.y
        }, swapSpeed, Phaser.Easing.Linear.None, true);

        var comboBlastTiles = [];

        item2Tween.onComplete.add(function() {

            this.addComboBlastTiles(comboBlastTiles, tile, adjTile);

            if (matchFound === false && comboBlastTiles.length === 0) {

                var item1Tween = this.game.add.tween(tile).to({
                    x: adjTile.x,
                    y: adjTile.y
                }, swapSpeed, Phaser.Easing.Linear.None, true);

                var item2Tween = this.game.add.tween(adjTile).to({
                    x: tile.x,
                    y: tile.y
                }, swapSpeed, Phaser.Easing.Linear.None, true);

                adjTile.properties.x = tile.properties.x;
                adjTile.properties.y = tile.properties.y;

                tile.properties.x = tmpCoords.x;
                tile.properties.y = tmpCoords.y;

                // swap back positions within the array
                this.game.global.tiles[tile.properties.y][tile.properties.x] = tile;
                this.game.global.tiles[adjTile.properties.y][adjTile.properties.x] = adjTile;

                piec.unlockGame();

            } else {

                this.game.onMoveStart(this.game);

                var combineExplosion = this.getCombineExplosion(tile, adjTile);

                CustomTileEvents.onComboStart(this.parent.game, tile, adjTile, combineExplosion);

                // this.game.time.events.add(3000, function() {
                this.game.time.events.add(combineExplosion === null ? 0 : combineExplosion.destroyDelay, function() {

                    if (combineExplosion !== null) {

                        tile.properties.explode = 1000;
                        adjTile.properties.explode = 1000;
                    }

                    var tilesToDestroy = [tileMatches, adjTileMatches];

                    tilesToDestroy = tilesToDestroy.concat(comboBlastTiles);

                    this.addBlastTiles(tilesToDestroy);

                    this.destroyMatchingTiles(tilesToDestroy);

                }, this);
            }

        }, this);
    }

    getCombineExplosion(tile1, tile2) {

        var tileType1 = PiecSettings.tiles[tile1.properties.tileType];
        var tileType2 = PiecSettings.tiles[tile2.properties.tileType];

        var match1, match2;

        for (var i = 0; i < PiecSettings.uniquePieceCombos.length; i++) {

            match1 =
                typeof PiecSettings.uniquePieceCombos[i].type1 === 'undefined' ||
                PiecSettings.uniquePieceCombos[i].type1 === tileType1.explode;

            match2 =
                typeof PiecSettings.uniquePieceCombos[i].type2 === 'undefined' ||
                PiecSettings.uniquePieceCombos[i].type2 === tileType2.explode;

            if (match1 && match2) {

                return Explosions[PiecSettings.uniquePieceCombos[i].resultsIn];
            }
        }

        return null;
    }

    addComboBlastTiles(matches, tile1, tile2) {

        var tileType1 = PiecSettings.tiles[tile1.properties.tileType];
        var tileType2 = PiecSettings.tiles[tile2.properties.tileType];

        var explosion, uniquePieceCombo;

        if (tileType1.explode && tileType2.explode) {

            PiecSettings.uniquePieceCombos.forEach(function(upCombo) {

                if ((upCombo.type1 === tileType1.explode &&
                        upCombo.type2 === tileType2.explode) ||
                    (upCombo.type1 === tileType2.explode &&
                        upCombo.type2 === tileType1.explode)) {

                    uniquePieceCombo = upCombo;

                    explosion = Explosions[upCombo.resultsIn];

                    matches.push({
                        color: 'any',
                        hMatches: 0,
                        original: tile1,
                        tiles: TileUtil.getMatches(this.game.global.tiles, tile1, explosion),
                        vMatches: 0
                    });

                    if (explosion.horizontalAndVerticalBig === true) {

                        // this.game.time.events.add(250, function() {

                        var explosion2 = Util.clone(explosion);

                        explosion2.vertical = true;
                        explosion2.horizontal = false;


                        this.batchExplode = TileUtil.getMatches(this.game.global.tiles, tile1, explosion2);

                        // }, this)
                    }
                }
            }, this);
        }

        if (tileType1.explode === 'colorMatch' &&
            tileType2.explode === 'colorMatch') {
            return;
        }

        if (tileType1.explode === 'colorMatch' ||
            tileType2.explode === 'colorMatch') {

            if (tileType1.explode && tileType2.explode) {

                var transformTo = tileType1.explode === 'colorMatch' ? tileType2 : tileType1;

                var generates = [];

                (uniquePieceCombo.generates || []).forEach(function(e) {

                    generates.push(TileUtil.getTileTypes(transformTo.color, e)[0]);
                }, this);

                var affectedTiles = TileUtil.getAllTilesByColor(this.game.global.tiles, transformTo.color);

                affectedTiles.forEach(function(at) {

                    transformTo = Util.sample(generates);

                    at.frame = PiecSettings.tiles.indexOf(transformTo);

                    at.properties.tileType = PiecSettings.tiles.indexOf(transformTo);

                    at.properties.color = 'nevermatch';

                    at.combine(this.game, this);

                }, this);

                var colorMatchTile = tileType1.explode === 'colorMatch' ? tile1 : tile2;

                colorMatchTile.destroy();

                this.game.global.tiles[colorMatchTile.properties.y][colorMatchTile.properties.x] = null;

                this.batchExplode = affectedTiles;

            } else {

                var color;

                if (tile1.properties.color !== 'any') {
                    color = tile1.properties.color;
                }

                if (tile2.properties.color !== 'any') {
                    color = tile2.properties.color;
                }

                explosion = Explosions.colorMatch;

                matches.push({
                    color: 'any',
                    hMatches: PiecSettings.minMatchSize,
                    original: tileType1.explode === 'colorMatch' ? tile1 : tile2,
                    tiles: TileUtil.getMatches(this.game.global.tiles, tileType1.explode === 'colorMatch' ? tile1 : tile2, explosion, color),
                    vMatches: PiecSettings.minMatchSize
                });
            }
        }
    }

    addBlastTiles(matches, ignoreMatchSize) {

        var tilesToDestroy = [];

        var tileType, explosion, tiles;

        matches.forEach(function(m) {

            if (ignoreMatchSize === true ||
                (m.hMatches >= PiecSettings.minMatchSize ||
                    m.vMatches >= PiecSettings.minMatchSize)) {

                m.tiles.forEach(function(t) {

                    tilesToDestroy = TileUtil.getAllTilesToDestroy(this.game.global.tiles, t);

                    if (t !== null) {

                        if (tilesToDestroy.length > 0) {
                            matches.push({
                                color: t.properties.color,
                                hMatches: 0,
                                original: t,
                                tiles: tilesToDestroy,
                                vMatches: 0
                            });
                        }
                    }
                }, this);
            }
        }, this);
    }

    combosContainsRule(combos, rule) {

        for (var i = 0; i < combos.length; i++) {

            if (combos[i].rule === rule) {
                return true;
            }
        }

        return false;
    }

    destroyMatchingTiles(matches, fall) {

        if (matches.length === 0) {
            this.onMoveComplete();
            return;
        }

        var tilesToDestroy = [];

        var combo;
        var combos = [];

        var frame;

        matches.forEach(function(m) {


            combo = this.getCombo(m);


            if (combo !== null) {

                if (!this.combosContainsRule(combos, combo.rule)) {

                    if (typeof combo.frame !== 'undefined') {
                        frame = combo.frame;
                    } else if (typeof combo.properties.tileType !== 'undefined') {
                        frame = combo.properties.tileType;
                    }

                    combos.push({
                        frame: frame,
                        rule: combo.rule,
                        tile: m.original,
                        tiles: m.tiles
                    });
                }
            } else {

                m.tiles.forEach(function(tile) {
                    tilesToDestroy.push(tile);
                }, this);
            }

        }, this);

        combos = Util.uniq(combos); // de-dupe

        tilesToDestroy = Util.uniq(tilesToDestroy); // de-dupe

        this.updateMoveStats(tilesToDestroy);

        var newFrame, combineTile, repeatingExplode, explosion, tileType;

        var hasCombine = false;

        combos.forEach(function(c) {

            hasCombine = true;

            if (typeof c.frame !== 'undefined') {
                newFrame = c.frame;
            } else if (typeof c.properties.tileType !== 'undefined') {
                newFrame = c.properties.tileType;
            }

            this.game.global.tiles[c.tile.y][c.tile.x].properties.tileType = newFrame;

            combineTile = this.game.global.tiles[c.tile.y][c.tile.x];

            c.tiles.forEach(function(t) {

                tileType = PiecSettings.tiles[t.properties.tileType];

                explosion = tileType.explode ? Explosions[tileType.explode] : {};

                repeatingExplode =
                    typeof explosion.repeat !== 'undefined';

                if (!(t.properties.x === c.tile.x &&
                        t.properties.y === c.tile.y) &&
                    this.game.global.tiles[t.properties.y][t.properties.x] !== null &&
                    repeatingExplode === false) {

                    this.game.global.tiles[t.properties.y][t.properties.x] = null;

                    t.moveTo(this.game, combineTile.x, combineTile.y, PiecSettings.combineDelay, function(tile) {

                        tile.destroy();
                    });
                }

            }, this);

            this.game.time.events.add(PiecSettings.combineDelay, function() {

                combineTile.combine(this.game, this);

                combineTile.swapImg(newFrame);

            }, this);

        }, this);

        var isCombineTile, tile;

        for (var i = 0; i < tilesToDestroy.length; i++) {

            if (tilesToDestroy[i]) {

                if (tilesToDestroy[i].properties.x !== null &&
                    tilesToDestroy[i].properties.y !== null) {

                    isCombineTile = false;

                    combos.forEach(function(c) {

                        if (tilesToDestroy[i].properties.x === c.tile.x &&
                            tilesToDestroy[i].properties.y === c.tile.y) {

                            isCombineTile = true;
                        }

                        c.tiles.forEach(function(tile) {

                            if (tile.properties.x === tilesToDestroy[i].properties.x &&
                                tile.properties.y === tilesToDestroy[i].properties.y &&
                                !PiecSettings.tiles[tile.properties.tileType].explode) {

                                isCombineTile = true;
                            }

                        }, this);

                    }, this);

                    if (isCombineTile === false) {

                        repeatingExplode = false;

                        tile = this.game.global.tiles[tilesToDestroy[i].properties.y][tilesToDestroy[i].properties.x];

                        if (tile) {

                            tile.properties.explode = tile.properties.explode || 0;

                            tile.properties.explode++;

                            tileType = PiecSettings.tiles[tile.properties.tileType];

                            if (tileType.explode) {

                                explosion = Explosions[tileType.explode];

                                repeatingExplode =
                                    typeof explosion.repeat !== 'undefined' &&
                                    explosion.repeat >= tile.properties.explode;
                            }

                            if (repeatingExplode === false) {


                                if (this.game.global.tiles[tilesToDestroy[i].properties.y][tilesToDestroy[i].properties.x].properties.indestructable !== true) {

                                    this.game.global.tiles[tilesToDestroy[i].properties.y][tilesToDestroy[i].properties.x] = null;

                                    tilesToDestroy[i].explode(this.game, this);
                                }

                            } else {

                                tile.properties.isReadyToExplode = true;

                                tile.playAnimation(this.game, this, tile.getAnimation(tileType.animation));

                                tile.jiggle();
                            }
                        }
                    }
                }
            }
        }

        if (fall !== false) {

            this.game.time.events.add(hasCombine ? PiecSettings.combineDelay : 0, function() {

                this.fall(PiecSettings.fallUpwards);
                this.fallFrom(PiecSettings.fallUpwards);
            }, this);
        }

    }

    resetMoveStats() {

        this.game.global.moveStats = {
            attack: 0,
            defend: 0
        };
    }

    updateMoveStats(tilesDestroyed) {

        var tileInfo;

        tilesDestroyed.forEach(function(t) {

            if (t) {

                tileInfo = PiecSettings.tiles[t.properties.tileType];

                // this.game.global.moveStats[tileInfo.color] = this.game.global.moveStats[tileInfo.color] || 0;

                this.game.global.moveStats[tileInfo.attribute]++;

                console.log("tileinfo" + tileInfo.attribute);

                // this.game.global.moveStats.totalDestroyed++;
            }

        }, this);

    }

    removeDupes(tile) {

        this.forEach(function(t) {

            if (t !== tile &&
                t.x === tile.x && t.y === tile.y) {

                console.log('remove duplicate');

                t.destroy();
            }

        }, this);
    }

    onMoveComplete() {

        if (this.game.global.fallingTiles <= 0) {

            if (this.getHoles() > 0 && (this.game.global.freezeCols || []).length === 0) {

                this.fall(PiecSettings.fallUpwards);
                this.fallFrom(PiecSettings.fallUpwards);

                return;
            }

            var repeaters = this.getRepeaters();

            var matches;

            if (repeaters.length > 0) {

                this.game.time.events.add(300, function() {

                    matches = [];

                    repeaters.forEach(function(r) {

                        matches.push({
                            color: r.properties.color,
                            hMatches: 0,
                            original: r,
                            tiles: TileUtil.getAllTilesToDestroy(this.game.global.tiles, r),
                            vMatches: 0
                        });

                    }, this);


                    this.destroyMatchingTiles(matches);

                }, this);

                return;
            }

            var tile;

            this.batchExplode = this.batchExplode || [];

            if (this.game.global.isComplete === true) {

                this.batchExplode = TileUtil.getAllUniqueGamePieces(this.game.global.tiles);
            }

            if (this.batchExplode.length > 0 &&
                (this.game.global.freezeCols || []).length > 0) {

                this.game.time.events.add(200, function() {

                    this.game.global.freezeCols = [];

                    this.destroyAllBatchExplodeItem();

                }, this);

                return;
            }

            if (this.batchExplode.length > 0) {

                this.destroyRandomBatchExplodeItem();

                return;
            }

            piec.unlockGame();

            this.game.onMoveComplete(this.game);

            if (this.game.global.isComplete === true) {

                this.game.onGameComplete.dispatch();
            }
        }
    }

    destroyRandomBatchExplodeItem() {

        console.log('destroyRandomBatchExplodeItem');

        var tile = Util.sample(this.batchExplode);

        var matches = [{
            color: tile.properties.color,
            hMatches: 0,
            original: tile,
            tiles: [tile],
            vMatches: 0
        }];

        this.addBlastTiles(matches, true);

        this.destroyMatchingTiles(matches);
    }

    destroyAllBatchExplodeItem() {

        var tile = Util.sample(this.batchExplode);

        var matches = [{
            color: tile.properties.color,
            hMatches: 0,
            original: tile,
            tiles: this.batchExplode,
            vMatches: 0
        }];

        this.addBlastTiles(matches, true);

        this.destroyMatchingTiles(matches);
    }

    getRepeaters() {

        var repeaters = [];

        var i, j;

        for (i = 0; i < this.game.global.tiles.length; i++) {

            for (j = 0; j < this.game.global.tiles[i].length; j++) {

                if (this.game.global.tiles[i][j] !== null &&
                    this.game.global.tiles[i][j].properties.isReadyToExplode === true) {

                    repeaters.push(this.game.global.tiles[i][j]);
                }
            }
        }

        return repeaters;
    }

    getCombo(match) {

        if (!PiecSettings.swipeCombineRules) {
            return null;
        }

        var combineRule, combo;

        for (var i = 0; i < PiecSettings.swipeCombineRules.length; i++) {

            combineRule = PiecSettings.swipeCombineRules[i];

            if (combineRule.horizontal.indexOf(match.hMatches) >= 0 &&
                combineRule.vertical.indexOf(match.vMatches) >= 0) {

                combo = PiecSettings.swipeCombineRules[i].generates;

                combo = combo.replace('%color%', match.color);

                for (var j = 0; j < PiecSettings.tiles.length; j++) {

                    if (PiecSettings.tiles[j].id === combo) {

                        return {
                            frame: j,
                            rule: combineRule
                        };
                    }
                }
            }
        }

        return null;
    }

    matchAllTiles() {

        var allMatches = [];

        var matches;

        for (var j = 0; j < this.game.global.tiles.length; j++) {

            for (var i = 0; i < this.game.global.tiles[j].length; i++) {

                if (this.game.global.tiles[j][i] !== null) {

                    matches = TileUtil.getLineMatches(this.game.global.tiles, this.game.global.tiles[j][i], PiecSettings.minMatchSize);

                    if (matches.tiles.length > 0 &&
                        this.containsMatch(allMatches, this.game.global.tiles[j][i]) === false) {
                        allMatches.push(matches);
                    }
                }
            }
        }

        this.addBlastTiles(allMatches);

        this.destroyMatchingTiles(allMatches);
    }

    containsMatch(allMatches, tile) {

        for (var i = 0; i < allMatches.length; i++) {

            for (var j = 0; j < allMatches[i].length; j++) {

                if (allMatches[i][j].properties.x === tile.properties.x &&
                    allMatches[i][j].properties.y === tile.properties.y) {

                    return true;
                }
            }
        }

        return false;
    }

    matchTiles() {

        var allMatches = [];

        var matches;

        for (var j = 0; j < this.global.tiles.length; j++) {

            for (var i = 0; i < this.global.tiles[j].length; i++) {

                matches = {
                    h: TileUtil.getAllAdjacentMatches(this.game.global.tiles, this.game.global.tiles[j][i], true, false, []),
                    v: TileUtil.getAllAdjacentMatches(this.game.global.tiles, this.game.global.tiles[j][i], false, true, []),
                };
            }
        }
    }

    pickInitialTile() {

        return;
    }

    pickTile(tile, canCombine) {

        if (this.game.global.locked === true) {
            return;
        }

        piec.lockGame();

        this.resetMoveStats();

        var matchingTiles = TileUtil.getAllAdjacentMatches(
            this.game.global.tiles,
            tile,
            true,
            true, []);

        var tileInfo = PiecSettings.tiles[tile.properties.tileType];

        if (tileInfo.delay > 0 && matchingTiles.length === 1) {
            tile.alpha = 0;
            tile.properties.surpressExplodeAnimation = true;

            tile.playAnimation(this.game, this, tileInfo.activateAnimation);
        }

        this.game.time.events.add(tileInfo.delay || 0, function() {

            if (!tileInfo.explode) {

                if (matchingTiles.length <= PiecSettings.minMatchSize) {

                    tile.wiggle();

                    //todo: animate tile to signify cannot do this move
                    return; /// should not match if fewer than minimum match size
                }

                var tileType = null;

                var generatesUniqueGamePiece = false;

                PiecSettings.tapCombineRules.forEach(function(rule) {

                    if (matchingTiles.length >= rule.amountMin &&
                        matchingTiles.length <= rule.amountMax) {

                        for (var i = 0; i < PiecSettings.tiles.length; i++) {

                            if (PiecSettings.tiles[i].id === rule.generates.replace('%color%', tile.properties.color)) {

                                tileType = i;

                                generatesUniqueGamePiece = true;
                            }
                        }
                    }
                });

                if (generatesUniqueGamePiece === true) {

                    matchingTiles.forEach(function(mt) {

                        this.game.add.tween(mt).to({ x: tile.x, y: tile.y }, PiecSettings.combineDelay, Phaser.Easing.Linear.None, true);

                    }, this);
                }

                this.game.time.events.add(generatesUniqueGamePiece === true ? PiecSettings.combineDelay : 0, function() {

                    if (generatesUniqueGamePiece === true) {

                        tile.combine(this.game, this);
                    }

                    this.updateMoveStats(matchingTiles);

                    this.floodFill(
                        tile.properties.y,
                        tile.properties.x,
                        tile.properties.tileType,
                        tileType,
                        generatesUniqueGamePiece);

                    this.fall(PiecSettings.fallUpwards);
                    this.fallFrom(PiecSettings.fallUpwards);
                }, this);

            } else {

                var count = {};

                var tInfo, countId;


                matchingTiles.forEach(function(t) {

                    tInfo = PiecSettings.tiles[t.properties.tileType];

                    countId = tInfo.id
                        .replace('rocketv', 'rocket')
                        .replace('rocketh', 'rocket')
                        .replace(tInfo.colorMatch + '-', '');

                    if (!count[countId]) {
                        count[countId] = 0;
                    }

                    count[countId]++;

                    if (canCombine !== false) {
                        this.game.add.tween(t).to({ x: tile.x, y: tile.y }, PiecSettings.combineDelay, Phaser.Easing.Linear.None, true);
                    }

                }, this);

                this.game.time.events.add(canCombine !== false ? PiecSettings.combineDelay : 0, function() {

                    var explosion;

                    var isComboAMatch, typeName, amount, combo;

                    if (canCombine !== false) {

                        PiecSettings.tapUniquePieceCombos.forEach(function(upCombo) {

                            isComboAMatch = true;

                            for (var key in upCombo) {
                                if (upCombo.hasOwnProperty(key)) {

                                    if (key.indexOf('Min') > -1) {

                                        typeName = key
                                            .replace('Min', '')
                                            .replace('%color%', );

                                        amount = count[typeName] || 0;

                                        if (amount < upCombo[key]) {
                                            isComboAMatch = false;
                                        }
                                    }

                                    if (key.indexOf('Max') > -1) {

                                        typeName = key.replace('Min', '');

                                        amount = count[typeName] || 0;

                                        if (amount > upCombo[key]) {
                                            isComboAMatch = false;
                                        }
                                    }
                                }
                            }

                            if (isComboAMatch === true) {

                                matchingTiles.forEach(function(t) {

                                    t.properties.tileType = 0;
                                    t.alpha = 0;

                                }, this);

                                explosion = Explosions[upCombo.resultsIn];

                                combo = upCombo;
                            }

                        }, this);

                    }

                    var matches = [];

                    if (!explosion) {

                        matches.push({
                            color: 'any',
                            hMatches: PiecSettings.minMatchSize,
                            original: tile,
                            tiles: matchingTiles,
                            vMatches: PiecSettings.minMatchSize
                        });

                    } else {

                        matches.push({
                            color: 'any',
                            hMatches: PiecSettings.minMatchSize,
                            original: tile,
                            tiles: TileUtil.getMatches(this.game.global.tiles, tile, explosion),
                            vMatches: PiecSettings.minMatchSize
                        });
                    }
                    var delay = 0;

                    if (combo && combo.delay) {
                        delay = combo.delay;
                        tile.playAnimation(this.game, this, combo.animation);
                    }

                    // toyblast specific
                    if (combo && combo.resultsIn === 'horizontalAndVertical') {

                        tile.rocketFly(this.game, this, true, true);
                    }

                    // toyblast specific
                    if (combo && combo.resultsIn === 'horizontalAndVerticalBig') {

                        tile.rocketFly(this.game, this, true, true, 2);
                    }

                    this.game.time.events.add(delay, function() {

                        if (combo && typeof combo.tranformBlastTilesTo !== 'undefined') {

                            this.staggerExplosions = [];

                            var tranformBlastTilesTo = combo.tranformBlastTilesTo.constructor === Array ? combo.tranformBlastTilesTo : [combo.tranformBlastTilesTo];

                            matches.forEach(function(m) {

                                m.tiles.forEach(function(t) {

                                    t.swapImg(Util.sample(tranformBlastTilesTo));

                                    this.staggerExplosions.push(t);
                                }, this);

                            }, this);

                            matchingTiles.forEach(function(mt) {
                                this.game.global.tiles[mt.properties.y][mt.properties.x] = null;
                            }, this);

                            this.fall(PiecSettings.fallUpwards);
                            this.fallFrom(PiecSettings.fallUpwards);

                            this.staggerExplode();

                        } else {

                            this.addBlastTiles(matches);

                            this.destroyMatchingTiles(matches, false);

                            var maxExplodeSeq = 0;

                            matches.forEach(function(m) {

                                m.tiles.forEach(function(t) {

                                    if (t.properties.explodeSeq &&
                                        t.properties.explodeSeq > maxExplodeSeq) {

                                        maxExplodeSeq = t.properties.explodeSeq;
                                    }
                                }, this);
                            }, this);

                            this.game.time.events.add(maxExplodeSeq * PiecSettings.staggerDestroyDelay + 10, function() {

                                this.fall(PiecSettings.fallUpwards);
                                this.fallFrom(PiecSettings.fallUpwards);
                            }, this);
                        }

                    }, this);

                }, this);
            }

            this.game.onMoveStart(this.game);
        }, this);
    }

    staggerExplode() {

        this.game.time.events.add(1000, function() {

            var matches = [];

            this.staggerExplosions.forEach(function(se) {

                var item, explosion, tileInfo;


                if (se !== null && se.properties.indestructable !== true) {

                    se.explode(this.game, this);

                    tileInfo = PiecSettings.tiles[se.properties.tileType];

                    explosion = Explosions[tileInfo.explode];

                    if (explosion) {

                        matches.push({
                            color: 'any',
                            hMatches: PiecSettings.minMatchSize,
                            original: se,
                            tiles: TileUtil.getMatches(this.game.global.tiles, se, explosion),
                            vMatches: PiecSettings.minMatchSize,
                            explosion: explosion
                        });


                    }
                }

            }, this);

            var maxExplodeSeq = 0;

            // re-order explode seq

            matches.forEach(function(m) {

                m.tiles.forEach(function(t) {

                    if (t.properties.explodeSeq > maxExplodeSeq) {
                        maxExplodeSeq = t.properties.explodeSeq;
                    }

                }, this);

            }, this);

            this.destroyMatchingTiles(matches, false);

            this.game.time.events.add(maxExplodeSeq * PiecSettings.staggerDestroyDelay, function() {

                this.fall(PiecSettings.fallUpwards);
                this.fallFrom(PiecSettings.fallUpwards);

            }, this);

        }, this);
    }

    floodFill(row, col, val, tileType, surpressExplodeAnimation) {

        if (row >= 0 && row < this.properties.fieldSize && col >= 0 && col < this.properties.fieldSize) {

            if (this.game.global.tiles[row][col] !== null && this.game.global.tiles[row][col].properties.tileType === val) {

                var isTileMissing = false;

                PiecSettings.gridShape.forEach(function(mt) {

                    if (mt.x === this.game.global.tiles[row][col].properties.x && mt.y === this.game.global.tiles[row][col].properties.y) {
                        isTileMissing = true;
                    }
                }, this);

                if (isTileMissing === false) {

                    if (!tileType) {

                        if (surpressExplodeAnimation === true) {
                            this.game.global.tiles[row][col].properties.surpressExplodeAnimation = true;
                        }

                        if (this.game.global.tiles[row][col].properties.indestructable !== true) {

                            this.game.global.tiles[row][col].explode(this.game, this);
                            this.game.global.tiles[row][col] = null;
                        }
                    } else {
                        this.game.global.tiles[row][col].swapImg(tileType);
                    }

                    this.floodFill(row + 1, col, val, false, surpressExplodeAnimation);
                    this.floodFill(row - 1, col, val, false, surpressExplodeAnimation);
                    this.floodFill(row, col + 1, val, false, surpressExplodeAnimation);
                    this.floodFill(row, col - 1, val, false, surpressExplodeAnimation);
                }
            }
        }
    }

    fall(upwards) {

        if (upwards === true) {
            this.fallUp();
        } else {
            this.fallDown();
        }
    }

    fallUp() {

        var tileTween, yTo;

        for (var i = 0; i < this.properties.fieldSize; i++) {

            for (var j = 0; j < this.properties.fieldSize; j++) {

                if (this.game.global.tiles[i][j] !== null) {

                    var delta = this.holesAbove(i, j);

                    if (delta > 0) {

                        if (this.game.global.freezeCols.indexOf(j) !== -1) {
                            continue;
                        }

                        this.game.global.tiles[i][j].fall(
                            this.game, -1 * delta,
                            this.properties.tileSize);
                    }
                }
            }
        }
    }

    fallDown() {

        var tileTween, yTo;

        for (var i = this.properties.fieldSize - 1; i >= 0; i--) {

            for (var j = 0; j < this.properties.fieldSize; j++) {

                if (this.game.global.tiles[i][j] != null) {

                    var delta = this.holesBelow(i, j);

                    if (delta > 0) {

                        if (this.game.global.freezeCols.indexOf(j) !== -1) {
                            continue;
                        }

                        this.game.global.tiles[i][j].fall(
                            this.game,
                            delta,
                            this.properties.tileSize);
                    }
                }
            }
        }
    }

    fallFrom(upwards) {

        if (PiecSettings.tilesReplenish === false) {
            return; // bail, tiles should never generate
        }

        if (upwards === true) {
            this.fallFromBottom();
        } else {
            this.fallFromTop();
        }
    }

    fallFromTop() {

        var tileTween, yTo, tileCount;

        for (var i = 0; i < this.properties.fieldSize; i++) {

            var holes = this.holesBelow(-1, i);

            for (var j = 0; j < holes; j++) {

                if (this.game.global.tiles[j][i] === null) {

                    if (this.game.global.freezeCols.indexOf(i) !== -1) {
                        continue;
                    }

                    this.game.global.tiles[j][i] = new Tile(
                        this.game,
                        i, // x
                        -(holes - j), // y
                        Math.floor(Math.random() * PiecSettings.tileTypes), // tile type
                        this.properties.tileSize // tile size
                    );

                    this.game.global.tiles[j][i].fall(
                        this.game,
                        holes,
                        this.properties.tileSize);

                    this.add(this.game.global.tiles[j][i]);
                }
            }
        }
    }

    fallFromBottom() {

        var newY, tileTween, yTo, y;

        for (var i = 0; i < this.properties.fieldSize; i++) {

            var holes = this.holesBelow(-1, i);

            for (var j = 0; j < holes; j++) {

                newY = this.properties.fieldSize - j - 1;

                y = this.properties.fieldSize + (holes - j - 1);

                if (this.game.global.freezeCols.indexOf(i) !== -1) {
                    continue;
                }

                this.game.global.tiles[newY][i] = new Tile(
                    this.game,
                    i, // x
                    y, // y
                    Math.floor(Math.random() * PiecSettings.tileTypes), // tile type
                    this.properties.tileSize // tile size
                );

                // this.add(this.game.global.tiles[newY][i]);

                this.game.global.tiles[newY][i].fall(
                    this.game, -1 * (y - newY),
                    this.properties.tileSize);

                this.add(this.game.global.tiles[newY][i]);


                // this.game.global.tiles[newY][i].properties.y = newY;

                // yTo = newY * this.properties.tileSize + this.properties.tileSize / 2;

                // tileTween = this.game.add.tween(this.game.global.tiles[newY][i]);
                // tileTween.to({
                //         y: newY * this.properties.tileSize + this.properties.tileSize / 2
                //     },
                //     Util.calcQuadTime(this.game.global.tiles[newY][i].y - yTo),
                //     PiecSettings.fallEasing,
                //     true);
            }
        }
    }

    holesBelow(row, col) {
        var holes = 0;
        for (var i = row + 1; i < this.properties.fieldSize; i++) {
            if (this.game.global.tiles[i][col] === null) {
                holes++;
            }
        }
        return holes;
    }

    holesAbove(row, col) {
        var holes = 0;
        for (var i = row + 1; i > 0; i--) {

            if (this.game.global.tiles[i - 1][col] === null) {
                holes++;
            }
        }

        return holes;
    }

    getHoles() {

        var holes = 0;

        var i, j;

        for (i = 0; i < this.properties.fieldSize; i++) {

            for (j = 0; j < this.properties.fieldSize; j++) {

                if (this.game.global.tiles[i][j] === null) {
                    holes++;
                }
            }
        }

        return holes;
    }

    createRewardTiles() {

        if (this.game.global.isComplete === true) {
            return;
        }

        if (PiecSettings.rewardTiles.numberRewarded === 0) {

            this.game.onGameComplete.dispatch();
            return;
        }

        this.game.time.events.add(1600, function() {

            this.game.global.isComplete = true;

            var tile;
            var tileType;
            var isTileMissing = true;

            for (var i = 0; i < PiecSettings.rewardTiles.numberRewarded; i++) {

                this.game.time.events.add(PiecSettings.rewardTiles.rewardDelay * i, function() {

                    tileType = {
                        explode: true
                    };

                    while (typeof tileType.explode !== 'undefined' || isTileMissing === true) {

                        isTileMissing = false;

                        tile = TileUtil.getRndTile(this.game.global.tiles);

                        tileType = TileUtil.getTileType(tile);

                        PiecSettings.gridShape.forEach(function(mt) {

                            if (mt.x === tile.properties.x && mt.y === tile.properties.y) {
                                isTileMissing = true;
                            }
                        });
                    }

                    tile.combine(this.game, this);
                    tile.swapImg(Util.sample(PiecSettings.rewardTiles.possibleTiles));

                    this.batchExplode = this.batchExplode || [];

                    this.batchExplode.push(tile);

                }, this);
            }

            this.game.time.events.add(PiecSettings.rewardTiles.rewardDelay * (PiecSettings.rewardTiles.numberRewarded + 1), function() {
                this.game.onCreatedRewardTiles.dispatch();

                this.destroyRandomBatchExplodeItem();
            }, this);



        }, this);
    }

    explodeRewardTiles() {

        var uniqueGamePieces = TileUtil.getAllUniqueGamePieces(this.game.global.tiles);

        if (uniqueGamePieces.length > 0) {

            piec.unlockGame();

            this.pickTile(Util.sample(uniqueGamePieces), false);

        } else {

            this.game.time.events.add(500, function() {
                this.game.onGameComplete.dispatch();
            }, this);
        }
    }
}

export default Grid;
