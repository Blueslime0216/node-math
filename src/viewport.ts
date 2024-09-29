import Node from "./node.js";
import Socket from "./socket.js";
import { Point } from "./utils/fieldUtils.js";

export default class Viewport{
    private _canvas:HTMLCanvasElement;
    private _ctx:CanvasRenderingContext2D;

    private _offset:Point = {x:0, y:0};
    private _zoom:number = 1;
    private _gridSpacing:number = 50;
    private _nodes:Node[] = [];

    private readonly lineThickness:number = 2;

    selectedNode:Node|null = null;
    selectedSocket:Socket|null = null;

    constructor(canvas:HTMLCanvasElement){
        this._canvas = canvas
        this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    get canvas(){return this._canvas}
    get ctx(){return this._ctx}

    get offset(){return this._offset}
    get zoom(){return this._zoom}
    set zoom(value:number){this._zoom = value}
    get gridSpacing(){return this._gridSpacing}
    get nodes(){return this._nodes}

    createNode(x:number, y:number, type:string){
        this._nodes.push(new Node(x, y, type));
        this.render();
    }

    render(){
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.drawGrid();
        this.drawNodes();
    }

    drawGrid(){
        this._ctx.save();
        this._ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this._ctx.lineWidth = this.lineThickness * this._zoom;
        this._ctx.beginPath();
        // 그리드 그리기
        for(let i = 0; i < this._canvas.width; i += this._gridSpacing){
            this._ctx.moveTo(i, 0);
            this._ctx.lineTo(i, this._canvas.height);
        }
        for(let i = 0; i < this._canvas.height; i += this._gridSpacing){
            this._ctx.moveTo(0, i);
            this._ctx.lineTo(this._canvas.width, i);
        }
        this._ctx.stroke();
        this._ctx.closePath();
        this._ctx.restore();
    }

    drawNodes(){
        this._nodes.forEach(node => {
            node.draw(this._ctx, this.lineThickness, this._gridSpacing);
        });
    }

    resize(){
        const _parent = this._canvas.parentElement as HTMLElement;
        this._canvas.width = _parent.clientWidth;
        this._canvas.height = _parent.clientHeight;
        this.render();
    }

    mouseMove(e:MouseEvent){
        this._nodes.forEach(node => {
            node.isHover = node.isInside(new Point(e.offsetX, e.offsetY));
        });
        this.render();
    }

    mouseDown(e:MouseEvent){
        this._nodes.forEach(node => {
            if(node.isHover){
                node.isSelected = true;
            }
        });
        this.render();
    }
}
