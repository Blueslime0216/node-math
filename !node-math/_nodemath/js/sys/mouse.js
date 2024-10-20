// ====================================================================================================
// 마우스 입력을 감지하는 클래스
// 이 클래스 안에 마우스 입력에 관한 정보가 저장되고, 불러올 수 있다
// ====================================================================================================
import { Point, Size } from "../utils/fieldUtils.js";
import controller from "./controller.js";
export class Mouse {
    constructor() {
        // 마우스 클릭 여부 (초기값은 전부 false)
        this._isMouseDown = { left: false, wheel: false, right: false };
        // 마우스 클릭이 시작된 지점 (초기값은 -1, -1로 설정)
        this._mouseStart = { left: new Point(-1, -1), wheel: new Point(-1, -1), right: new Point(-1, -1) };
        // 마우스 드래그 상태 여부
        this._isMouseDragging = { left: false, wheel: false, right: false };
        // 휠 방향
        this._wheelDelta = { x: 0, y: 0 };
        // 마우스가 드래그 된 거리
        this._draggedSize = { left: new Size(-1, -1), wheel: new Size(-1, -1), right: new Size(-1, -1) };
    }
    // private _draggedSizeAdjuseted: IMouseDraggedSize = { left: new Size(-1, -1), wheel: new Size(-1, -1), right: new Size(-1, -1) };
    // 마우스가 눌려있는지 여부 반환
    get isMouseDown() { return this._isMouseDown; }
    // isMouseDown.left, isMouseDown.wheel, isMouseDown.right로 사용
    // 마우스 클릭 시작 지점 반환
    get mouseStart() { return this._mouseStart; }
    // 현재 드래그 중인지 여부 반환
    get isMouseDragging() { return this._isMouseDragging; }
    // 드래그 중인 크기 반환
    get draggedSize() { return this._draggedSize; }
    // 휠 방향 반환
    get wheelDelta() { return this._wheelDelta; }
    set isMouseDown(value) { this._isMouseDown = value; }
    set mouseStart(value) { this._mouseStart = value; }
    set isMouseDragging(value) { this._isMouseDragging = value; }
    set draggedSize(value) { this._draggedSize = value; }
    set wheelDelta(value) { this._wheelDelta = value; }
    // 마우스 클릭 이벤트
    mousedown(e) {
        // 마우스 클릭 시작 위치 저장
        switch (e.button) {
            case 0: // 마우스 왼쪽 버튼이 눌렸으면
                $mouse._mouseStart.left = { x: e.clientX, y: e.clientY };
                break;
            case 1: // 마우스 휠 버튼이 눌렸으면
                $mouse._mouseStart.wheel = { x: e.clientX, y: e.clientY };
                break;
            case 2: // 마우스 오른쪽 버튼이 눌렸으면
                $mouse._mouseStart.right = { x: e.clientX, y: e.clientY };
                break;
        }
        // 눌려진 마우스 버튼 표시
        switch (e.button) {
            case 0:
                $mouse._isMouseDown.left = true; // 마우스 왼쪽 버튼이 눌렸으면
                break;
            case 1:
                $mouse._isMouseDown.wheel = true; // 마우스 휠 버튼이 눌렸으면
                break;
            case 2:
                $mouse._isMouseDown.right = true; // 마우스 오른쪽 버튼이 눌렸으면
                break;
        }
        // 마우스 클릭 상태 저장
        switch (e.button) {
            case 0:
                $mouse._isMouseDragging.left = false; // 마우스 왼쪽 버튼 드래그 상태 초기화
                break;
            case 1:
                $mouse._isMouseDragging.wheel = false; // 마우스 휠 버튼 드래그 상태 초기화
                break;
            case 2:
                $mouse._isMouseDragging.right = false; // 마우스 오른쪽 버튼 드래그 상태 초기화
                break;
        }
        controller.mousedown(e); // 컨트롤러 실행
    }
    // 마우스 이동 이벤트
    mousemove(e) {
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
                $mouse._isMouseDragging.left = false; // 마우스 왼쪽 버튼 드래그 상태 초기화
                $mouse._draggedSize.left = new Size(0, 0); // 마우스 왼쪽 버튼 드래그 거리 초기화
                break;
            case 1: // 마우스 휠 버튼이 떼어졌으면
                $mouse._mouseStart.wheel = { x: -1, y: -1 };
                $mouse._isMouseDown.wheel = false; // 마우스 휠 버튼이 떼어졌으면
                $mouse._isMouseDragging.wheel = false; // 마우스 휠 버튼 드래그 상태 초기화
                $mouse._isMouseDragging.wheel = false; // 마우스 휠 버튼 드래그 상태 초기화
                $mouse._draggedSize.wheel = new Size(0, 0); // 마우스 휠 버튼 드래그 거리 초기화
                break;
            case 2: // 마우스 오른쪽 버튼이 떼어졌으면
                $mouse._mouseStart.right = { x: -1, y: -1 };
                $mouse._isMouseDown.right = false; // 마우스 오른쪽 버튼이 떼어졌으면
                $mouse._isMouseDragging.right = false; // 마우스 오른쪽 버튼 드래그 상태 초기화
                $mouse._isMouseDragging.right = false; // 마우스 오른쪽 버튼 드래그 상태 초기화
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
