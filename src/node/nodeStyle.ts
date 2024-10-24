// hsl 색상을 문자열로 변환
export function getHSL(color: HSLColor): string {
    const { h, s, l, a } = color;
    return `hsl(${h}, ${s}%, ${l}%, ${a})`;
}
// 색상을 좀 더 밝게 만드는 함수
function lightenColor(color: HSLColor, percentage: number): HSLColor {
    // 밝기(Lightness)를 주어진 퍼센트만큼 증가시킴
    const newLightness = Math.min(color.l + percentage, 100);  // 최대값은 100%
    return { ...color, l: newLightness };
}
// 단일 기본 색상 정의
const baseColors: ColorSet = {
    fill: { h: 210, s: 70, l: 50, a: 1 },
    stroke: { h: 210, s: 15, l: 100, a: 1 },
    lineThickness: 1,
};
// 노드 상태에 따른 색상을 반환하는 함수
function getStateColorSet(base: ColorSet, state: NodeState): ColorSet {
    switch (state) {
        case 'hovered':
            return {
                ...base,
                fill: lightenColor(base.fill, 10),  // 밝기를 10% 밝게
            };
        case 'selected':
            return {
                ...base,
                stroke: { h: 60, s: 100, l: 70, a: 1 },  // 연노란색 테두리
                lineThickness: 2,
            };
        case 'dragSelected':
            return {
                ...base,
                stroke: { h: 20, s: 100, l: 50, a: 1 },  // 연빨간색 테두리
                lineThickness: 2,
            };
        default:
            return base;
    }
}


class NodeStyleManager {
    private nodeTypeStyles: Record<NodeType, TypeStyle>;

    constructor() {
        // 각 노드 타입별 기본 색상 설정
        this.nodeTypeStyles = {
            operator: {
                color:{
                    keyColor: baseColors,
                    bodyColor: { ...baseColors, fill: { h: 210, s: 50, l: 40, a: 1 } },
                },
                shape: {
                    head : {
                        color: 'keyColor',
                        polygon : [
                            { x: -1.5,  y: -0.5 },
                            { x: 1.5,   y: -0.5 },
                            { x: 1.5,   y: 0.5  },
                            { x: -1.5,  y: 0.5  },
                        ]
                    },
                    connector : {
                        color: 'keyColor',
                        polygon : [
                            { x: -1.5,  y: 0.5  },
                            { x: 0,     y: 0.5  },
                            { x: -0.5,  y: 1    },
                            { x: -1.5,  y: 1    },
                        ]
                    },
                    body : {
                        color: 'bodyColor',
                        polygon : [
                            { x: -1.5,  y: 1    },
                            { x: -0.5,  y: 1    },
                            { x: 0,     y: 0.5  },
                            { x: 1.5,   y: 0.5  },
                            { x: 1.5,   y: 4    },
                            { x: 1,     y: 4.5  },
                            { x: -1.5,  y: 4.5  },
                        ]
                    },
                }
            },
            // value: {
            //     color:{
            //         keyColor: { ...baseColors, fill: { h: 120, s: 60, l: 50, a: 1 } },
            //         bodyColor: { ...baseColors, fill: { h: 120, s: 40, l: 40, a: 1 } },
            //     },
            //     shape: {
            //         head : {
            //             color: 'keyColor',
            //             polygon : [
            //                 { x: -1.5,  y: -0.5 },
            //                 { x: 1.5,   y: -0.5 },
            //                 { x: 1.5,   y: 0.5  },
            //                 { x: -1.5,  y: 0.5  },
            //             ]
            //         },
            //     }
            // },
        };
    }

    // 상태에 맞는 스타일을 반환하는 메서드
    getNodeStyle(type: NodeType, state: NodeState): TypeStyle {
        const baseStyle = this.nodeTypeStyles[type];
        return {
            color:{
                keyColor: getStateColorSet(baseStyle.color.keyColor, state),
                bodyColor: getStateColorSet(baseStyle.color.bodyColor, state),
            },
            shape: baseStyle.shape,
        };
    }
}
const nodeStyleManager = new NodeStyleManager();
export default nodeStyleManager; // 인스턴스를 export







// export class nodeStyle2 implements NodeStyle{ // 노드의 색상
//     colors:Record<StyleColor, nodeColorChip> = {
//         blue : {
//             default: {
//                 fill: 'hsl(210, 70%, 50%, 100%)', // 노드의 배경 색상
//                 stroke: 'hsl(210, 15%, 100%, 100%)', // 노드의 테두리 색상
//                 lineThickness: 1, // 노드의 테두리 두께
//             },
//             hover: {
//                 fill: 'hsl(210, 70%, 55%, 100%)',
//                 stroke: 'hsl(210, 15%, 100%, 100%)',
//                 lineThickness: 1,
//             },
//             selected: {
//                 fill: 'hsl(210, 70%, 50%, 100%)',
//                 stroke: 'hsl(120, 100%, 70%, 100%)',
//                 lineThickness: 2,
//             },
//             dragSelected: {
//                 fill: 'hsl(210, 70%, 50%, 100%)',
//                 stroke: 'hsl(20, 100%, 50%, 100%)',
//                 lineThickness: 2,
//             },
//         },
//         sky : {
//             default: {
//                 fill: 'hsl(210, 70%, 50%, 50%)',
//                 stroke: 'hsl(210, 15%, 100%, 100%)',
//                 lineThickness: 1,
//             },
//             hover: {
//                 fill: 'hsl(210, 70%, 55%, 50%)',
//                 stroke: 'hsl(210, 15%, 100%, 100%)',
//                 lineThickness: 1,
//             },
//             selected: {
//                 fill: 'hsl(210, 70%, 50%, 60%)',
//                 stroke: 'hsl(120, 100%, 70%, 100%)',
//                 lineThickness: 2,
//             },
//             dragSelected: {
//                 fill: 'hsl(210, 70%, 50%, 60%)',
//                 stroke: 'hsl(20, 100%, 50%, 100%)',
//                 lineThickness: 2,
//             },
//         },
//     };
//     shapes:Record<StyleShape, nodeShapeChip> = { // 노드의 모양
//         header : {
//             color: 'blue',
//             polygon : [
//                 { x: -1.5,  y: -0.5 },
//                 { x: 1.5,   y: -0.5 },
//                 { x: 1.5,   y: 0.5  },
//                 { x: -1.5,  y: 0.5  },
//             ]
//         },
//         connector : {
//             color: 'blue',
//             polygon : [
//                 { x: -1.5,  y: 0.5  },
//                 { x: 0,     y: 0.5  },
//                 { x: -0.5,  y: 1    },
//                 { x: -1.5,  y: 1    },
//             ]
//         },
//         body : {
//             color: 'sky',
//             polygon : [
//                 { x: -1.5,  y: 1    },
//                 { x: -0.5,  y: 1    },
//                 { x: 0,     y: 0.5  },
//                 { x: 1.5,   y: 0.5  },
//                 { x: 1.5,   y: 4    },
//                 { x: 1,     y: 4.5  },
//                 { x: -1.5,  y: 4.5  },
//             ]
//         },
//     };
// }

// const imsi = new nodeStyle2(); // 인스턴스 생성