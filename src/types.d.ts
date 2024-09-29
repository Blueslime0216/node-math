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