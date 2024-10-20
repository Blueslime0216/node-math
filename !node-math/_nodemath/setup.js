// ====================================================================================================
// 알만툴 적용을 위한 셋업 코드
// ====================================================================================================

// 로딩 기다리기
window.onload = function() {
    // body의 overflow를 hidden으로 설정
    document.body.style.overflow = 'hidden';

    // 마우스 이동 막기
    Game_Temp.prototype.setDestination = function() {};

    // transition이 처음 한번에는 작동하지 않아서 한번 실행해주기
    function gameCanvasReset() {
        if (document.getElementById('gameCanvas')) {
            setTimeout(() => {
                document.getElementById('gameCanvas').style.marginBottom = '0px';
            }, 500);
        } else {
            setTimeout(() => {
                gameCanvasReset();
            }, 500);
        }
    }
    gameCanvasReset();
}

// 개발자 도구 열기
const gui = require('nw.gui');
const win = gui.Window.get();
win.showDevTools();

// 캔버스 생성
const editor = document.createElement('div');
editor.id = 'editor';
document.body.appendChild(editor);