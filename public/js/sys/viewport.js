// ====================================================================================================
// 뷰포트 렌더링 및 뷰포트 변수 관련 코드
// 여기서는 명령받은 대로 렌더링 하거나 관련 데이터를 전달해주는 역할을 한다.
// ====================================================================================================
import { $_ } from "../utils/domUtils.js";
export class Viewport {
    // selectedSocket:Socket|null = null; // 선택된 소켓
    constructor(canvas) {
        /*
            ( this.offset = this._offsetStart + this._offsetMoving )
            this.offset은 계산이 완료된 좌표이다
            this._offsetStart는 시작 시점(드래그를 시작할 때)의 좌표
            this._offsetMoving은 이동 중인 거리(드래그한 거리, 거리이므로 상대적인 값이다)
        */
        this._offsetStart = { x: 816 / 2, y: 624 / 2 }; // 시점을 움직이기 시작한 지점
        this._offsetMoving = { width: -1, height: -1 }; // 시점을 움직이는 중인 거리
        this._zoom = 1; // 시점 확대 정도
        this.zoomAmount = 1; // 노드 위치 이동을 위한 시점 확대 정도
        this.zoomMax = 3; // 최대 확대 정도
        this.zoomMin = 0.1; // 최대 축소 정도
        // 상수들
        this.lineThickness = 2; // 선 두께
        this.gridSpacingDefault = 50; // 그리드 기본 간격
        this.nodes = []; // 노드들
        this.hoveredNode = null; // 호버된 노드
        this.selectedNodes = new Set(); // 선택된 노드들
        this.dragSelectedNodes = new Set(); // 드래그 선택영역 안에 있는 노드들
        this.temp_nodeBeforeDragSelect = new Set(); // 드래그 선택 이전에 선택되어 있었다가 Shift로 삭제된 노드들
        this.hoveredSocket = null; // 호버된 소켓
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d');
    }
    get canvas() { return this._canvas; }
    get ctx() { return this._ctx; }
    get offset() {
        return { x: (this._offsetStart.x + this._offsetMoving.width),
            y: (this._offsetStart.y + this._offsetMoving.height) };
    }
    // set offset(value:TPoint){this._offset = value}
    get offsetStart() { return this._offsetStart; }
    set offsetStart(value) { this._offsetStart = value; }
    get offsetMoving() { return this._offsetMoving; }
    set offsetMoving(value) { this._offsetMoving = value; }
    get zoom() { return this._zoom; }
    set zoom(value) { this._zoom = value; }
    get gridSpacing() { return this._zoom * this.gridSpacingDefault; }
}
const canvas = $_('editor'); // 캔버스 가져오기
const viewport = new Viewport(canvas); // 인스턴스 생성
const ctx = viewport.ctx; // 캔버스 컨텍스트 가져오기
export default viewport; // 인스턴스를 export
export { canvas, ctx }; // 캔버스 컨텍스트도 export
