// T:type + Debug:debug
type TDebug = (boolean|number)[]

enum ESocketType{
    input = 'input',
    output = 'output'
}

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