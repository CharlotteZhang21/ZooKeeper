export function arrayToPolygonEdges(gridSize, missingTiles) {

    var polygonEdgesAll = [];

    var isMissing;

    for (var i = 0; i < gridSize; i++) {

        for (var j = 0; j < gridSize; j++) {

            isMissing = false;

            missingTiles.forEach(function(mt) {

                if (mt.x === i && mt.y === j) {

                    isMissing = true;
                }

            }, this);

            if (isMissing === false) {

                // top edge
                polygonEdgesAll.push({
                    startX: i,
                    startY: j,
                    endX: i + 1,
                    endY: j,
                    type: 'top'
                });

                // left edge
                polygonEdgesAll.push({
                    startX: i,
                    startY: j,
                    endX: i,
                    endY: j + 1,
                    type: 'left'
                });

                // right edge
                polygonEdgesAll.push({
                    startX: i + 1,
                    startY: j,
                    endX: i + 1,
                    endY: j + 1,
                    type: 'right'
                });

                // bottom edge
                polygonEdgesAll.push({
                    startX: i,
                    startY: j + 1,
                    endX: i + 1,
                    endY: j + 1,
                    type: 'bottom'
                });
            }
        }
    }

    var polygonEdges = [];
    var edgeCount = 0;

    polygonEdgesAll.forEach(function(pe1) {

        edgeCount = 0;

        polygonEdgesAll.forEach(function(pe2) {

            if (pe1.startX === pe2.startX &&
                pe1.startY === pe2.startY &&
                pe1.endX === pe2.endX &&
                pe1.endY === pe2.endY) {

                edgeCount++;
            }

        }, this);

        // if edge only matches with itself it is unqiue (ie a true edge)
        if (edgeCount <= 1) {

            polygonEdges.push(pe1);
        }

    }, this);

    return polygonEdges;
}

export function getLines(edges) {

    var item = this.getFirstUnconnected(edges);

    item.connectedAtStart = true;

    var lines = [];

    var orderedEdges;

    var sanityCheck = 0;

    while (item !== null) {

        orderedEdges = [];

        while (item !== null && sanityCheck < 1000) {


            item = this.getConnected(item, edges);

            if (item !== null) {

                orderedEdges.push(item.coords);

                item = item.item;

                item.isConnected = true;
            }

            sanityCheck++;
        }

        if (orderedEdges.length > 0) {
            lines.push(orderedEdges);
        }

        item = this.getFirstUnconnected(edges);
    }

    return lines;
}

export function getFirstUnconnected(edges) {

    for (var i = 0; i < edges.length; i++) {
        if (typeof edges[i].isConnected === 'undefined') {
            return edges[i];
        }
    }

    return null;
}

export function getConnected(edge, edges) {

    for (var i = 0; i < edges.length; i++) {

        if (edges[i].isConnected !== true) {

            if (edge.connectedAtStart !== false) {

                if (edge.endX === edges[i].startX &&
                    edge.endY === edges[i].startY) {

                    edges[i].connectedAtStart = true;

                    return {
                        item: edges[i],
                        coords: {
                            type: edges[i].type,
                            x: edges[i].startX,
                            y: edges[i].startY
                        }
                    };
                }

                if (edge.endX === edges[i].endX &&
                    edge.endY === edges[i].endY) {

                    edges[i].connectedAtStart = false;

                    return {
                        item: edges[i],
                        coords: {
                            type: edges[i].type,
                            x: edges[i].endX,
                            y: edges[i].endY
                        }
                    };
                }

            } else {

                if (edge.startX === edges[i].startX &&
                    edge.startY === edges[i].startY) {

                    edges[i].connectedAtStart = true;

                    return {
                        item: edges[i],
                        coords: {
                            type: edges[i].type,
                            x: edges[i].startX,
                            y: edges[i].startY
                        }
                    };
                }

                if (edge.startX === edges[i].endX &&
                    edge.startY === edges[i].endY) {

                    edges[i].connectedAtStart = false;

                    return {
                        item: edges[i],
                        coords: {
                            type: edges[i].type,
                            x: edges[i].endX,
                            y: edges[i].endY
                        }
                    };
                }

            }
        }
    }

    return null;
}

export function getOffset(edge, previousEdge) {

    var padding = 0.8;


    switch (edge.type) {
        case 'left':
            return {
                x: padding * -1,
                y: previousEdge.type === 'top' ? padding * -1 : (previousEdge.type === 'bottom' ? padding * 1 : 0)
            };
        case 'right':
            return {
                x: padding,
                y: previousEdge.type === 'top' ? padding * -1 : (previousEdge.type === 'bottom' ? padding * 1 : 0)
            };
        case 'top':
            return {
                x: previousEdge.type === 'left' ? padding * -1 : (previousEdge.type === 'right' ? padding * 1 : 0),
                y: padding * -1
            };
        case 'bottom':
            return {
                x: previousEdge.type === 'left' ? padding * -1 : (previousEdge.type === 'right' ? padding * 1 : 0),
                y: padding
            };
    }
}

export function linesToSvgPolygon(lines, gridSize) {

    var svgPolygon = '';

    var lineCounter;

    var x, y, previousEdge, offset;

    lines.forEach(function(l1) {

        // l1.push(l1[0]); // re-add initial to the end to close the path

        for (var i = 0; i < l1.length; i++) {

            x = (l1[i].x / gridSize) * 100;
            y = (l1[i].y / gridSize) * 100;

            if (i === 0) {
                previousEdge = l1[l1.length - 1];
            } else {
                previousEdge = l1[i - 1];
            }

            offset = this.getOffset(l1[i], previousEdge);

            x = x + offset.x;
            y = y + offset.y;

            if (i === 0) {
                svgPolygon += 'M' + x + ' ' + y + ' ';
            }

            svgPolygon += 'L' + x + ' ' + y + ' ';
        }

        svgPolygon += ' Z';

    }, this);

    return svgPolygon;
}
