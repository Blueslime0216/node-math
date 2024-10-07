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
import { Point, Size } from "./utils/fieldUtils.js";
import debugManager from "./utils/debugStateManager.js";
import effectStateManager from "./utils/effectStateManager.js";
import userSetting from "./utils/userSetting.js";



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
window.addEventListener('mousedown', (e) => {
    // 마우스 클릭 시작 위치 저장
    switch (e.button) {
        case 0:
            controller._mouseStart.left = { x: e.clientX, y: e.clientY };  // 마우스 왼쪽 버튼이 눌렸으면
            break;
        case 1:
            controller._mouseStart.wheel = { x: e.clientX, y: e.clientY };  // 마우스 휠 버튼이 눌렸으면
            break;
        case 2:
            controller._mouseStart.right = { x: e.clientX, y: e.clientY };  // 마우스 오른쪽 버튼이 눌렸으면
            break;
    }
    // 눌려진 마우스 버튼 표시
    switch (e.button) {
        case 0:
            controller._mouseDown.left = true;  // 마우스 왼쪽 버튼이 눌렸으면
            break;
        case 1:
            controller._mouseDown.wheel = true;  // 마우스 휠 버튼이 눌렸으면
            break;
        case 2:
            controller._mouseDown.right = true;  // 마우스 오른쪽 버튼이 눌렸으면
            break;
    }
    // 마우스 클릭 상태 저장
    switch (e.button) {
        case 0:
            controller._isMouseDragging.left = false;  // 마우스 왼쪽 버튼 드래그 상태 초기화
            break;
        case 1:
            controller._isMouseDragging.wheel = false;  // 마우스 휠 버튼 드래그 상태 초기화
            break;
        case 2:
            controller._isMouseDragging.right = false;  // 마우스 오른쪽 버튼 드래그 상태 초기화
            break;
    }
});
controller.mousemove = (e) => {
    // // 마우스 위치에 따라 노드 hover 상태 변경 (??? 코파일럿 추천 코드, 작동하나 나중에 확인하자)
    // viewport.nodes.forEach(node => {
    //     node.isHover = node.isInside({ x: e.offsetX, y: e.offsetY });
    // });
};
window.addEventListener('mousemove', (e) => {
    // 마우스가 눌려있으면 드래그 중으로 표시
    if (controller.isMouseDown.left) { // 마우스 왼쪽 버튼이 눌려있으면
        // 왼쪽 버튼 드래그 중으로 표시
        controller._isMouseDragging.left = true;
        // 드래그 거리 저장
        controller._draggedSize.left = new Size(e.clientX - controller._mouseStart.left.x, e.clientY - controller._mouseStart.left.y);
    }
    if (controller.isMouseDown.wheel) { // 마우스 휠 버튼이 눌려있으면
        // 휠 버튼 드래그 중으로 표시
        controller._isMouseDragging.wheel = true;
        // 드래그 거리 저장
        controller._draggedSize.wheel = new Size(e.clientX - controller._mouseStart.wheel.x, e.clientY - controller._mouseStart.wheel.y);
    }
    if (controller.isMouseDown.right) { // 마우스 오른쪽 버튼이 눌려있으면
        // 오른쪽 버튼 드래그 중으로 표시
        controller._isMouseDragging.right = true;
        // 드래그 거리 저장
        controller._draggedSize.right = new Size(e.clientX - controller._mouseStart.right.x, e.clientY - controller._mouseStart.right.y);
    }
    
    // [ 시점 이동 기능 ]
    if (controller._isMouseDragging.wheel) {
        viewport.offsetMoving.width = controller._draggedSize.wheel.width;
        viewport.offsetMoving.height = controller._draggedSize.wheel.height;

        viewport.render();
    }
});
window.addEventListener('mouseup', (e) => {
    // 마우스 시작 지점 초기화
    // switch문을 사용한 이유는 개별적으로 업데이트 해서 적용하기 위함임
    switch (e.button) {
        case 0: // 마우스 왼쪽 버튼이 떼어졌으면
            controller._mouseStart.left = { x: -1, y: -1 };  
            
            controller._mouseDown.left = false;  // 마우스 왼쪽 버튼이 떼어졌으면
            controller._isMouseDragging.left = false;  // 마우스 왼쪽 버튼 드래그 상태 초기화
            
            controller._isMouseDragging.left = false;  // 마우스 왼쪽 버튼 드래그 상태 초기화

            controller._draggedSize.left = new Size(0, 0);  // 마우스 왼쪽 버튼 드래그 거리 초기화

            break;
        case 1: // 마우스 휠 버튼이 떼어졌으면
            controller._mouseStart.wheel = { x: -1, y: -1 };

            controller._mouseDown.wheel = false;  // 마우스 휠 버튼이 떼어졌으면
            controller._isMouseDragging.wheel = false;  // 마우스 휠 버튼 드래그 상태 초기화
            
            controller._isMouseDragging.wheel = false;  // 마우스 휠 버튼 드래그 상태 초기화

            controller._draggedSize.wheel = new Size(0, 0);  // 마우스 휠 버튼 드래그 거리 초기화

            // [ 시점 이동 기능 ]
            // 변경된 시점 적용하기
            viewport.offsetStart = viewport.offset;
            viewport.offsetMoving = { width: -1, height: -1 };

            break;
        case 2: // 마우스 오른쪽 버튼이 떼어졌으면
            controller._mouseStart.right = { x: -1, y: -1 };
            
            controller._mouseDown.right = false;  // 마우스 오른쪽 버튼이 떼어졌으면
            controller._isMouseDragging.right = false;  // 마우스 오른쪽 버튼 드래그 상태 초기화
            
            controller._isMouseDragging.right = false;  // 마우스 오른쪽 버튼 드래그 상태 초기화
            
            controller._draggedSize.right = new Size(0, 0);  // 마우스 오른쪽 버튼 드래그 거리 초기화

            break;
    }
});
controller.mouseup = (e) => {
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
        position: { x: e.offsetX, y: e.offsetY },
    }
    animateStart();
}

// 키보드 이벤트 리스너 등록
keyListener.keydown = (e) => {
    if(keyListener.isKeyDown('Control')){
        console.log('ctrl down');
    }
    if(keyListener.isKeyDown('+') || keyListener.isKeyDown('-')){
        // 화면 중심을 기준으로 확대하는 기능
        effectStateManager.keyboardZoomCenterSign = {
            isOn: true,
            startTime: (new Date().getTime()),
            isApply: zoomApply( viewport,
                                (keyListener.isKeyDown('+') ? 1.1 : 0.9),
                                canvas.width/2,
                                canvas.height/2),
            isInOut: keyListener.isKeyDown('+') ? 'in' : 'out',
            position: { x: canvas.width/2, y: canvas.height/2 },
        };
        animateStart();
    }

    viewport.render();
};


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

// range로 값 변경 디버깅
(document.getElementById('range1') as HTMLButtonElement).addEventListener('input', () => {
    userSetting.gridCustom.lineWidthBoldStrong = Number((document.getElementById('range1') as HTMLInputElement).value);

    viewport.render();
});
(document.getElementById('range2') as HTMLButtonElement).addEventListener('input', () => {
    userSetting.gridCustom.lineLength = Number((document.getElementById('range2') as HTMLInputElement).value);

    viewport.render();
});
(document.getElementById('range3') as HTMLButtonElement).addEventListener('input', () => {
    userSetting.gridCustom.dashLength = Number((document.getElementById('range3') as HTMLInputElement).value);

    viewport.render();
});
