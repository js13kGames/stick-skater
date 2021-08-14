class TakeOffPanel extends Panel {
    start() {
        this.caption = nomangle('doodle boy went to his rocket');

        this.hero = this.addElement(new Element([
            new CharacterTrait(),
            new HeroTrait(),
            new BoundTrait(50),
        ], initPosition(this.panelWidth / 3, this.panelHeight / 2)));

        this.rocket = this.addElement(new Element([
            new RocketTrait(),
        ], initPosition(this.panelWidth * 2 / 3, this.panelHeight / 2)));
    }

    renderBackground() {
        this.grassBackground();
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (!this.absorbed) {
            if (dist(this.hero, this.rocket) < 50) {
                this.hero.remove();

                this.rocket.trait('rocket').flying = true;

                interp(this.rocket, 'y', this.rocket.y, -200, 2, 0, easeInExpo);
            }
        }
    }
}
