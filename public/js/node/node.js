import Socket from "./socket.js";
import viewport from "../viewport.js";
export default class Node {
    constructor(startPos, type) {
        this.id = Math.random().toString(36).substring(2, 18); // 노드 아이디
        this.bounds = { x: 0, y: 0, width: 0, height: 0 }; // 노드의 바운더리
        this.color = 'hsl(210, 70%, 50%)'; // 노드의 색상
        this.bgColor = 'hsla(210, 70%, 50%)'; // 노드의 배경 색상
        this.type = 'node'; // 노드의 타입
        this.isHover = false; // 마우스가 노드 위에 있는지 여부
        this.isSelected = false; // 노드가 선택되었는지 여부
        this.sockets = {
            input: [], // 노드의 입력 소켓들
            output: [], // 노드의 출력 소켓들
            all: [], // 노드의 소켓들
        }; // 노드의 소켓들
        this.x = startPos.x; // 노드의 x좌표
        this.y = startPos.y; // 노드의 y좌표
        this.type = type; // 노드 타입
        // 소켓 생성
        if (type === 'test') {
            this.createSockets(2, 'input');
            this.createSockets(1, 'output');
        }
        ;
        this.width = 3; // 노드의 너비 (그리드 단위)
        this.height = 2 + this.sockets.input.length + this.sockets.output.length; // 노드의 높이 (그리드 단위)
    }
    // bounds getter, setter
    get x() { return this.bounds.x; }
    get y() { return this.bounds.y; }
    set x(value) { this.bounds.x = value; }
    set y(value) { this.bounds.y = value; }
    get width() { return this.bounds.width; }
    get height() { return this.bounds.height; }
    set width(value) { this.bounds.width = value; }
    set height(value) { this.bounds.height = value; }
    nodeOffset() {
        return {
            x: this.bounds.x + viewport.offset.x,
            y: this.bounds.y + viewport.offset.y,
        };
    }
    /**
     * 소켓을 생성합니다.
     * @param index 소켓의 인덱스
     * @param type 소켓의 타입
     */
    createSocket(index, type) {
        this.sockets[type].push(new Socket(this, index, type));
        this.sockets.all.push(this.sockets[type][index]);
    }
    createSockets(count, type) {
        for (let i = 0; i < count; i++) {
            this.createSocket(i, type);
        }
    }
    draw() {
        // 값 가져오기
        const ctx = viewport.ctx; // 캔버스 컨텍스트
        const gridSpacing = viewport.gridSpacing; // 그리드 간격
        const borderThickness = gridSpacing / 20; // 테두리 두께 계산
        const borderRadious = borderThickness * 2; // 테두리 둥글기 계산
        const { x, y } = this.bounds; // 노드의 위치 및 크기
        const nodeOffset = this.nodeOffset(); // 노드의 뷰포트 이동 적용 위치
        const xMoved = nodeOffset.x; // 뷰포트 이동 적용
        const yMoved = nodeOffset.y; // 뷰포트 이동 적용
        const width = this.bounds.width * gridSpacing; // 너비 계산
        const height = this.bounds.height * gridSpacing; // 높이 계산
        // 스타일 설정
        ctx.lineWidth = borderThickness; // 테두리 두께 설정
        ctx.strokeStyle = 'hsl(210, 15%, 100%)'; // 테두리 색상 설정
        // ctx.strokeStyle = this.isSelected ? 'yellow' : 'hsl(210, 15%, 100%)';
        // if (selectedNodes.includes(this)) { // 노드가 선택된 상태라면
        //     ctx.fillStyle = 'hsl(210, 70%, 65%)';
        //     ctx.strokeStyle = 'yellow';
        //     ctx.lineWidth = borderThickness * 2;
        // } else if (hoveredSocket.ParentNode === this) { // 소켓이 호버 중인 상태라면
        //     ctx.fillStyle = 'hsl(210, 70%, 50%)'; // 기본 상태의 색상
        // } else if (this.color === 'hover') { // 호버 상태라면
        //     ctx.fillStyle = 'hsl(210, 70%, 55%)';
        // } else { // 기본 상태이면
        //     ctx.fillStyle = 'hsl(210, 70%, 50%)';
        // }
        ctx.fillStyle = this.bgColor;
        // 노드 그리기
        ctx.beginPath(); // 그리기 시작
        ctx.roundRect(xMoved - width / 2, yMoved - gridSpacing / 2, width, height, borderRadious); // 둥근 사각형 그리기
        ctx.fill(); // 노드 내부 채우기
        ctx.stroke(); // 테두리 그리기
        // 가로선을 그려서 헤더 분할
        ctx.moveTo(xMoved - width / 2, yMoved + gridSpacing / 2); // 시작점 설정
        ctx.lineTo(xMoved + width / 2, yMoved + gridSpacing / 2); // 끝점 설정
        ctx.stroke(); // 가로선 그리기
        // 소켓 그리기
        this.sockets.all.forEach(socket => {
            socket.draw(this.bounds, nodeOffset, this.sockets.output.length);
        });
    }
    isInside(point) {
        const { x, y } = this.nodeOffset();
        return point.x > x - (this.width) * viewport.gridSpacing / 2 &&
            point.x < x + (this.width) * viewport.gridSpacing / 2 &&
            point.y > y - (1) * viewport.gridSpacing / 2 &&
            point.y < y + (1 + this.sockets.all.length) * viewport.gridSpacing;
    }
    isCollide(rect) {
        return rect.x < this.x + this.width / 2 && rect.x + rect.width > this.x - this.width / 2 && rect.y < this.y + this.height / 2 && rect.y + rect.height > this.y - this.height / 2;
    }
}
