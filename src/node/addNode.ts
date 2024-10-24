// ====================================================================================================
// 노드 추가하는 탭
// ====================================================================================================

import viewport from "../sys/viewport.js";
import effectStateManager from "../class/effectStateManager.js";
import { render } from "../sys/viewportFunctions.js";
import $mouse from "../sys/mouse.js";
import $keyboard from "../sys/keyboard.js";



// export function addNodeStart() {
//     addNode();
// }
// function addNode() {
//     // 스크린 초기화를 위해 먼저 렌더링 한번 하기
//     render();
//     // 애니메이션이 필요 없다면 종료하기
//     if (!$keyboard.isKeyDown("ShiftLeft") || !$keyboard.isKeyDown("KeyA")) {
//         viewport.isAddNode = false;
//         return;
//     } else {
//         viewport.isAddNode = true;
//     }
    
//     requestAnimationFrame(addNode);
// }