import { $_ } from "./utils/domUtils.js";
import Controller from "./controller.js";
import DebugStateManager from "./utils/debugStateManager.js";
import Viewport from "./viewport.js";
import keyboardEventListener from "./keyboardEvent.js";

// 단축키 버튼을 누른 경우 alert 창으로 단축키 목록 표시
(document.getElementById('shortcuts') as HTMLButtonElement).addEventListener('click', () => {
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
        '드래그 선택 : 빈 공간에 좌클릭 후 드래그\n'
    );
});

const debugManager = new DebugStateManager(); // 디버그 상태 관리자 생성
const keyListener = new keyboardEventListener(); // 키보드 이벤트 리스너 생성

const canvas:HTMLCanvasElement = $_('editor') as HTMLCanvasElement; // 캔버스 가져오기
const controller = new Controller(canvas); // 마우스 컨트롤러 생성

const viewport = new Viewport(canvas); // 뷰포트 생성

// 뷰포트 리사이즈 이벤트
window.onresize = viewport.resize;
// 뷰포트 크기 조정
viewport.resize();

// 최초 렌더링
viewport.render();

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // 우클릭 메뉴 안 뜨게 하기
});
// 마우스 컨트롤러 이벤트 등록
controller.mousedown = (e) => {
    // 클릭된 마우스 로그 띄우기
    // console.log(controller._mouseDown);
};
controller.mousemove = (e) => {
    // 드래그 중인 마우스 로그 띄우기
    // console.log(controller._isMouseDragging);
};
controller.mouseup = (e) => {
};
controller.click = (e) => {
}
controller.wheel = (e) => {
    // 줌 조절하기
    const zoomFactor = 1.1; // 줌 인/아웃 시 사용할 배율
    const zoomAmount = e.deltaY > 0 ? 1 / zoomFactor : zoomFactor; // 줌 방향(in/out) 계산
    // 만약 줌이 최소/최대값을 벗어나면 최소/최대값으로 설정
    if (!(viewport.zoom*zoomAmount < viewport.zoomMin || viewport.zoom*zoomAmount > viewport.zoomMax)) {
        viewport.zoom *= zoomAmount;

        // 마우스 위치를 기준으로 줌이 조정되도록 시점 이동
        viewport.offset.x += (e.offsetX - viewport.offset.x) * (1 - zoomAmount);
        viewport.offset.y += (e.offsetY - viewport.offset.y) * (1 - zoomAmount);
    }

    viewport.render();
}

// 키보드 이벤트 리스너 등록
keyListener.keydown = (e) => {
    if(e.code === 'ControlLeft'){
        console.log('ctrl down');
    }
};