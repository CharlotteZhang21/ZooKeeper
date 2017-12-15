var PiecSettings = PiecSettings || {};

// bail if not set as swipe
if (PiecSettings.isSwipe === false) {

    PiecSettings.minMatchSize = 1; // the minimum number of matching tiles must be over this limit to cause a 'match'
    
    var blastAnimation = {
        name: 'tnt-explode',  // name of your animation
        img: 'tnt-explode.png',  // the name of your png sequence image
        frames: 55,  // number of frames the png sequence contains
        frameWidth: 112,  // the width of each frame with the png sequence
        frameHeight: 112,  // the height of each frame with the png sequence
        frameRate: 30,  // the frame rate at which this animaiton should be played at
        scale: 4.0,  // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1,  // the opacity of the animation
        atlas: true,  // is atlas animation animation
        startFrame: 20  // start frame
    };

    var tntExplode = {
        name: 'tnt-explode',  // name of your animation
        img: 'tnt-explode.png',  // the name of your png sequence image
        frames: 55,  // number of frames the png sequence contains
        frameWidth: 112,  // the width of each frame with the png sequence
        frameHeight: 112,  // the height of each frame with the png sequence
        frameRate: 30,  // the frame rate at which this animaiton should be played at
        scale: 4.0,  // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1,  // the opacity of the animation
        atlas: true  // is atlas animation animation
    };

    var tntExplode2 = {
        name: 'tnt-explode2',  // name of your animation
        img: 'tnt-explode2.png',  // the name of your png sequence image
        frames: 55,  // number of frames the png sequence contains
        frameWidth: 300,  // the width of each frame with the png sequence
        frameHeight: 345,  // the height of each frame with the png sequence
        frameRate: 25,  // the frame rate at which this animaiton should be played at
        scale: 6.0,  // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1,  // the opacity of the animation
        atlas: true  // is atlas animation animation
    };

    var blueRubic = {  
        name: 'blue-rubic',  // name of your animation
        img: 'blue-rubic.png',  // the name of your png sequence image
        frames: 18,  // number of frames the png sequence contains
        frameWidth: 78,  // the width of each frame with the png sequence
        frameWidth: 78,  // the height of each frame with the png sequence
        scale: 1,  // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1,  // the opacity of the animation
        atlas: true  // is atlas animation animation
    };

    var greenRubic = {
        name: 'green-rubic',  // name of your animation
        img: 'green-rubic.png',  // the name of your png sequence image
        frames: 18,  // number of frames the png sequence contains
        frameWidth: 78,  // the width of each frame with the png sequence
        frameWidth: 78,  // the height of each frame with the png sequence
        scale: 1,  // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1,  // the opacity of the animation
        atlas: true  // is atlas animation animation
    };

    var yellowRubic = {
        name: 'yellow-rubic',  // name of your animation
        img: 'yellow-rubic.png',  // the name of your png sequence image
        frames: 18,  // number of frames the png sequence contains
        frameWidth: 78,  // the width of each frame with the png sequence
        frameWidth: 78,  // the height of each frame with the png sequence
        scale: 1,  // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1,  // the opacity of the animation
        atlas: true  // is atlas animation animation
    };

    var purpleRubic = {
        name: 'purple-rubic',  // name of your animation
        img: 'purple-rubic.png',  // the name of your png sequence image
        frames: 18,  // number of frames the png sequence contains
        frameWidth: 78,  // the width of each frame with the png sequence
        frameWidth: 78,  // the height of each frame with the png sequence
        scale: 1,  // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1,  // the opacity of the animation
        atlas: true  // is atlas animation animation
    };


    // list of animations
    PiecSettings.animations = PiecSettings.animations || [];

    // important - add all your animations (see above) here to this array
    PiecSettings.animations.push(blastAnimation, tntExplode, tntExplode2, blueRubic, greenRubic, yellowRubic, purpleRubic);

    PiecSettings.tiles = [];

    // tile info keys:
    // color - the color of the tile
    // id - a unique id for each tile
    // explode - the pattern this tile explodes in (see src/prefabs/explosions.js for more details)
    // animation - the specific animation that plays when tile is destroyed (different to PiecSettings.destroyAnimation in the setting.js file)
    // delay - the delay before destroying any tiles
    // idleAnimation - the animation played by default for this tile
    // colorMatch - the color which this tile's special ability affects
    // activateAnimation - the animaiton played when tile is activated
    PiecSettings.tiles[0] = { color: 'purple', id: 'purple' };
    PiecSettings.tiles[1] = { color: 'blue', id: 'blue' };
    PiecSettings.tiles[2] = { color: 'green', id: 'green' };
    PiecSettings.tiles[3] = { color: 'yellow', id: 'yellow' };
    PiecSettings.tiles[4] = { color: 'orange', id: 'orange' };
    PiecSettings.tiles[5] = { color: 'red', id: 'red' };
    PiecSettings.tiles[6] = { color: 'any', id: 'rocketh', explode: 'horizontal' };
    PiecSettings.tiles[7] = { color: 'any', id: 'rocketv', explode: 'vertical' };
    PiecSettings.tiles[8] = { color: 'any', id: 'tnt', explode: 'blast', animation: blastAnimation, delay: 550, activateAnimation: tntExplode };
    PiecSettings.tiles[9] = { color: 'any', id: 'blue-rubic', explode: 'colorMatch', delay: 300, idleAnimation: blueRubic, colorMatch: 'blue' };
    PiecSettings.tiles[10] = { color: 'any', id: 'green-rubic', explode: 'colorMatch', delay: 300, idleAnimation: greenRubic, colorMatch: 'green' };
    PiecSettings.tiles[11] = { color: 'any', id: 'yellow-rubic', explode: 'colorMatch', delay: 300, idleAnimation: yellowRubic, colorMatch: 'yellow' };
    PiecSettings.tiles[12] = { color: 'any', id: 'purple-rubic', explode: 'colorMatch', delay: 300, idleAnimation: purpleRubic, colorMatch: 'purple' };

    // starting tiles
    // choose the x y coordinates and the tile type for the game start out with the tiles specified
    // some presets are below commented out

    //chained rockets
    var chainedRockets = [{
        x: 4,
        y: 6,
        tileType: 6
    }, {
        x: 1,
        y: 5,
        tileType: 7
    }, {
        x: 1,
        y: 1,
        tileType: 6
    }, {
        x: 7,
        y: 1,
        tileType: 7
    }];

    // rocket combo
    var rocketAndRocket = [{
        x: 5,
        y: 5,
        tileType: 6
    }, {
        x: 5,
        y: 6,
        tileType: 7
    }];

    // tnt combo
    var tntAndTnt = [{
        x: 5,
        y: 6,
        tileType: 8
    }, {
        x: 2,
        y: 3,
        tileType: 7
    }];

     // rubic + tnt
    var rubicAndTnt = [{
        x: 5,
        y: 5,
        tileType: 8
    }, {
        x: 5,
        y: 6,
        tileType: 10
    }];

    // rubic + rubic
    var rubicAndRubic = [{
        x: 4,
        y: 4,
        tileType: 11
    }, {
        x: 4,
        y: 5,
        tileType: 10
    }];

    // tnt + rockets
    var tntAndRocket = [{
        x: 4,
        y: 6,
        tileType: 7
    }, {
        x: 4,
        y: 5,
        tileType: 8
    }];

    // rubic + rocket
    var rubicAndRocket = [{
        x: 5,
        y: 5,
        tileType: 7
    }, {
        x: 5,
        y: 6,
        tileType: 10
    }];

    var none = [];

    PiecSettings.startingTiles = emptyGrid;

    // tap combine rules specify which unique game pieces generate given the destruction of a certain amount of tiles
    // for exmaple here we see...
    // 3-4 tiles would generate a tnt tile
    // 4-20 tiles would generate a rocket tile
    PiecSettings.tapCombineRules = [{
        amountMin: 7,
        amountMax: 8,
        generates: 'tnt'
    }, {
        amountMin: 5,
        amountMax: 5,
        generates: 'rocketv'
    }, {
        amountMin: 6,
        amountMax: 6,
        generates: 'rocketh'
    }, {
        amountMin: 8,
        amountMax: 100,
        generates: '%color%-rubic' // note %color% is replaced by current color dynamically
    }];


    // tap unique piece combos specifiy special explosion patterns for when you combine unqiue game pieces
    // for exmaple here we see...
    // combining 2-20 rockets would make a horizontalAndVertical blast (see src/prefabs/explosions.js for more details)
    // combining 2-20 tnts would make a biggerBlast blast (see src/prefabs/explosions.js for more details)
    // combining 1-20 rockets and 1-20 tnts would make a hugeBlast blast (see src/prefabs/explosions.js for more details)
    PiecSettings.tapUniquePieceCombos = [{
        rocketMin: 2,
        rocketMax: 20,
        tntMin: 0,
        tntMax: 0,
        rubicMin: 0,
        rubicMax: 0,
        resultsIn: 'horizontalAndVertical'
    }, {
        rocketMin: 0,
        rocketMax: 0,
        tntMin: 2,
        tntMax: 20,
        rubicMin: 0,
        rubicMax: 0,
        resultsIn: 'biggerBlast',
        animation: tntExplode2,
        delay: 1300
    }, {
        rocketMin: 1,
        rocketMax: 20,
        tntMin: 1,
        tntMax: 20,
        rubicMin: 0,
        rubicMax: 0,
        resultsIn: 'horizontalAndVerticalBig'
    }, {
        rocketMin: 1,
        rocketMax: 20,
        tntMin: 1,
        tntMax: 20,
        rubicMin: 0,
        rubicMax: 0,
        resultsIn: 'horizontalAndVerticalBig'
    }, {
        rocketMin: 0,
        rocketMax: 0,
        tntMin: 0,
        tntMax: 0,
        rubicMin: 2,
        rubicMax: 200,
        delay: 500,
        resultsIn: 'destroyAll'
    }, {
        rocketMin: 1,
        rocketMax: 200,
        tntMin: 0,
        tntMax: 0,
        rubicMin: 1,
        rubicMax: 1,
        delay: 500,
        resultsIn: 'colorMatch',
        tranformBlastTilesTo: [6, 7]
    }, {
        rocketMin: 0,
        rocketMax: 0,
        tntMin: 1,
        tntMax: 200,
        rubicMin: 1,
        rubicMax: 1,
        delay: 500,
        resultsIn: 'colorMatch',
        tranformBlastTilesTo: [8]
    }];

    // custom grid shapes

    // specific custom grid from available presets (see /settings-grid-presets.js for more info)
    // PiecSettings.gridShape = PiecSettings.gridShapeConfig.squareHole;
    // PiecSettings.gridShape = PiecSettings.gridShapeConfig.sShape;

    // random custom grid from available presets    
    // PiecSettings.gridShape = PiecSettings.randomGridShape();

    // no custom grid
    PiecSettings.gridShape = [];
}
