
function print(string) {
    console.log("StartEngine :: " + string);
}

function warn(string) {
    console.warn("StartEngine :: " + string);
}

function error(string) {
    console.error("StartEngine :: " + string);
}


function Engine(canvasId) {

    this.canvas = document.getElementById(canvasId);
    this.context = canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.keys = new Array(256);
    for(var i = 0; i < 256; i++) {
        this.keys[i] = false;
    }

    window.addEventListener("keydown", function(e) {
        this.keys[e.keyCode] = true;
    }.bind(this), false);

    window.addEventListener("keyup", function(e) {
        this.keys[e.keyCode] = false;
    }.bind(this), false);

    this.key = function(string) {
        var code;
        if(string.length === 1) code = string.charCodeAt(0);
        else if(string === "SPACE") code = 32;
        else if(string === "LEFT") code = 37;
        else if(string === "UP") code = 38;
        else if(string === "RIGHT") code = 39;
        else if(string === "DOWN") code = 40;
        if(code != null) return this.keys[code];
        return false;
    }



    this.canvas.addEventListener("mousedown",function() {
        var e = {
            x: event.x - this.canvas.offsetLeft,
            y: event.y - this.canvas.offsetTop,
            button: event.button
        };
        this.onMouseDown(e);
    }.bind(this), false);

    this.canvas.addEventListener("mouseup",function() {
        var e = {
            x: event.x - this.canvas.offsetLeft,
            y: event.y - this.canvas.offsetTop,
            button: event.button
        };
        this.onMouseUp(e);
    }.bind(this), false);

    this.canvas.addEventListener("mousemove",function() {
        var e = {
            x: event.x - this.canvas.offsetLeft,
            y: event.y - this.canvas.offsetTop,
            button: event.button
        };
        this.onMouseMove(e);
    }.bind(this), false);

    this.canvas.addEventListener("mousewheel",function() {
        var e = {
            x: event.x - this.canvas.offsetLeft,
            y: event.y - this.canvas.offsetTop,
            delta: event.wheelDeltaY
        };
        this.onMouseWheel(e);
    }.bind(this), false);

    this.onMouseDown = function(e) {}
    this.onMouseUp = function(e) {}
    this.onMouseMove = function(e) {}
    this.onMouseWheel = function(e) {}

    this.start = function() {
        this.init();
        this.running = true;
        this.last = this.getMillis();
        this.loop();
    }

    this.stop = function() {
        this.running = false;
    }

    this.loop = function() {
        var now = this.getMillis();
        var delta = now - this.last;
        this.ups = Math.round(1000 / delta);
        this.fps = this.ups;
        this.update();
        this.render(this.context);
        this.last = now;
        if(this.running) requestAnimationFrame(this.loop.bind(this));
    }

    this.update = function() {}
    this.render = function(context) {}
    this.init = function() {}

    this.clear = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.getMillis = function() {
        return new Date().getMilliseconds();
    }
}


function Sprite(width, height, pixels) {
    this.width = width;
    this.height = height;
    var c = document.createElement("canvas");
    c.width = this.width;
    c.height = this.height;
    var context = c.getContext("2d");
    var pixel = context.createImageData(1, 1);
    for(var x=0; x<this.width; x++) {
        for(var y=0; y<this.height; y++) {
            var g = pixels[x + y * this.width];
            pixel.data[0] = g; //r;
            pixel.data[1] = g; //g;
            pixel.data[2] = g; //b;
            pixel.data[3] = 255;
            context.putImageData(pixel, x, y);
        }
    }
    this.image = context.getImageData(0, 0, this.width, this.height);
    this.render = function(x, y, context) {
        context.putImageData(this.image, x, y);
    }
}




function Vector(x, y, z) {
    if(x == null || y == null) {
        warn("Vector Args Undefined");
        return;
    }
    if(z == null) return new Vector2(x, y);
    return new Vector3(x, y, z);
}

function Vector2(x, y) {
    this.x = x;
    this.y = y;
    this.add = function(v) {
        var vx = this.x + v.x;
        var vy = this.y + v.y;
        return new Vector2(vx, vy);
    }
    this.sub = function(v) {
        var vx = this.x - v.x;
        var vy = this.y - v.y;
        return new Vector2(vx, vy);
    }
    this.dot = function(v) {
        return this.x * v.x + this.y * v.y;
    }
    this.normalize = function() {
        var m = this.magnitude();
        var vx = this.x / m;
        var vy = this.y / m;
        return new Vector2(vx, vy);
    }
    this.magnitude = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.add = function(v) {
        var vx = this.x + v.x;
        var vy = this.y + v.y;
        var vz = this.z;
        if(v.z != null) vz = this.z + v.z;
        return new Vector3(vx, vy, vz);
    }
    this.sub = function(v) {
        var vx = this.x - v.x;
        var vy = this.y - v.y;
        var vz = this.z;
        if(v.z != null) vz = this.z - v.z;
        return new Vector3(vx, vy, vz);
    }
    this.dot = function(v) {
        if(v.z == null) return this.x * v.x + this.y * v.y;
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    this.cross = function(v) {
        if(v.z == null) return;
        var vx = this.y * v.z - this.z * v.y;
        var vy = this.z * v.x - this.x * v.z;
        var vz = this.x * v.y - this.y * v.x;
        return new Vector3(vx, vy, vz);
    }
    this.normalize = function() {
        var m = this.magnitude();
        var vx = this.x / m;
        var vy = this.y / m;
        var vz = this.z / m;
        return new Vector3(vx, vy, vz);
    }
    this.magnitude = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}




function SeededRandom(seed) {
    this.seed = seed;
    this.next = function() {
        this.seed = Math.sin(this.seed) * 10000;
        return this.seed - Math.floor(this.seed);
    }
    this.nextInt = function() {
        return Math.floor(this.next() * 9007199254740991);
    }
}

function Noise1(seed, octaves, persistence, frequency) {
    this.seed = seed;
    this.octaves = octaves;
    this.persistence = persistence;
    this.frequency = frequency;

    this.generate = function(x) {
        var total = 0;
        var freq = this.frequency;
        var amp = this.persistence;
        for(var i = 0; i < this.octaves; i++) {
            total += this.interpolateNoise(x * freq) * amp;
            freq *= 2;
            amp *= this.persistence;
        }
        return (total + 1) / 2;
    }

    this.interpolateNoise = function(x) {
        var intx = Math.floor(x);
        var fractx = x - intx;
        var v1 = this.smoothNoise(intx);
        var v2 = this.smoothNoise(intx + 1);
        return this.interpolate(v1, v2, fractx);
    }

    this.interpolate = function(a, b, x) {
        var ft = x * 3.1415927;
        var f = (1 - Math.cos(ft)) * .5;
        return  a * (1 - f) + b * f;
    }

    this.smoothNoise = function(x) {
        return this.getNoise(x) / 2 + this.getNoise(x - 1) / 4 + this.getNoise(x + 1) / 4;
    }

    this.getNoise = function(x) {
        var rng = new SeededRandom(this.hash(x, this.seed));
        var r = rng.nextInt();
        return (r & 32767) / 32767 - .5;
    }

    this.hash = function(x, y) {
        var a = x >= 0 ? 2 * x : -2 * x - 1;
        var b = y >= 0 ? 2 * y : -2 * y - 1;
        return a >= b ? a * a + a + b : a + b * b;
    }
}

function Noise2(seed, octaves, persistence, frequency) {
    this.seed = seed;
    this.octaves = octaves;
    this.persistence = persistence;
    this.frequency = frequency;

    this.generate = function(x, y) {
        var total = 0;
        var freq = this.frequency;
        var amp = this.persistence;
        for(var i = 0; i < this.octaves; i++) {
            total += this.interpolateNoise(x * freq, y * freq) * amp;
            freq *= 2;
            amp *= this.persistence;
        }
        return (total + 1) / 2;
    }

    this.interpolateNoise = function(x, y) {
        var intx = Math.floor(x);
        var fractx = x - intx;
        var inty = Math.floor(y);
        var fracty = y - inty;
        var v1 = this.smoothNoise(intx, inty);
        var v2 = this.smoothNoise(intx + 1, inty);
        var v3 = this.smoothNoise(intx, inty + 1);
        var v4 = this.smoothNoise(intx + 1, intx + 1);
        var i1 = this.interpolate(v1, v2, fractx);
        var i2 = this.interpolate(v3, v4, fractx);
        return this.interpolate(i1, i2, fracty);
    }

    this.interpolate = function(a, b, x) {
        var ft = x * 3.1415927;
        var f = (1 - Math.cos(ft)) * .5;
        return  a * (1 - f) + b * f;
    }

    this.smoothNoise = function(x, y) {
        var corners = (this.getNoise(x-1, y-1) + this.getNoise(x+1, y-1) + this.getNoise(x-1, y+1) + this.getNoise(x+1, y+1) ) / 16;
        var sides   = (this.getNoise(x-1, y) + this.getNoise(x+1, y) + this.getNoise(x, y-1) + this.getNoise(x, y+1) ) / 8;
        var center = this.getNoise(x, y) / 4;
        return corners + sides + center;
    }

    this.getNoise = function(x, y) {
        var rng = new SeededRandom(this.hash(this.hash(x, y), this.seed));
        var r = rng.nextInt();
        return (r & 32767) / 32767 - .5;
    }

    this.hash = function(x, y) {
        var a = x >= 0 ? 2 * x : -2 * x - 1;
        var b = y >= 0 ? 2 * y : -2 * y - 1;
        return a >= b ? a * a + a + b : a + b * b;
    }
}
/**
 * Created by session2 on 1/6/16.
 */