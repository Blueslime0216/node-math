// ====================================================================================================
// 현재 조작 상태를 저장하는 클래스
// ====================================================================================================

class State{
    isNodeDragging: boolean = false; // 노드 드래그 중인지 여부
    nodeDragging_cancel: boolean = false; // 노드 드래그 취소 여부
    clickOrDragWait: boolean = false; // 클릭인지 드래그인지 판단하는 인터벌 시간
    isDragSelecting: boolean = false; // 드래그 선택 중인지 여부
    isDragSelecting_cancel: boolean = false; // 노드 선택 드래그 취소 여부
}

export default new State(); // 인스턴스를 export