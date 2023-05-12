import { createNoise3D, createNoise2D } from 'simplex-noise';
import canvasSketch from 'canvas-sketch';
import { random, randomChoice, map } from './utils';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
    duration: 3,
    fps: 30,
};

const pallete = ['#FF6A5A', '#FFB350', '#B83564', '#FFFFFF'];
const bgCol = '#272D4D';

function triangle(ctx, x, y, h) {
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(random(-Math.PI, Math.PI));
    ctx.beginPath();
    var sides = 3;
    var a = (Math.PI * 2) / sides;
    ctx.moveTo(h, 0);
    for (var i = 1; i < sides + 1; i++) {
        ctx.lineTo(h * Math.cos(a * i), h * Math.sin(a * i));
    }
    ctx.closePath();
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset the transform
}

function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function square(ctx, x, y, w) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(random(-Math.PI, Math.PI));
    ctx.fillRect(-w, -w, w, w);
    ctx.restore();
}

const sketch = ({ context, width, height }) => {
    let color = randomChoice(pallete);

    context.fillStyle = bgCol;
    context.fillRect(0, 0, width, height);
    let x = random(0, width);
    let y = random(0, height);
    let count = 0;
    let currentLen = 0;
    let noiseFn = createNoise2D();
    const maxLen = 20;
    let thicknessCoef = random(5, 20);
    let step = 2;

    return ({ context, width, height }) => {
        /* context.fillStyle = bgCol; */
        /* context.fillRect(0, 0, width, height); */

        if (count > 40) {
            return;
        }

        context.fillStyle = color;
        for (let i = currentLen; i < Math.min(currentLen + step, maxLen); i++) {
            [x, y] = nextPoint(x, y, noiseFn);
            const m = map(i, 0, maxLen, 0, Math.PI);
            let thickness = Math.sin(m) * thicknessCoef;
            const rnd = random();
            if (rnd > 0.66) {
                circle(context, x, y, thickness);
            } else if (rnd > 0.33) {
                square(context, x, y, thickness * 1.5, thickness * 1.5);
            } else {
                triangle(context, x, y, thickness * 1.5, thickness * 1.5);
            }
        }
        currentLen += step;

        if (currentLen >= maxLen) {
            currentLen = 0;
            x = random(0, width);
            y = random(0, height);
            color = randomChoice(pallete);
            noiseFn = createNoise2D();
            thicknessCoef = random(5, 12);
            count++;
        }
    };
};

canvasSketch(sketch, settings);

function nextPoint(x, y, noiseFn, noiseStep = 0.0003) {
    let angle = noiseFn(x * noiseStep, y * noiseStep) * 80;
    x += Math.cos(angle) * random(30, 50);
    y += Math.sin(angle) * random(30, 50);
    if (x < 0) {
        x = settings.dimensions[0] + x;
    }
    if (y < 0) {
        y = settings.dimensions[1] + y;
    }
    x = x % settings.dimensions[0];
    y = y % settings.dimensions[1];
    return [x, y];
}
