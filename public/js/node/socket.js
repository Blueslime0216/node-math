import viewport from "../sys/viewport.js";
import { isInsideSocket } from "./nodeFunctions.js";
export default class Socket {
    constructor(node, index, type) {
        this._id = Math.random().toString(36).substring(2, 18); // 소켓 아이디
        this._connectedSocket = null; // 연결된 소켓
        this.isHover = false; // 호버 중 인지 여부
        this._parentNode = node;
        this._index = index;
        this._type = type;
    }
    get id() { return this._id; }
    get parentNode() { return this._parentNode; }
    get index() { return this._index; }
    get type() { return this._type; }
    get connectedSocket() { return this._connectedSocket; }
    get x() {
        const gridSpacing = viewport.gridSpacing;
        const _bounds = this._parentNode.bounds;
        const nodeOffset = this._parentNode.nodeOffset();
        return nodeOffset.x + (_bounds.width / 2 * gridSpacing * (this._type === 'input' ? -1 : 1));
    }
    get y() {
        const gridSpacing = viewport.gridSpacing;
        const nodeOffset = this._parentNode.nodeOffset();
        return nodeOffset.y + gridSpacing / 2 * 3 + (this.index + (this._type === 'input' ? this._parentNode.sockets.output.length : 0)) * gridSpacing;
    }
    get radius() {
        return viewport.gridSpacing / 6;
    }
    draw() {
        const gridSpacing = viewport.gridSpacing;
        const nodeOffset = this._parentNode.nodeOffset();
        const _x = nodeOffset.x + (this._parentNode.bounds.width / 2 * gridSpacing * (this._type === 'input' ? -1 : 1));
        const _y = nodeOffset.y + gridSpacing / 2 * 3 + (this.index + (this._type === 'input' ? this._parentNode.sockets.output.length : 0)) * gridSpacing;
        // 소켓 그리기
        if (this.isHover) { // 호버 중이라면
            viewport.ctx.fillStyle = 'hsl(210, 70%, 60%)';
            // } else if (this._connectedSocket) { // 연결된 상태라면
            //     viewport.ctx.fillStyle = 'hsl(210, 70%, 60%)';
        }
        else { // 일반 상태라면
            viewport.ctx.fillStyle = 'hsl(210, 70%, 50%)';
        }
        viewport.ctx.beginPath();
        viewport.ctx.arc(_x, _y, this.radius, 0, Math.PI * 2);
        viewport.ctx.fill();
        viewport.ctx.stroke();
    }
    isInside(point) {
        return isInsideSocket(point, this);
    }
    connect(socket) {
        this._connectedSocket = socket;
    }
    disconnect() {
        this._connectedSocket = null;
    }
}
