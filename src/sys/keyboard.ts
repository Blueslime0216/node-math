// ==================================================
// 키보드 입력 처리 관련 코드
// 
// ==================================================

import controller from "./controller.js";

export class keyboard {
    // 현재 눌려있는 키를 저장하는 Set 객체 (중복된 값을 허용하지 않음)
    private _keymap:Array<KeyboardEvent["code"]> = [];
    private _keymap_hold:Array<KeyboardEvent["code"]> = [];
    // private _time:Array<number> = [];

    get keymap() { return this._keymap; }
    // get time() { return this._time; }

    // 특정 key가 눌려있는지 확인
    isKeyDown(key:KeyboardEvent["code"]): boolean { return this._keymap.indexOf(key) !== -1; }
    isKeyHold(key:KeyboardEvent["code"]): boolean { return this._keymap_hold.indexOf(key) !== -1; }
    // index
    indexOf(key:KeyboardEvent["code"]): number { return this._keymap.indexOf(key); }

    // 키보드 이벤트 리스너
    keydown(e: KeyboardEvent) {
        // keymap에 키 추가
        if (this._keymap.indexOf(e.code) === -1) { // 중복된 값이 없으면
            this._keymap.push(e.code);

            controller.keypress(e); // keypress 실행
        } else { // 중복된 값이 있으면
            if (this._keymap_hold.indexOf(e.code) === -1) { // 중복된 값이 없으면
                this._keymap_hold.push(e.code);

                controller.holdStart(e); // holdStart 실행
            } else {
                controller.holding(e); // holdStart 실행
            }
        }
        // if (this._time.indexOf(e.timeStamp) === -1)
        
        controller.keydown(e); // keydown 실행
    }
    keyup(e: KeyboardEvent) {
        // keymap에서 키 제거
        this._keymap.splice(this._keymap.indexOf(e.code), 1);
        this._keymap_hold.splice(this._keymap_hold.indexOf(e.code), 1);
        // this._time.splice(this._time.indexOf(e.timeStamp), 1);

        controller.keyup(e); // 컨트롤러 실행
    }
}

const $keyboard = new keyboard(); // 인스턴스 생성
export default $keyboard; // 인스턴스를 export