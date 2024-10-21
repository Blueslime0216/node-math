// ====================================================================================================
// 다양한 곳에서 사용할 함수들을 정의해두는 파일
// ====================================================================================================

import Controller from "../sys/controller.js";
import viewport,{ Viewport } from "../sys/viewport.js";
import DebugStateManager from "../class/debugStateManager.js";
import effectStateManager from "../class/effectStateManager.js";
import { render } from "../sys/viewportFunctions.js";
import state from "../class/state.js";
import $mouse from "../sys/mouse.js";
import { Size } from "utils/fieldUtils.js";


export function zoomApply(zoomAmount: number, x: number, y: number):boolean {
    // 만약 변경된 값이 최소/최대값을 벗어나면 최소/최대값으로 설정
    if (!(viewport.zoom*zoomAmount < viewport.zoomMin || viewport.zoom*zoomAmount > viewport.zoomMax)) {
        // 줌 적용
        viewport.zoom *= zoomAmount;
        // 모든 노드의 위치 조정 (너비와 높이는 gridSpacing에 의해 자동 조정됨)
        viewport.zoomAmount *= zoomAmount;

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
    render();
    // 애니메이션이 필요 없다면 종료하기
    if (!effectStateManager.keyboardZoomCenterSign.isOn && // 키보드 중심 줌 이펙트
        !effectStateManager.mouseZoomSign.isOn && // 마우스 줌 이펙트
        state.isDragSelecting === false && // 드래그 선택 중
        true) {
        isAnimateOn = false;
        return;
    }
    
    requestAnimationFrame(animate);
}

// (???) arr:Array<TPoint>이거 폴리곤 아님? 폴리곤이면 타입 수정하자
export function drawRoundPolygon(ctx:CanvasRenderingContext2D, arr:Array<TPoint>, radius:number) {
    // @ts-expect-error NOTE: 이 타입스크립트는 왜 이 함수를 못 찾는 걸까
    roundPolygon(arr, radius ).forEach((p, i) => {
      !i && ctx.moveTo(p.in.x, p.in.y)
      ctx.arcTo(p.x, p.y, p.out.x, p.out.y, p.arc.radius)
      ctx.lineTo(p.next.in.x, p.next.in.y)
  })
}