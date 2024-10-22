// ====================================================================================================
// 뷰포트 함수들
// 여기서는 명령받은 대로 렌더링 하거나 관련 데이터를 전달해주는 역할을 한다.
// ====================================================================================================
import viewport, { canvas, ctx } from "./viewport.js";
import $mouse from "./mouse.js";
import Node from "../node/node.js";
import effectStateManager from "../class/effectStateManager.js";
import { zoomEffect } from "../func/effectFunctions.js";
import userSetting from "../class/userSetting.js";
import state from "../class/state.js";
import { drawRoundPolygon } from "../func/functions.js";
export function createNode(startPos, type) {
    viewport.nodes.push(new Node(startPos, type));
    render();
}
export function render() {
    // 캔버스 비우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 배경 채우기
    ctx.fillStyle = 'hsl(0, 0%, 10%)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 그리드 그리기
    drawGrid();
    // 노드 그리기
    drawNodes();
    // 선택 영역 그리기
    if (state.isDragSelecting && !state.isDragSelecting_cancel) {
        drawDragSelectBox();
    }
    // 이펙트 그리기
    drawEffects();
}
// 드래그로 선택된 영역을 그리는 함수
function drawDragSelectBox() {
    var _a;
    ctx.strokeStyle = 'hsl(210, 100%, 60%, 100%)';
    ctx.fillStyle = 'hsl(210, 100%, 60%, 10%)';
    ctx.shadowColor = 'hsl(210, 100%, 50%, 100%)';
    ctx.shadowBlur = 5;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.lineDashOffset = -((_a = (Date.now() / 1000).toString().split('.')[1]) === null || _a === void 0 ? void 0 : _a.slice(0, 1)) * 2 || 0;
    ctx.beginPath();
    const noiseMove = (Math.random() < 0) ? (Math.random() * 10 - 5) * viewport.zoomAmount : 0;
    const x = noiseMove + Math.min(($mouse.mouseStart.left.x + viewport.offsetMoving.width) - canvas.offsetLeft, $mouse.mousePos.x - canvas.offsetLeft);
    const y = noiseMove + Math.min(($mouse.mouseStart.left.y + viewport.offsetMoving.height) - canvas.offsetTop, $mouse.mousePos.y - canvas.offsetTop);
    const width = Math.abs(($mouse.mouseStart.left.x + viewport.offsetMoving.width) - $mouse.mousePos.x);
    const height = Math.abs(($mouse.mouseStart.left.y + viewport.offsetMoving.height) - $mouse.mousePos.y);
    const glitch = {
        on: Math.random() < 0.1, // 10% 확률로 지그재그 효과 추가
        numPoints: Math.floor(0 * viewport.zoomAmount), // 10~10개의 지그재그 포인트
        leftYOffsets: [], // 왼쪽 변의 y 좌표 오프셋 배열
        rightYOffsets: [] // 오른쪽 변의 y 좌표 오프셋 배열
    };
    function xOffset() {
        return Math.floor(Math.random() * 10 * viewport.zoomAmount) - 5;
    }
    // 지그재그 효과를 사용할 경우 y 오프셋을 랜덤으로 설정
    if (glitch.on && glitch.numPoints > 0) {
        for (let i = 0; i < glitch.numPoints; i++) {
            // @ts-ignore
            glitch.leftYOffsets.push(Math.random() * height); // 왼쪽 변 y 오프셋 추가
            // @ts-ignore
            glitch.rightYOffsets.push(Math.random() * height); // 오른쪽 변 y 오프셋 추가
        }
    }
    // 기본 다각형 좌표 설정
    const points = [
        { x: x, y: y }, // 왼쪽 상단
        { x: x + width, y: y }, // 오른쪽 상단
    ];
    // 오른쪽 변에 대한 지그재그 점 추가
    if (glitch.on && glitch.numPoints > 0) {
        // y 오프셋을 정렬하여 순서대로 처리
        glitch.rightYOffsets.sort((a, b) => a - b);
        // 오른쪽 변 지그재그 점 추가
        for (let i = 0; i < glitch.numPoints; i++) {
            points.push({
                x: x + width + xOffset(), // 오른쪽에 틀어진 x 값
                y: y + glitch.rightYOffsets[i] // 랜덤한 y 값
            });
        }
    }
    // 오른쪽 하단 좌표와 왼쪽 하단 좌표 추가
    points.push({ x: x + width, y: y + height }); // 오른쪽 하단
    points.push({ x: x, y: y + height }); // 왼쪽 하단
    // 왼쪽 변에 대한 지그재그 점 추가
    if (glitch.on && glitch.numPoints > 0) {
        // y 오프셋을 정렬하여 순서대로 처리
        glitch.leftYOffsets.sort((a, b) => a - b);
        glitch.leftYOffsets.reverse();
        // 왼쪽 변 지그재그 점 추가
        for (let i = 0; i < glitch.numPoints; i++) {
            points.push({
                x: x + xOffset(), // 왼쪽에 틀어진 x 값
                y: y + glitch.leftYOffsets[i] // 랜덤한 y 값
            });
        }
    }
    // 다각형 그리기
    drawRoundPolygon(ctx, points, 0);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
}
function drawGrid() {
    ctx.strokeStyle = 'hsl(0, 0%, 25%)'; // 그리드 선 색상 설정
    // 그리드 선 두께 설정 (확대하면 선명하게, 축소하면 연하게 보이게 설정하려고 gridSpacing 가져옴)
    const lineWidth = Math.min(viewport.gridSpacing / 75, 2);
    const lineWidthBold = lineWidth * userSetting.gridCustom.lineWidthBoldStrong;
    // const lineDashMargine = this.gridSpacing * userSetting.gridCustom.lineDashMargine/100;
    // const dashLength = userSetting.gridCustom.isOn ? this.gridSpacing/5 : 0;
    // 그리드 선 길이 설정
    const lineLength = viewport.gridSpacing * (userSetting.gridCustom.isOn ? userSetting.gridCustom.lineLength : 100) / 100;
    const lineMargin = viewport.gridSpacing * (100 - (userSetting.gridCustom.isOn ? userSetting.gridCustom.lineLength : 100)) / 100;
    const dashLength = viewport.gridSpacing * (userSetting.gridCustom.isOn ? userSetting.gridCustom.dashLength : 0) / 100;
    const dashMargin = viewport.gridSpacing * (100 - (userSetting.gridCustom.isOn ? userSetting.gridCustom.dashLength : 0)) / 100;
    // 자 속성
    ctx.fillStyle = 'hsl(0, 0%, 100%)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // 수직선 그리기
    let index = -Number((viewport.offset.x / viewport.gridSpacing).toString().split('.')[0]); // 눈금 자 좌표 기록용
    for (let x = viewport.offset.x % viewport.gridSpacing; x < canvas.width; x += viewport.gridSpacing) {
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([lineLength, lineMargin]);
        ctx.lineDashOffset = -viewport.offset.y - lineMargin / 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = lineWidthBold;
        ctx.setLineDash([dashLength, dashMargin]);
        ctx.lineDashOffset = -viewport.offset.y - dashMargin / 2 + viewport.gridSpacing / 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.closePath();
        // 세로 눈금 자 표시
        if (userSetting.ruler.isOn && userSetting.ruler.horizontal) {
            ctx.fillText((index).toString().split('.')[0], x, 16);
            index++;
        }
    }
    index = -Number((viewport.offset.y / viewport.gridSpacing).toString().split('.')[0]); // 눈금 자 좌표 기록
    // 수평선 그리기
    for (let y = viewport.offset.y % viewport.gridSpacing; y < canvas.height; y += viewport.gridSpacing) {
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([lineLength, lineMargin]);
        ctx.lineDashOffset = -viewport.offset.x - lineMargin / 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        ctx.lineWidth = lineWidthBold;
        ctx.setLineDash([dashLength, dashMargin]);
        ctx.lineDashOffset = -viewport.offset.x - dashMargin / 2 + viewport.gridSpacing / 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        // 가로 눈금 자 표시
        if (userSetting.ruler.isOn && userSetting.ruler.vertical) {
            ctx.fillText((index).toString().split('.')[0], 16, y);
            index++;
        }
    }
    // 점선 종료
    ctx.setLineDash([]);
}
function drawNodes() {
    viewport.nodes.forEach(node => {
        node.draw();
    });
}
function drawEffects() {
    // 마우스 확대/축소 중심 이펙트
    if (userSetting.mouseZoomEffect.isOn && effectStateManager.mouseZoomSign.isOn === true) {
        zoomEffect(ctx, viewport.lineThickness, (new Date().getTime()), effectStateManager.mouseZoomSign);
    }
    // 키보드 확대/축소 중심 이펙트
    if (userSetting.keyboardZoomEffect.isOn && effectStateManager.keyboardZoomCenterSign.isOn === true) {
        zoomEffect(ctx, viewport.lineThickness, (new Date().getTime()), effectStateManager.keyboardZoomCenterSign);
    }
}
