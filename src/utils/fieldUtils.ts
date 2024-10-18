export class Point implements TPoint {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Size implements TSize {
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

// export class Rect implements Rect {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//     constructor(x: number, y: number, width: number, height: number) {
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//     }
// }

// export class Polygon implements Polygon {
//     points: Point[];
//     constructor(points: Point[]) {
//         this.points = points;
//     }
// }