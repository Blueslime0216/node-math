// ====================================================================================================
// 마우스 입력을 감지하는 클래스
// 이 클래스 안에 마우스 입력에 관한 정보가 저장되고, 불러올 수 있다
// ====================================================================================================
import { Point, Size } from "../utils/fieldUtils.js";
import controller from "./controller.js";
export class Mouse {
    constructor() {
        this._mousePos = new Point(-1, -1); // 마우스 위치 (초기값은 -1, -1로 설정)
        // private _mousePos_offset: TPoint = new Point(-1, -1); // 마우스 상대 위치 (초기값은 -1, -1로 설정)
        // 마우스 클릭 여부 (초기값은 전부 false)
        this._isMouseDown = { left: false, wheel: false, right: false };
        // 마우스 클릭이 시작된 지점 (초기값은 -1, -1로 설정)
        this._mouseStart = { left: new Point(-1, -1), wheel: new Point(-1, -1), right: new Point(-1, -1) };
        // 마우스 클릭 상태 여부
        this._isMouseClick = { left: false, wheel: false, right: false };
        // 마우스 드래그 시작 상태 여부
        this._isMouseDragFirst = { left: false, wheel: false, right: false };
        // 마우스 드래그 상태 여부
        this._isMouseDragging = { left: false, wheel: false, right: false };
        // 휠 방향
        this._wheelDelta = { x: 0, y: 0 };
        // 마우스가 드래그 된 거리
        this._draggedSize = { left: new Size(-1, -1), wheel: new Size(-1, -1), right: new Size(-1, -1) };
    }
    // private _draggedSizeAdjuseted: IMouseDraggedSize = { left: new Size(-1, -1), wheel: new Size(-1, -1), right: new Size(-1, -1) };
    get mousePos() { return this._mousePos; } // 마우스 위치 반환
    // get mousePos_offset(): TPoint { return this._mousePos_offset; } // 마우스 상대 위치 반환
    get isMouseDown() { return this._isMouseDown; } // 마우스가 눌려있는지 여부 반환
    // isMouseDown.left, isMouseDown.wheel, isMouseDown.right로 사용
    get mouseStart() { return this._mouseStart; } // 마우스 클릭 시작 지점 반환
    get isMouseClick() { return this._isMouseClick; }
    get isMouseDragFirst() { return this._isMouseDragFirst; }
    get isMouseDragging() { return this._isMouseDragging; } // 현재 드래그 중인지 여부 반환
    get draggedSize() { return this._draggedSize; } // 드래그 중인 크기 반환
    get wheelDelta() { return this._wheelDelta; } // 휠 방향 반환
    set mousePos(value) { this._mousePos = value; }
    // set mousePos_offset(value: TPoint) { this._mousePos_offset = value; }
    set isMouseDown(value) { this._isMouseDown = value; }
    set mouseStart(value) { this._mouseStart = value; }
    set isMouseClick(value) { this._isMouseClick = value; }
    set isMouseDragFirst(value) { this._isMouseDragFirst = value; }
    set isMouseDragging(value) { this._isMouseDragging = value; }
    set draggedSize(value) { this._draggedSize = value; }
    set wheelDelta(value) { this._wheelDelta = value; }
    // 마우스 클릭 이벤트
    mousedown(e) {
        // 마우스 클릭 시작 위치 저장
        $mouse._isMouseClick.left = false; // 마우스 왼쪽 버튼 클릭 상태 초기화
        $mouse._isMouseClick.wheel = false; // 마우스 휠 버튼 클릭 상태 초기화
        $mouse._isMouseClick.right = false; // 마우스 오른쪽 버튼 클릭 상태 초기화
        switch (e.button) {
            case 0: // 마우스 왼쪽 버튼이 눌렸으면
                $mouse._mouseStart.left = { x: e.clientX, y: e.clientY }; // 마우스 클릭 시작 위치 저장
                $mouse._isMouseDown.left = true; // 눌렸다고 표시하기
                $mouse._isMouseDragFirst.left = true; // 드래그 시작 상태로 표시하기
                $mouse._isMouseDragging.left = false; // 마우스 왼쪽 버튼 드래그 상태 초기화
                break;
            case 1: // 마우스 휠 버튼이 눌렸으면
                $mouse._mouseStart.wheel = { x: e.clientX, y: e.clientY }; // 마우스 클릭 시작 위치 저장
                $mouse._isMouseDown.wheel = true; // 눌렸다고 표시하기
                $mouse._isMouseDragFirst.wheel = true; // 드래그 시작 상태로 표시하기
                $mouse._isMouseDragging.wheel = false; // 마우스 휠 버튼 드래그 상태 초기화
                break;
            case 2: // 마우스 오른쪽 버튼이 눌렸으면
                $mouse._mouseStart.right = { x: e.clientX, y: e.clientY }; // 마우스 클릭 시작 위치 저장
                $mouse._isMouseDown.right = true; // 눌렸다고 표시하기
                $mouse._isMouseDragFirst.right = true; // 드래그 시작 상태로 표시하기
                $mouse._isMouseDragging.right = false; // 마우스 오른쪽 버튼 드래그 상태 초기화
                break;
        }
        controller.mousedown(e); // 컨트롤러 실행
    }
    mouseclick(e) {
        controller.mouseclick(e); // 컨트롤러 실행
    }
    // 드래그 시작 이벤트
    mousedragstart(e) {
        // 어짜피 일순간이기 때문에 그냥 다 초기화 하기
        $mouse.isMouseDragFirst.left = false;
        $mouse.isMouseDragFirst.wheel = false;
        $mouse.isMouseDragFirst.right = false;
        controller.mousedragstart(e);
    }
    // 마우스 이동 이벤트
    mousemove(e) {
        // 위치 저장
        $mouse._mousePos = new Point(e.clientX, e.clientY);
        // $mouse._mousePos_offset = new Point(e.offsetX, e.offsetY);
        // 마우스가 눌려있으면 드래그 중으로 표시
        if ($mouse._isMouseDown.left) { // 마우스 왼쪽 버튼이 눌려있으면
            // 왼쪽 버튼 드래그 중으로 표시
            $mouse._isMouseDragging.left = true;
            // 드래그 거리 저장
            $mouse._draggedSize.left = new Size(e.clientX - $mouse._mouseStart.left.x, e.clientY - $mouse._mouseStart.left.y);
        }
        if ($mouse._isMouseDown.wheel) { // 마우스 휠 버튼이 눌려있으면
            // 휠 버튼 드래그 중으로 표시
            $mouse._isMouseDragging.wheel = true;
            // 드래그 거리 저장
            $mouse._draggedSize.wheel = new Size(e.clientX - $mouse._mouseStart.wheel.x, e.clientY - $mouse._mouseStart.wheel.y);
        }
        if ($mouse._isMouseDown.right) { // 마우스 오른쪽 버튼이 눌려있으면
            // 오른쪽 버튼 드래그 중으로 표시
            $mouse._isMouseDragging.right = true;
            // 드래그 거리 저장
            $mouse._draggedSize.right = new Size(e.clientX - $mouse._mouseStart.right.x, e.clientY - $mouse._mouseStart.right.y);
        }
        controller.mousemove(e); // 컨트롤러 실행
    }
    // 마우스 클릭 해제 이벤트
    mouseup(e) {
        // 마우스 시작 지점 초기화
        // switch문을 사용한 이유는 개별적으로 업데이트 해서 적용하기 위함임
        switch (e.button) {
            case 0: // 마우스 왼쪽 버튼이 떼어졌으면
                $mouse._mouseStart.left = { x: -1, y: -1 };
                $mouse._isMouseDown.left = false; // 마우스 왼쪽 버튼이 떼어졌으면
                $mouse._isMouseDragging.left = false; // 마우스 왼쪽 버튼 드래그 상태 초기화
                $mouse._isMouseDragFirst.left = false;
                $mouse._draggedSize.left = new Size(0, 0); // 마우스 왼쪽 버튼 드래그 거리 초기화
                break;
            case 1: // 마우스 휠 버튼이 떼어졌으면
                $mouse._mouseStart.wheel = { x: -1, y: -1 };
                $mouse._isMouseDown.wheel = false; // 마우스 휠 버튼이 떼어졌으면
                $mouse._isMouseDragging.wheel = false; // 마우스 휠 버튼 드래그 상태 초기화
                $mouse._isMouseDragFirst.wheel = false;
                $mouse._draggedSize.wheel = new Size(0, 0); // 마우스 휠 버튼 드래그 거리 초기화
                break;
            case 2: // 마우스 오른쪽 버튼이 떼어졌으면
                $mouse._mouseStart.right = { x: -1, y: -1 };
                $mouse._isMouseDown.right = false; // 마우스 오른쪽 버튼이 떼어졌으면
                $mouse._isMouseDragging.right = false; // 마우스 오른쪽 버튼 드래그 상태 초기화
                $mouse._isMouseDragFirst.right = false;
                $mouse._draggedSize.right = new Size(0, 0); // 마우스 오른쪽 버튼 드래그 거리 초기화
                break;
        }
        controller.mouseup(e); // 컨트롤러 실행
    }
    wheel(e) {
        // 휠 방향 저장
        $mouse._wheelDelta = { x: e.deltaX, y: e.deltaY };
        controller.wheel(e); // 컨트롤러 실행
    }
}
const $mouse = new Mouse(); // 인스턴스 생성
export default $mouse; // 인스턴스를 export
