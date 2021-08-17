class Game {

    constructor() {
        G = this;
        G.clock = 0;

        G.hud = new HUD();
        G.world = new World();

        INTERPOLATIONS = [];
    }

    startPanel(panel) {
        this.currentPanel = panel;
        panel.restart();
    }

    cycle(elapsed) {
        if (DEBUG && down[KEYBOARD_G]) elapsed *= 0.1;

        G.clock += elapsed;

        const directionSign = sign(MOUSE_POSITION.x - PREVIOUS_MOUSE_POSITION.x);
        if (directionSign) {
            INPUT.directionAcc += elapsed * sign(MOUSE_POSITION.x - PREVIOUS_MOUSE_POSITION.x);
        } else {
            INPUT.directionAcc += limit(-elapsed, -INPUT.directionAcc, elapsed);
        }
        INPUT.directionAcc = limit(-1, INPUT.directionAcc, 1)

        G.world.cycle(elapsed);
        G.hud.cycle(elapsed);
        INTERPOLATIONS.forEach(x => x.cycle(elapsed));
    }

    render() {
        wrap(() => {
            fs('#170e65');
            fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            G.world.render();
            G.hud.render();
        });
    }

}
