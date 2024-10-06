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



// 이미 애니메이션이 실행되고 있지 않다면 반복적으로 렌더링하는 코드
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
    if (!effectStateManager.keyboardZoomCenterSign.isOn && // 키보드 중심 줌 이펙트
        !effectStateManager.mouseZoomSign.isOn && // 마우스 줌 이펙트
        true) {
        isAnimateOn = false;
        return;
    }
    
    requestAnimationFrame(animate);
}
