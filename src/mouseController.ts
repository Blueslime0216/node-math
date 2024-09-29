import { Point, Size } from "utils/fieldUtils";

export default class MouseController {
    // 마우스 이벤트를 감지할 HTML 요소
    private _element: HTMLElement;

    // 마우스 클릭이 시작된 지점 (초기값은 -1, -1로 설정)
    private _mouseStart: Point = new Point(-1, -1);

    // 마우스가 눌려있는 버튼 (초기값은 -1로 설정)
    private _mouseDown: number = -1;

    // 마우스 드래그 상태 여부
    private _isDragging: boolean = false;

    // 드래그 중인 크기
    private _draggedSize: Size = new Size(0, 0);

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
            // 마우스 클릭 시작 지점 저장
            this._mouseStart = { x: e.clientX, y: e.clientY };
            this._mouseDown = e.button;  // 마우스가 눌려있다고 표시
            this._isDragging = false;  // 아직 드래그 중이 아님
        });

        // 마우스가 움직였을 때 이벤트 처리
        this._element.addEventListener('mousemove', (e) => {
            this._mousemove(e);  // 커스텀 mousemove 핸들러 호출
            // 마우스가 눌려있으면 드래그 중으로 표시
            if (this.isMouseDown){
                this._isDragging = true;
                this._draggedSize = new Size(e.clientX - this._mouseStart.x, e.clientY - this._mouseStart.y);
            };
        });

        // 마우스 버튼이 떼어졌을 때 이벤트 처리
        this._element.addEventListener('mouseup', (e) => {
            const dragEvent: DragMouseEvent = Object.assign(e, {
                draggedX: e.clientX - this._mouseStart.x,
                draggedY: e.clientY - this._mouseStart.y
            });
            this._mouseup(dragEvent);  // 커스텀 mouseup 핸들러 호출
            // 마우스 시작 지점 초기화
            this._mouseStart = { x: -1, y: -1 };
            this._mouseDown = -1;  // 마우스가 눌려있지 않음
            this._isDragging = false;   // 드래그 상태 초기화
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
    get isMouseDown(): boolean { return this._mouseDown !== -1; }
    
    // 마우스가 눌린 버튼 반환
    get mouseDown(): number { return this._mouseDown; }

    // 현재 드래그 중인지 여부 반환
    get isDragging(): boolean { return this._isDragging; }

    // 마우스 클릭 시작 지점 반환
    get mouseStart(): Point { return this._mouseStart; }

    // 드래그 중인 크기 반환
    get draggedSize(): Size { return this._draggedSize; }

    // 마우스 컨트롤러 해제
    dispose() {
        this._element.removeEventListener('mousedown', this._mousedown);
        this._element.removeEventListener('mousemove', this._mousemove);
        this._element.removeEventListener('mouseup', this._mouseup);
        this._element.removeEventListener('click', this._click);
        this._element.removeEventListener('wheel', this._wheel);
    }
    
}
