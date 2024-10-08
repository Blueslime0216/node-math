// ====================================================================================================
// 디버그 on/off
// ====================================================================================================
export class DebugStateManager {
    constructor() {
        this.show_nodeCenter = { isOn: false }; // 노드 중심(좌표) 표시
        this.show_nodeHitbox = { isOn: false }; // 노드 판정 영역 표시
        this.show_socketHitbox = { isOn: false }; // 소켓 판정 영역 표시
        this.log_renderedNodes = { isOn: false, count: 0 }; // 렌더링 된 노드 개수 로깅 [on/off, 개수를 저장할 변수]
    }
}
export default new DebugStateManager(); // 인스턴스를 export
