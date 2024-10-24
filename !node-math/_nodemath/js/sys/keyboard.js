// ==================================================
// 키보드 입력 처리 관련 코드
// 
// ==================================================
import controller from "./controller.js";
export class keyboard {
    constructor() {
        // 현재 눌려있는 키를 저장하는 Set 객체 (중복된 값을 허용하지 않음)
        this._keymap = [];
        this._time = [];
    }
    // get
    get keymap() { return this._keymap; }
    get time() { return this._time; }
    // 특정 key가 눌려있는지 확인
    isKeyDown(key) { return this._keymap.indexOf(key) !== -1; }
    // index
    indexOf(key) { return this._keymap.indexOf(key); }
    // 키보드 이벤트 리스너
    keydown(e) {
        // keymap에 키 추가
        if (this._keymap.indexOf(e.code) === -1)
            this._keymap.push(e.code);
        if (this._time.indexOf(e.timeStamp) === -1)
            controller.keydown(e); // 컨트롤러 실행
    }
    keyup(e) {
        // keymap에서 키 제거
        if (this._keymap.indexOf(e.code) !== -1)
            this._keymap.splice(this._keymap.indexOf(e.code), 1);
        if (this._time.indexOf(e.timeStamp) !== -1)
            this._time.splice(this._time.indexOf(e.timeStamp), 1);
        controller.keyup(e); // 컨트롤러 실행
    }
}
const $keyboard = new keyboard(); // 인스턴스 생성
export default $keyboard; // 인스턴스를 export
