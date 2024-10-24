import Socket from "./socket.js";
import viewport from "../sys/viewport.js";
import { drawRoundPolygon } from "../func/functions.js";
import { isInsideNode } from "./nodeFunctions.js";
import debugManager from "../class/debugStateManager.js";
import nodeStyleManager, { getHSL } from "./nodeStyle.js";
export default class Node {
    // getter, setter
    get id() { return this._id; }
    get name() { return this._name; }
    set name(value) { this._name = value; }
    get position() {
        return { x: this._dragStart.x + this._dragOffset.x,
            y: this._dragStart.y + this._dragOffset.y };
    }
    set position(value) { this._dragStart = value; }
    // set positionX(value:number){this._dragStart.x = value}
    // set positionY(value:number){this._dragStart.y = value}
    get dragStart() { return this._dragStart; }
    set dragStart(value) { this._dragStart = value; }
    get dragOffset() { return this._dragOffset; }
    set dragOffset(value) { this._dragOffset = value; }
    get bounds() { return this._bounds; }
    set bounds(value) { this._bounds = value; }
    get state() {
        if (this._isDragSelected)
            return 'dragSelected';
        if (this._isSelected)
            return 'selected';
        if (this._isHover)
            return 'hovered';
        return 'default';
    }
    get isHover() { return this._isHover; }
    get isSelected() { return this._isSelected; }
    get isDragSelected() { return this._isDragSelected; }
    set isHover(value) { this._isHover = value; }
    set isSelected(value) { this._isSelected = value; }
    set isDragSelected(value) { this._isDragSelected = value; }
    constructor(startPos, type) {
        this._id = Math.random().toString(36).substring(2, 18); // 노드 아이디
        this._name = '더하기'; // 노드 이름
        this._dragStart = { x: 0, y: 0 }; // 드래그 시작 위치
        this._dragOffset = { x: 0, y: 0 }; // 드래그 할 때 움직이는 거리
        this._bounds = { width: 0, height: 0 }; // 노드의 바운더리
        this.type = 'operator'; // 노드의 타입
        this._isHover = false; // 마우스가 노드 위에 있는지 여부
        this._isSelected = false; // 노드가 선택되었는지 여부
        this._isDragSelected = false; // 드래그 선택 영역 안에 있는지 여부
        this.sockets = {
            input: [], // 노드의 입력 소켓들
            output: [], // 노드의 출력 소켓들
            all: [], // 노드의 소켓들
        }; // 노드의 소켓들
        this.position = startPos; // 노드의 x좌표
        this.type = type; // 노드 타입
        // 소켓 생성
        switch (type) {
            case 'operator':
                this.createSockets('float', 'input', 2);
                this.createSockets('float', 'output', 2);
                break;
            case 'value':
                this.createSockets('float', 'output', 1);
                break;
        }
        this.width = 3; // 노드의 너비 (그리드 단위)
        this.height = 2 + this.sockets.input.length + this.sockets.output.length; // 노드의 높이 (그리드 단위)
    }
    // bounds getter, setter
    get x() { return this.position.x; }
    get y() { return this.position.y; }
    set x(value) { this.position.x = value; }
    set y(value) { this.position.y = value; }
    get width() { return this.bounds.width; }
    get height() { return this.bounds.height; }
    set width(value) { this.bounds.width = value; }
    set height(value) { this.bounds.height = value; }
    nodeOffset() {
        return {
            x: viewport.offset.x + this.position.x * viewport.zoomAmount,
            y: viewport.offset.y + this.position.y * viewport.zoomAmount,
        };
    }
    createSocket(type, direction, index) {
        this.sockets[direction].push(new Socket(this, type, direction, index));
        this.sockets.all.push(this.sockets[direction][index]);
    }
    createSockets(type, direction, count) {
        for (let i = 0; i < count; i++) {
            this.createSocket(type, direction, i);
        }
    }
    draw() {
        // 값 가져오기
        const ctx = viewport.ctx; // 캔버스 컨텍스트
        const gridSpacing = viewport.gridSpacing; // 그리드 간격
        const thicknessUnit = gridSpacing / 20; // 테두리 두께 계산
        const borderRadious = thicknessUnit * 2; // 테두리 둥글기 계산
        const { x, y } = this.position; // 노드의 위치 및 크기
        const xMoved = this.nodeOffset().x; // 뷰포트 이동 적용
        const yMoved = this.nodeOffset().y; // 뷰포트 이동 적용
        const width = this.bounds.width * gridSpacing; // 너비 계산
        const height = this.bounds.height * gridSpacing; // 높이 계산
        // 노드 그리기
        const nodeStyle = nodeStyleManager.getNodeStyle(this.type, this.state); // 노드 스타일 가져오기
        Object.keys(nodeStyle.shape).forEach((key) => {
            const colorCode = (nodeStyle.shape[key].color); // 색상 코드 가져오기
            const color = nodeStyle.color[colorCode];
            // 색상 설정
            ctx.fillStyle = getHSL(color.fill);
            ctx.strokeStyle = getHSL(color.stroke);
            ctx.lineWidth = thicknessUnit * color.lineThickness;
            // 노드 그리기(모양 변환)
            const transformedPolygon = nodeStyle.shape[key].polygon.map((point) => {
                return {
                    x: xMoved + point.x * gridSpacing,
                    y: yMoved + point.y * gridSpacing
                };
            });
            ctx.beginPath(); // 그리기 시작
            drawRoundPolygon(ctx, transformedPolygon, gridSpacing / 10); // 노드 그리기
            ctx.fill(); // 노드 내부 채우기
            ctx.stroke(); // 테두리 그리기
            ctx.closePath(); // 그리기 끝
        });
        // 노드 이름 적기
        ctx.fillStyle = 'hsl(0, 0%, 100%)'; // 글자 색상 설정
        ctx.font = `${gridSpacing / 2.5}px EliceDigitalBaeum_Regular`; // 글자 크기 및 글꼴 설정
        ctx.textAlign = 'left'; // 텍스트 정렬 설정
        ctx.textBaseline = 'middle'; // 텍스트 베이스라인 설정
        ctx.fillText(this.name, xMoved - width / 2 + gridSpacing / 4, yMoved); // 텍스트 쓰기
        // 소켓 그리기
        this.sockets.all.forEach(socket => {
            socket.draw();
        });
    }
    // (!!!) 최적화 해야함, 근처에 마우스가 온 경우에만 체크하게 수정하자
    isInside(point) {
        const gridSpacing = viewport.gridSpacing; // 그리드 간격
        let test = false;
        // 노드 바운더리 안에 있는지 여부 반환
        const nodeStyle = nodeStyleManager.getNodeStyle(this.type, this.state);
        Object.keys(nodeStyle.shape).forEach((key) => {
            const transformedPolygon = nodeStyle.shape[key].polygon.map((point) => {
                return {
                    x: this.nodeOffset().x + point.x * gridSpacing,
                    y: this.nodeOffset().y + point.y * gridSpacing
                };
            });
            const result = isInsideNode(point, transformedPolygon); // key는 디버깅을 위해 입력됨
            test = test || result;
            // (디버깅) 노드의 호버된 부분을 콘솔에 출력
            if (debugManager.log_hoveredShape.isOn && result)
                console.log(`${this.id}의 ${key}`);
        });
        return test;
    }
    isCollide(rect) {
        const gridSpacing = viewport.gridSpacing; // 그리드 간격
        const x = Math.min(rect.x, rect.x + rect.width); // 시작점 X 좌표
        const y = Math.min(rect.y, rect.y + rect.height); // 시작점 Y 좌표
        const x2 = Math.max(rect.x, rect.x + rect.width); // 끝점 X 좌표
        const y2 = Math.max(rect.y, rect.y + rect.height); // 끝점 Y 좌표
        const nodeX = this.nodeOffset().x; // 이 노드의 X 좌표
        const nodeY = this.nodeOffset().y; // 이 노드의 Y 좌표
        const nodeWidth = this.bounds.width * gridSpacing; // 이 노드의 너비
        const nodeHeight = this.bounds.height * gridSpacing; // 이 노드의 높이
        return (nodeX + nodeWidth / 2 >= x && // 노드의 가장 오른쪽 좌표가 선택 영역의 가장 왼쪽 좌표보다 크고
            nodeX - nodeWidth / 2 <= x2 && // 노드의 가장 왼쪽 좌표가 선택 영역의 가장 오른쪽 좌표보다 작고
            nodeY + (nodeHeight - gridSpacing / 2) >= y && // 노드의 가장 아래쪽 좌표가 선택 영역의 가장 위쪽 좌표보다 크고
            nodeY - gridSpacing / 2 <= y2); // 노드의 가장 위쪽 좌표가 선택 영역의 가장 아래쪽 좌표보다 작으면
    }
}
