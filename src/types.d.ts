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
interface IMouseDraggedSize{
    left:Sizs;
    wheel:Sizs;
    right:Sizs;
}