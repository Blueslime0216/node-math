// ====================================================================================================
// 디버그 on/off
// ====================================================================================================

export class DebugStateManager{
    log_hoveredShape:IDebug = { isOn:true }; // 노드의 호버된 부분 콘솔에 출력
    // show_nodeCenter:IDebug = { isOn:false }; // 노드 중심(좌표) 표시
    // show_nodeHitbox:IDebug = { isOn:false }; // 노드 판정 영역 표시
    // show_socketHitbox:IDebug = { isOn:false }; // 소켓 판정 영역 표시
    // log_renderedNodes:IDebug = { isOn:false, count : 0 }; // 렌더링 된 노드 개수 로깅 [on/off, 개수를 저장할 변수]
}

export default new DebugStateManager(); // 인스턴스를 export