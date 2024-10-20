//=============================================================================
// RPG Maker MZ - 노드 에디터 플러그인
//=============================================================================

/*:ko
 * @target MZ
 * @plugindesc 노드 에디터 플러그인
 * @author 푸른슬라임
 *
 * @help main.js
 *
 * 노드 방식을 이용해 수학적인 계산을 할 수 있는 플러그인입니다.
 *
 */

/*:en
 * @target MZ
 * @plugindesc Node Editor Plugin
 * @author BlueSlime
 * 
 * @help main.js
 * 
 * This plugin allows you to perform mathematical calculations using a node-based approach.
 * 
*/


// 처음 로딩 기다리기
window.onload = function() {
    // 기본 초기 설정들

    // body의 overflow를 hidden으로 설정
    document.body.style.overflow = 'hidden';

    // 마우스 움직임 막기
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

// 디버깅 모드 설정들 ("!디버그 (뭐시기)"를 검색해서 찾을 수 있음)
let debugMode = {
    showAreaBorder: false,
}
// 선언
let isEdtiorOpen = false;

// shoArea 생성
const showArea = document.createElement('div');
    showArea.id = 'showArea';
    document.body.appendChild(showArea);
    debugMode.showAreaBorder ? showArea.style.border = '1px solid red' : ''; // !디버그 showAreaBorder

function openNE() {
    if (isEdtiorOpen) {
        console.log('이미 열려 있습니다.'+isEdtiorOpen);
    } else {
        console.log('노드 에디터를 엽니다.'+isEdtiorOpen);
        isEdtiorOpen = true;
        console.log('노드 에디터를 열었습니다'+isEdtiorOpen);
        openNodeEditor();
    }
}

function openNodeEditor() {
    // 캔버스를 동적으로 생성하기
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
        canvas.id = 'nodeEditor';
        // body에 추가
        showArea.appendChild(canvas);
        // 캔버스의 배경색 설정
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 닫기 버튼 생성
    const closeBtn = document.createElement('button');
        closeBtn.innerText = 'X';

        showArea.appendChild(closeBtn);
        closeBtn.onclick = closeNodeEditor;
        closeBtn.id = 'closeBtn';
        closeBtn.classList.add('btn');
    // 노드 추가 버튼 생성
    const addNodeBtn = document.createElement('button');
        addNodeBtn.innerText = '+';
        showArea.appendChild(addNodeBtn);
        // addNodeBtn.onclick = addNode;
        addNodeBtn.id = 'addNodeBtn';
        addNodeBtn.classList.add('btn');

    // 등장 애니메이션
    const gameCanvas = document.getElementById('gameCanvas');
    setTimeout(() => {
        canvas.style.top = '50%';
        gameCanvas.style.marginBottom = '25%';
    }, 1);
    setTimeout(() => {
        closeBtn.classList.add('on');
        addNodeBtn.classList.add('on');
    }, 100);
}

function closeNodeEditor() {
    const nodeEditor = document.getElementById('nodeEditor');
    const gameCanvas = document.getElementById('gameCanvas');
    const closeBtn = document.getElementById('closeBtn');
    const addNodeBtn = document.getElementById('addNodeBtn');
    setTimeout(() => {
        nodeEditor.style.top = '100%';
        gameCanvas.style.marginBottom = '0';
        gameCanvas.style.filter = 'blur(0)';
        closeBtn.classList.remove('on', 'hover');
        addNodeBtn.classList.remove('on', 'hover');
    }, 1);
    // 0.5초 후에 캔버스를 제거
    setTimeout(() => {
        nodeEditor.remove();
        closeBtn.remove();
        addNodeBtn.remove();
        isEdtiorOpen = false;
    }, 500);
}

// closeBtn 위에 마우스가 올라가면 .hover 클래스를 추가
document.addEventListener('mouseover', function(e) {
    if (e.target.id === 'closeBtn') {
        e.target.classList.add('hover');
    }
    if (e.target.id === 'addNodeBtn') {
        e.target.classList.add('hover');
    }
});
// 마우스가 closeBtn 위에서 떠나면 .hover 클래스를 제거
document.addEventListener('mouseout', function(e) {
    if (e.target.id === 'closeBtn') {
        e.target.classList.remove('hover');
    }
    if (e.target.id === 'addNodeBtn') {
        e.target.classList.remove('hover');
    }
});
