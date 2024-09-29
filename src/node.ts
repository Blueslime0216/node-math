import Socket from "./socket.js";

export default class Node{
    id:string = Math.random().toString(36).substring(2, 18); // 노드 아이디

    bounds:Rect = {x:0, y:0, width:0, height:0}; // 노드의 바운더리

    color:string = 'hsl(210, 70%, 50%)'; // 노드의 색상
    type:string = 'node'; // 노드의 타입

    isHover:boolean = false; // 마우스가 노드 위에 있는지 여부
    isSelected:boolean = false; // 노드가 선택되었는지 여부

    sockets:Set<Socket> = new Set(); // 노드의 소켓들

    constructor(x:number, y:number, type:string){
        this.x = x; // 노드의 x좌표
        this.y = y; // 노드의 y좌표
        this.type = type; // 노드 타입
        
        // 홀수로 설정하자(그래야 그리드에 예쁘게 맞춰짐)
        this.width = 3; // 노드의 너비 (그리드 단위)
        this.height = 3; // 노드의 높이 (그리드 단위)

        // 소켓 생성
        this.createSocket(0, ESocketType.input);
        this.createSocket(1, ESocketType.input);
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

    /**
     * 소켓을 생성합니다.
     * @param index 소켓의 인덱스
     * @param type 소켓의 타입
     */
    createSocket(index:number, type:ESocketType){
        this.sockets.add(new Socket(this, index, type));
    }

    draw(_ctx:CanvasRenderingContext2D, _borderThickness:number = 1, _gridSpacing:number){
        const _borderRadious = _borderThickness * 2;
        const {x, y, width, height} = this.bounds;
        const _width = width * _gridSpacing;
        const _height = height * _gridSpacing;
        // 노드 그리기
        _ctx.save();
        _ctx.fillStyle = this.isHover ? 'hsl(210, 70%, 60%)' : this.color;
        _ctx.strokeStyle = this.isSelected ? 'yellow' : 'hsl(210, 15%, 100%)';
        _ctx.beginPath();
        _ctx.roundRect(x - _width / 2, y - _height / 2, _width, _height, _borderRadious);
        _ctx.fill();
        _ctx.closePath();
        _ctx.restore();
        // 소켓 그리기
        this.sockets.forEach(socket => {
            socket.draw(_ctx, this.bounds, _gridSpacing);
        });
    }

    isInside(point:Point){
        return point.x > this.x - this.width / 2 && point.x < this.x + this.width / 2 && point.y > this.y - this.height / 2 && point.y < this.y + this.height / 2;
    }
    isCollide(rect:Rect){
        return rect.x < this.x + this.width / 2 && rect.x + rect.width > this.x - this.width / 2 && rect.y < this.y + this.height / 2 && rect.y + rect.height > this.y - this.height / 2;
    }
}