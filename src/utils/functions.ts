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
    // 스크린 초기화를 위해 먼저 렌더링 한번 하기
    viewport.render();
    // 애니메이션이 필요 없다면 종료하기
    if (!effectStateManager.keyboardZoomCenterSign.isOn &&
        !effectStateManager.mouseZoomSign.isOn) {
        isAnimateOn = false;
        return;
    }
    
    requestAnimationFrame(animate);
}



export function zoomEffect(ctx: CanvasRenderingContext2D, lineThickness: number, _nowTime: number, _setting: IEffect, _center: Point=_setting.position) {
    const isApply:boolean = _setting.isApply;
    const isInOut:string = _setting.isInOut as string;
    const center:Point = _center;
    // 확대/축소 중심 표시
    let _time = _nowTime - _setting.startTime; // 0 -> 200
    const _factor = _time/200;
    // 프레임이 200을 넘어가면 애니메이션 종료
    if (_time > 200) {
        _setting.isOn = false;
        return;
    }
    
    // 글로우 효과 주기
    ctx.shadowBlur = 10;
    ctx.lineWidth = lineThickness + 1;
    // 움직였는지에 따라 색상 변경
    if (isApply) {
        ctx.strokeStyle = 'hsl(210, 100%, 60%)';
        ctx.shadowColor = 'hsl(210, 100%, 60%)';
    } else {
        ctx.strokeStyle = 'hsl(0, 70%, 50%)';
        ctx.shadowColor = 'hsl(0, 70%, 50%)';
    }

    // 함수 선언
    ctx.beginPath();
    function startPos() {
        if (isInOut === 'in') {
            return (1 - Math.pow(1 - _factor, 3))*50 + 10;
        } else {
            return (Math.pow(1 - _factor, 3))*50 + 25;
        }
    }
    function endPos() {
        return (startPos() + length());
    }
    function length() {
        if (isInOut === 'in') {
            return (Math.pow(1 - _factor, 3))*25;
        } else {
            return (Math.pow(1 - _factor, 3))*25;
        }
    }
    // 십자선 그리기
    for (let i = 0; i < 4; i++) {
        ctx.moveTo(center.x + (i % 2 === 0 ? -1 : 1) * startPos(), center.y + (i < 2 ? -1 : 1) * startPos());
        ctx.lineTo(center.x + (i % 2 === 0 ? -1 : 1) * endPos(), center.y + (i < 2 ? -1 : 1) * endPos());
    }
    ctx.stroke();
    function arcDistance() {
        if (isInOut === 'in') {
            return (1 - Math.pow(1 - _factor, 3))*50;
        } else {
            return 50 - (1 - Math.pow(1 - _factor, 3))*50 + 35;
        }
    }
    // // 선과 선 사이에 약간의 공간을 두고 호를 그리기
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        // 호 그리기
        const margineArc = 0.2;
        ctx.arc( center.x , center.y , arcDistance(), Math.PI / 2 * i + margineArc + Math.PI/4, Math.PI / 2 * (i + 1) - margineArc + Math.PI/4);
        ctx.stroke();
    }

    // 글로우 효과 제거
    ctx.shadowBlur = 0;
}