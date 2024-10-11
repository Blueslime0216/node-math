import Socket from "./socket.js";
import viewport from "../viewport.js";
import { drawRoundPolygon } from "../utils/functions.js";
import { isInside } from "./nodeFunctions.js";
import debugManager from "../utils/debugStateManager.js";

export default class Node{
    id:string = Math.random().toString(36).substring(2, 18); // 노드 아이디
    name:string = '더하기'; // 노드 이름

    position:Point = {x:0, y:0}; // 노드의 위치
    bounds:Size = {width:0, height:0}; // 노드의 바운더리

    style:nodeStyle = { // 노드의 색상
        colors : {
            sky : {
                default: {
                    fill: 'hsla(210, 70%, 50%, 100%)', // 노드의 배경 색상
                    stroke: 'hsla(210, 15%, 100%, 100%)', // 노드의 테두리 색상
                    lineThickness: 1, // 노드의 테두리 두께
                },
                hover: {
                    fill: 'hsla(210, 70%, 55%, 100%)',
                    stroke: 'hsla(210, 15%, 100%, 100%)',
                    lineThickness: 1,
                },
                selected: {
                    fill: 'hsla(210, 70%, 65%, 100%)',
                    stroke: 'hsla(60, 100%, 50%, 100%)',
                    lineThickness: 2,
                },
            },
            grey : {
                default: {
                    fill: 'hsla(210, 70%, 50%, 50%)',
                    stroke: 'hsla(210, 15%, 100%, 100%)',
                    lineThickness: 1,
                },
                hover: {
                    fill: 'hsla(210, 70%, 55%, 50%)',
                    stroke: 'hsla(210, 15%, 100%, 100%)',
                    lineThickness: 1,
                },
                selected: {
                    fill: 'hsla(210, 70%, 65%, 100%)',
                    stroke: 'hsla(60, 100%, 50%, 100%)',
                    lineThickness: 2,
                },
            },
        },
        shape: { // 노드의 모양
            header : {
                color: 'sky',
                polygon : [
                { x: -1.5,  y: -0.5 },
                { x: 1.5,   y: -0.5 },
                { x: 1.5,   y: 0.5  },
                { x: -1.5,  y: 0.5  },
            ]},
            connector : {
                color: 'sky',
                polygon : [
                { x: -1.5,  y: 0.5  },
                { x: 0,     y: 0.5  },
                { x: -0.5,  y: 1    },
                { x: -1.5,  y: 1    },
            ]},
            body : {
                color: 'grey',
                polygon : [
                { x: -1.5,  y: 1    },
                { x: -0.5,  y: 1    },
                { x: 0,     y: 0.5  },
                { x: 1.5,   y: 0.5  },
                { x: 1.5,   y: 4    },
                { x: 1,     y: 4.5  },
                { x: -1.5,  y: 4.5  },
            ]},
        }
    };

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
    get x (){return this.position.x}
    get y (){return this.position.y}

    set x (value:number){this.position.x = value}
    set y (value:number){this.position.y = value}

    get width (){return this.bounds.width}
    get height (){return this.bounds.height}
    
    set width (value:number){this.bounds.width = value}
    set height (value:number){this.bounds.height = value}

    nodeOffset():Point{
        return {
            x: viewport.offset.x + this.position.x*viewport.zoomAmount,
            y: viewport.offset.y + this.position.y*viewport.zoomAmount,
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
        const {x, y} = this.position; // 노드의 위치 및 크기
        const xMoved = this.nodeOffset().x; // 뷰포트 이동 적용
        const yMoved = this.nodeOffset().y; // 뷰포트 이동 적용
        const width = this.bounds.width * gridSpacing; // 너비 계산
        const height = this.bounds.height * gridSpacing; // 높이 계산
        

        // 노드 그리기
        Object.keys(this.style.shape).forEach((key) => {
            const color = this.style.shape[key].color; // 색상 가져오기
            // 색상 설정
            if (this.isSelected) {
                // 노드가 선택된 상태라면
                ctx.fillStyle = this.style.colors[color].selected.fill;
                ctx.strokeStyle = this.style.colors[color].selected.stroke;
                ctx.lineWidth = thicknessUnit * this.style.colors[color].selected.lineThickness;
            // } else if (hoveredSocket.ParentNode === this) {
            //     // 소켓이 호버 중인 상태라면
            //     ctx.fillStyle = 'hsl(210, 70%, 50%)'; // 기본 상태의 색상
            } else if (this.isHover) {
                // 호버 상태라면
                ctx.fillStyle = this.style.colors[color].hover.fill;
                ctx.strokeStyle = this.style.colors[color].hover.stroke;
                ctx.lineWidth = thicknessUnit * this.style.colors[color].hover.lineThickness;
            } else {
                // 기본 상태이면
                ctx.fillStyle = this.style.colors[color].default.fill;
                ctx.strokeStyle = this.style.colors[color].default.stroke;
                ctx.lineWidth = thicknessUnit * this.style.colors[color].default.lineThickness;
            }
            
            // 노드 그리기(모양 변환)
            const transformedPolygon = this.style.shape[key].polygon.map((point: { x: number, y: number }) => {
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
        ctx.font = `${gridSpacing/2.5}px EliceDigitalBaeum_Regular`; // 글자 크기 및 글꼴 설정
        ctx.textAlign = 'left'; // 텍스트 정렬 설정
        ctx.textBaseline = 'middle'; // 텍스트 베이스라인 설정
        ctx.fillText(this.name, xMoved - width/2 + gridSpacing/4, yMoved); // 텍스트 쓰기
        
        // 소켓 그리기
        this.sockets.all.forEach(socket => {
            socket.draw(this.position, this.bounds, this.nodeOffset(), this.sockets.output.length);
        });
    }

    // (!!!) 최적화 해야함, 근처에 마우스가 온 경우에만 체크하게 수정하자
    isInside(point:Point){
        const gridSpacing = viewport.gridSpacing; // 그리드 간격
        let test = false;

        // 노드 바운더리 안에 있는지 여부 반환
        Object.keys(this.style.shape).forEach((key) => {
            const transformedPolygon = this.style.shape[key].polygon.map((point: { x: number, y: number }) => {
                return {
                    x: this.nodeOffset().x + point.x * gridSpacing,
                    y: this.nodeOffset().y + point.y * gridSpacing
                };
            });
            const result = isInside(point, transformedPolygon); // key는 디버깅을 위해 입력됨
            test = test || result;

            // (디버깅) 노드의 호버된 부분을 콘솔에 출력
            if (debugManager.log_hoveredShape.isOn && result) console.log(`${this.id}의 ${key}`);
        });
        return test;
    }
    
    isCollide(rect:Rect){
        // return rect.x < this.x + this.width / 2 &&
        // rect.x + rect.width > this.x - this.width / 2 &&
        // rect.y < this.y + this.height / 2 &&
        // rect.y + rect.height > this.y - this.height / 2;
    }
}