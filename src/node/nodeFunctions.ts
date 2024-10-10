
// ====================================================================================================
// 마우스/키보드 입력을 처리하는 컨트롤러 클래스
// 여기서 마우스/키보드 입력에 대한 처리(변수 업데이트! 등)를 하고 이벤트 리스너를 할당하는 등의 작업을 한다
// 직접적으로 작동하는 기능은 여기가 아니라 index.ts에서 작동한다
// ====================================================================================================

import { Point } from "../utils/fieldUtils.js";
import Node from "./node.js";
import Socket from "./socket.js";

export function isInside(point: Point, polygon: Polygon): boolean {
    let inside = false;

    // 폴리곤의 모든 변을 순회하면서 교차점을 확인
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        // 점이 다각형의 변과 교차하는지 확인
        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;

    }

    return inside;
}
