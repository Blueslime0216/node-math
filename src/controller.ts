// ====================================================================================================
// 마우스/키보드 입력을 처리하는 컨트롤러 클래스
// 여기서 마우스/키보드 입력에 대한 처리(변수 업데이트! 등)를 하고 이벤트 리스너를 할당하는 등의 작업을 한다
// 직접적으로 작동하는 기능은 여기가 아니라 index.ts에서 작동한다
// ====================================================================================================

import { Point, Size } from "./utils/fieldUtils.js";


export default class Controller {
    // 마우스 이벤트를 감지할 HTML 요소
    private _element: HTMLElement;

    // 마우스 클릭이 시작된 지점 (초기값은 -1, -1로 설정)
    public _mouseStart: IMouseKeysPoint = { left: new Point(-1, -1), wheel: new Point(-1, -1), right: new Point(-1, -1) };

    // 눌려져 있는 마우스 버튼 (초기값은 전부 false)
    public _mouseDown: IMouseKeys = { left: false, wheel: false, right: false };

    // 마우스 드래그 상태 여부
    public _isMouseDragging: IMouseKeys = { left: false, wheel: false, right: false };

    // 드래그 거리?
    public _draggedSize: IMouseDraggedSize = { left: Size, wheel: Size, right: Size };

    // 커스텀 마우스 이벤트 핸들러 (기본적으로 빈 함수로 초기화)
    private _mousedown: (e: MouseEvent) => void = () => {};
    private _mousemove: (e: MouseEvent) => void = () => {};
    private _mouseup: (e: DragMouseEvent|MouseEvent) => void = () => {};
    private _click: (e: MouseEvent) => void = () => {};
    private _wheel: (e: WheelEvent) => void = () => {};

    // 생성자: 특정 HTML 요소에 마우스 이벤트 리스너를 추가
    constructor(element: HTMLElement) {
        this._element = element;

        // 마우스가 눌렸을 때 이벤트 처리
        this._element.addEventListener('mousedown', (e) => {
            this._mousedown(e);  // 커스텀 mousedown 핸들러 호출
        });

        // 마우스가 움직였을 때 이벤트 처리
        this._element.addEventListener('mousemove', (e) => {
            this._mousemove(e);  // 커스텀 mousemove 핸들러 호출
        });

        // 마우스 버튼이 떼어졌을 때 이벤트 처리
        this._element.addEventListener('mouseup', (e) => {
            // const dragEvent: DragMouseEvent = Object.assign(e, {
            //     draggedX: e.clientX - this._mouseStart.x,
            //     draggedY: e.clientY - this._mouseStart.y
            // });
            // this._mouseup(dragEvent);  // 커스텀 mouseup 핸들러 호출
            this._mouseup(e);  // 커스텀 mouseup 핸들러 호출
        });

        // 마우스 클릭 이벤트 처리
        this._element.addEventListener('click', (e) => {
            this._click(e);  // 커스텀 클릭 핸들러 호출
        });

        // 마우스 휠 이벤트 처리
        this._element.addEventListener('wheel', (e) => {
            this._wheel(e);  // 커스텀 휠 핸들러 호출
        });
    }

    // 커스텀 mousedown 핸들러 설정
    set mousedown(callback: (e: MouseEvent) => void) { this._mousedown = callback; }

    // 커스텀 mousemove 핸들러 설정
    set mousemove(callback: (e: MouseEvent) => void) { this._mousemove = callback; }

    // 커스텀 mouseup 핸들러 설정
    set mouseup(callback: (e: MouseEvent) => void) { this._mouseup = callback; }

    // 커스텀 click 핸들러 설정
    set click(callback: (e: MouseEvent) => void) { this._click = callback; }

    // 커스텀 wheel 핸들러 설정
    set wheel(callback: (e: WheelEvent) => void) { this._wheel = callback; }

    // 마우스가 눌려있는지 여부 반환
    get isMouseDown(): IMouseKeys { return this._mouseDown; }
    // 사용법은 isMouseDown.left, isMouseDown.wheel, isMouseDown.right로 사용
    
    // 마우스가 눌린 버튼 반환
    // get whichMouseDown(): number { return this._mouseDown.left ? 0 : this._mouseDown.wheel ? 1 : this._mouseDown.right ? 2 : -1; }

    // 현재 드래그 중인지 여부 반환
    get isMouseDragging(): IMouseKeys { return this._isMouseDragging; }
    // 사용법은 isDragging.left, isDragging.wheel, isDragging.right로 사용

    // 마우스 클릭 시작 지점 반환
    get mouseDownStart(): IMouseKeysPoint { return this._mouseStart; }

    // 드래그 중인 크기 반환
    // get draggedSize(): IMouseDraggedSize { return this._draggedSize; }

    // 마우스 컨트롤러 해제
    dispose() {
        this._element.removeEventListener('mousedown', this._mousedown);
        this._element.removeEventListener('mousemove', this._mousemove);
        this._element.removeEventListener('mouseup', this._mouseup);
        this._element.removeEventListener('click', this._click);
        this._element.removeEventListener('wheel', this._wheel);
    }
    
}