import Node from "./node.js";
import viewport from "../sys/viewport.js";

export default class Socket{
    _id:string = Math.random().toString(36).substring(2, 18); // 소켓 아이디
    _parentNode:Node; // 소켓이 속한 노드
    _index:number; // 소켓 인덱스
    _type:TSocketType; // 소켓 타입
    // _hitboxSize:number = 10; // 소켓 히트박스 크기
    _connectedSocket:Socket|null = null; // 연결된 소켓

    constructor(node:Node, index:number, type:TSocketType){
        this._parentNode = node;
        this._index = index;
        this._type = type;
    }

    get id(){return this._id}
    get parentNode(){return this._parentNode}
    get index(){return this._index}
    get type(){return this._type}
    get connectedSocket(){return this._connectedSocket}

    draw(_position:TPoint, _bounds:TSize, nodeOffset:TPoint, sockets_output_length:number){
        const _ctx = viewport.ctx;
        const gridSpacing = viewport.gridSpacing;
        const _x = nodeOffset.x + (_bounds.width * gridSpacing)/2 * (this._type === 'input' ? -1 : 1);
        const _y = (nodeOffset.y) + gridSpacing/2*3 + (this.index + (this._type === 'input' ? sockets_output_length : 0))*gridSpacing ;
        const _radius = gridSpacing / 6;
        // 소켓 그리기
        _ctx.fillStyle = 'hsl(210, 70%, 50%)';
        _ctx.beginPath();
        _ctx.arc(_x, _y, _radius, 0, Math.PI * 2);
        // console.log(_x, _y, this.index);
        _ctx.fill();
        _ctx.stroke();


        // 인풋 소켓 그리기
        // const socketX = this.x - (this.width * gridSpacing)/2; // 인풋 소켓의 X 좌표 계산
        // _ctx.beginPath();
        // _ctx.arc(socketX, socketY + i * gridSpacing, socketRadius, 0, 2 * Math.PI); // 원 그리기
        // if (hoveredSocket === undefined || !(hoveredSocket.type === 'input' && hoveredSocket.index === i && hoveredSocket.ParentNode === this)) { // 기본 상태라면
        //     _ctx.fillStyle = 'hsl(210, 70%, 30%)';
        // } else if (hoveredSocket.type === 'input' && hoveredSocket.index === i && hoveredSocket.ParentNode === this) { // 만약 hoveredSocket이 이 소켓이면
        //     _ctx.fillStyle = 'hsl(210, 70%, 80%)';
        // }
        // _ctx.fill(); // 소켓 내부 채우기
        // _ctx.stroke(); // 소켓 테두리 그리기
    }

    connect(socket:Socket){
        this._connectedSocket = socket;
    }

    disconnect(){
        this._connectedSocket = null;
    }
}