import Explosions from '../prefabs/explosions';
import * as Util from '../utils/util';

// get adjacent tile
export function getAdjacent(grid, tile, direction) {

    var xOffset = 0;
    var yOffset = 0;

    switch (direction) {
        case 'up':
            yOffset = -1;
            break;
        case 'down':
            yOffset = 1;
            break;
        case 'left':
            xOffset = -1;
            break;
        case 'right':
            xOffset = 1;
            break;
        case 'ur':
            xOffset = 1;
            yOffset = -1;
            break;
        case 'ul':
            xOffset = -1;
            yOffset = -1;
            break;
        case 'dr':
            xOffset = 1;
            yOffset = 1;
            break;
        case 'dl':
            xOffset = -1;
            yOffset = 1;
            break;
    }

    if (tile.properties.x + xOffset < 0 ||
        tile.properties.x + xOffset >= grid.length ||
        tile.properties.y + yOffset < 0 ||
        tile.properties.y + yOffset >= grid.length) {

        // out of range
        return null;
    }

    return grid[tile.properties.y + yOffset][tile.properties.x + xOffset];
}

export function getItemAt(grid, x, y) {

    if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) {
        return null;
    }

    return grid[y][x];
}

export function getAllAdjacentMatches(grid, tile, horizontal, vertical, adjacentMatches) {

    var adjacentMatches = adjacentMatches || [];

    var isTileMissing = false;

    PiecSettings.gridShape.forEach(function(mt) {

        if (mt.x === tile.properties.x && mt.y === tile.properties.y) {
            isTileMissing = true;
        }
    }, this);

    if (tile === null ||
        tile.properties.x === null ||
        tile.properties.y === null ||
        isTileMissing === true) {
        return adjacentMatches; // bail if tile is null
    }

    if (adjacentMatches.length === 0) {

        adjacentMatches.push(tile);
    }

    var original = adjacentMatches[0];

    var color = tile.properties.color;

    var originalColor = original.properties.color;

    if (adjacentMatches.length > 0 &&
        !this.contains(adjacentMatches, tile) &&
        color === originalColor) {

        adjacentMatches.push(tile);
    }

    if (horizontal === true) {

        var lTile = this.getAdjacent(grid, tile, 'left');
        var rTile = this.getAdjacent(grid, tile, 'right');

        if (lTile && !this.contains(adjacentMatches, lTile) && lTile.properties.color === originalColor) {
            //adjacentMatches.push(uTile);
            adjacentMatches = this.getAllAdjacentMatches(grid, lTile, horizontal, vertical, adjacentMatches);
        }
        if (rTile && !this.contains(adjacentMatches, rTile) && rTile.properties.color === originalColor) {
            //adjacentMatches.push(dTile);
            adjacentMatches = this.getAllAdjacentMatches(grid, rTile, horizontal, vertical, adjacentMatches);
        }
    }

    if (vertical === true) {
        var dTile = this.getAdjacent(grid, tile, 'down');
        var uTile = this.getAdjacent(grid, tile, 'up');

        if (uTile && !this.contains(adjacentMatches, uTile) && uTile.properties.color === originalColor) {
            //adjacentMatches.push(lTile);
            adjacentMatches = this.getAllAdjacentMatches(grid, uTile, horizontal, vertical, adjacentMatches);
        }
        if (dTile && !this.contains(adjacentMatches, dTile) && dTile.properties.color === originalColor) {
            //adjacentMatches.push(rTile);
            adjacentMatches = this.getAllAdjacentMatches(grid, dTile, horizontal, vertical, adjacentMatches);
        }
    }

    return adjacentMatches;
}


// get all tiles with same color
export function getLineMatches(grid, tile, minMatchAmount) {

    var tileMatches = {
        h: this.getAllAdjacentMatches(grid, tile, true, false, []),
        v: this.getAllAdjacentMatches(grid, tile, false, true, []),
    };

    var tiles = [];

    if (tileMatches.h.length >= minMatchAmount) {

        tiles = tiles.concat(tileMatches.h);
    }

    if (tileMatches.v.length >= minMatchAmount) {

        tiles = tiles.concat(tileMatches.v);
    }

    return {
        original: tile.properties,
        vMatches: tileMatches.v.length,
        hMatches: tileMatches.h.length,
        color: tile.properties.color,
        tiles: Util.uniq(tiles) // de-dupe
    };
}

export function contains(tiles, tile) {

    if (typeof tile === 'undefined') {
        return false;
    }

    for (var i = 0; i < tiles.length; i++) {

        if (tiles[i].properties.x === tile.properties.x &&
            tiles[i].properties.y === tile.properties.y) {

            return true;
        }
    }

    return false;
}

// get all tiles with same color
export function getAllMatches(grid, color) {

    var matches = [];

    for (var i = 0; i < grid.length; i++) {

        for (var j = 0; j < grid[i].length; j++) {

            if (grid[j][i] &&
                grid[j][i].properties.color === color) {
                matches.push(grid[j][i]);
            }
        }
    }

    return matches;
}

export function getLinear(grid, tile, vertical, horizontal, slopeDown, slopeUp) {

    var matches = [];

    var explodeSeq = (tile.properties.explodeSeq || 0);

    for (var i = 0; i < grid.length; i++) {

        for (var j = 0; j < grid[i].length; j++) {

            if (grid[j][i] === null) {
                continue;
            }

            if (vertical === true &&
                i === tile.properties.x) {

                // used for staggered delays during explosions
                grid[j][i].properties.explodeSeq = explodeSeq + Math.abs(tile.properties.y - j);

                matches.push(grid[j][i]);
            }

            if (horizontal === true &&
                j === tile.properties.y) {

                // used for staggered delays during explosions
                grid[j][i].properties.explodeSeq = explodeSeq + Math.abs(tile.properties.x - i);

                matches.push(grid[j][i]);
            }

            if (slopeDown === true &&
                j - tile.properties.y === i - tile.properties.x) {

                // used for staggered delays during explosions
                grid[j][i].properties.explodeSeq = explodeSeq + Math.abs(tile.properties.x - i);

                matches.push(grid[j][i]);
            }

            if (slopeUp === true &&
                j - tile.properties.y === tile.properties.x - i) {

                // used for staggered delays during explosions
                grid[j][i].properties.explodeSeq = explodeSeq + Math.abs(tile.properties.x - i);

                matches.push(grid[j][i]);
            }
        }
    }

    return matches;
}

export function getWithBlastRadius(grid, tile, blastRadius) {

    var matches = [];

    for (var i = 0; i < grid.length; i++) {

        for (var j = 0; j < grid[i].length; j++) {

            if (grid[j][i] &&
                grid[j][i].properties.x <= tile.properties.x + blastRadius &&
                grid[j][i].properties.x >= tile.properties.x - blastRadius &&
                grid[j][i].properties.y <= tile.properties.y + blastRadius &&
                grid[j][i].properties.y >= tile.properties.y - blastRadius) {

                // used for staggered delays during explosions
                grid[j][i].properties.explodeSeq = (tile.properties.explodeSeq || 0);

                matches.push(grid[j][i]);
            }
        }
    }

    return matches;
}

export function getRandomColor() {

    var colors = [];

    for (var i = 0; i < PiecSettings.tileTypes; i++) {

        colors.push(PiecSettings.tiles[i].color);
    }

    return colors[Math.floor(Math.random() * colors.length)];
}


export function getMatches(grid, tile, explosion, color) {

    if (explosion.colorMatch === true) {

        if (!color && PiecSettings.tiles[tile.properties.tileType].colorMatch) {
            color = PiecSettings.tiles[tile.properties.tileType].colorMatch;
        }

        if (!color) {
            // color = this.getRandomColor();

            return [];
        }

        var matches = this.getAllMatches(grid, color);

        matches.push(tile);

        return matches;
    }

    if (explosion.horizontal === true ||
        explosion.vertical === true ||
        explosion.slopeUp === true ||
        explosion.slopeDown === true) {

        var blasted = [];

        var matches = [];

        if (explosion.blastRadius > 0) {

            blasted = this.getWithBlastRadius(grid, tile, explosion.blastRadius);

            blasted.forEach(function(t) {

                matches = matches.concat(this.getLinear(
                    grid,
                    t,
                    explosion.vertical,
                    explosion.horizontal,
                    explosion.slopeUp,
                    explosion.slopeDown));

            }, this);

            //re-order explode seq

            var xDiff, yDiff;

            matches.forEach(function(m) {

                xDiff = Math.abs(tile.properties.x - m.properties.x);
                yDiff = Math.abs(tile.properties.y - m.properties.y);

                m.properties.explodeSeq = xDiff > yDiff ? xDiff : yDiff;

            }, this);

            matches = Util.uniq(matches);

            // if (explosion.horizontalAndVerticalBig === true) {


            //     //remove middle tiles from destruction path

            //     // matches.forEach(function(m) {


            //     //     if (m.properties.x >= tile.properties.x - 1 &&
            //     //         m.properties.x <= tile.properties.x + 1 &&
            //     //         m.properties.y >= tile.properties.y - 1 &&
            //     //         m.properties.y <= tile.properties.y + 1) {

            //     //         Util.remove(matches, m);
            //     //     } 

            //     // }, this);
            // }

            return matches;

        } else {

            return this.getLinear(
                grid,
                tile,
                explosion.vertical,
                explosion.horizontal,
                explosion.slopeUp,
                explosion.slopeDown);

        }

    }

    if (explosion.blastRadius > 0) {

        return this.getWithBlastRadius(grid, tile, explosion.blastRadius);
    }


    if (explosion.destroyAll === true) {
        return this.getDestroyAll(grid, tile);
    }
}

export function getDestroyAll(grid, tile) {

    var matches = [];

    var distX, distY;

    for (var i = 0; i < grid.length; i++) {

        for (var j = 0; j < grid[i].length; j++) {

            distX = Math.abs(tile.properties.x - grid[j][i].properties.x);
            distY = Math.abs(tile.properties.y - grid[j][i].properties.y);

            // used for staggered delays during explosions
            grid[j][i].properties.explodeSeq = distX > distY ? distX : distY;

            matches.push(grid[j][i]);
        }
    }

    return matches;
}

export function getTilesToDestroy(tiles, tile) {

    if (!tile) {
        return [];
    }

    var tileType = PiecSettings.tiles[tile.properties.tileType];

    var tilesToDestroy = [];

    if (typeof tileType.explode !== 'undefined') {

        var explosion = Explosions[tileType.explode];

        tilesToDestroy = this.getMatches(
            tiles,
            tile,
            explosion);
    }

    return tilesToDestroy;
}

export function getAllTilesToDestroy(tiles, tile, tilesToDestroy) {

    var newTiles = [];

    tilesToDestroy = tilesToDestroy || [];

    var tmpArr = this.getTilesToDestroy(tiles, tile);

    tmpArr.forEach(function(ttd) {

        if (!this.containsTile(tilesToDestroy, ttd)) {
            tilesToDestroy.push(ttd);

            newTiles.push(ttd);
        }

    }, this);

    newTiles.forEach(function(nt) {

        tilesToDestroy = this.getAllTilesToDestroy(tiles, nt, tilesToDestroy);
    }, this);


    return tilesToDestroy;
}


export function containsTile(tiles, tile) {

    var contains = false;

    for (var i = 0; i < tiles.length; i++) {

        if (tile &&
            tiles[i] &&
            tiles[i].properties.x === tile.properties.x &&
            tiles[i].properties.y === tile.properties.y) {

            return true;
        }
    }

    return contains;
}


export function getRndTile(grid) {

    return getItemAt(
        grid,
        Util.rndInt(PiecSettings.fieldSize - 1, 0),
        Util.rndInt(PiecSettings.fieldSize - 1, 0));
}

export function getTileType(tile) {

    return PiecSettings.tiles[tile.properties.tileType];
}

export function getTileTypes(color, explode) {

    var tileTypes = [];

    PiecSettings.tiles.forEach(function(t) {

        if ((!color || t.color === color) &&
            (!explode || t.explode === explode)) {

            tileTypes.push(t);
        }
    }, this);

    return tileTypes;
}

export function getAllUniqueGamePieces(grid) {

    var uniqueGamePieces = [];

    var tile, tileType;

    for (var i = 0; i < PiecSettings.fieldSize; i++) {
        for (var j = 0; j < PiecSettings.fieldSize; j++) {

            tile = this.getItemAt(grid, i, j);

            tileType = this.getTileType(tile);

            if (typeof tileType.explode !== 'undefined') {
                uniqueGamePieces.push(tile);
            }
        }
    }

    return uniqueGamePieces;
}


export function getAllTilesByColor(grid, color) {

    var tiles = [];

    var tile, tileType;

    for (var i = 0; i < PiecSettings.fieldSize; i++) {
        for (var j = 0; j < PiecSettings.fieldSize; j++) {

            tile = this.getItemAt(grid, i, j);

            if (tile !== null) {

                tileType = this.getTileType(tile);

                if (tile.properties.color === color) {
                    tiles.push(tile);
                }
            }
        }
    }

    return tiles;
}
