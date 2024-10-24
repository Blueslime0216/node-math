export class SocketStyleManager_old{
    colors = {
        blue : {
            default: {
                fill: 'hsl(210, 70%, 50%, 100%)', // 노드의 배경 색상
                stroke: 'hsl(210, 15%, 100%, 100%)', // 노드의 테두리 색상
                lineThickness: 1, // 노드의 테두리 두께
            },
            hover: {
                fill: 'hsl(210, 70%, 55%, 100%)',
                stroke: 'hsl(210, 15%, 100%, 100%)',
                lineThickness: 1,
            },
            selected: {
                fill: 'hsl(210, 70%, 50%, 100%)',
                stroke: 'hsl(120, 100%, 70%, 100%)',
                lineThickness: 2,
            },
            connected: {
                fill: 'hsl(210, 70%, 50%, 100%)',
                stroke: 'hsl(20, 100%, 50%, 100%)',
                lineThickness: 2,
            },
        },
        sky : {
            default: {
                fill: 'hsl(210, 70%, 50%, 50%)',
                stroke: 'hsl(210, 15%, 100%, 100%)',
                lineThickness: 1,
            },
            hover: {
                fill: 'hsl(210, 70%, 55%, 50%)',
                stroke: 'hsl(210, 15%, 100%, 100%)',
                lineThickness: 1,
            },
            selected: {
                fill: 'hsl(210, 70%, 50%, 60%)',
                stroke: 'hsl(120, 100%, 70%, 100%)',
                lineThickness: 2,
            },
            connected: {
                fill: 'hsl(210, 70%, 50%, 60%)',
                stroke: 'hsl(20, 100%, 50%, 100%)',
                lineThickness: 2,
            },
        },
    };
    shapes = { // 노드의 모양
        header : {
            color: 'blue',
            type : 'default',
        },
        connector : {
            color: 'blue',
            type : 'default',
        },
        body : {
            color: 'sky',
            type : 'default',
        },
    };
}




// hsl 색상을 문자열로 변환
export function getHSL(color: HSLColor): string {
    const { h, s, l, a } = color;
    return `hsl(${h}, ${s}%, ${l}%, ${a})`;
}
// 색상을 좀 더 밝게 만드는 함수
function lightenColor(color: HSLColor, percentage: number): HSLColor {
    // 밝기(Lightness)를 주어진 퍼센트만큼 증가시킴
    const newLightness = Math.min(Math.max(color.l + percentage, 0), 100);  // 최소값은 0, 최대값은 100%
    return { ...color, l: newLightness };
}
// 단일 기본 색상 정의
const baseColors: ColorSet = {
    fill: { h: 210, s: 70, l: 50, a: 1 },
    stroke: { h: 210, s: 15, l: 100, a: 1 },
    lineThickness: 1,
};
// 노드 상태에 따른 색상을 반환하는 함수
function getStateColorSet(base: ColorSet, state: SocketState): ColorSet {
    switch (state) {
        case 'hovered':
            return {
                ...base,
                fill: lightenColor(base.fill, 10),  // 밝기를 10% 밝게
            };
        case 'parent_selected':
            return {
                ...base,
                stroke: { h: 60, s: 100, l: 70, a: 1 },
                lineThickness: 2
            };
        case 'selected':
            return {
                ...base,
                stroke: { h: 60, s: 100, l: 70, a: 1 },
                lineThickness: 2,
            };
        case 'connected':
            return {
                ...base,
                fill: lightenColor(base.fill, -20),  // 밝기를 -20% 밝게
            };
        default:
            return base;
    }
}


class SocketStyleManager {
    private style: SocketStyle = {
        color:{
            blue:{ 
                fill:{ h: 210, s: 70, l: 50, a: 1 },
                stroke:{ h: 210, s: 15, l: 100, a: 1 },
                lineThickness : 1,
            },
        },
        shape:{
            float:{
                color:'blue',
                shape:'circle',
            },
            int:{
                color:'blue',
                shape:'circle',
            }
        }
    };

    // 상태에 맞는 스타일을 반환하는 메서드
    getStyle(type: SocketType, state: SocketState): SocketStyle_return {
        return {
            // 색상을 실재 ColorSet으로 변경해서 리턴
            color: getStateColorSet(this.style.color[this.style.shape[type].color], state),
            shape: this.style.shape,
        };
    }
};
export default new SocketStyleManager(); // 인스턴스를 export