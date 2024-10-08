import Socket from "./socket.js";
import viewport from "../viewport.js";
import { drawRoundPolygon } from "../utils/functions.js";

export default class Node{
    id:string = Math.random().toString(36).substring(2, 18); // 노드 아이디
    name:string = '더하기'; // 노드 이름

    bounds:Rect = {x:0, y:0, width:0, height:0}; // 노드의 바운더리

    style:nodeStyle = { // 노드의 색상
        default: {
            fill: 'hsla(210, 70%, 50%, 50)', // 노드의 배경 색상
            stroke: 'hsla(210, 15%, 100%, 100)', // 노드의 테두리 색상
            lineThickness: 1, // 노드의 테두리 두께
        },
        hover: {
            fill: 'hsla(210, 70%, 55%, 100)',
            stroke: 'hsla(210, 15%, 100%, 100)',
            lineThickness: 1,
        },
        selected: {
            fill: 'hsla(210, 70%, 65%, 100)',
            stroke: 'hsla(60, 100%, 50%, 100)',
            lineThickness: 2,
        },
    }
    type:string = 'node'; // 노드의 타입

    isHover:boolean = false; // 마우스가 노드 위에 있는지 여부
    isSelected:boolean = false; // 노드가 선택되었는지 여부

    sockets = {
        input: [] as Socket[], // 노드의 입력 소켓들
        output: [] as Socket[], // 노드의 출력 소켓들
        all: [] as Socket[], // 노드의 소켓들
    }; // 노드의 소켓들

    constructor(startPos:Point, type:string){
        this.x = startPos.x; // 노드의 x좌표
        this.y = startPos.y; // 노드의 y좌표
        this.type = type; // 노드 타입

        // 소켓 생성
        if (type === 'test'){
            this.createSockets(2, 'input');
            this.createSockets(1, 'output');
        };
        
        this.width = 3; // 노드의 너비 (그리드 단위)
        this.height = 2 + this.sockets.input.length + this.sockets.output.length; // 노드의 높이 (그리드 단위)
    }

    // bounds getter, setter
    get x (){return this.bounds.x}
    get y (){return this.bounds.y}

    set x (value:number){this.bounds.x = value}
    set y (value:number){this.bounds.y = value}

    get width (){return this.bounds.width}
    get height (){return this.bounds.height}
    
    set width (value:number){this.bounds.width = value}
    set height (value:number){this.bounds.height = value}

    nodeOffset(){
        return {
            x: this.bounds.x + viewport.offset.x,
            y: this.bounds.y + viewport.offset.y,
        }
    }

    /**
     * 소켓을 생성합니다.
     * @param index 소켓의 인덱스
     * @param type 소켓의 타입
     */
    createSocket(index:number, type:TSocketType){
        this.sockets[type].push(new Socket(this, index, type));
        this.sockets.all.push(this.sockets[type][index]);
    }
    createSockets(count:number, type:TSocketType){
        for (let i = 0; i < count; i++) {
            this.createSocket(i, type);
        }
    }

    draw(){
        // 값 가져오기
        const ctx = viewport.ctx; // 캔버스 컨텍스트
        const gridSpacing = viewport.gridSpacing; // 그리드 간격
        const thicknessUnit = gridSpacing / 20; // 테두리 두께 계산
        const borderRadious = thicknessUnit * 2; // 테두리 둥글기 계산
        const {x, y} = this.bounds; // 노드의 위치 및 크기
        const nodeOffset = this.nodeOffset(); // 노드의 뷰포트 이동 적용 위치
        const xMoved = nodeOffset.x; // 뷰포트 이동 적용
        const yMoved = nodeOffset.y; // 뷰포트 이동 적용
        const width = this.bounds.width * gridSpacing; // 너비 계산
        const height = this.bounds.height * gridSpacing; // 높이 계산

        // 스타일 설정
        if (this.isSelected) { // 노드가 선택된 상태라면
            ctx.fillStyle = this.style.selected.fill;
            ctx.strokeStyle = this.style.selected.stroke;
            ctx.lineWidth = thicknessUnit * this.style.selected.lineThickness;
        // } else if (hoveredSocket.ParentNode === this) { // 소켓이 호버 중인 상태라면
        //     ctx.fillStyle = 'hsl(210, 70%, 50%)'; // 기본 상태의 색상
        } else if (this.isHover) { // 호버 상태라면
            ctx.fillStyle = this.style.hover.fill;
            ctx.strokeStyle = this.style.hover.stroke;
            ctx.lineWidth = thicknessUnit * this.style.hover.lineThickness;
        } else { // 기본 상태이면
            ctx.fillStyle = this.style.default.fill;
            ctx.strokeStyle = this.style.default.stroke;
            ctx.lineWidth = thicknessUnit * this.style.default.lineThickness;
        }

        // 노드 그리기
        ctx.beginPath(); // 그리기 시작
        drawRoundPolygon(ctx, [
            { x: xMoved - width/2, y: yMoved + gridSpacing/2 + gridSpacing/2 },
            { x: xMoved - width/2 + gridSpacing, y: yMoved + gridSpacing/2 + gridSpacing/2 },
            { x: xMoved - width/2 + gridSpacing/2*3, y: yMoved + gridSpacing/2 },
            { x: xMoved + width/2, y: yMoved + gridSpacing/2 },
            { x: xMoved + width/2, y: yMoved + height - gridSpacing/2 - gridSpacing/2 },
            { x: xMoved + width/2 - gridSpacing/2, y: yMoved + height - gridSpacing/2 },
            { x: xMoved - width/2, y: yMoved + height - gridSpacing/2 },
        ], gridSpacing/10 )
        ctx.fill(); // 노드 내부 채우기
        ctx.stroke(); // 테두리 그리기
        ctx.closePath(); // 그리기 끝

        // 헤더 그리기
        ctx.beginPath();
        drawRoundPolygon(ctx, [
            { x: xMoved - width/2, y: yMoved - gridSpacing/2 },
            { x: xMoved + width/2, y: yMoved - gridSpacing/2 },
            { x: xMoved + width/2, y: yMoved + gridSpacing/2 },
            { x: xMoved - width/2 + gridSpacing/2*3, y: yMoved + gridSpacing/2 },
            { x: xMoved - width/2 + gridSpacing, y: yMoved + gridSpacing/2 + gridSpacing/2 },
            { x: xMoved - width/2, y: yMoved + gridSpacing/2 + gridSpacing/2 },
        ], gridSpacing/10 )
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // 노드 이름 적기
        ctx.fillStyle = 'hsl(0, 0%, 100%)'; // 글자 색상 설정
        ctx.font = `${gridSpacing/2.5}px EliceDigitalBaeum_Regular`; // 글자 크기 및 글꼴 설정
        ctx.textAlign = 'left'; // 텍스트 정렬 설정
        ctx.textBaseline = 'middle'; // 텍스트 베이스라인 설정
        ctx.fillText(this.name, xMoved - width/2 + gridSpacing/4, yMoved); // 텍스트 쓰기
        
        // 소켓 그리기
        this.sockets.all.forEach(socket => {
            socket.draw(this.bounds, nodeOffset, this.sockets.output.length);
        });
    }

    isInside(point:Point){
        const {x, y} = this.nodeOffset();
        return  point.x > x - (this.width)*viewport.gridSpacing/2 &&
                point.x < x + (this.width)*viewport.gridSpacing/2 &&
                point.y > y - (1)*viewport.gridSpacing/2 &&
                point.y < y + (1 + this.sockets.all.length)*viewport.gridSpacing + (1)*viewport.gridSpacing/2; // 상단 헤더 위아래 여백 + 소켓 공간 + 하단 여백
    }
    isCollide(rect:Rect){
        // return rect.x < this.x + this.width / 2 &&
        // rect.x + rect.width > this.x - this.width / 2 &&
        // rect.y < this.y + this.height / 2 &&
        // rect.y + rect.height > this.y - this.height / 2;
    }
}