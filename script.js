/**
 * Author: Anthony Valenzo
 * Disclaimer: Please do not redistribute this code.
 */

// This is the audio used for the game

let key = new Audio('https://bigsoundbank.com/UPLOAD/mp3/1065.mp3?v=d');
let door = new Audio('https://bigsoundbank.com/UPLOAD/mp3/1703.mp3?v=d');
let music = new Audio('https://drive.google.com/uc?id=1vz6Tiax8RGv8x30QUVLdf13h9E3JmHI4');

key.loaded = false;

key.addEventListener('canplaythrough', function() {
	key.loaded = true;
});

/**
 * Credit to Daniel lmms: https://stackoverflow.com/a/48036361/16557976 (Calculating FPS)
 * Source: setupCanvas() => https://www.html5rocks.com/en/tutorials/canvas/hidpi/ [Not my code]
 * Prototype Game Engine using '2D canvas'
 * 
 * Source: Calculate FPS https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html [Not my code]
 */

let version = "Pre Alpha 0.1.0";

// this is the windows animation request frame that switches the stage
let current_stage;

class TextBox {
    constructor(textInfo, ctx, canvas) {
        this.c_line = 0;
        this.c_char = 0;
        this.speed = 17;

        this.ctx = ctx;
        this.canvas = canvas;
        this.stringArray = textInfo;

        this.current = '';

        this.stringArray.forEach(e => {
            e = e.toString();
        });

        setInterval(() => {
            if (this.stringArray[this.c_line][this.c_char] !== undefined) {
                this.c_char++;
                if (key.loaded) {
                    key.currentTime = 0.94;
                    key.play();
                }
            } else {
                if (key.loaded) {
                	key.pause();
                }
            }
            this.current = this.stringArray[this.c_line].slice(0, this.c_char);
        }, 1000 / this.speed);

        this.canvas.addEventListener('keydown', (e) => {
            switch (e.key) {
                case "ArrowLeft":
                case "a":
                    this.prev();
                    break;
                case "ArrowRight":
                case "d":
                    this.next();
                    break;
            }
        });
    }

    prev() {
        if (this.stringArray[this.c_line - 1]) {
            this.c_line--;
        }

        this.c_char = 0;
    }

    next() {
        if (this.stringArray[this.c_line + 1]) {
            this.c_line++;
        }

        this.c_char = 0;
    }

    getCurrent() {
        return this.current;
    }
}

class Button {
    constructor(x = 0, y = 0, text, ctx, canvas) {
        this.canvas = canvas;
        this.ctx = ctx;
        this._ctx = new Array();
        this.x = x;
        this.y = y;
        this.text = text;
        this.bound = this.ctx.measureText(this.text);

        this.clickedBgColor = '#00f';
        this.hoveringBgColor = '#ff02';
        this.BgColor = '#000';
        
        this.clickedColor = '#ff0';
        this.hoveringColor = '#ff0';
        this.color = '#fff';

        this.isVisible = true;
        this.isHovering = false;
        this.isClicked = false;

        // PLEASE READ: The code below, does not work properly, Idk why :(

        this.w = this.bound.width * 3;
        this.h = this.bound.fontBoundingBoxAscent * 4;
    }

    onclick(callback) {
        this.callback = function() {
            callback.apply(this);
        };

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isVisible) {
                this.clientX = e.clientX - this.canvas.getBoundingClientRect().x;
                this.clientY = e.clientY - this.canvas.getBoundingClientRect().y;

                if (this.clientX > this.x &&
                    this.clientX < this.x + this.w &&
                    this.clientY < this.y + this.h &&
                    this.clientY > this.y) {
                    this.isHovering = true;

                } else {
                    this.isHovering = false;
                }
            }
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.isVisible) {
                this.clientX = e.clientX - this.canvas.getBoundingClientRect().x;
                this.clientY = e.clientY - this.canvas.getBoundingClientRect().y;

                if (this.clientX > this.x &&
                    this.clientX < this.x + this.w &&
                    this.clientY < this.y + this.h &&
                    this.clientY > this.y) {

                    this.click();
                    this.isClicked = true;

                    setTimeout(() => {
                        this.isClicked = !this.isClicked;
                    }, 100);
                }
            }
        });
    }

    click() {
        this.callback();
    }

    render() {
        if (this.isVisible) {
            this._ctx.fillStyle = this.ctx.fillStyle;

            if (this.isClicked) {
                this.ctx.fillStyle = this.clickedBgColor;
            } else if (this.isHovering) {
                this.ctx.fillStyle = this.hoveringBgColor;
            } else {
                this.ctx.fillStyle = this.BgColor;
            }

            this.ctx.fillRect(this.x, this.y, this.w, this.h);
            
            if (this.isClicked) {
                this.ctx.fillStyle = this.clickedColor;
            } else if (this.isHovering) {
                this.ctx.fillStyle = this.hoveringColor;
            } else {
                this.ctx.fillStyle = this.color;
            }
            
            this.ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h - 10);


            this.ctx.fillStyle = this._ctx.fillStyle;
        }
    }
}

const initialize = (canvas) => {
    // let dpr = window.devicePixelRatio || 1;
    // let rect = canvas.getBoundingClientRect();
    // canvas.width = rect.width * dpr;
    // canvas.height = rect.height * dpr;
    let ctx = canvas.getContext('2d');
    // ctx.scale(dpr, dpr);
    return ctx;
};

$("button").click(function() {
    key.currentTime = 0.94;
    key.play();
});

// Start of jQuery Code

$(".gameInventory .list").html("");

let inventory = [
    ["Phone", 7, false], // Item, Weight in Pounds
    ["Hand Crank Radio", 4, false],
    ["Some Snacks", 2, false],
    ["24 Water Bottle Pack", 29, false],
    ["Hand-cranked Flashlight", 1, false],
    ["Canteen", 5, false],
    ["Twinkies", 1, false],
    ["Diet Water", 20, false]
];

let c_inv = [];

let inv_cap = 3;
let selected = [];

for (let i = 0; i < inventory.length; i++) {
    $(".gameInventory .list").append(`
        <li>
            <input type="checkbox" id="invItem-${i}" item="${i}">
            <label class="btn" for="invItem-${i}">${inventory[i][0]}</label>
        </li>
    `);
}

$(".gameInventory .list input").click(function() {
    for (let i = 0; i < inventory.length; i++) {
        inventory[i][2] = false;
    }

    $(".gameInventory .list input:checked").each(function() {
        let index = $(this).attr("item");
        inventory[index][2] = true;

    });

    let slots = 0;
    let text_slots = $("h3.gameInventory_percentage");

    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i][2] === true) {
            slots += 1;
        }
    }

    text_slots.text(`${slots} / ${inv_cap} slots available`);

    if (slots / inv_cap > 1) {
        text_slots.addClass("disabled");
        $(".gameInvLeave").prop("disabled", true);
    } else {
        text_slots.removeClass("disabled");
        $(".gameInvLeave").prop("disabled", false);
    }
});


let suspense = new Audio("https://drive.google.com/uc?id=1EPQsT6iPygMugTecEmPJ7e-5fcn_kzzC");
let response;

$("#db_plan button[res=win]").click(function() {
    $("#db_plan").hide();
    $("#db_unsafe").show();
    response = 0;
});

$("#db_plan button[res=door]").click(function() {
    $("#db_plan").hide();
    $("#db_unsafe").show();
    response = 1;
});

$("#db_unsafe button[res=leave]").click(function() {
    if (response === 1) {
        $("#db_02").show();
        suspense.currentTime = 8;
        suspense.play();
    } else {
        $(".gameNav")
            .css("opacity", "0.3")
            .attr("readonly", "readonly")
            .hover(function() {
                $(".gameNav").css("opacity", "0.5");
            });
        setTimeout(() => {
            $(".gameNav").slideUp();
        }, 2000);
        $("#db_invLeave").show();
    }
    $("#db_unsafe").hide();
    $("#db_plan").hide();
});

$("#db_unsafe button[res=dont]").click(function() {
    $("#db_unsafe").hide();
    $("#db_plan").hide();
    $("#db_dont").show();
});

$("#gameInvButton").click(function() {
    $("#gameInv").slideToggle();
});

$(".dialogBox").hide();
$("#game_start").click(function() {
    $("#db_plan").show();
    $(this).hide();
});

// Canvas Game

let intro = (function() {
    let canvas = document.getElementById("intro");

    let CANVAS_WIDTH = 640,
        CANVAS_HEIGHT = 360;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    let ctx = initialize(canvas);

    let textInfo = [
        version,
        "You woke up.",
        "It's pitch black in your room.",
        "You check the time on your phone:",
        "\"July 4, 2022 9:06 AM\"",
        "You try to turn the lights on. It doesn't work.",
        "Bewildered, you go outside.",
        "\n",
        "The sun has disappeared.",
        "\n",
        "Press 'Shift' to skip",
        "\n",
    ];

    let text = new TextBox(textInfo, ctx, canvas);

    let prevB = new Button(0, 0, '[Previous]', ctx, canvas);
    let forwB = new Button(0, 0, '[Next]', ctx, canvas);
    let contB = new Button(0, 0, '[Continue]', ctx, canvas);

    contB.x = CANVAS_WIDTH / 2 - contB.w / 2;
    contB.y = CANVAS_HEIGHT / 2 - contB.h / 2;

    prevB.y = CANVAS_HEIGHT - prevB.h;
    forwB.y = CANVAS_HEIGHT - prevB.h;
    forwB.x = CANVAS_WIDTH - forwB.w;

    let clickFnCheck = () => {
        if (text.c_line === textInfo.length - 1) {
            contB.isVisible = true;
        } else {
            contB.isVisible = false;
        }

        if (text.c_line === 0) {
            prevB.isVisible = false;
        } else {
            prevB.isVisible = true;
        }

        if (text.c_line === 7) {
            door.play();
        } else {
            door.pause();
            door.currentTime = 0;
        }

        if (text.c_line === textInfo.length - 1) {
            forwB.isVisible = false;
        } else {
            forwB.isVisible = true;
        }
    };

    clickFnCheck();

    canvas.addEventListener("keydown", function(e) {
        if (e.key === 'Shift') {
            contB.click();
        }

        clickFnCheck();
    });

    contB.onclick(() => {
        $(".canvas_cont[stage='0']").fadeOut();

        setTimeout(() => {
            $(".gameWrapper").fadeIn();
        }, 1000);
    });

    prevB.onclick(() => {
        text.prev();
        clickFnCheck();
    });

    forwB.onclick(() => {
        text.next();
        clickFnCheck();
    });
    
    let prog = (function() {
        this.w = CANVAS_WIDTH;
        this.h = 1.5
        this.x = 0;
        this.y = CANVAS_HEIGHT- prevB.h - this.h;
        this.prCalc = () => {
            return text.c_line / (textInfo.length - 1);
        }
        
        return {
        	render: () => {
                this.pr = this.prCalc();
                
                ctx.fillStyle = "#333";
            	ctx.fillRect(this.x,this.y,this.w,this.h);	
                
                ctx.fillStyle = `rgba(${255},${255},${0},${1})`;
            	ctx.fillRect(this.x,this.y,this.w * this.pr,this.h);	
            }
        };
    })();

    const times = new Array();
    let fps;

    let loop = () => {
        ctx.fillStyle = "#0f111b";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = "#fff";

        ctx.textAlign = 'center';

        ctx.font = 'normal 24px monospace';

        ctx.fillText(text.getCurrent(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, prevB.y, CANVAS_WIDTH, prevB.h);

        contB.render();
        prevB.render();
        forwB.render();
        prog.render();

        ctx.fillStyle = "#fff";
        
        ctx.textAlign = 'left';
        ctx.fillText(`FPS: ${fps}`, 3, 24);

        current_stage = window.requestAnimationFrame(() => {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            loop();
        });
    };

    loop();
})();

let main = (function() {
    let gameWrapper = document.querySelector(".canvas_cont[stage='1']");
    let canvas = document.getElementById("main");

    let CANVAS_WIDTH = 640,
        CANVAS_HEIGHT = 360;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    let ctx = initialize(canvas);

    ctx.imageSmoothingEnabled = false;
    
    const times = new Array();
    let fps;

    let xCursor = 0,
        yCursor = 0;

    let keys = new Array();
    let camera = {
        x: 0,
        y: 0,
    };

    /*
    element.addEventListener 'listens for a specific type of change' it can be tracking for a key that is pressed and held (that's key down), or it can track for a key that was pressed but no longer is (that's key up)
    */

    canvas.addEventListener("mousemove", (e) => {
        xCursor = e.clientX - canvas.offsetLeft;
        yCursor = e.clientY - canvas.offsetTop;
    });

    let sprite = (function() {
        let img = new Image();
        img.src = "https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c1ed.png";
        
        let heart = new Image();
        heart.src = "https://i.ibb.co/qCVYXB0/heart.png";

        let w = 100,
            h = 100;
        
        let xVel = 0,
            yVel = 0,
            speed = 5,
            friction = 0.1;
        
        let move = {
        	up: () => { yVel -= 1; },
            down: () => { yVel += 1; },
            left: () => { xVel -= 1; },
            right: () => { xVel += 1; },
        };

        let health = [5, 5];

        let render = () => {
            ctx.drawImage(sprite.img, camera.x, camera.y, sprite.w, sprite.h);
            
            for (let i = 0; i <= health[0]; i++) {
            	ctx.drawImage(heart, i*22 + 22, canvas.height - 44, 22, 22);
            }
            
            yVel *= (1 - friction);
            camera.y += yVel;
            xVel *= (1 - friction);
            camera.x += xVel;
        }

        return {
            img,
            w,
            h,
            render,
            xVel,
            yVel,
            speed,
            friction,
            move
        }
    })();
    
    canvas.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (keys['ArrowDown'] || keys['s']) {
            sprite.move.down();
        }
        if (keys['ArrowRight'] || keys['d']) {
            sprite.move.right();
        }
        if (keys['ArrowUp'] || keys['w']) {
            sprite.move.up();
        }
        if (keys['ArrowLeft'] || keys['a']) {
            sprite.move.left();
        }
    });

    canvas.addEventListener('keyup', (e) => {
        delete keys[e.key];
    });
    
    let gui = (function () {
        let debug = {
            x: 0,
            y: 0,
        	w: canvas.width,
            h: 20
        };
        
        let inv = {
            x: 0,
            y: debug.h,
            w: 200,
            h: 0,
        };
        
        let inv_ico = new Image();
        inv_ico.src = "https://i.ibb.co/JjzFxMz/inv.png";
        
    	let render = () => {
            ctx.font = 'normal 16px monospace';
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.fillRect(debug.x,debug.y,debug.w,debug.h);
            ctx.fillStyle = "#fff";
            ctx.fillText(`FPS: ${fps} X: ${camera.x.toFixed(2)} Y: ${camera.y.toFixed(2)}`, 0, 16);
            ctx.drawImage(inv_ico, debug.w - debug.h, 0, debug.h, debug.h);
            
            ctx.fillStyle = "#000";
        	ctx.fillRect(canvas.width - inv.w, inv.y, inv.w, c_inv.length * 16 + 4);
        
            
            for (let i = 0; i < c_inv.length; i++) {
                if (i === 0) {
                	ctx.fillStyle = "#fff";
                } else {
                	ctx.fillStyle = "#ccc";
                }
                
                ctx.fillText(`${c_inv[i]}`, canvas.width-inv.w, i * 16 + 16 + 20);
            }
        };
    
        return { render };
    })();
    
    let touchControls = (function() {
        let border = {
            r: 70,
            margin: 10
        };
        
        let knob = {
        	x: 0,
            y: 0,
            r: 40,
        };
        
        let mousedown = false;
        
        let trackControls = () => {
        	    if (knob.x > 10) {
                    sprite.move.right();
                } else if (knob.x < -10) {
                	sprite.move.left();
                }
                
                if (knob.y > 10) {
                    sprite.move.down();
                } else if (knob.y < -10) {
                	sprite.move.up();
                }
        };
        
        let timeout;
        
        let on;
        
        if (navigator.userAgentData.mobile) {
        	on = {
            	down: "touchstart",
                up: "touchend",
                move: "touchmove"
            }
        } else {
        	on = {
            	down: "mousedown",
                up: "mouseup",
                move: "mousemove"
            }
        }
        
        canvas.addEventListener(on.down, function(e) {
			mousedown = true;
            
            e.clientX = (e.clientX) ? e.clientX : e.touches[0].clientX;
            e.clientY = (e.clientY) ? e.clientY : e.touches[0].clientY;
            
        	let dim = canvas.getBoundingClientRect();
            
            let client = {
            	x: e.clientX - dim.x - CANVAS_WIDTH + border.r + border.margin,
                y: e.clientY - dim.y - CANVAS_HEIGHT + border.r + border.margin
            };
            
            withinBorders = () => {
            	let x2 = 0;
                let y2 = 0;
                let x1 = client.x;
                let y1 = client.y;
                
                let dis = parseInt(Math.sqrt((x1 * x1) + (y1 * y1)));
                
                if (dis <= border.r) {
                	return true;
                } else {
                	return false;
                }
            };
            
            if (mousedown && withinBorders()) {
                knob.x = client.x;
                knob.y = client.y;
        	}
            
            timeout = setInterval(trackControls, 50);
        });
        
        canvas.addEventListener(on.up, function() {
			mousedown = false;
            clearTimeout(timeout);
            
            knob.x = knob.y = 0;
        });
        
        canvas.addEventListener(on.move, function(e) {
            e.clientX = (e.clientX) ? e.clientX : e.touches[0].clientX;
            e.clientY = (e.clientY) ? e.clientY : e.touches[0].clientY;
            
        	let dim = canvas.getBoundingClientRect();
            
            let client = {
            	x: e.clientX - dim.x - CANVAS_WIDTH + border.r + border.margin,
                y: e.clientY - dim.y - CANVAS_HEIGHT + border.r + border.margin
            };
            
            withinBorders = () => {
            	let x2 = 0;
                let y2 = 0;
                let x1 = client.x;
                let y1 = client.y;
                
                let dis = parseInt(Math.sqrt((x1 * x1) + (y1 * y1)));
                
                if (dis <= border.r) {
                	return true;
                } else {
                	return false;
                }
            };
            
            if (mousedown && withinBorders()) {
                knob.x = client.x;
                knob.y = client.y;
        	}
        });
        
        let render = () => {

            ctx.globalCompositeOperation = "difference";
			ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
            
            ctx.beginPath();
            ctx.arc(CANVAS_WIDTH - border.r - border.margin, CANVAS_HEIGHT - border.r - border.margin, border.r, 0, 2 * Math.PI);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(CANVAS_WIDTH - border.r - border.margin + knob.x, CANVAS_HEIGHT - border.r - border.margin + knob.y, knob.r, 0 , 2 * Math.PI);
            ctx.fill();
            
            ctx.globalCompositeOperation = "source-over";
        }
        
    	return { render };
    })();
    
    let fullScreen = () => {
        gameWrapper.requestFullscreen()
    };

    let loop = () => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
		try {
            ctx.fillStyle = "#333";
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            sprite.render();
            gui.render();
            touchControls.render();

            if (camera.x < 0) {
                camera.x = 0;
            } // Prevents block from going to far left

            if (camera.y < 0) {
                camera.y = 0;
            } // Prevents block from going to far up
        } catch (Error) {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.fillStyle = "#fff";
            ctx.textAlign = 'center';
            
            ctx.fillText(`Aw Snap, an Error occured! ${Error.name}: ${Error.message}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        }

        current_stage = window.requestAnimationFrame(() => {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            loop();
        });
    };

    return {
        loop, fullScreen
    }
})();

$(".gameInvLeave").click(function() {
    c_inv.push("Inventory:");
    c_inv.push("\n");
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i][2] === true) {
            c_inv.push(inventory[i][0]);
        }
    }
    
    if (c_inv[2] === undefined) {
    	c_inv.push("No Current Items");
    }
    
    $(".gameWrapper").fadeOut();
    setTimeout(() => {
        $(".canvas_cont[stage='1']")
            .fadeIn(1000)
        
        window.cancelAnimationFrame(current_stage);
        
        main.loop();
        music.volume = 0.1;
    }, 1000);
});
