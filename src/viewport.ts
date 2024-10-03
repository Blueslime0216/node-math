// ====================================================================================================
// 뷰포트 렌더링 및 뷰포트 변수 관련 코드
// 여기서는 명령받은 대로 렌더링 하거나 관련 데이터를 전달해주는 역할을 한다.
// ====================================================================================================

import { $_ } from "./utils/domUtils.js";
import Node from "./node/node.js";
import Socket from "./node/socket.js";
import { Point } from "./utils/fieldUtils.js";
import effectStateManager from "./utils/effectStateManager.js";
import { zoomEffect } from "./utils/functions.js";
import userSetting from "./utils/userSetting.js";


export class Viewport{
    private _canvas:HTMLCanvasElement;
    private _ctx:CanvasRenderingContext2D;

    /* 
        ( this.offset = this._offsetStart + this._offsetMoving )
        this.offset은 계산이 완료된 좌표이다
        this._offsetStart는 시작 시점(드래그를 시작할 때)의 좌표
        this._offsetMoving은 이동 중인 거리(드래그한 거리, 거리이므로 상대적인 값이다)
    */
    private _offsetStart:Point = { x:816/2, y:624/2 }; // 시점을 움직이기 시작한 지점
    private _offsetMoving:Size = { width:0, height:0 }; // 시점을 움직이는 중인 거리
    private _zoom:number = 1; // 시점 확대 정도
    private _zoomMax:number = 3; // 최대 확대 정도
    private _zoomMin:number = 0.25; // 최대 축소 정도
    private _nodes:Node[] = []; // 노드들
    
    // 상수들
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

    get offset(){return { x:(this._offsetStart.x + this._offsetMoving.width), y:(this._offsetStart.y + this._offsetMoving.height) }}
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

    createNode(startPos:Point, type:string){
        this._nodes.push(new Node(startPos, type));
        this.render();
    }

    render(){
        // 캔버스 비우기
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // 그리드 그리기
        this.drawGrid();

        // 노드 그리기
        this.drawNodes();

        // 이펙트 그리기
        this.drawEffects();
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
            node.draw(this);
        });
    }

    drawEffects(){
        // 마우스 확대/축소 중심 이펙트
        if (userSetting.mouseZoomEffect.isOn && effectStateManager.mouseZoomSign.isOn === true) {
            zoomEffect(
                this._ctx,
                this.lineThickness,
                (new Date().getTime()),
                effectStateManager.mouseZoomSign
            );
        }
        // 키보드 확대/축소 중심 이펙트
        if (userSetting.keyboardZoomEffect.isOn && effectStateManager.keyboardZoomCenterSign.animation > -1) {
            zoomEffect(
                this._ctx,this.lineThickness,
                (new Date().getTime()),
                effectStateManager.keyboardZoomCenterSign,
                { x: this._canvas.width / 2, y: this._canvas.height / 2 }
            );
        }
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

const canvas:HTMLCanvasElement = $_('editor') as HTMLCanvasElement; // 캔버스 가져오기
export default new Viewport(canvas); // 인스턴스를 export