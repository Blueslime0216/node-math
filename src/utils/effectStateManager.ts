// ====================================================================================================
// 각종 이펙트들의 표시 상태를 관리하는 변수들을 모아둔 클래스
// ====================================================================================================

class EffectStateManager{
    mouseZoomSign:IEffect = { // 마우스 기준으로 확대/축소 이펙트
        isOn:false, // 이펙트가 켜져있는지 여부지만 실질적인 판단은 animation > -1으로 함
        animation:-1, // 애니메이션 프레임
        isApply:false, // 줌이 실행 되었는지 여부(최대/최소에 막혀서 실행이 안됐는지 확인)
        isInOut: 'in', // 줌 방향(in/out)
        position:{x:0, y:0}, // 줌이 실행된 마우스 위치
    };
    keyboardZoomCenterSign:IEffect = { // 키보드로 화면 중심을 기준으로 확대/축소 이펙트
        isOn:false,
        animation:-1,
        isApply:false,
        isInOut: 'in',
    };
}

export default new EffectStateManager(); // 인스턴스를 export