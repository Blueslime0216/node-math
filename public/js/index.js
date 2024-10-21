// ====================================================================================================
// 메인 허브
// 키 입력이 발생하면 mouse.ts에서 값을 업데이트한 뒤 controller.ts에서 조작을 실행한다 
// ====================================================================================================
import { $_ } from "./utils/domUtils.js";
import controller from "./sys/controller.js";
import $mouse from "./sys/mouse.js";
import $keyboard from "./sys/keyboard.js";
import { render } from "./sys/viewportFunctions.js";
const canvas = $_('editor'); // 캔버스 가져오기
console.log(controller); // 컨트롤러 코드 실행(이거 안 하면 컨트롤러 생성을 안 하더라)
// 최초 렌더링
render();
window.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // 우클릭 메뉴 안 뜨게 하기
});
window.addEventListener('keydown', (e) => {
    e.preventDefault(); // 모든 기본 키 입력 방지
});
// 마우스 값 변경(그 후에 컨트롤러 실행)
window.addEventListener('mousedown', (e) => {
    $mouse.mousedown(e);
});
window.addEventListener('mousemove', (e) => {
    if ($mouse.isMouseDragFirst.left || $mouse.isMouseDragFirst.wheel || $mouse.isMouseDragFirst.right) {
        $mouse.mousedragstart(e);
    }
    $mouse.mousemove(e);
});
window.addEventListener('mouseup', (e) => {
    // 마우스 버튼이 드래그 되지 않고 떨어지면 클릭 이벤트
    if (e.button === 0 && !$mouse.isMouseDragging.left)
        $mouse.isMouseClick.left = true;
    if (e.button === 1 && !$mouse.isMouseDragging.wheel)
        $mouse.isMouseClick.wheel = true;
    if (e.button === 2 && !$mouse.isMouseDragging.right)
        $mouse.isMouseClick.right = true;
    if ($mouse.isMouseClick.left || $mouse.isMouseClick.wheel || $mouse.isMouseClick.right) {
        $mouse.mouseclick(e);
    }
    $mouse.mouseup(e);
});
canvas.addEventListener('wheel', (e) => {
    $mouse.wheel(e);
});
// 키보드 이벤트 리스너 등록
window.addEventListener('keydown', (e) => {
    $keyboard.keydown(e);
});
window.addEventListener('keyup', (e) => {
    $keyboard.keyup(e);
});
// // range로 값 변경 디버깅
// (document.getElementById('range1') as HTMLButtonElement).addEventListener('input', () => {
//     userSetting.gridCustom.lineWidthBoldStrong = Number((document.getElementById('range1') as HTMLInputElement).value);
//     render();
// });
// (document.getElementById('range2') as HTMLButtonElement).addEventListener('input', () => {
//     userSetting.gridCustom.lineLength = Number((document.getElementById('range2') as HTMLInputElement).value);
//     render();
// });
// (document.getElementById('range3') as HTMLButtonElement).addEventListener('input', () => {
//     userSetting.gridCustom.dashLength = Number((document.getElementById('range3') as HTMLInputElement).value);
//     render();
// });
