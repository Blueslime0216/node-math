import Node from "./node.js";
import { Point } from "./utils/fieldUtils.js";
export default class Viewport {
    constructor(canvas) {
        this._offset = { x: 0, y: 0 }; // 시점 움직인 정도
        this._zoom = 1; // 시점 확대 정도
        this._zoomMax = 5; // 최대 확대 정도
        this._zoomMin = 0.1; // 최대 축소 정도
        this._gridSpacing = this._zoom * 50; // 그리드 간격
        this._nodes = []; // 노드들
        this.lineThickness = 2; // 선 두께
        this.gridSpacingDefault = 50; // 그리드 기본 간격
        this.selectedNode = null; // 선택된 노드(노드들 ???)
        this.selectedSocket = null; // 선택된 소켓
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d');
    }
    get canvas() { return this._canvas; }
    get ctx() { return this._ctx; }
    get offset() { return this._offset; }
    set offset(value) { this._offset = value; }
    get zoom() { return this._zoom; }
    set zoom(value) { this._zoom = value; }
    get zoomMax() { return this._zoomMax; }
    get zoomMin() { return this._zoomMin; }
    get gridSpacing() { return this._zoom * this.gridSpacingDefault; }
    get nodes() { return this._nodes; }
    createNode(x, y, type) {
        this._nodes.push(new Node(x, y, type));
        this.render();
    }
    render() {
        // 캔버스 비우기
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        // 그리드 그리기
        this.drawGrid();
        // 노드 그리기
        // this.drawNodes();
    }
    drawGrid() {
        this._ctx.strokeStyle = 'hsl(0, 0%, 25%)'; // 그리드 선 색상 설정
        this._ctx.lineWidth = 1; // 그리드 선 두께 설정
        // 수직선 그리기
        for (let x = this._offset.x % this.gridSpacing; x < this._canvas.width; x += this.gridSpacing) {
            this._ctx.beginPath();
            this._ctx.moveTo(x, 0);
            this._ctx.lineTo(x, this._canvas.height);
            this._ctx.stroke();
        }
        // 수평선 그리기
        for (let y = this._offset.y % this.gridSpacing; y < this._canvas.height; y += this.gridSpacing) {
            this._ctx.beginPath();
            this._ctx.moveTo(0, y);
            this._ctx.lineTo(this._canvas.width, y);
            this._ctx.stroke();
        }
    }
    drawNodes() {
        this._nodes.forEach(node => {
            node.draw(this._ctx, this.lineThickness, this.gridSpacing);
        });
    }
    resize() {
        const _parent = this._canvas.parentElement;
        this._canvas.width = _parent.clientWidth;
        this._canvas.height = _parent.clientHeight;
        this.render();
    }
    mouseMove(e) {
        this._nodes.forEach(node => {
            node.isHover = node.isInside(new Point(e.offsetX, e.offsetY));
        });
        this.render();
    }
    mouseDown(e) {
        this._nodes.forEach(node => {
            if (node.isHover) {
                node.isSelected = true;
            }
        });
        this.render();
    }
}
