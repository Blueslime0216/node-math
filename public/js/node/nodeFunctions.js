export function isInsideNode(point, polygon) {
    let inside = false;
    // 폴리곤의 모든 변을 순회하면서 교차점을 확인
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        // 점이 다각형의 변과 교차하는지 확인
        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect)
            inside = !inside;
    }
    return inside;
}
export function isInsideSocket(point, socket) {
    return Math.sqrt(Math.pow(point.x - socket.x, 2) + Math.pow(point.y - socket.y, 2)) <= socket.radius;
}
