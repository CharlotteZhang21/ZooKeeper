var PiecSettings = PiecSettings || {};

// bail if not set as swipe
if (PiecSettings.isSwipe === true) {

    PiecSettings.minMatchSize = 3; // the minimum number of matching tiles must be over this limit to cause a 'match'

    PiecSettings.animations = PiecSettings.animations || [];

    // blast animation is the animation that plays when a tnt is blown up

    var _frameRate = 20;

    PiecSettings.animations.push({
        name: 'monkeyDestroyTile', // name of your animation
        img: 'destroy-tiles-monkey.png', // the name of your png sequence image
        frames: 5, // number of frames the png sequence contains
        frameWidth: 80, // the width of each frame with the png sequence
        frameHeight: 80, // the height of each frame with the png sequence
        frameRate: _frameRate, // the frame rate at which this animaiton should be played at
        scale: 1, // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1.0 // the opacity of the animation
    });

    PiecSettings.animations.push({
        name: 'giraffDestroyTile', // name of your animation
        img: 'destroy-tiles-giraff.png', // the name of your png sequence image
        frames: 5, // number of frames the png sequence contains
        frameWidth: 80, // the width of each frame with the png sequence
        frameHeight: 80, // the height of each frame with the png sequence
        frameRate: _frameRate, // the frame rate at which this animaiton should be played at
        scale: 1, // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1.0 // the opacity of the animation
    });

    PiecSettings.animations.push({
        name: 'pandaDestroyTile', // name of your animation
        img: 'destroy-tiles-panda.png', // the name of your png sequence image
        frames: 5, // number of frames the png sequence contains
        frameWidth: 80, // the width of each frame with the png sequence
        frameHeight: 80, // the height of each frame with the png sequence
        frameRate: _frameRate, // the frame rate at which this animaiton should be played at
        scale: 1, // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1.0 // the opacity of the animation
    });

    PiecSettings.animations.push({
        name: 'lionDestroyTile', // name of your animation
        img: 'destroy-tiles-lion.png', // the name of your png sequence image
        frames: 6, // number of frames the png sequence contains
        frameWidth: 80, // the width of each frame with the png sequence
        frameHeight: 80, // the height of each frame with the png sequence
        frameRate: _frameRate, // the frame rate at which this animaiton should be played at
        scale: 1, // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1.0 // the opacity of the animation
    });

    PiecSettings.animations.push({
        name: 'hippoDestroyTile', // name of your animation
        img: 'destroy-tiles-hippo.png', // the name of your png sequence image
        frames: 6, // number of frames the png sequence contains
        frameWidth: 80, // the width of each frame with the png sequence
        frameHeight: 80, // the height of each frame with the png sequence
        frameRate: _frameRate, // the frame rate at which this animaiton should be played at
        scale: 1, // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1.0 // the opacity of the animation
    });

    PiecSettings.animations.push({
        name: 'elephantDestroyTile', // name of your animation
        img: 'destroy-tiles-elephant.png', // the name of your png sequence image
        frames: 6, // number of frames the png sequence contains
        frameWidth: 80, // the width of each frame with the png sequence
        frameHeight: 80, // the height of each frame with the png sequence
        frameRate: _frameRate, // the frame rate at which this animaiton should be played at
        scale: 1, // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1.0 // the opacity of the animation
    });

    PiecSettings.animations.push({
        name: 'crocoDestroyTile', // name of your animation
        img: 'destroy-tiles-croco.png', // the name of your png sequence image
        frames: 5, // number of frames the png sequence contains
        frameWidth: 80, // the width of each frame with the png sequence
        frameHeight: 80, // the height of each frame with the png sequence
        frameRate: _frameRate, // the frame rate at which this animaiton should be played at
        scale: 1, // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
        alpha: 1.0 // the opacity of the animation
    });

    // PiecSettings.animations.push({
    //     name: 'rabbitDestroyTile', // name of your animation
    //     img: 'destroy-tiles-rabbit.png', // the name of your png sequence image
    //     frames: 5, // number of frames the png sequence contains
    //     frameWidth: 80, // the width of each frame with the png sequence
    //     frameHeight: 80, // the height of each frame with the png sequence
    //     frameRate: 24, // the frame rate at which this animaiton should be played at
    //     scale: 1, // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
    //     alpha: 1.0 // the opacity of the animation
    // });

    PiecSettings.tiles = [];

    // tile info keys:
    // color - the color of the tile
    // id - a unique id for each tile
    // explode - the pattern this tile explodes in (see src/prefabs/explosions.js for more details)
    // animation - the specific animation that plays when tile is destroyed (different to PiecSettings.destroyAnimation in the setting.js file)

    PiecSettings.tiles[0] = { color: 'lion', id: 'lion', attribute: 'defend'};
    PiecSettings.tiles[1] = { color: 'giraff', id: 'giraff', attribute: 'attack' };
    PiecSettings.tiles[2] = { color: 'hippo', id: 'hippo', attribute: 'defend' };
    PiecSettings.tiles[3] = { color: 'elephant', id: 'elephant', attribute: 'attack' };
    PiecSettings.tiles[4] = { color: 'croco', id: 'croco', attribute: 'attack' };
    PiecSettings.tiles[5] = { color: 'monkey', id: 'monkey', attribute: 'attack'};
    PiecSettings.tiles[6] = { color: 'panda', id: 'panda', attribute: 'attack' };

    // var stripeAndStripe = [{
    //     x: 2,
    //     y: 3,
    //     tileType: 10
    // }, {
    //     x: 2,
    //     y: 4,
    //     tileType: 16
    // }];

    var liquoriceAndLiquorice = [{
        x: 2,
        y: 3,
        tileType: 0
    }, {
        x: 2,
        y: 4,
        tileType: 0
    }];


    var emptyGrid = [];

    PiecSettings.startingTiles = emptyGrid;

    // swipe combine rules specify which unique game pieces generate given the destruction of a certain amount of tiles
    // for exmaple here we see...
    // 4 horizontal tiles would generate vertical color stipe tile
    // 4 vertical tiles would generate horizontal color stipe tile
    // 3 horizontal and 3 vertical tiles would generate color blob tile
    // 5 horizontal/vertical tiles would generate a master tile
    PiecSettings.swipeCombineRules = [{
        horizontal: [4],
        vertical: [0, 1, 2, 3],
        generates: '%color%VStripe' // the %color% gets replaced by the color of tile currently being swiped
    }, {
        horizontal: [0, 1, 2, 3],
        vertical: [4],
        generates: '%color%HStripe' // the %color% gets replaced by the color of tile currently being swiped
    }, {
        horizontal: [3],
        vertical: [3],
        generates: '%color%Blob' // the %color% gets replaced by the color of tile currently being swiped
    }, {
        horizontal: [5],
        vertical: [0, 1, 2, 3],
        generates: 'master'
    }, {
        horizontal: [0, 1, 2, 3],
        vertical: [5],
        generates: 'master'
    }];

    // unique piece combos specifiy special explosion patterns for when you combine unqiue game pieces
    // for exmaple here we see...
    // combining a horizontal and vertical color stripe would result in a horizontalAndVertical blast  (see src/prefabs/explosions.js for more details)
    // combining a vertical and vertical color stripe would result in a horizontalAndVertical blast  (see src/prefabs/explosions.js for more details)
    // combining a horizontal and horizontal color stripe would result in a horizontalAndVertical blast  (see src/prefabs/explosions.js for more details)
    // combining a blob and blob would result in a biggerBlast blast (see src/prefabs/explosions.js for more details)
    // combining anything with a colorMatch would result in a colorMatch blast (see src/prefabs/explosions.js for more details)
    PiecSettings.uniquePieceCombos = [{
        type1: 'horizontal',
        type2: 'vertical',
        resultsIn: 'horizontalAndVertical'
    }, {
        type1: 'vertical',
        type2: 'vertical',
        resultsIn: 'horizontalAndVertical'
    }, {
        type1: 'horizontal',
        type2: 'horizontal',
        resultsIn: 'horizontalAndVertical'
    }, {
        type1: 'horizontal',
        type2: 'blast',
        resultsIn: 'horizontalAndVerticalBig'
    }, {
        type1: 'vertical',
        type2: 'blast',
        resultsIn: 'horizontalAndVerticalBig'
    }, {
        type1: 'blast',
        type2: 'horizontal',
        resultsIn: 'horizontalAndVerticalBig'
    }, {
        type1: 'blast',
        type2: 'vertical',
        resultsIn: 'horizontalAndVerticalBig'
    }, {
        type1: 'blast',
        type2: 'blast',
        resultsIn: 'biggerBlast'
    }, {
        type1: 'colorMatch',
        type2: 'horizontal',
        resultsIn: 'colorMatch',
        generates: ['horizontal', 'vertical']
    }, {
        type1: 'colorMatch',
        type2: 'vertical',
        resultsIn: 'colorMatch',
        generates: ['horizontal', 'vertical']
    }, {
        type1: 'colorMatch',
        type2: 'blast',
        resultsIn: 'colorMatch',
        generates: ['blast']
    }, {
        type1: 'colorMatch',
        type2: 'colorMatch',
        resultsIn: 'destroyAll'
    }, {
        type1: 'colorMatch',
        resultsIn: 'colorMatch'
    }, {
        type2: 'colorMatch',
        resultsIn: 'colorMatch'
    }];
}
