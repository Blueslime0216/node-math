// ====================================================================================================
// 플레이어가 변경할 수 있는 설정들
// ====================================================================================================
class UserSetting {
    constructor() {
        this.mouseZoomEffect = {
            isOn: true,
        };
        this.keyboardZoomEffect = {
            isOn: true,
        };
        this.ruler = {
            isOn: false,
            vertical: true, // 수직 자
            horizontal: true, // 수평 자
        };
        this.gridCustom = {
            isOn: false,
            lineWidthBoldStrong: 2, // 십자 모양 두께 배율
            lineLength: 50, // 선 길이 (1~100)
            dashLength: 20, // 점선(십자 모양) 길이 (1~100)
        };
    }
}
export default new UserSetting(); // 인스턴스를 export
