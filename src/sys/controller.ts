// ====================================================================================================
// 마우스/키보드 입력을 감지하는 컨트롤러 클래스
// 이 클래스 안에 입력에 관한 정보가 저장되고, 불러올 수 있다
// ====================================================================================================

import { $, $_ } from "../utils/domUtils.js";
import { Point, Size } from "../utils/fieldUtils.js";
import viewport from "../sys/viewport.js";
import { createNode } from "../sys/viewportFunctions.js";
import $mouse from "./mouse.js";
import $keyboard from "./keyboard.js";
import Node from "../node/node.js";
import Socket from "../node/socket.js";
import { zoomApply, animateStart } from "../func/functions.js";
import debugManager from "../class/debugStateManager.js";
import effectStateManager from "../class/effectStateManager.js";
import userSetting from "../class/userSetting.js";
import { render } from "../sys/viewportFunctions.js";

const canvas:HTMLCanvasElement = $_('editor') as HTMLCanvasElement; // 캔버스 가져오기



export class Controller {
    mousedown(e: MouseEvent) {
        // 마우스 왼 클릭
        if ($mouse.isMouseDown.left) {
            // 만약 호버된 노드가 있으면 선택된 노드로 설정
            if (viewport.hoveredNode) {
                // 비우기
                viewport.nodes.forEach(node => {
                    node.isSelected = false;
                });
                viewport.selectedNodes = [];

                viewport.nodes.forEach(node => {
                    if (node.isHover) {
                        // 선택된 노드로 설정
                        viewport.selectedNodes.push(node);
                        node.isSelected = true;
                        // 선택된 노드를 맨 앞으로 가져오기
                        viewport.nodes.splice(viewport.nodes.indexOf(node), 1);
                        viewport.nodes.push(node);
                    } else {
                        node.isSelected = false;
                    }
                });
            } else { // 호버된 노드가 없다는 건 빈 공간을 클릭했다는 것
                viewport.selectedNodes = [];
                viewport.nodes.forEach(node => {
                    node.isSelected = false;
                });
            }


            // 노드 선택 스타일 적용하려고 렌더링
            render();
        }
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


        // 움직이면 일단 렌더링
        render();
    }

    mouseup(e: MouseEvent) {
        // [ 시점 이동 기능 ]
        if (e.button === 1) {
            // 변경된 시점 적용하기
            viewport.offsetStart = viewport.offset;
            viewport.offsetMoving = { width: -1, height: -1 };
        }
    }

    click(e: WheelEvent) {
    }

    wheel(e: WheelEvent) {
        // [ 시점 확대/축소 기능 ]
        const zoomFactor = 1.1; // 줌 인/아웃 시 사용할 배율
        const zoomAmount = $mouse.wheelDelta.y > 0 ? 1 / zoomFactor : zoomFactor; // 줌 방향(in/out) 계산

        // 마우스 위치를 기준으로 줌이 조정되도록 시점 이동
        // 이펙트 주기
        effectStateManager.mouseZoomSign = {
            isOn: true,
            startTime: (new Date().getTime()),
            isApply: zoomApply(viewport, zoomAmount, e.offsetX, e.offsetY),
            isInOut: zoomAmount > 1 ? 'in' : 'out',
            position: { x: e.offsetX, y: e.offsetY },
        }



        animateStart();
    }

    keydown(e: KeyboardEvent) {
        // [ 노드 생성 기능 ]
        // [ Shift + A ] 를 누르면 노드 생성
        if ($keyboard.isKeyDown('ShiftLeft') && $keyboard.isKeyDown('KeyA') && ($keyboard.indexOf('Shift') < $keyboard.indexOf('KeyA'))) {
            createNode({ 
                x: (canvas.width / 2 - viewport.offset.x) / viewport.zoom,
                y: (canvas.height / 2 - viewport.offset.y) / viewport.zoom
            }, 'test');
            render();
        } else

        // [ 전체 선택 기능 ]
        // [ a, Ctrl + a ] 누르면 모든 노드 선택
        if ($keyboard.isKeyDown('KeyA')) {
            console.log(viewport.selectedNodes.length, viewport.nodes.length);
            if (viewport.selectedNodes.length >= viewport.nodes.length) {
                // 모든 노드가 선택되어 있으면 선택 해제
                viewport.nodes.forEach(node => {
                    node.isSelected = false;
                });
                viewport.selectedNodes = [];
            } else {
                // 아니면 모든 노드 선택
                viewport.nodes.forEach(node => {
                    node.isSelected = true;
                    viewport.selectedNodes.push(node);
                });
            }
            render();
        } else

        
        if($keyboard.isKeyDown('+') || $keyboard.isKeyDown('-')){
            // 화면 중심을 기준으로 확대하는 기능
            effectStateManager.keyboardZoomCenterSign = {
                isOn: true,
                startTime: (new Date().getTime()),
                isApply: zoomApply( viewport,
                                    ($keyboard.isKeyDown('+') ? 1.1 : 0.9),
                                    canvas.width/2,
                                    canvas.height/2),
                isInOut: $keyboard.isKeyDown('+') ? 'in' : 'out',
                position: { x: canvas.width/2, y: canvas.height/2 },
            };
            animateStart();
        }

        render();
    }

    keyup(e: KeyboardEvent) {
    }
}

const controller = new Controller(); // 인스턴스 생성
export default controller; // 인스턴스를 export