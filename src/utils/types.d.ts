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
    isInOut?:'in'|'out';
    [key: string]: any;
}

interface ISetting{
    isOn:boolean;
    [key: string]: any;
}


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
// HSL 타입 정의
interface HSLColor {
    h: number;  // Hue (0 ~ 360)
    s: number;  // Saturation (0 ~ 100) as percentage
    l: number;  // Lightness (0 ~ 100) as percentage
    a: number;  // Alpha (0 ~ 1) as transparency
}

// ColorSet에 hsl 객체 포함
interface ColorSet {
    fill: HSLColor;       // 채움 색상
    stroke: HSLColor;     // 테두리 색상
    lineThickness: number;    // 테두리 두께
}
interface ShapeSet {
    color: NodeColor;
    polygon: Polygon;
}

// 각 노드 타입의 스타일 정의
interface TypeStyle {
    color:{
        keyColor: ColorSet;
        bodyColor: ColorSet;
    }
    shape: Record<NodeShape, ShapeSet>
}

type NodeColor = 'keyColor'|'bodyColor';
type NodeShape = 'head'|'connector'|'body';
type NodeType = 'operator'|'value';
type NodeState = 'default'|'hovered'|'selected'|'dragSelected';

type TSocketDirection = 'input'|'output';
type SocketColor = 'blue';
type SocketType = 'float'|'int';
type SocketShape = 'circle'|'square'|'diamond'|'hexagon';
type SocketState = 'default'|'hovered'|'parent_selected'|'selected'|'connected';

// 소켓 스타일 정의
interface SocketStyle {
    color: Record<SocketColor, ColorSet>;
    shape: Record<SocketType, SocketTypeStyle>;
}

// 각 소켓 타입의 스타일 정의
interface SocketTypeStyle {
    color: SocketColor;
    shape: SocketShape;
}


// 리턴 용 인터페이스 (색상이 실재 값로 변경됨)
interface SocketStyle_return {
    color: ColorSet;
    shape: Record<SocketType, SocketTypeStyle>;
}