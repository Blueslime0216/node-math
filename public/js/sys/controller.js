// ====================================================================================================
// 마우스/키보드 입력을 처리하는 컨트롤러 클래스
// ====================================================================================================
import { $_ } from "../utils/domUtils.js";
import { keydownInOrder } from "../utils/functions.js";
import viewport from "./viewport.js";
import { createNode } from "./viewportFunctions.js";
import $mouse from "./mouse.js";
import $keyboard from "./keyboard.js";
import { zoomApply, animateStart } from "../func/functions.js";
import effectStateManager from "../class/effectStateManager.js";
import { render } from "./viewportFunctions.js";
import state from "../class/state.js";
const canvas = $_('editor'); // 캔버스 가져오기
export class Controller {
    constructor() {
        this._isSnapToGrid = false; // 그리드에 맞추기 여부
        this._viewportOffsetMoved_whileDragging = { width: 0, height: 0 }; // 노드를 드래그하는 동안 움직인 시점 이동 거리
    }
    mousedown(e) {
        // [ 노드 드래그 선택 취소 기능 ] 노드 드래그 선택 중 [ 마우스 오른쪽 클릭 ] : 노드 드래그 선택 취소
        if ($mouse.isMouseDown.right && state.isDragSelecting) {
            state.isDragSelecting = false;
            state.isDragSelecting_cancel = true;
            viewport.dragSelectedNodes.forEach(node => {
                node.isDragSelected = false;
            });
            viewport.dragSelectedNodes.clear();
            viewport.selectedNodes = new Set(viewport.temp_nodeBeforeDragSelect);
            viewport.selectedNodes.forEach(node => {
                node.isSelected = true;
            });
            console.log('노드 드래그 선택 취소');
        }
        // [ 노드 선택 기능 ]
        // [ 단일 선택 ] 마우스 왼 클릭 + 호버된 노드가 있고 + 선택된 노드가 아니면 + Alt 키 누르지 않았으면 + 노드 드래그 선택 취소가 된 상태가 아니면
        if ($mouse.isMouseDown.left && viewport.hoveredNode && !viewport.hoveredNode.isSelected && !$keyboard.isKeyDown('AltLeft') && !state.isDragSelecting_cancel) {
            if (!($keyboard.isKeyDown('ShiftLeft'))) {
                // 비우기
                viewport.nodes.forEach(node => {
                    node.isSelected = false;
                });
                viewport.selectedNodes.clear();
            }
            // 선택된 노드로 설정
            viewport.selectedNodes.add(viewport.hoveredNode);
            viewport.hoveredNode.isSelected = true;
            // 선택된 노드를 맨 앞으로 가져오기
            viewport.nodes.splice(viewport.nodes.indexOf(viewport.hoveredNode), 1);
            viewport.nodes.push(viewport.hoveredNode);
        }
        // [ 노드 드래그 취소 기능 ]
        // 노드 드래그 중 [ 마우스 오른쪽 클릭 ] 노드 드래그 취소
        if ($mouse.isMouseDown.right && state.isNodeDragging) {
            viewport.selectedNodes.forEach(node => {
                node.dragOffset = { x: 0, y: 0 };
            });
            state.isNodeDragging = false;
            state.nodeDragging_cancel = true;
            this._viewportOffsetMoved_whileDragging = { width: 0, height: 0 };
        }
        render();
    }
    mouseclick(e) {
        // 선택된 노드를 클릭 하는 경우
        if ($mouse.isMouseClick.left && viewport.hoveredNode && viewport.hoveredNode.isSelected) {
            // Alt가 같이 눌린 경우면 [ 단일 선택 해제 ]
            if ($keyboard.isKeyDown('AltLeft')) {
                // ts에러 때문에 적음
                if (viewport.hoveredNode === null) {
                    alert('애초에 위의 조건문에 있어서 hoveredNode가 null이면 이 코드까지 올 수가 없는데 난 왜 예외처리를 하고 있는 거지');
                    return;
                }
                ;
                // 호버된 노드가 선택된 노드라면 선택 해제
                if (viewport.hoveredNode.isSelected) {
                    viewport.hoveredNode.isSelected = false;
                    viewport.selectedNodes.delete(viewport.hoveredNode);
                }
                else {
                    // 선택된 노드로 설정
                    viewport.selectedNodes.add(viewport.hoveredNode);
                    viewport.hoveredNode.isSelected = true;
                    // 선택된 노드를 맨 앞으로 가져오기
                    viewport.nodes.splice(viewport.nodes.indexOf(viewport.hoveredNode), 1);
                    viewport.nodes.push(viewport.hoveredNode);
                }
            }
            else if (!$keyboard.isKeyDown('ShiftLeft')) { // 다중선택 해제 방지(Shift를 누르지 않은 경우)
                // [ 단일 선택 ] 이 노드 하나만 선택처리
                // 비우기
                viewport.selectedNodes.clear();
                viewport.nodes.forEach(node => {
                    node.isSelected = false;
                });
                viewport.nodes.forEach(node => {
                    if (node.isHover) {
                        // 선택된 노드로 설정
                        viewport.selectedNodes.add(node);
                        node.isSelected = true;
                        // 선택된 노드를 맨 앞으로 가져오기
                        viewport.nodes.splice(viewport.nodes.indexOf(node), 1);
                        viewport.nodes.push(node);
                    }
                    else {
                        node.isSelected = false;
                    }
                });
            }
        }
        // 빈 공간을 클릭한 경우
        if ($mouse.isMouseClick.left && !viewport.hoveredNode) {
            // [ 모든 노드 선택 해제 기능 ]
            // (빈 공간을 클릭하면 모든 노드 선택 해제)
            viewport.selectedNodes.clear();
            viewport.nodes.forEach(node => {
                node.isSelected = false;
            });
        }
        render();
    }
    mousedragstart(e) {
        // [ 노드 드래그 선택 기능 ]
        // 빈 공간을 드래그하면 드래그 선택
        if ($mouse.isMouseDown.left && !viewport.hoveredNode) {
            // temp로 복사해두기
            viewport.temp_nodeBeforeDragSelect = new Set(viewport.selectedNodes);
            state.isDragSelecting = true;
            // 비우기
            if (!$keyboard.isKeyDown('ShiftLeft')) {
                viewport.selectedNodes.forEach(node => {
                    node.isSelected = false;
                });
                viewport.selectedNodes.clear();
            }
            animateStart();
        }
    }
    mousemove(e) {
        // [ 시점 이동 기능 ]
        if ($mouse.isMouseDragging.wheel) {
            viewport.offsetMoving.width = $mouse.draggedSize.wheel.width;
            viewport.offsetMoving.height = $mouse.draggedSize.wheel.height;
        }
        // [ 노드 호버 효과 ]
        // 비우기
        viewport.hoveredNode = null;
        viewport.nodes.slice().reverse().forEach(node => {
            node.isHover = false;
        });
        // 호버된 노드 체크
        viewport.nodes.slice().reverse().some((node) => {
            // 소켓 호버 비우기
            viewport.hoveredSocket = null;
            node.sockets.all.forEach(socket => {
                socket.isHover = false;
            });
            // 소켓 호버 체크
            let isStop = false;
            node.sockets.all.forEach(socket => {
                if (socket.isInside({ x: e.offsetX, y: e.offsetY })) {
                    socket.isHover = true;
                    viewport.hoveredSocket = socket;
                    // console.log('소켓 호버');
                    isStop = true;
                }
            });
            if (isStop)
                return true;
            // 만약 노드가 호버되어 있으면
            if (node.isInside({ x: e.offsetX, y: e.offsetY })) {
                node.isHover = true;
                viewport.hoveredNode = node;
                // console.log('노드 호버');
                return true;
            }
            return false;
        });
        // [ 드래그 선택 취소 기능 ]
        if (state.isDragSelecting_cancel) {
            return;
        }
        // (!!!) 이 아래는 드래그 선택을 취소할 때 우클릭을 때지 않고 마우스를 움직일 때 실행되지 않음
        // [ 노드 드래그 기능 ]
        // 마우스 왼쪽 클릭 중이고, 선택된 노드가 있으면 + 노드 드래그 중단이 된 경우가 아니면 + 노드 드래그 선택 중이 아니면 + 노드 드래그 선택 취소가 된 상태가 아니면
        if ($mouse.isMouseDragging.left && viewport.selectedNodes.size > 0 && !state.nodeDragging_cancel && !state.isDragSelecting && !state.isDragSelecting_cancel) {
            state.isNodeDragging = true;
            viewport.selectedNodes.forEach(node => {
                node.dragOffset.x = ($mouse.draggedSize.left.width - this._viewportOffsetMoved_whileDragging.width) / viewport.zoom;
                node.dragOffset.y = ($mouse.draggedSize.left.height - this._viewportOffsetMoved_whileDragging.height) / viewport.zoom;
                // 만약 시점을 움직이고 있으면
                if ($mouse.isMouseDragging.wheel) {
                    // 노드 드래그 거리를 시점 이동 거리에 더하기
                    node.dragOffset.x -= viewport.offsetMoving.width / viewport.zoom;
                    node.dragOffset.y -= viewport.offsetMoving.height / viewport.zoom;
                }
                // 만약 스냅이 켜져 있으면
                if (this._isSnapToGrid) {
                    // 노드를 그리드에 맞추기
                    node.dragOffset.x = Math.round((node.dragOffset.x + node.dragStart.x) / (viewport.gridSpacing / viewport.zoom)) * (viewport.gridSpacing / viewport.zoom) - node.dragStart.x;
                    node.dragOffset.y = Math.round((node.dragOffset.y + node.dragStart.y) / (viewport.gridSpacing / viewport.zoom)) * (viewport.gridSpacing / viewport.zoom) - node.dragStart.y;
                }
            });
        }
        // [ 노드 드래그 선택 기능 ] 빈 공간을 드래그 하면 드래그 선택
        if (state.isDragSelecting) {
            viewport.nodes.forEach(node => {
                if (node.isCollide({ x: $mouse.mouseStart.left.x - canvas.offsetLeft,
                    y: $mouse.mouseStart.left.y - canvas.offsetTop,
                    width: $mouse.draggedSize.left.width,
                    height: $mouse.draggedSize.left.height
                })) {
                    node.isDragSelected = true;
                    viewport.dragSelectedNodes.add(node);
                }
                else {
                    node.isDragSelected = false;
                    viewport.dragSelectedNodes.delete(node);
                }
            });
        }
        // 움직이면 일단 렌더링
        render();
    }
    mouseup(e) {
        // [ 시점 이동 기능 ]
        if (e.button === 1) {
            // 노드 드래그 중이면 거리 조정
            if (state.isNodeDragging && e.button === 1) {
                this._viewportOffsetMoved_whileDragging.width += viewport.offsetMoving.width;
                this._viewportOffsetMoved_whileDragging.height += viewport.offsetMoving.height;
            }
            // [ 노드 드래그 선택 기능 ]
            // 드래그 선택 중이면 시작 좌표 조정하기
            if (state.isDragSelecting && e.button === 1) {
                $mouse.mouseStart.left.x += viewport.offsetMoving.width;
                $mouse.mouseStart.left.y += viewport.offsetMoving.height;
            }
            // 변경된 시점 적용하기
            viewport.offsetStart = viewport.offset;
            viewport.offsetMoving = { width: 0, height: 0 };
        }
        // [ 노드 드래그 기능 ]
        // 노드를 드래그 중이고, 마우스 왼쪽 클릭 중이면
        if (state.isNodeDragging && e.button === 0) {
            // 변경된 노드 위치 적용하기
            viewport.selectedNodes.forEach(node => {
                node.position = node.position; // node.position의 setter 방식 때문에 이렇게 코드를 짬
                node.dragOffset = { x: 0, y: 0 };
            });
            state.isNodeDragging = false;
            this._viewportOffsetMoved_whileDragging = { width: 0, height: 0 };
        }
        // [ 노드 드래그 취소 기능 ]
        if (state.nodeDragging_cancel && e.button === 0) {
            state.nodeDragging_cancel = false;
        }
        // [ 노드 드래그 선택 기능 ]
        if (e.button === 0)
            state.isDragSelecting_cancel = false; // 왼쪽 버튼이 떼지면 드래그 선택 취소 상태 해제
        if (state.isDragSelecting && e.button === 0) {
            state.isDragSelecting = false;
            // Alt 눌림 여부에 따라서 slecetedNodes에 추가할지 말지 결정
            if ($keyboard.isKeyDown('AltLeft')) {
                viewport.dragSelectedNodes.forEach(node => {
                    if (node.isSelected) {
                        node.isSelected = false;
                        viewport.selectedNodes.delete(node);
                    }
                });
            }
            else {
                viewport.dragSelectedNodes.forEach(node => {
                    node.isSelected = true;
                    viewport.selectedNodes.add(node);
                });
            }
            viewport.dragSelectedNodes.forEach(node => {
                node.isDragSelected = false;
            });
            viewport.dragSelectedNodes.clear();
            render();
        }
    }
    wheel(e) {
        // [ 시점 확대/축소 기능 ]
        const zoomFactor = 1.1; // 줌 인/아웃 시 사용할 배율
        const zoomAmount = $mouse.wheelDelta.y > 0 ? 1 / zoomFactor : zoomFactor; // 줌 방향(in/out) 계산
        // 이펙트 주기(그리고 저기 낀 함수로 마우스 위치 기준 줌 적용하기)
        effectStateManager.mouseZoomSign = {
            isOn: true,
            startTime: (new Date().getTime()),
            isApply: zoomApply(zoomAmount, e.offsetX, e.offsetY),
            isInOut: zoomAmount > 1 ? 'in' : 'out',
            position: { x: e.offsetX, y: e.offsetY },
        };
        if (effectStateManager.mouseZoomSign.isApply) {
            // mouseStartAdjusted의 값을 마우스 포인터를 중심으로 조정하기
            $mouse.mouseStart.left.x += (e.clientX - $mouse.mouseStart.left.x) * (1 - zoomAmount);
            $mouse.mouseStart.left.y += (e.clientY - $mouse.mouseStart.left.y) * (1 - zoomAmount);
            $mouse.mouseStart.wheel.x += (e.clientX - $mouse.mouseStart.wheel.x) * (1 - zoomAmount);
            $mouse.mouseStart.wheel.y += (e.clientY - $mouse.mouseStart.wheel.y) * (1 - zoomAmount);
            $mouse.mouseStart.right.x += (e.clientX - $mouse.mouseStart.right.x) * (1 - zoomAmount);
            $mouse.mouseStart.right.y += (e.clientY - $mouse.mouseStart.right.y) * (1 - zoomAmount);
            // _viewportOffsetMoved_whileDragging 값 조정
            this._viewportOffsetMoved_whileDragging.width *= zoomAmount;
            this._viewportOffsetMoved_whileDragging.height *= zoomAmount;
        }
        animateStart();
    }
    keydown(e) {
        // [ 전체 선택(해제) 기능 ]
        // [ A ] 모든 노드 선택
        if ($keyboard.isKeyDown('KeyA') && $keyboard.keymap.length === 1) { // A키만 눌리면
            // 모든 노드 선택
            viewport.nodes.forEach(node => {
                node.isSelected = true;
                viewport.selectedNodes.add(node);
            });
            render();
        }
        // [ Alt + A ] 모든 노드 선택 해제
        if (keydownInOrder(['AltLeft', 'KeyA']) && $keyboard.keymap.length === 2) { // Alt + A키가 눌리면
            // 모든 노드 선택 해제
            viewport.nodes.forEach(node => {
                node.isSelected = false;
            });
            viewport.selectedNodes.clear();
            render();
        }
        // [ 화면 중심을 기준으로 확대하는 기능 ]
        if ($keyboard.isKeyDown('NumpadAdd') || $keyboard.isKeyDown('NumpadSubtract')) {
            effectStateManager.keyboardZoomCenterSign = {
                isOn: true,
                startTime: (new Date().getTime()),
                isApply: zoomApply(($keyboard.isKeyDown('NumpadAdd') ? 1.1 : 0.9), canvas.width / 2, canvas.height / 2),
                isInOut: $keyboard.isKeyDown('NumpadAdd') ? 'in' : 'out',
                position: { x: canvas.width / 2, y: canvas.height / 2 },
            };
            animateStart();
        }
        // [ 노드 순서 변경 기능 ]
        if (keydownInOrder(['ControlLeft', 'BracketLeft']) || keydownInOrder(['ControlLeft', 'BracketRight'])) {
            // 노드를 선택하지 않았으면
            if (viewport.selectedNodes.size === 0) {
                // 가장 위에 있는 노드 선택
                viewport.selectedNodes.add(viewport.nodes[viewport.nodes.length - 1]);
                viewport.nodes[viewport.nodes.length - 1].isSelected = true;
            }
            // 선택된 노드들을 위/아래로 이동
            viewport.selectedNodes.forEach(node => {
                const index = viewport.nodes.indexOf(node);
                if ($keyboard.isKeyDown('BracketLeft')) {
                    if (index > 0) {
                        viewport.nodes.splice(index, 1);
                        viewport.nodes.splice(index - 1, 0, node);
                    }
                }
                else { // BracketRight
                    if (index < viewport.nodes.length - 1) {
                        viewport.nodes.splice(index, 1);
                        viewport.nodes.splice(index + 1, 0, node);
                    }
                }
            });
        }
        ;
        render();
    }
    keypress(e) {
        // [ 노드 생성 기능 ]
        // [ Shift + A ] 를 누르면 노드 생성
        if (keydownInOrder(['ShiftLeft', 'KeyA']) && !$keyboard.isKeyHold('ShiftLeft')) {
            createNode({
                x: (canvas.width / 2 - viewport.offset.x) / viewport.zoom,
                y: (canvas.height / 2 - viewport.offset.y) / viewport.zoom
            }, 'operator');
            render();
        }
        // [ 노드 드래그 선택 기능 ] 이전에 선택되어 있던 노드들 처리 방법 Shift로 선택하기
        if (state.isDragSelecting && $keyboard.isKeyDown('ShiftLeft')) { // Shift를 누르면
            viewport.selectedNodes = new Set(viewport.temp_nodeBeforeDragSelect);
            viewport.selectedNodes.forEach(node => {
                node.isSelected = true;
            });
        }
        // [ 노드 삭제 기능 ]
        if ($keyboard.isKeyDown('KeyX') || $keyboard.isKeyDown('Delete')) {
            viewport.nodes = viewport.nodes.filter(node => {
                if (node.isSelected) {
                    return false;
                }
                else {
                    return true;
                }
            });
            viewport.selectedNodes.clear();
            render();
        }
        // [ 그리드에 맞추기 기능 ]
        if ($keyboard.isKeyDown('ControlLeft') && state.isNodeDragging) {
            this._isSnapToGrid = true;
            viewport.selectedNodes.forEach(node => {
                // 노드를 그리드에 맞추기
                node.dragOffset.x = Math.round((node.dragOffset.x + node.dragStart.x) / (viewport.gridSpacing / viewport.zoom)) * (viewport.gridSpacing / viewport.zoom) - node.dragStart.x;
                node.dragOffset.y = Math.round((node.dragOffset.y + node.dragStart.y) / (viewport.gridSpacing / viewport.zoom)) * (viewport.gridSpacing / viewport.zoom) - node.dragStart.y;
            });
        }
        if (keydownInOrder(['ControlLeft', 'KeyG'])) {
            viewport.selectedNodes.forEach(node => {
                // 노드를 그리드에 맞추기
                node.position = {
                    x: Math.round((node.position.x) / (viewport.gridSpacing / viewport.zoom)) * (viewport.gridSpacing / viewport.zoom),
                    y: Math.round((node.position.y) / (viewport.gridSpacing / viewport.zoom)) * (viewport.gridSpacing / viewport.zoom),
                };
            });
        }
        // [ 단축키 목록 표시 ]
        if ($keyboard.isKeyDown('F1')) {
            const kr = ('<b>< 규칙 ></b><br>'
                + '가능하면 키보드 왼쪽에 있는 키 사용하자<br>'
                + 'Shift : All과 Add처럼 A가 겹치는 경우<br>'
                + 'Alt : 기존 기능의 반전<br>'
                + '<br>'
                + '<b>< 단축키 ></b><br>'
                + '<i>- 시점 관련</i><br>'
                + '시점 이동 : [ 마우스 휠 드래그 ]<br>'
                + '확대/축소 : [ 마우스 휠 스크롤 ]<br>'
                + '화면 중심 확대/축소 : [ + / - ]<br>'
                + '<i>- 노드 조작 관련</i><br>'
                + '노드 생성 : [ Shift + A ]<br>'
                + '노드 삭제 : 노드 선택 후 [ X, Delete ]<br>'
                + '노드 이동 : [ 노드 선택 후 마우스 왼쪽 드래그 ]<br>'
                + '그리드에 맞춰서 이동 : 이동 중 [ Ctrl ]<br>'
                + '선택된 노드 그리드에 맞추기 : [ Ctrl + G ]<br>'
                + '노드 앞쪽/뒤쪽으로 이동 : [ Ctrl + "]" / Ctrl + "[" ]<br>'
                + '<i>- 선택 관련</i><br>'
                + '노드 단일 선택 : [ 노드 좌클릭 ]<br>'
                + '노드 선택 취소 : [ Alt + 노드 좌클릭 ]<br>'
                + '모든 노드 선택 : [ A ]<br>'
                + '모든 노드 선택 취소 : [ Alt + A, 빈 공간 클릭 ]<br>'
                + '다중 선택 : [ Shift + 좌클릭 ]<br>'
                + '드래그 선택 : 빈 공간에 좌클릭 드래그<br>'
                + '드래그 추가 선택 : [ Shift + 드래그 선택 ](중간에 Shift를 떼거나 눌려도 가능)<br>'
                + '드래그 제거 선택 : [ Alt + 드래그 선택 ](드래그 중에 Alt 눌러도 가능)<br>'
                + '드래그 취소 : 그래그 중 + [ 마우스 우클릭 ]<br>'
                + '<i>- 기타</i><br>'
                + '단축키 목록 표시 : [ F1 ]<br>'
                + '<br>'
                + '<b>< 메모 ></b><br>'
                + '노드 생성 시 화면 중앙에 생성됨<br>'
                + '노드 이동 중 시점 조작 가능<br>'
                + '다중 선택 중 [ Alt + 좌클릭 ]를 사용해 단일 선택 취소 가능<br>'
                + '겹쳐져 있을 때 노드가 선택되면 가장 위로 올라옴<br>');
            // @ts-expect-error NOTE: 이 타입스크립트는 왜 이 함수를 못 찾는 걸까
            Swal.fire({
                title: '< Shortcuts >',
                html: `<div style="text-align: left;">${kr}</div>`,
            });
        }
    }
    ;
    holdStart(e) {
    }
    ;
    holding(e) {
    }
    ;
    keyup(e) {
        // [ 그리드에 맞추기 기능 ]
        if (e.code === 'ControlLeft') {
            this._isSnapToGrid = false;
        }
        // [ 노드 드래그 선택 기능 ] 이전에 선택되어 있던 노드들 처리 방법 Shift로 선택하기
        if (state.isDragSelecting && e.code === 'ShiftLeft') { // Shift가 떼지면
            viewport.selectedNodes.forEach(node => {
                node.isSelected = false;
            });
            viewport.selectedNodes.clear();
        }
    }
}
const controller = new Controller(); // 인스턴스 생성
export default controller; // 인스턴스를 export
