export class SocketStyleManager_old {
    constructor() {
        this.colors = {
            blue: {
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
            sky: {
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
        this.shapes = {
            header: {
                color: 'blue',
                type: 'default',
            },
            connector: {
                color: 'blue',
                type: 'default',
            },
            body: {
                color: 'sky',
                type: 'default',
            },
        };
    }
}
// const imsi = new SocketStyleManager(); // 인스턴스 생성
// export default imsi; // 인스턴스를 export
// hsl 색상을 문자열로 변환
export function getHSL(color) {
    const { h, s, l, a } = color;
    return `hsl(${h}, ${s}%, ${l}%, ${a})`;
}
// 색상을 좀 더 밝게 만드는 함수
function lightenColor(color, percentage) {
    // 밝기(Lightness)를 주어진 퍼센트만큼 증가시킴
    const newLightness = Math.min(color.l + percentage, 100); // 최대값은 100%
    return Object.assign(Object.assign({}, color), { l: newLightness });
}
// 단일 기본 색상 정의
const baseColors = {
    fill: { h: 210, s: 70, l: 50, a: 1 },
    stroke: { h: 210, s: 15, l: 100, a: 1 },
    lineThickness: 1,
};
// 노드 상태에 따른 색상을 반환하는 함수
function getStateColorSet(base, state) {
    switch (state) {
        case 'hovered':
            return Object.assign(Object.assign({}, base), { fill: lightenColor(base.fill, 10) });
        case 'selected':
            return Object.assign(Object.assign({}, base), { stroke: { h: 60, s: 100, l: 70, a: 1 }, lineThickness: 2 });
        case 'dragSelected':
            return Object.assign(Object.assign({}, base), { stroke: { h: 20, s: 100, l: 50, a: 1 }, lineThickness: 2 });
        default:
            return base;
    }
}
class SocketStyleManager {
    constructor() {
        // 각 노드 타입별 기본 색상 설정
        this.socketTypeStyles = {
            color: {
                blue: {
                    fill: { h: 210, s: 70, l: 50, a: 1 },
                    stroke: { h: 210, s: 15, l: 100, a: 1 },
                    lineThickness: 1,
                },
            },
            shape: {
                float: {
                    color: 'blue',
                    shape: 'circle',
                },
            }
        };
        // 상태에 맞는 스타일을 반환하는 메서드
        getNodeStyle(type, NodeType, state, NodeState);
        TypeStyle;
        {
            const baseStyle = this.nodeTypeStyles[type];
            return {
                color: {
                    keyColor: getStateColorSet(baseStyle.color.keyColor, state),
                    bodyColor: getStateColorSet(baseStyle.color.bodyColor, state),
                },
                shape: baseStyle.shape,
            };
        }
    }
}
