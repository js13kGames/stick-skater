class Game {

    constructor() {
        G = this;
        G.clock = 0;

        G.gameSpeed = 1;

        this.lastHudMessage = null;

        this.startScene(new IntroScene());
        this.transition('#000', 1);
    }

    mainMenu() {
        G.startScene(new MenuScene());
        G.menu = new MainMenu();
    }

    challenges() {
        G.menu = new ChallengesMenu();
    }

    startScene(scene) {
        this.transition();

        this.menu = null;
        this.scene = scene;
        scene.restart();
    }

    cycle(elapsed) {
        const direction = mobileDirection();
        if (direction && this.scene.world.hero.draggable) {
            let newAngle = atan2(MOVEMENT_TARGET_DIRECTION.y, MOVEMENT_TARGET_DIRECTION.x);
            newAngle += elapsed * mobileDirection() * PI;
            MOVEMENT_TARGET_DIRECTION.x = cos(newAngle) * 400;
            MOVEMENT_TARGET_DIRECTION.y = sin(newAngle) * 400;
        }

        if (DEBUG && down[KEYBOARD_G]) elapsed *= 0.1;
        if (DEBUG && down[KEYBOARD_F]) elapsed *= 4;

        G.clock += elapsed;

        if (G.menu) G.menu.cycle(elapsed);
        G.scene.cycle(elapsed);
        INTERPOLATIONS.forEach(x => x.cycle(elapsed));

        if (G.scene.hud.messageLines != this.lastHudMessage) {
            say(G.scene.hud.messageLines.join(' '));
        }
        this.lastHudMessage = G.scene.hud.messageLines;
    }

    render() {
        wrap(() => this.scene.render());

        if (this.menu) {
            wrap(() => this.menu.render());
        }

        // const fadeAlpha = limit(0, 1 - this.clock / 1, 1);
        // wrap(() => {
        //     R.globalAlpha = fadeAlpha;
        //     fs('#000');
        //     fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // });

        wrap(() => {
            if (!document.pointerLockElement || this.scene.world.hero && this.scene.world.hero.input.userControlled) return;

            fs('#fff');
            ss('#000');
            R.lineWidth = 2;

            translate(MOUSE_POSITION.x, MOUSE_POSITION.y);
            rotate(PI / 3);
            beginPath();
            moveTo(0, 0);
            lineTo(40, 15);
            lineTo(30, 0);
            lineTo(40, -15);
            closePath();
            fill();
            stroke();
        });

        if (this.transitionProgress < 1) {
            wrap(() => {
                R.globalAlpha = 1 - this.transitionProgress;
                fs(this.transitionPattern);
                fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            });
        }

        // Mobile controls
        fs('#000');
        fr(0, CANVAS_HEIGHT, CANVAS_WIDTH, MOBILE_CONTROLS_HEIGHT);

        fs('#fff');

        wrap(() => {
            R.globalAlpha = 0.5 + 0.5 * (mobileDirection() < 0);
            translate(CANVAS_WIDTH / 8, CANVAS_HEIGHT + MOBILE_CONTROLS_HEIGHT / 2);
            scale(-1, 1);
            renderMobileArrow();
        });

        wrap(() => {
            R.globalAlpha = 0.5 + 0.5 * (mobileDirection() > 0);
            translate(CANVAS_WIDTH * 3 / 8, CANVAS_HEIGHT + MOBILE_CONTROLS_HEIGHT / 2);
            renderMobileArrow();
        });

        wrap(() => {
            R.globalAlpha = 0.5 + 0.5 * mobileTrick();

            fr(
                evaluate(CANVAS_WIDTH * 5 / 8 - MOBILE_BUTTON_SIZE / 2),
                evaluate(CANVAS_HEIGHT + MOBILE_CONTROLS_HEIGHT / 2 - MOBILE_BUTTON_SIZE / 2),
                MOBILE_BUTTON_SIZE,
                MOBILE_BUTTON_SIZE,
            );
        });

        wrap(() => {
            R.globalAlpha = 0.5 + 0.5 * mobileSquat();

            beginPath();
            arc(
                evaluate(CANVAS_WIDTH * 7 / 8),
                evaluate(CANVAS_HEIGHT + MOBILE_CONTROLS_HEIGHT / 2),
                evaluate(MOBILE_BUTTON_SIZE / 2),
                0,
                TWO_PI,
            );
            fill();
        });
    }

    transition(pattern, duration = 0.3) {
        this.transitionPattern = pattern || createCanvasPattern(CANVAS_WIDTH, CANVAS_HEIGHT, (r) => {
            r.drawImage(CANVAS, 0, 0);
        });

        interp(this, 'transitionProgress', 0, 1, duration);
    }
}
