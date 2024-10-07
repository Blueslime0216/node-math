// ====================================================================================================
// 플레이어가 변경할 수 있는 설정들
// ====================================================================================================

class UserSetting{
    mouseZoomEffect:ISetting = { // 마우스 확대/축소 이펙트
        isOn: true,
    };
    keyboardZoomEffect:ISetting = { // 키보드 확대/축소 이펙트
        isOn: true,
    };
    ruler:ISetting = { // 눈금 자 표시 여부
        isOn:false,
        vertical: true, // 수직 자
        horizontal: true, // 수평 자
    };
    gridCustom:ISetting = { // 그리드 모드
        isOn: true,
        lineWidthBoldStrong: 2, // 십자 모양 두께 배율
        lineLength: 50, // 선 길이 (1~100)
        dashLength: 20, // 점선(십자 모양) 길이 (1~100)
    };
}

export default new UserSetting(); // 인스턴스를 export