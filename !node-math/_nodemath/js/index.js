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
// // 단축키 목록 표시
// (document.getElementById('shortcuts') as HTMLButtonElement).addEventListener('click', () => {
//     const imsi = ('< Shortcuts >\n\n'
//         + '< 규칙 >\n'
//         + '가능하면 키보드 왼쪽에 있는 키 사용하자\n'
//         + 'Shift : All과 Add처럼 A가 겹치는 경우\n'
//         + 'Alt : 기존 기능의 반전\n'
//         + '\n'
//         + '< 단축키 >\n'
//         + '> 시점 관련\n'
//         + '시점 이동 : [ 마우스 휠 드래그 ]\n'
//         + '확대/축소 : [ 마우스 휠 스크롤 ]\n'
//         + '화면 중심 확대/축소 : [ + / - ] \n'
//         + '> 노드 조작 관련\n'
//         + '노드 생성 : [ Shift + A ]\n'
//         + '노드 삭제 : 노드 선택 후 [ X, Delete ]\n'
//         + '노드 이동 : [ 노드 선택 후 마우스 왼쪽 드래그 ]\n'
//         + '그리드에 맞춰서 이동 : 이동 중 [ Ctrl ]\n'
//         + '선택된 노드 그리드에 맞추기 : [ Ctrl + G ]\n'
//         + '노드 앞쪽/뒤쪽으로 이동 : [ Ctrl + "]" / Ctrl + "[" ]\n'
//         + '> 선택 관련\n'
//         + '노드 단일 선택 : [ 노드 좌클릭 ]\n'
//         + '노드 선택 취소 : [ Alt + 노드 좌클릭 ]\n'
//         + '모든 노드 선택 : [ A ]\n'
//         + '모든 노드 선택 취소 : [ Alt + A, 빈 공간 클릭 ]\n'
//         + '다중 선택 : [ Shift + 좌클릭 ]\n'
//         + '\n'
//         + '< 메모 >\n'
//         + '노드 생성 시 화면 중앙에 생성됨\n'
//         + '노드 이동 중 시점 조작 가능\n'
//         + '다중 선택 중 [ Alt + 좌클릭 ]를 사용해 단일 선택 취소 가능\n'
//         + '겹쳐져 있을 때 노드가 선택되면 가장 위로 올라옴\n'
//         // + '드래그 선택 : 빈 공간에 좌클릭 후 드래그\n'
//     );
//     console.log(imsi);
//     alert(imsi);
// });
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
