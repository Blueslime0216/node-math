// ====================================================================================================
// 현재 조작 상태를 저장하는 클래스
// ====================================================================================================
class State {
    constructor() {
        this.isNodeDragging = false; // 노드 드래그 중인지 여부
        this.nodeDraggingCancel = false; // 노드 드래그 취소 여부
        this.clickOrDragWait = false; // 클릭인지 드래그인지 판단하는 인터벌 시간
        this.isDragSelecting = false; // 드래그 선택 중인지 여부
    }
}
export default new State(); // 인스턴스를 export
