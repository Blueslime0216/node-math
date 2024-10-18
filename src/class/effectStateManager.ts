// ====================================================================================================
// 각종 이펙트들의 표시 상태를 관리하는 변수들을 모아둔 클래스
// ====================================================================================================

class EffectStateManager{
    mouseZoomSign:IEffect = { // 마우스 기준으로 확대/축소 이펙트
        isOn:false, // 이펙트가 켜져있는지 여부
        startTime:0, // 이펙트가 시작된 시간을 기록
        isApply:false, // 줌이 실행 되었는지 여부(최대/최소에 막혀서 실행이 안됐는지 확인)
        isInOut: 'in', // 줌 방향(in/out)
        position:{x:0, y:0}, // 줌이 실행된 마우스 위치
    };
    keyboardZoomCenterSign:IEffect = { // 키보드로 화면 중심을 기준으로 확대/축소 이펙트
        isOn:false,
        startTime:0,
        isApply:false,
        isInOut: 'in',
        position:{x:816/2, y:624/2}, // 캔버스 중심 위치(선언할 때 초기화됌)
    };
}

export default new EffectStateManager(); // 인스턴스를 export