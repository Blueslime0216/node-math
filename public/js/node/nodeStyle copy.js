export class nodeStyle {
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
                dragSelected: {
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
                dragSelected: {
                    fill: 'hsl(210, 70%, 50%, 60%)',
                    stroke: 'hsl(20, 100%, 50%, 100%)',
                    lineThickness: 2,
                },
            },
        };
        this.shapes = {
            header: {
                color: 'blue',
                polygon: [
                    { x: -1.5, y: -0.5 },
                    { x: 1.5, y: -0.5 },
                    { x: 1.5, y: 0.5 },
                    { x: -1.5, y: 0.5 },
                ]
            },
            connector: {
                color: 'blue',
                polygon: [
                    { x: -1.5, y: 0.5 },
                    { x: 0, y: 0.5 },
                    { x: -0.5, y: 1 },
                    { x: -1.5, y: 1 },
                ]
            },
            body: {
                color: 'sky',
                polygon: [
                    { x: -1.5, y: 1 },
                    { x: -0.5, y: 1 },
                    { x: 0, y: 0.5 },
                    { x: 1.5, y: 0.5 },
                    { x: 1.5, y: 4 },
                    { x: 1, y: 4.5 },
                    { x: -1.5, y: 4.5 },
                ]
            },
        };
    }
}
const imsi = new nodeStyle(); // 인스턴스 생성
export default imsi; // 인스턴스를 export
