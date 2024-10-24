import Socket from "./socket.js";
import viewport, { canvas } from "../sys/viewport.js";
import { drawRoundPolygon } from "../func/functions.js";
import { isInsideNode } from "./nodeFunctions.js";
import debugManager from "../class/debugStateManager.js";
import nodeStyleManager,{ getHSL } from "./nodeStyle.js";



export default class Node{
    private _id:string = Math.random().toString(36).substring(2, 18); // 노드 아이디
    private _name:string = '더하기'; // 노드 이름

    private _dragStart:TPoint = {x:0, y:0}; // 드래그 시작 위치
    private _dragOffset:TPoint = {x:0, y:0}; // 드래그 할 때 움직이는 거리
    private _bounds:TSize = {width:0, height:0}; // 노드의 바운더리

    // getter, setter
    get id(){return this._id}
    get name(){return this._name}
    set name(value:string){this._name = value}

    get position(){return { x: this._dragStart.x + this._dragOffset.x,
                            y: this._dragStart.y + this._dragOffset.y}}
    set position(value:TPoint){this._dragStart = value}
    // set positionX(value:number){this._dragStart.x = value}
    // set positionY(value:number){this._dragStart.y = value}
    get dragStart(){return this._dragStart}
    set dragStart(value:TPoint){this._dragStart = value}
    get dragOffset(){return this._dragOffset}
    set dragOffset(value:TPoint){this._dragOffset = value}
    get bounds(){return this._bounds}
    set bounds(value:TSize){this._bounds = value}

    type:NodeType = 'operator'; // 노드의 타입

    private _isHover:boolean = false; // 마우스가 노드 위에 있는지 여부
    private _isSelected:boolean = false; // 노드가 선택되었는지 여부
    private _isDragSelected:boolean = false; // 드래그 선택 영역 안에 있는지 여부
    get state():NodeState{
        if (this._isDragSelected) return 'dragSelected';
        if (this._isSelected) return 'selected';
        if (this._isHover) return 'hovered';
        return 'default';
    }
    get isHover(){return this._isHover}
    get isSelected(){return this._isSelected}
    get isDragSelected(){return this._isDragSelected}
    set isHover(value:boolean){this._isHover = value}
    set isSelected(value:boolean){this._isSelected = value}
    set isDragSelected(value:boolean){this._isDragSelected = value}

    sockets = {
        input: [] as Socket[], // 노드의 입력 소켓들
        output: [] as Socket[], // 노드의 출력 소켓들
        all: [] as Socket[], // 노드의 소켓들
    }; // 노드의 소켓들

    constructor(startPos:TPoint, type:NodeType){
        this.position = startPos; // 노드의 x좌표
        this.type = type; // 노드 타입

        // 소켓 생성
        switch (type) {
            case 'operator':
                this.createSockets(2, 'input');
                this.createSockets(1, 'output');
                break;
        }
        
        this.width = 3; // 노드의 너비 (그리드 단위)
        console.log(this.sockets.input.length, this.sockets.output.length);
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

    nodeOffset():TPoint{
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
        const nodeStyle:TypeStyle = nodeStyleManager.getNodeStyle(this.type, this.state); // 노드 스타일 가져오기
        (Object.keys(nodeStyle.shape) as NodeShape[]).forEach((key:NodeShape) => {
            const colorCode:NodeColor = (nodeStyle.shape[key].color) as NodeColor; // 색상 코드 가져오기
            const color = nodeStyle.color[colorCode];
            // 색상 설정
            ctx.fillStyle = getHSL(color.fill);
            ctx.strokeStyle = getHSL(color.stroke);
            ctx.lineWidth = thicknessUnit * color.lineThickness;
            
            // 노드 그리기(모양 변환)
            const transformedPolygon = nodeStyle.shape[key].polygon.map((point: { x: number, y: number }) => {
                return {
                    x: xMoved + point.x * gridSpacing,
                    y: yMoved + point.y * gridSpacing
                };
            });
            
            ctx.beginPath(); // 그리기 시작
            drawRoundPolygon(ctx, transformedPolygon, gridSpacing/10); // 노드 그리기
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
            socket.draw();
        });
    }

    // (!!!) 최적화 해야함, 근처에 마우스가 온 경우에만 체크하게 수정하자
    isInside(point:TPoint){
        const gridSpacing = viewport.gridSpacing; // 그리드 간격
        let test = false;

        // 노드 바운더리 안에 있는지 여부 반환
        const nodeStyle:TypeStyle = nodeStyleManager.getNodeStyle(this.type, this.state);
        (Object.keys(nodeStyle.shape) as NodeShape[]).forEach((key:NodeShape) => {
            const transformedPolygon = nodeStyle.shape[key].polygon.map((point: { x: number, y: number }) => {
                return {
                    x: this.nodeOffset().x + point.x * gridSpacing,
                    y: this.nodeOffset().y + point.y * gridSpacing
                };
            });
            const result = isInsideNode(point, transformedPolygon); // key는 디버깅을 위해 입력됨
            test = test || result;

            // (디버깅) 노드의 호버된 부분을 콘솔에 출력
            if (debugManager.log_hoveredShape.isOn && result) console.log(`${this.id}의 ${key}`);
        });
        return test;
    }
    
    isCollide(rect:TRect){
        const gridSpacing = viewport.gridSpacing; // 그리드 간격
        const x = Math.min(rect.x, rect.x + rect.width); // 시작점 X 좌표
        const y = Math.min(rect.y, rect.y + rect.height); // 시작점 Y 좌표
        const x2 = Math.max(rect.x, rect.x + rect.width); // 끝점 X 좌표
        const y2 = Math.max(rect.y, rect.y + rect.height); // 끝점 Y 좌표
        const nodeX = this.nodeOffset().x; // 이 노드의 X 좌표
        const nodeY = this.nodeOffset().y; // 이 노드의 Y 좌표
        const nodeWidth = this.bounds.width*gridSpacing; // 이 노드의 너비
        const nodeHeight = this.bounds.height*gridSpacing; // 이 노드의 높이

        return (nodeX + nodeWidth/2 >= x && // 노드의 가장 오른쪽 좌표가 선택 영역의 가장 왼쪽 좌표보다 크고
                nodeX - nodeWidth/2 <= x2 && // 노드의 가장 왼쪽 좌표가 선택 영역의 가장 오른쪽 좌표보다 작고
                nodeY + (nodeHeight - gridSpacing/2) >= y && // 노드의 가장 아래쪽 좌표가 선택 영역의 가장 위쪽 좌표보다 크고
                nodeY - gridSpacing/2 <= y2); // 노드의 가장 위쪽 좌표가 선택 영역의 가장 아래쪽 좌표보다 작으면
    }
}