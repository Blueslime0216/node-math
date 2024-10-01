// ====================================================================================================
// 다양한 곳에서 사용할 함수들을 정의해두는 파일
// ====================================================================================================

import { $_ } from "./utils/domUtils.js";
import Controller from "./controller.js";
import viewport from "./viewport.js";
import keyboardEventListener from "./keyboardEvent.js";
import DebugStateManager from "./utils/debugStateManager.js";
import effectStateManager from "./utils/effectStateManager.js";


// (!!!) any수정하기
export function zoomApply(viewport: any, zoomAmount: number, x: number, y: number) {
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
    if (effectStateManager.keyboardZoomCenterSign.animation > -1) {
        effectStateManager.keyboardZoomCenterSign.animation -= 1;
    } else if (effectStateManager.mouseZoomSign.animation > -1) {
        effectStateManager.mouseZoomSign.animation -= 1;
    } else {
        // 스크린 초기화를 위해 한번 렌더링 한 뒤에 애니메이션 종료
        isAnimateOn = false;
        return;
    }
    
    requestAnimationFrame(animate);
}