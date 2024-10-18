// ====================================================================================================
// 각종 타입들
// ====================================================================================================

// ==================================================
// 일반적인 타입들
// ==================================================
interface TPoint{
    x:number;
    y:number;
}

interface TSize{
    width:number;
    height:number;
}

interface TRect{
    x:number;
    y:number;
    width:number;
    height:number;
}

type Polygon = TPoint[]


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

type TSocketType = 'input' | 'output';



interface viewportOffset{
    value:TPoint;
    start:TPoint;
    moving:TPoint;
}


// ==================================================
// 마우스에 관한 타입들
// ==================================================
interface IMouseKeys{
    left:boolean;
    wheel:boolean;
    right:boolean;
}
interface IMouseKeysPoint{
    left:TPoint; // 좌표가 있으면 Point 형식으로, 없으면 -1로 할당해두자
    wheel:TPoint;
    right:TPoint;
}
type IWheelDelta = {
    x : number; // x를 쓸 일이 있나?
    y : number;
}
interface IMouseDraggedSize{
    left:Sizs;
    wheel:Sizs;
    right:Sizs;
}


// ==================================================
// 노드 스타일에 관한 타입들
// ==================================================
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