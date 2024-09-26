export default class Viewport{
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;

    _x:number = 0;
    _y:number = 0;
    _zoom:number = 0;
    _gridSpacing:number = 6;

    get socketRadius(){return this._gridSpacing / 6}

    private readonly lineThickness:number = 5;
    private readonly grid:number = 10;

    constructor(canvas:HTMLCanvasElement){
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    render(){
    }
}
