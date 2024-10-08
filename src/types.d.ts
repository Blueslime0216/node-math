// ====================================================================================================
// 각종 타입들
// ====================================================================================================

interface IDebug{
    isOn:boolean;
    [key: string]: any;
}

interface IEffect{
    isOn:boolean;
    // startTime?:number;
    isInOut?:'in' | 'out';
    [key: string]: any;
}

interface ISetting{
    isOn:boolean;
    [key: string]: any;
}

// (???) 구지 열거형으로 하는 이유가 있나 확인해보기
type TSocketType = 'input' | 'output';

interface Point{
    x:number;
    y:number;
}

interface Size{
    width:number;
    height:number;
}

// (???) 이거 드래그 선택 할 때만 쓰는 것 같은데 더 좋은 작명 생각하자
interface Rect{
    x:number;
    y:number;
    width:number;
    height:number;
}

// type Polygon = Point[]

// (???) 이거 쓰는 거임?
interface DragMouseEvent extends MouseEvent {
    draggedX:number;
    draggedY:number;
}

interface IMouseKeys{
    left:boolean;
    wheel:boolean;
    right:boolean;
}
interface IMouseKeysPoint{
    left:Point; // 좌표가 있으면 Point로, 없으면 -1로 할당해두자
    wheel:Point;
    right:Point;
}
interface IMouseDraggedSize{
    left:Sizs;
    wheel:Sizs;
    right:Sizs;
}

interface viewportOffset{
    value:Point;
    start:Point;
    moving:Point;
}

interface nodeStyle{
    default:{
        fill:string;
        stroke:string;
        lineThickness:number;
    };
    hover:{
        fill:string;
        stroke:string;
        lineThickness:number;
    };
    selected:{
        fill:string;
        stroke:string;
        lineThickness:number;
    };
}
