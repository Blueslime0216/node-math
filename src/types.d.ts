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

interface Rect{
    x:number;
    y:number;
    width:number;
    height:number;
}

type Polygon = Point[]

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
    colors: {
        [key:string]:nodeColor
    },
    shape: {
        [key:string]:nodeShape;
    },
}

interface nodeColor{
    default:{
        fill:string;
        stroke:string;
        lineThickness:number;
    },
    hover:{
        fill:string;
        stroke:string;
        lineThickness:number;
    },
    selected:{
        fill:string;
        stroke:string;
        lineThickness:number;
    },
}
interface nodeShape{
    color:nodeColorSet,
    polygon:Polygon;
}
type nodeColorSet = 'sky' | 'grey';