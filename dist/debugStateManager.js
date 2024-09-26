export default class DebugStateManager {
    constructor() {
        this.show_nodeCenter = [false]; // 노드 중심(좌표) 표시
        this.show_nodeHitbox = [false]; // 노드 판정 영역 표시
        this.show_socketHitbox = [false]; // 소켓 판정 영역 표시
        this.log_renderedNodes = [false, 0]; // 렌더링 된 노드 개수 로깅 [on/off, 개수를 저장할 변수]
    }
}
