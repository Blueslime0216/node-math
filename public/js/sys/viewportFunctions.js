// ====================================================================================================
// 뷰포트 함수들
// 여기서는 명령받은 대로 렌더링 하거나 관련 데이터를 전달해주는 역할을 한다.
// ====================================================================================================
import viewport, { canvas, ctx } from "./viewport.js";
import Node from "../node/node.js";
import effectStateManager from "../class/effectStateManager.js";
import { zoomEffect } from "../func/effectFunctions.js";
import userSetting from "../class/userSetting.js";
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
    // 이펙트 그리기
    drawEffects();
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
