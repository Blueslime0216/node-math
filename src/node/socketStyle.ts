export class socketStyle{
    colors:Record<StyleColor, socketColorChip> = {
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
    shapes:Record<string, socketShapeChip> = { // 노드의 모양
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

const imsi = new socketStyle(); // 인스턴스 생성
export default imsi; // 인스턴스를 export