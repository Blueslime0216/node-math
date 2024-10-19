// ====================================================================================================
// 기본적으로 쓸 함수들
// ====================================================================================================

import $keyboard from "../sys/keyboard.js";


// 두 키가 순차적으로 눌렸는지 확인
export function keydownInOrder(keys:Array<string>):boolean {
    return keys.every((key, index) => {
        if (index === keys.length - 1) {
            return true;
        }
        const nextKey = keys[index + 1];
        return $keyboard.isKeyDown(key) && $keyboard.isKeyDown(nextKey) && $keyboard.indexOf(key) < $keyboard.indexOf(nextKey);
    });
}