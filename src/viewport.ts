import Node from "./node.js";
import Socket from "./socket.js";
import { Point } from "./utils/fieldUtils.js";

export default class Viewport{
    private _canvas:HTMLCanvasElement;
    private _ctx:CanvasRenderingContext2D;

    // private _offset:Point = { x:-1, y:-1 }; // 시점 움직인 정도 (_offsetStart + _offsetMoving)
    private _offsetStart:Point = { x:0, y:0 }; // 시점을 움직이기 시작한 지점
    private _offsetMoving:Size = { width:0, height:0 }; // 시점을 움직이는 중인 거리
    private _zoom:number = 1; // 시점 확대 정도
    private _zoomMax:number = 5; // 최대 확대 정도
    private _zoomMin:number = 0.5; // 최대 축소 정도
    private _gridSpacing:number = this._zoom*50; // 그리드 간격
    private _nodes:Node[] = []; // 노드들
    
    private readonly lineThickness:number = 2; // 선 두께
    private readonly gridSpacingDefault:number = 50; // 그리드 기본 간격

    selectedNode:Node|null = null; // 선택된 노드(노드들 ???)
    selectedSocket:Socket|null = null; // 선택된 소켓

    constructor(canvas:HTMLCanvasElement){
        this._canvas = canvas
        this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    get canvas(){return this._canvas}
    get ctx(){return this._ctx}

    get offset(){return {
        x: this._offsetStart.x + this._offsetMoving.width,
        y: this._offsetStart.y + this._offsetMoving.height
    }}
    // set offset(value:Point){this._offset = value}
    get offsetStart(){return this._offsetStart}
    set offsetStart(value:Point){this._offsetStart = value}
    get offsetMoving(){return this._offsetMoving}
    set offsetMoving(value:Size){this._offsetMoving = value}

    get zoom(){return this._zoom}
    set zoom(value:number){this._zoom = value}
    get zoomMax(){return this._zoomMax}
    get zoomMin(){return this._zoomMin}
    get gridSpacing(){return this._zoom*this.gridSpacingDefault}
    get nodes(){return this._nodes}

    createNode(x:number, y:number, type:string){
        this._nodes.push(new Node(x, y, type));
        this.render();
    }

    render(){
        // 캔버스 비우기
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // 그리드 그리기
        this.drawGrid();

        // 노드 그리기
        // this.drawNodes();
    }

    drawGrid(){
        this._ctx.strokeStyle = 'hsl(0, 0%, 25%)'; // 그리드 선 색상 설정
        this._ctx.lineWidth = 1; // 그리드 선 두께 설정

        // 수직선 그리기
        for (let x = this.offset.x % this.gridSpacing; x < this._canvas.width; x += this.gridSpacing) {
            this._ctx.beginPath();
            this._ctx.moveTo(x, 0);
            this._ctx.lineTo(x, this._canvas.height);
            this._ctx.stroke();
        }
        // 수평선 그리기
        for (let y = this.offset.y % this.gridSpacing; y < this._canvas.height; y += this.gridSpacing) {
            this._ctx.beginPath();
            this._ctx.moveTo(0, y);
            this._ctx.lineTo(this._canvas.width, y);
            this._ctx.stroke();
        }
    }

    drawNodes(){
        this._nodes.forEach(node => {
            node.draw(this._ctx, this.lineThickness, this.gridSpacing);
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
