// ====================================================================================================
// 다양한 곳에서 사용할 함수들을 정의해두는 파일
// ====================================================================================================

import { $_ } from "./domUtils.js";
import Controller from "../controller.js";
import viewport,{ Viewport } from "../viewport.js";
import keyboardEventListener from "../keyboardEvent.js";
import DebugStateManager from "./debugStateManager.js";
import effectStateManager from "./effectStateManager.js";


export function zoomApply(viewport:Viewport, zoomAmount: number, x: number, y: number) {
    // 만약 변경된 값이 최소/최대값을 벗어나면 최소/최대값으로 설정
    if (!(viewport.zoom*zoomAmount < viewport.zoomMin || viewport.zoom*zoomAmount > viewport.zoomMax)) {
        viewport.zoom *= zoomAmount;

        // 입력받는 위치를 기준으로 줌이 조정되도록 시점 이동
        viewport.offsetStart.x += (x - viewport.offset.x) * (1 - zoomAmount);
        viewport.offsetStart.y += (y - viewport.offset.y) * (1 - zoomAmount);

        return true;
    } else {
        return false;
    }
}



// 애니메이션이 필요하면 반복적으로 렌더링하는 코드
let isAnimateOn:boolean = false;
export function animateStart(){
    if (!isAnimateOn) {
        isAnimateOn = true;
        animate();
    }
}
export function animate(){
    // 애니메이션이 필요한 경우 렌더링 하고 아니면 종료
    viewport.render();
    let isStop = true;
    if (effectStateManager.keyboardZoomCenterSign.animation > -1) {
        effectStateManager.keyboardZoomCenterSign.animation -= 1;
        isStop = false;
    }
    if (effectStateManager.mouseZoomSign.animation > -1) {
        effectStateManager.mouseZoomSign.animation -= 1;
        isStop = false;
    }
    if (isStop) {
        // 스크린 초기화를 위해 한번 렌더링 한 뒤에 애니메이션 종료
        isAnimateOn = false;
        return;
    }
    
    requestAnimationFrame(animate);
}



export function zoomEffect(ctx: CanvasRenderingContext2D, lineThickness: number, animation: number, isApply: boolean, isInOut: string, center: Point) {
    // 확대/축소 중심 표시
    let frame: number;
    if (isInOut === 'in') {
        frame = 3 - animation / 5; // 15/5 -> 3
    } else {
        frame = animation / 5; // 15/5 -> 3
    }
    let rhombus = frame * 10 + 10; // 마름모 거리
    // 움직였는지에 따라 색상 변경
    ctx.strokeStyle = isApply ? 'hsl(210, 70%, 60%)' : 'hsl(0, 70%, 50%)';
    ctx.lineWidth = lineThickness;
    // // 중심에 작은 정마름모 그리기
    // ctx.beginPath();
    // ctx.moveTo(center.x, center.y - rhombus);
    // ctx.lineTo(center.x + rhombus, center.y);
    // ctx.lineTo(center.x, center.y + rhombus);
    // ctx.lineTo(center.x - rhombus, center.y);
    // ctx.closePath();
    // ctx.stroke();
    // 십자선 그리기
    ctx.beginPath();
    function startPos() {
        return (10 + Math.pow(frame * 10 / 3, 2) / 2);
    }
    function endPos() {
        return (startPos() + length());
    }
    function length() {
        return ((25 - Math.pow(frame * 10 / 3 - 5, 2)));
    }
    function arcDistance() {
        return (20 + Math.pow(frame * 2, 2));
    }
    // 선 그리기
    for (let i = 0; i < 4; i++) {
        ctx.moveTo(center.x + (i % 2 === 0 ? -1 : 1) * startPos(), center.y + (i < 2 ? -1 : 1) * startPos());
        ctx.lineTo(center.x + (i % 2 === 0 ? -1 : 1) * endPos(), center.y + (i < 2 ? -1 : 1) * endPos());
    }
    ctx.stroke();
    // 선과 선 사이에 약간의 공간을 두고 호를 그리기
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        // 호 그리기
        const margineArc = 0.2;
        ctx.arc( center.x , center.y , arcDistance(), Math.PI / 2 * i + margineArc + Math.PI/4, Math.PI / 2 * (i + 1) - margineArc + Math.PI/4);
        ctx.stroke();
    }
}