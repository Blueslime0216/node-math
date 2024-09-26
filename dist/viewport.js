export default class Viewport {
    get socketRadius() { return this._gridSpacing / 6; }
    constructor(canvas) {
        this._x = 0;
        this._y = 0;
        this._zoom = 0;
        this._gridSpacing = 6;
        this.lineThickness = 5;
        this.grid = 10;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
    }
    render() {
    }
}
