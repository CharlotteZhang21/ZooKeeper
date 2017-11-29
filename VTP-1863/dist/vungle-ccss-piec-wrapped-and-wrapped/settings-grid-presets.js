var PiecSettings = PiecSettings || {};


var sShape = [{
    x: 2,
    y: 1
}, {
    x: 3,
    y: 1
}, {
    x: 4,
    y: 1
}, {
    x: 5,
    y: 1
}, {
    x: 6,
    y: 1
}, {
    x: 2,
    y: 2
}, {
    x: 2,
    y: 3
}, {
    x: 2,
    y: 4
}, {
    x: 3,
    y: 4
}, {
    x: 4,
    y: 4
}, {
    x: 5,
    y: 4
}, {
    x: 6,
    y: 4
}, {
    x: 6,
    y: 5
}, {
    x: 6,
    y: 6
}, {
    x: 6,
    y: 7
}, {
    x: 2,
    y: 7
}, {
    x: 3,
    y: 7
}, {
    x: 4,
    y: 7
}, {
    x: 5,
    y: 7
}, {
    x: 6,
    y: 7
}];

var diagonal = [{
    x: 0,
    y: 0
}, {
    x: 1,
    y: 1
}, {
    x: 2,
    y: 2
}, {
    x: 3,
    y: 3
}, {
    x: 4,
    y: 4
}, {
    x: 5,
    y: 5
}, {
    x: 6,
    y: 6
}, {
    x: 7,
    y: 7
}, {
    x: 8,
    y: 8
}];

var squareHole = [{
    x: 4,
    y: 4
}, {
    x: 4,
    y: 5
}, {
    x: 5,
    y: 4
}, {
    x: 5,
    y: 5
}];

var noCorners = [{
    x: 0,
    y: 8
}, {
    x: 0,
    y: 7
}, {
    x: 1,
    y: 8
}, {
    x: 8,
    y: 8
}, {
    x: 8,
    y: 7
}, {
    x: 7,
    y: 8
}, {
    x: 0,
    y: 0
}, {
    x: 1,
    y: 0
}, {
    x: 0,
    y: 1
}, {
    x: 8,
    y: 0
}, {
    x: 7,
    y: 0
}, {
    x: 8,
    y: 1
}];

var line = [{
    x: 3,
    y: 0
}, {
    x: 3,
    y: 1
}, {
    x: 3,
    y: 2
}, {
    x: 3,
    y: 3
}, {
    x: 3,
    y: 4
}, {
    x: 3,
    y: 5
}, {
    x: 3,
    y: 6
}, {
    x: 3,
    y: 7
}, {
    x: 3,
    y: 8
}];

// hole
var hole = [{
    x: 3,
    y: 4
}, {
    x: 4,
    y: 4
}, {
    x: 4,
    y: 3
}, {
    x: 6,
    y: 6
}, {
    x: 6,
    y: 7
}, {
    x: 6,
    y: 8
}, {
    x: 1,
    y: 0
}, {
    x: 1,
    y: 1
}, {
    x: 1,
    y: 2
}];

// heart
var heart = [
    { x: 3, y: 8 },
    { x: 2, y: 7 },
    { x: 1, y: 6 },
    { x: 0, y: 5 },
    { x: 0, y: 6 },
    { x: 0, y: 7 },
    { x: 1, y: 7 },
    { x: 1, y: 8 },
    { x: 2, y: 8 },
    { x: 0, y: 8 },
    { x: 5, y: 8 },
    { x: 6, y: 7 },
    { x: 7, y: 6 },
    { x: 8, y: 5 },
    { x: 8, y: 6 },
    { x: 7, y: 7 },
    { x: 8, y: 7 },
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
    { x: 4, y: 0 },
    { x: 8, y: 0 },
    { x: 0, y: 0 }
];

PiecSettings.gridShapeConfig = {
    noCorners: noCorners,
    line: line,
    hole: hole,
    heart: heart,
    squareHole: squareHole,
    diagonal: diagonal,
    sShape: sShape
};

PiecSettings.gridShapeConfigs = [
    PiecSettings.gridShapeConfig.noCorners,
    PiecSettings.gridShapeConfig.line,
    PiecSettings.gridShapeConfig.hole,
    PiecSettings.gridShapeConfig.squareHole,
    PiecSettings.gridShapeConfig.diagonal,
    PiecSettings.gridShapeConfig.sShape
];

PiecSettings.randomGridShape = function() {
    return PiecSettings.gridShapeConfigs[rndInt(PiecSettings.gridShapeConfigs.length - 1, 0)];
};

function rndInt(max, min) {

    if (!min) {
        min = 0;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
