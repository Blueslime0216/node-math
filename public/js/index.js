// ====================================================================================================
// 메인 허브
// 키 입력이 발생하면 mouse.ts에서 값을 업데이트한 뒤 controller.ts에서 조작을 실행한다 
// ====================================================================================================
import { $_ } from "./utils/domUtils.js";
import controller from "./sys/controller.js";
import $mouse from "./sys/mouse.js";
import $keyboard from "./sys/keyboard.js";
import userSetting from "./class/userSetting.js";
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
    $mouse.mousemove(e);
});
window.addEventListener('mouseup', (e) => {
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
// 단축키 버튼을 누른 경우 alert 창으로 단축키 목록 표시
document.getElementById('shortcuts').addEventListener('click', () => {
    alert('< Shortcuts >\n\n' +
        '시점 이동 : 마우스 휠 드래그\n' +
        '확대/축소 : 마우스 휠 스크롤\n' +
        '노드 선택 : 노드 좌클릭\n' +
        '노드 선택 취소 : 빈 공간 클릭\n' +
        '다중 선택 : Shift + 좌클릭\n' +
        '다중 선택 중 단일 선택 : 노드 좌클릭\n' +
        '노드 이동 : 노드 좌클릭 후 드래그\n' +
        '격자에 맞춰서 이동 : Ctrl + 드래그\n' +
        '(노드 이동 중 시점 이동 가능)\n' +
        '(다중 선택 시 즉시 드래그 안 되게 설정)\n' +
        '(겹치는 경우 마지막으로 선택된 노드가 위로 올라옴)\n' +
        '드래그 선택 : 빈 공간에 좌클릭 후 드래그\n');
});
// range로 값 변경 디버깅
document.getElementById('range1').addEventListener('input', () => {
    userSetting.gridCustom.lineWidthBoldStrong = Number(document.getElementById('range1').value);
    render();
});
document.getElementById('range2').addEventListener('input', () => {
    userSetting.gridCustom.lineLength = Number(document.getElementById('range2').value);
    render();
});
document.getElementById('range3').addEventListener('input', () => {
    userSetting.gridCustom.dashLength = Number(document.getElementById('range3').value);
    render();
});
