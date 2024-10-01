// ==================================================
// 키보드 입력 처리 관련 코드
// 
// ==================================================

export default class keyboardEventListener {
    // 현재 눌려있는 키를 저장하는 Set 객체 (중복된 값을 허용하지 않음)
    private _keymap: Set<KeyboardEvent["key"]> = new Set();
    // key code는 일단 사용처가 없어서 주석처리 해둠
    // // 현재 눌려있는 키 코드를 저장하는 Set 객체 (중복된 값을 허용하지 않음)
    // private _codemap: Set<KeyboardEvent["code"]> = new Set();

    // 커스텀으로 지정할 keydown 이벤트 핸들러 (기본적으로 빈 함수)
    private _keydown: (e: KeyboardEvent) => void = () => {};
    // 커스텀으로 지정할 keyup 이벤트 핸들러 (기본적으로 빈 함수)
    private _keyup: (e: KeyboardEvent) => void = () => {};

    // 생성자: window에 keydown 및 keyup 이벤트 리스너를 추가
    constructor() {
        window.addEventListener('keydown', (e) => {
            // 키가 눌렸을 때 key와 code를 각각 Set에 추가
            if (!this._keymap.has(e.key)) this._keymap.add(e.key);
            // if (!this._codemap.has(e.code)) this._codemap.add(e.code);

            // 커스텀 keydown 핸들러 호출
            this._keydown(e);
        });
        window.addEventListener('keyup', (e) => {
            // 키가 떼어졌을 때 key와 code를 각각 Set에서 삭제
            this._keymap.delete(e.key);
            // this._codemap.delete(e.code);

            // 커스텀 keyup 핸들러 호출
            this._keyup(e);
        });
    }

    // keymap getter: _keymap Set을 반환
    get keymap() { return this._keymap; }
    // // codemap getter: _codemap Set을 반환
    // get codemap() { return this._codemap; }

    // (???) 이거 쓰나?
    // // 현재 눌린 key들을 배열로 반환
    // get keymapArray(): KeyboardEvent["key"][] {
    //     const array: KeyboardEvent["key"][] = [];
    //     this._keymap.forEach((value) => array.push(value)); // Set을 순회하며 배열로 변환
    //     return array;
    // }
    // // 현재 눌린 key code들을 배열로 반환
    // get codemapArray(): KeyboardEvent["code"][] {
    //     const array: KeyboardEvent["code"][] = [];
    //     this._codemap.forEach((value) => array.push(value)); // Set을 순회하며 배열로 변환
    //     return array;
    // }

    // 특정 key가 눌려있는지 확인 (Set에 key가 포함되어 있는지 확인)
    isKeyDown(key: KeyboardEvent["key"]): boolean { return this._keymap.has(key); }
    // // 특정 key code가 눌려있는지 확인 (Set에 code가 포함되어 있는지 확인)
    // isDownCode(code: KeyboardEvent["code"]): boolean { return this._codemap.has(code); }

    // keydown 이벤트 핸들러를 설정하는 setter
    set keydown(callback: (e: KeyboardEvent) => void) { this._keydown = callback; }
    // keyup 이벤트 핸들러를 설정하는 setter
    set keyup(callback: (e: KeyboardEvent) => void) { this._keyup = callback; }


    // 이벤트 리스너를 삭제하는 메서드
    dispose() {
        window.removeEventListener('keydown', this._keydown);
        window.removeEventListener('keyup', this._keyup);
    }
}
