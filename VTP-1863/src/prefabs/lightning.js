import * as CustomTileEvents from '../utils/custom-tile-events';
import * as Util from '../utils/util';

class Lightning extends Phaser.Graphics {

    //initialization code in the constructor
    constructor(game, x1, y1, x2, y2) {

        super(game);

        this.settings = {
            particles: [],
            frame: 0,
            amplitude: 6,
            distance: 0.1,
            distanceVarient: 10,
            ghostingEffect: 0.225,
            originY: y1,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        };

        this.anchor.setTo(0.5, 0.5);

        var xDelta = x2 - x1;
        var yDelta = y2 - y1;

        var delta = Math.sqrt((xDelta * xDelta) + (yDelta * yDelta));

        var xMax = x1 + delta;

        var distance, x, y, particle;

        var angleDeg = Math.atan2(yDelta, xDelta) * 180 / Math.PI;

        var previous = particle = {
            x: x1,
            y: y1
        };

        do {
            distance = this.settings.distance + this.settings.distanceVarient * Math.random();
            x = previous.x + distance;
            y = previous.y;
            particle = {
                x: x,
                y: y
            };
            this.settings.particles.push(particle);
            previous = particle;
        } while (particle.x < xMax);

        game.add.existing(this);

        this.angle = angleDeg;

        this.pivot.x = x1;
        this.pivot.y = y1;

        this.x = x1;
        this.y = y1;
    }

    randomColorHSLA(minHue, maxHue) {
        var h = Math.round(minHue + Math.random() * (maxHue - minHue)),
            s = '100%',
            l = '50%';
        return 'hsla(' + h + ',' + s + ',' + l + ',1)';
    }

    moveParticle(i) {
        var self = this.settings.particles[i];
        var next = this.settings.particles[i + 1];
        var prev = this.settings.particles[i - 1];

        var neighborsAttraction = 0; //0.5*((prev.y-next.y)/2);
        var medianAttraction = (this.settings.originY - self.y) * 0.1;
        var randomness = this.settings.amplitude / 2 - Math.random() * this.settings.amplitude;
        self.y += neighborsAttraction + medianAttraction + randomness;

        //TODO: move x in a similar way?
        self.x -= 0.05 * ((self.x - prev.x - (next.x - self.x)) / 2);
        var ampx = 4;
        self.x += ampx / 2 - Math.random() * ampx;
    }

    update() {

        this.clear();

        // this.beginPath();
        this.fillStyle = 'rgba(0,0,0,' + this.settings.ghostingEffect + ')';

        this.lineStyle(4, 0xFFFFFF, 1);

        var r = Math.floor(127 + 128 * Math.random()),
            g = Math.floor(256 * Math.random()),
            b = Math.floor(256 * Math.random());

        var particle = this.settings.particles[0];

        this.moveTo(particle.x, particle.y);

        for (var i = 1; i < this.settings.particles.length - 1; i++) {

            this.lineTo(
                this.settings.particles[i].x,
                this.settings.particles[i].y);

            // this.stroke();
            this.moveParticle(i);
        }

        // this.lineTo(
        //     this.settings.particles[this.settings.particles.length - 1].x, 
        //     this.settings.particles[this.settings.particles.length - 1].y);

        // this.stroke();

        // this.closePath();
    }

}

export default Lightning;
