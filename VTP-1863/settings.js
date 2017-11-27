var PiecSettings = PiecSettings || {};

PiecSettings.numberOfInteractions = 1; // number of interactions before the end card is shown
PiecSettings.numberOfMovesBeforeCtaShown = 0; // the number of moves neded for the CTA to be displayed
PiecSettings.isSwipe = true; // tap or swipe control
PiecSettings.fieldSize = 7; // number of tiles per row/column
PiecSettings.tileTypes = 6; // different kind of tiles allowed
PiecSettings.fallDuration = 1000; // time it takes for the tiles to fall
PiecSettings.fallEasing = Phaser.Easing.Quadratic.In; // easing for the tiles falling (see http://phaser.io/docs/2.4.4/Phaser.Easing.html)
PiecSettings.fallUpwards = false; // if true the tiles fall upwards rather than down
PiecSettings.tilesReplenish = true; // if true, new tiles keep generating above/below the grid after explosions
// PiecSettings.particleEmitter = !(/android/i.test(navigator.userAgent)); //if true particle emitter used to emit tiny tile fragments on destruction (quite heavy so disabled for android)
PiecSettings.staggerDestroyDelay = 50; // the small stagger delay for the destruction of tiles (eg a rocket destroys tiles as it flies along)
PiecSettings.iconsFrameWidth = 82;
PiecSettings.createBackGroundGrid = true;
PiecSettings.tileSquash = false;
PiecSettings.TileBounceStrength = 0.2; //value between 0 and 1
PiecSettings.TileBounceScalar = 4.4;

PiecSettings.combineAnimation = {
    name: 'combine', // name of your animation
    img: 'combine.png', // the name of your png sequence image
    frames: 15, // number of frames the png sequence contains
    frameWidth: 128, // the width of each frame with the png sequence
    frameHeight: 128, // the height of each frame with the png sequence
    frameRate: 60, // the frame rate at which this animaiton should be played at
    scale: 3.0, // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
    alpha: 1.0 // the opacity of the animation
};


PiecSettings.combineDelay = 150; // the delay before tiles combine to form new ones (this time is used to play the combine animation above)

// PiecSettings.gridShape = PiecSettings.gridShapeConfig.sShape;
PiecSettings.gridShape = [];

// when you complete the game you are rewarded special tiles that explode systematically
PiecSettings.rewardTiles = {
    possibleTiles: [], // list of possible reward tiles, the number matches the id in tiles (see above), eg here we can be rewarded rockets and tnts
    numberRewarded: 0, // number of tiles rewarded
    rewardDelay: 250 // delay before rewarding starts
};
