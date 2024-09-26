export default class DebugStateManager{
    show_nodeCenter:TDebug = [false]; // 노드 중심(좌표) 표시
    show_nodeHitbox:TDebug = [false]; // 노드 판정 영역 표시
    show_socketHitbox:TDebug = [false]; // 소켓 판정 영역 표시
    log_renderedNodes:TDebug = [false, 0]; // 렌더링 된 노드 개수 로깅 [on/off, 개수를 저장할 변수]
}