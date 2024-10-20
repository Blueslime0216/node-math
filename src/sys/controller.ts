// ====================================================================================================
// 마우스/키보드 입력을 감지하는 컨트롤러 클래스
// 이 클래스 안에 입력에 관한 정보가 저장되고, 불러올 수 있다
// ====================================================================================================

import { $, $_ } from "../utils/domUtils.js";
import { keydownInOrder } from "../utils/functions.js";
import { Point, Size } from "../utils/fieldUtils.js";
import viewport from "./viewport.js";
import { createNode } from "./viewportFunctions.js";
import $mouse from "./mouse.js";
import $keyboard from "./keyboard.js";
import Node from "../node/node.js";
import Socket from "../node/socket.js";
import { zoomApply, animateStart } from "../func/functions.js";
import debugManager from "../class/debugStateManager.js";
import effectStateManager from "../class/effectStateManager.js";
import userSetting from "../class/userSetting.js";
import { render } from "./viewportFunctions.js";

const canvas:HTMLCanvasElement = $_('editor') as HTMLCanvasElement; // 캔버스 가져오기



export class Controller {
    _isSnapToGrid: boolean = false; // 그리드에 맞추기 여부
    _isNodeDragging: boolean = false; // 노드 드래그 중인지 여부
    _nodeDraggingCancel: boolean = false; // 노드 드래그 취소 여부
    _viewportOffsetMoved_whileDragging: Size = { width: 0, height: 0 }; // 노드를 드래그하는 동안 움직인 시점 이동 거리

    mousedown(e: MouseEvent) {
        // [ 노드 선택 기능 ]
        // [ 단일 선택 ] 마우스 왼 클릭 + 호버된 노드가 있고 + 선택된 노드가 아니면 + Alt 키 누르지 않았으면
        if ($mouse.isMouseDown.left && viewport.hoveredNode && !viewport.hoveredNode.isSelected && !$keyboard.isKeyDown('AltLeft')) {
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
        } else
        // 선택된 노드를 선택 하는 경우
        if ($mouse.isMouseDown.left && viewport.hoveredNode && viewport.hoveredNode.isSelected) {
            // 드래그인지 단일 클릭인지 판단
            let waitInterval = setInterval(() => {
                // 드래그 시 드래그라고 판단
                if ($mouse.isMouseDragging.left) {
                    clearInterval(waitInterval); // 인터벌 삭제
                }
                // 클릭 해제 시 클릭이라고 판단
                if ($mouse.isMouseDown.left === false) {
                    if ($keyboard.isKeyDown('AltLeft')) {
                        // ts에러 때문에 적음
                        if (viewport.hoveredNode === null) {
                            alert('hoveredNode is null, unexpected situation');
                            return
                        };

                        // 호버된 노드가 선택된 노드라면 선택 해제
                        if (viewport.hoveredNode.isSelected) {
                            viewport.hoveredNode.isSelected = false;
                            viewport.selectedNodes.delete(viewport.hoveredNode);
                        } else {
                            // 선택된 노드로 설정
                            viewport.selectedNodes.add(viewport.hoveredNode);
                            viewport.hoveredNode.isSelected = true;
                            // 선택된 노드를 맨 앞으로 가져오기
                            viewport.nodes.splice(viewport.nodes.indexOf(viewport.hoveredNode), 1);
                            viewport.nodes.push(viewport.hoveredNode);
                        }
                    } else if (!$keyboard.isKeyDown('ShiftLeft')) { // 다중선택 해제 방지
                        // 비우기
                        viewport.nodes.forEach(node => {
                            node.isSelected = false;
                        });
                        viewport.selectedNodes.clear();

                        viewport.nodes.forEach(node => {
                            if (node.isHover) {
                                // 선택된 노드로 설정
                                viewport.selectedNodes.add(node);
                                node.isSelected = true;
                                // 선택된 노드를 맨 앞으로 가져오기
                                viewport.nodes.splice(viewport.nodes.indexOf(node), 1);
                                viewport.nodes.push(node);
                            } else {
                                node.isSelected = false;
                            }
                        });
                    }

                    render(); // 인터벌이라 아래의 렌더링이 이미 끝난 후라서 여기서 렌더링

                    clearInterval(waitInterval); // 인터벌 삭제
                }
            }, 10); // 일정 시간 간격으로 확인
        }
        
        // 빈 공간을 클릭하면 모든 노드 선택 해제)
        if ($mouse.isMouseDown.left && !viewport.hoveredNode) {
            viewport.selectedNodes.clear();
            viewport.nodes.forEach(node => {
                node.isSelected = false;
            });
        }

        // [ 노드 드래그 취소 기능 ]
        // 노드 드래그 중 [ 마우스 오른쪽 클릭 ] 노드 드래그 취소
        if ($mouse.isMouseDown.right && this._isNodeDragging) {
            viewport.selectedNodes.forEach(node => {
                node.dragOffset = { x: 0, y: 0 };
            });
            this._isNodeDragging = false;
            this._nodeDraggingCancel = true;
            this._viewportOffsetMoved_whileDragging = { width: 0, height: 0 };
        }


        // 노드 선택 스타일 적용하려고 무조건 한번 렌더링
        render();
    }

    mousemove(e: MouseEvent) {
        // [ 시점 이동 기능 ]
        if ($mouse.isMouseDragging.wheel) {
            viewport.offsetMoving.width = $mouse.draggedSize.wheel.width;
            viewport.offsetMoving.height = $mouse.draggedSize.wheel.height;
        }


        // [ 노드 호버 효과 ]
        viewport.hoveredNode = null; // 비우기
        // 호버된 노드가 있는지 확인
        viewport.nodes.slice().reverse().forEach(node => { // 가장 위에 있는 노드를 찾기 위해 reverse를 넣음
            node.isHover = (node.isInside({ x: e.offsetX, y: e.offsetY }) && !viewport.hoveredNode);
            if (node.isHover) {
                viewport.hoveredNode = node;
            }
        });

        // [ 노드 드래그 기능 ]
        // 마우스 왼쪽 클릭 중이고, 선택된 노드가 있으면
        if ($mouse.isMouseDragging.left && viewport.selectedNodes.size > 0 && !this._nodeDraggingCancel) {
            this._isNodeDragging = true;

            viewport.selectedNodes.forEach(node => {
                node.dragOffset.x = ($mouse.draggedSize.left.width - this._viewportOffsetMoved_whileDragging.width)/viewport.zoom;
                node.dragOffset.y = ($mouse.draggedSize.left.height - this._viewportOffsetMoved_whileDragging.height)/viewport.zoom;

                // 만약 시점을 움직이고 있으면
                if ($mouse.isMouseDragging.wheel) {
                    // 노드 드래그 거리를 시점 이동 거리에 더하기
                    node.dragOffset.x -= viewport.offsetMoving.width / viewport.zoom;
                    node.dragOffset.y -= viewport.offsetMoving.height / viewport.zoom;
                }

                // 만약 스냅이 켜져 있으면
                if (this._isSnapToGrid) {
                    // 노드를 그리드에 맞추기
                    node.dragOffset.x = Math.round((node.dragOffset.x + node.dragStart.x)/(viewport.gridSpacing/viewport.zoom))*(viewport.gridSpacing/viewport.zoom)- node.dragStart.x;
                    node.dragOffset.y = Math.round((node.dragOffset.y + node.dragStart.y)/(viewport.gridSpacing/viewport.zoom))*(viewport.gridSpacing/viewport.zoom)- node.dragStart.y;
                }
            });
        }


        // 움직이면 일단 렌더링
        render();
    }

    mouseup(e: MouseEvent) {
        // [ 시점 이동 기능 ]
        if (e.button === 1) {
            // 노드 드래그 중이면 거리 조정
            if (this._isNodeDragging && e.button === 1) {
                this._viewportOffsetMoved_whileDragging.width += viewport.offsetMoving.width;
                this._viewportOffsetMoved_whileDragging.height += viewport.offsetMoving.height;
            }

            // 변경된 시점 적용하기
            viewport.offsetStart = viewport.offset;
            viewport.offsetMoving = { width: 0, height: 0 };
        }

        // [ 노드 드래그 기능 ]
        // 노드를 드래그 중이고, 마우스 왼쪽 클릭 중이면
        if (this._isNodeDragging && e.button === 0) {
            // 변경된 노드 위치 적용하기
            viewport.selectedNodes.forEach(node => {
                node.position = node.position; // node.position의 setter 방식 때문에 이렇게 코드를 짬
                node.dragOffset = { x: 0, y: 0 };
            });

            this._isNodeDragging = false;
            this._viewportOffsetMoved_whileDragging = { width: 0, height: 0 };
        }

        // [ 노드 드래그 취소 기능 ]
        if (this._nodeDraggingCancel && e.button === 0) {
            this._nodeDraggingCancel = false;
        }
    }

    wheel(e: WheelEvent) {
        // [ 시점 확대/축소 기능 ]
        const zoomFactor = 1.1; // 줌 인/아웃 시 사용할 배율
        const zoomAmount = $mouse.wheelDelta.y > 0 ? 1 / zoomFactor : zoomFactor; // 줌 방향(in/out) 계산
        // 이펙트 주기(그리고 저기 낀 함수로 마우스 위치 기준 줌 적용하기)
        effectStateManager.mouseZoomSign = {
            isOn: true,
            startTime: (new Date().getTime()),
            isApply: zoomApply(viewport, zoomAmount, e.offsetX, e.offsetY),
            isInOut: zoomAmount > 1 ? 'in' : 'out',
            position: { x: e.offsetX, y: e.offsetY },
        }

        // mouseStartAdjusted의 값을 마우스 포인터를 중심으로 조정하기
        $mouse.mouseStart.left.x += (e.clientX - $mouse.mouseStart.left.x)*(1 - zoomAmount);
        $mouse.mouseStart.left.y += (e.clientY - $mouse.mouseStart.left.y)*(1 - zoomAmount);
        $mouse.mouseStart.wheel.x += (e.clientX - $mouse.mouseStart.wheel.x)*(1 - zoomAmount);
        $mouse.mouseStart.wheel.y += (e.clientY - $mouse.mouseStart.wheel.y)*(1 - zoomAmount);
        $mouse.mouseStart.right.x += (e.clientX - $mouse.mouseStart.right.x)*(1 - zoomAmount);
        $mouse.mouseStart.right.y += (e.clientY - $mouse.mouseStart.right.y)*(1 - zoomAmount);
        // _viewportOffsetMoved_whileDragging 값 조정
        this._viewportOffsetMoved_whileDragging.width *= zoomAmount;
        this._viewportOffsetMoved_whileDragging.height *= zoomAmount;


        animateStart();
    }

    keydown(e: KeyboardEvent) {
        // [ 노드 생성 기능 ]
        // [ Shift + A ] 를 누르면 노드 생성
        if ($keyboard.isKeyDown('ShiftLeft') && $keyboard.isKeyDown('KeyA') && (($keyboard.indexOf('Shift') < $keyboard.indexOf('KeyA')))) {
            createNode({ 
                x: (canvas.width / 2 - viewport.offset.x) / viewport.zoom,
                y: (canvas.height / 2 - viewport.offset.y) / viewport.zoom
            }, 'test');
            render();
        }
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
        if($keyboard.isKeyDown('NumpadAdd') || $keyboard.isKeyDown('NumpadSubtract')){
            effectStateManager.keyboardZoomCenterSign = {
                isOn: true,
                startTime: (new Date().getTime()),
                isApply: zoomApply( viewport,
                                    ($keyboard.isKeyDown('NumpadAdd') ? 1.1 : 0.9),
                                    canvas.width/2,
                                    canvas.height/2),
                isInOut: $keyboard.isKeyDown('NumpadAdd') ? 'in' : 'out',
                position: { x: canvas.width/2, y: canvas.height/2 },
            };


            animateStart();
        }

        // [ 노드 삭제 기능 ]
        if($keyboard.isKeyDown('KeyX') || $keyboard.isKeyDown('Delete')){
            viewport.nodes = viewport.nodes.filter(node => {
                if (node.isSelected) {
                    return false;
                } else {
                    return true;
                }
            });
            viewport.selectedNodes.clear();


            render();
        }

        // [ 그리드에 맞추기 기능 ]
        if($keyboard.isKeyDown('ControlLeft') && this._isNodeDragging){
            this._isSnapToGrid = true;

            viewport.selectedNodes.forEach(node => {
                // 노드를 그리드에 맞추기
                node.dragOffset.x = Math.round((node.dragOffset.x + node.dragStart.x)/(viewport.gridSpacing/viewport.zoom))*(viewport.gridSpacing/viewport.zoom)- node.dragStart.x;
                node.dragOffset.y = Math.round((node.dragOffset.y + node.dragStart.y)/(viewport.gridSpacing/viewport.zoom))*(viewport.gridSpacing/viewport.zoom)- node.dragStart.y;
            });
        }
        if(keydownInOrder(['ControlLeft', 'KeyG'])){
            viewport.selectedNodes.forEach(node => {
                // 노드를 그리드에 맞추기
                node.position = {
                    x: Math.round((node.position.x)/(viewport.gridSpacing/viewport.zoom))*(viewport.gridSpacing/viewport.zoom),
                    y: Math.round((node.position.y)/(viewport.gridSpacing/viewport.zoom))*(viewport.gridSpacing/viewport.zoom),
                }
            });
        }

        // [ 노드 순서 변경 기능 ]
        if(keydownInOrder(['ControlLeft', 'BracketLeft']) || keydownInOrder(['ControlLeft', 'BracketRight'])){
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
                } else { // BracketRight
                    if (index < viewport.nodes.length - 1) {
                        viewport.nodes.splice(index, 1);
                        viewport.nodes.splice(index + 1, 0, node);
                    }
                }
            });
        };

        render();
    }

    keyup(e: KeyboardEvent) {
        // [ 그리드에 맞추기 기능 ]
        if(e.code === 'ControlLeft'){
            this._isSnapToGrid = false;
        }
    }
}

const controller = new Controller(); // 인스턴스 생성
export default controller; // 인스턴스를 export