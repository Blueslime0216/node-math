// ====================================================================================================
// 기능들
// 여기서 각 기능을 구현한다
// controller.ts에서 입력된 값들을 가지고 상태를 파악해 값을 조정해서 viewports.ts에 적절한 렌더링 명령을 내린다.
// ====================================================================================================

import { $_ } from "./utils/domUtils.js";
import Controller from "./controller.js";
import viewport from "./viewport.js";
import keyboardEventListener from "./keyboardEvent.js";
import Node from "./node/node.js";
import Socket from "./node/socket.js";
import { zoomApply, animateStart } from "./utils/functions.js";
import debugManager from "./utils/debugStateManager.js";
import effectStateManager from "./utils/effectStateManager.js";


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
// Add node button을 누른 경우 노드 추가
(document.getElementById('addNodeBtn') as HTMLButtonElement).addEventListener('click', () => {
    viewport.createNode({ x: 0, y: 0 }, 'test');
    viewport.render();
});

const keyListener = new keyboardEventListener(); // 키보드 이벤트 리스너 생성
// import로 debugManager를 가져왔음
// import로 effectStateManager를 가져왔음

const canvas:HTMLCanvasElement = $_('editor') as HTMLCanvasElement; // 캔버스 가져오기
const controller = new Controller(canvas); // 마우스 컨트롤러 생성

// import로 viewport를 가져왔음

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
};
controller.mousemove = (e) => {
    // [ 시점 이동 기능 ]
    if (controller._isMouseDragging.wheel) {
        viewport.offsetMoving.width = controller._draggedSize.wheel.width;
        viewport.offsetMoving.height = controller._draggedSize.wheel.height;

        viewport.render();
    }
};
controller.mouseup = (e) => {
    // [ 시점 이동 기능 ]
    // 변경된 시점 적용하기
    viewport.offsetStart = viewport.offset;
    viewport.offsetMoving = { width: -1, height: -1 };
};
controller.click = (e) => {
}
controller.wheel = (e) => {
    // 줌 조절하기
    const zoomFactor = 1.1; // 줌 인/아웃 시 사용할 배율
    const zoomAmount = e.deltaY > 0 ? 1 / zoomFactor : zoomFactor; // 줌 방향(in/out) 계산
    // 마우스 위치를 기준으로 줌이 조정되도록 시점 이동
    // 애니메이션 주기
    effectStateManager.mouseZoomSign = {
        isOn: true,
        startTime: (new Date().getTime()),
        isApply: zoomApply(viewport, zoomAmount, e.offsetX, e.offsetY),
        isInOut: zoomAmount > 1 ? 'in' : 'out',
        position: { x: e.offsetX, y: e.offsetY }
    }
    animateStart();
}

// 키보드 이벤트 리스너 등록
keyListener.keydown = (e) => {
    if(keyListener.isKeyDown('Control')){
        console.log('ctrl down');
    }
    if(keyListener.isKeyDown('+')){
        // 화면 중심을 기준으로 확대하는 기능
        effectStateManager.keyboardZoomCenterSign = {
            isOn: true,
            isInOut: 'in',
            animation: 15,
            isApply: zoomApply(viewport, 1.1, canvas.width/2, canvas.height/2)
        };
        animateStart();
    }
    if(keyListener.isKeyDown('-')){
        // 화면 중심을 기준으로 축소하는 기능
        effectStateManager.keyboardZoomCenterSign = {
            isOn: true,
            isInOut: 'out',
            animation: 15,
            isApply: zoomApply(viewport, 1/1.1, canvas.width/2, canvas.height/2)
        };
        animateStart();
    }

    viewport.render();
};

