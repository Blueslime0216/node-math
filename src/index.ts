import MouseController from "./mouseController.js";
import DebugStateManager from "./utils/debugStateManager.js";
import Viewport from "./viewport.js";

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

const debugManager = new DebugStateManager()

const canvas:HTMLCanvasElement = document.getElementById('editor') as HTMLCanvasElement; // 캔버스 가져오기
const viewport = new Viewport(canvas);
