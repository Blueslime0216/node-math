import Node from "./node.js";
import viewport from "../sys/viewport.js";
import { isInsideSocket } from "./nodeFunctions.js";
import socketStyleManager,{ getHSL } from "./socketStyle.js";



export default class Socket{
    private _id:string = Math.random().toString(36).substring(2, 18); // 소켓 아이디
    private _parentNode:Node; // 소켓이 속한 노드
    private _type:SocketType; // 소켓 타입
    private _direction:TSocketDirection; // 소켓 타입
    private _index:number; // 소켓 인덱스

    private _connectedSocket:Socket|null = null; // 연결된 소켓

    isHovered:boolean = false; // 호버 중 인지 여부
    isSelected:boolean = false; // 선택 중 인지 여부
    isConnected:boolean = false; // 연결 중 인지 여부

    constructor(node:Node, type:SocketType ,direction:TSocketDirection, index:number){
        this._parentNode = node;
        this._type = type;
        this._direction = direction;
        this._index = index;
    }

    get id(){return this._id}
    get parentNode(){return this._parentNode}
    get type(){return this._type}
    get direction(){return this._direction}
    get index(){return this._index}
    get connectedSocket(){return this._connectedSocket}

    get x(){
        const gridSpacing = viewport.gridSpacing;
        const _bounds = this._parentNode.bounds;
        const nodeOffset = this._parentNode.nodeOffset();
        return nodeOffset.x + (_bounds.width/2 * gridSpacing * (this._direction === 'input' ? -1 : 1));
    }
    get y(){
        const gridSpacing = viewport.gridSpacing;
        const nodeOffset = this._parentNode.nodeOffset();
        return nodeOffset.y + gridSpacing/2*3 + (this.index + (this._direction === 'input' ? this._parentNode.sockets.output.length : 0))*gridSpacing ;
    }
    get radius(){
        return viewport.gridSpacing / 6;
    }

    get state():SocketState{
        if (this.isHovered) return 'hovered';
        if (this.isSelected) return 'selected';
        if (this.isConnected) return 'connected';
        if (this._parentNode.isSelected) return 'parent_selected';
        return 'default';
    }


    draw(){
        const gridSpacing = viewport.gridSpacing;
        const thicknessUnit = gridSpacing / 20;
        const nodeOffset = this._parentNode.nodeOffset();
        const type:SocketType = 'int';
        const _x = nodeOffset.x + (this._parentNode.bounds.width/2 * gridSpacing * (this._direction === 'input' ? -1 : 1));
        const _y = nodeOffset.y + gridSpacing/2*3 + (this.index + (this._direction === 'input' ? this._parentNode.sockets.output.length : 0))*gridSpacing ;
       
        // 소켓 그리기
        const socketStyle:SocketStyle_return = socketStyleManager.getStyle(this.type, this.state);
        const color = socketStyle.color;
        // 색상 설정
        viewport.ctx.fillStyle = getHSL(color.fill);
        viewport.ctx.strokeStyle = getHSL(color.stroke);
        viewport.ctx.lineWidth = thicknessUnit*color.lineThickness;
        console.log(thicknessUnit, color.lineThickness, viewport.ctx.lineWidth);
        // 만약 parent node가 선택되어 있다면 (!!!) 여기 전체 갈아 엎기, 최적화 필요
        if (this._parentNode.isSelected) {
            const selectedStyle = socketStyleManager.getStyle(this.type, 'selected').color;
            viewport.ctx.fillStyle = getHSL(selectedStyle.fill);
            viewport.ctx.strokeStyle = getHSL(selectedStyle.stroke);
            viewport.ctx.lineWidth = thicknessUnit*selectedStyle.lineThickness;
        }

        viewport.ctx.beginPath();
        // 모양 설정
        if (socketStyle.shape[this._type].shape == ('circle' as SocketShape)){
            viewport.ctx.arc(_x, _y, this.radius, 0, Math.PI * 2);
        } else if (socketStyle.shape[this._type].shape == ('square' as SocketShape)){
            const width = this.radius/Math.sqrt(2)*2.5;
            viewport.ctx.rect(_x - width/2, _y - width/2, width, width);
        } else if (socketStyle.shape[this._type].shape == ('diamond' as SocketShape)){
            const radius = this.radius*1.15;
            const angle = Math.PI / 2;
            for (let i = 0; i < 4; i++) {
                const x = _x + radius * Math.cos(angle * i);
                const y = _y + radius * Math.sin(angle * i);
                viewport.ctx.lineTo(x, y);
            }
        } else if (socketStyle.shape[this._type].shape == ('hexagon' as SocketShape)){
            const radius = this.radius*1.1;
            const angle = Math.PI / 3;
            viewport.ctx.moveTo(_x + radius * Math.cos(0), _y + radius * Math.sin(0));
            for (let i = 1; i < 6; i++) {
                viewport.ctx.lineTo(_x + radius * Math.cos(angle * i), _y + radius * Math.sin(angle * i));
            }
        }
        viewport.ctx.closePath();
        viewport.ctx.fill();
        viewport.ctx.stroke();
    }

    isInside(point:TPoint){
        return isInsideSocket(point, this);
    }

    connect(socket:Socket){
        this._connectedSocket = socket;
    }

    disconnect(){
        this._connectedSocket = null;
    }
}