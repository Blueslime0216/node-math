// ====================================================================================================
// 이펙트를 그리는 함수들은 여기로
// ====================================================================================================

import viewport,{ Viewport } from "../sys/viewport.js";
import DebugStateManager from "../class/debugStateManager.js";
import effectStateManager from "../class/effectStateManager.js";


export function zoomEffect( ctx: CanvasRenderingContext2D,
                            lineThickness: number,
                            _nowTime: number,
                            _setting: IEffect,
                            _center: TPoint=_setting.position) {

    const isApply:boolean = _setting.isApply;
    const isInOut:string = _setting.isInOut as string;
    const center:TPoint = _center;
    // 확대/축소 중심 표시
    let _time = _nowTime - _setting.startTime; // 0 -> 200
    const _factor = _time/200;
    // 프레임이 200을 넘어가면 애니메이션 종료
    if (_time > 200) {
        _setting.isOn = false;
        return;
    }
    
    // 글로우 효과 주기
    ctx.shadowBlur = 10;
    ctx.lineWidth = (lineThickness + 1)*Math.pow(1 - _factor, 3) + 1;
    // 움직였는지에 따라 색상 변경
    if (isApply) {
        ctx.strokeStyle = 'hsl(210, 100%, 60%)';
        ctx.shadowColor = 'hsl(210, 100%, 60%)';
    } else {
        ctx.strokeStyle = 'hsl(0, 70%, 50%)';
        ctx.shadowColor = 'hsl(0, 70%, 50%)';
    }

    // 함수들 선언
    function startPos() {
        if (isInOut === 'in') {
            return (1 - Math.pow(1 - _factor, 3))*50 + 10;
        } else {
            return (Math.pow(1 - _factor, 3))*50 + 25;
        }
    }
    function endPos() {
        return (startPos() + length());
    }
    function length() {
        if (isInOut === 'in') {
            return (Math.pow(1 - _factor, 3))*25;
        } else {
            return (1 - Math.pow(1 - _factor, 3))*25;
        }
    }
    // 호 거리 함수
    function arcDistance() {
        if (isInOut === 'in') {
            return (1 - Math.pow(1 - _factor, 3))*50;
        } else {
            return 50 - (1 - Math.pow(1 - _factor, 3))*50 + 35;
        }
    }

    // 십자선 그리기
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(center.x + (i % 2 === 0 ? -1 : 1) * startPos(), center.y + (i < 2 ? -1 : 1) * startPos());
        ctx.lineTo(center.x + (i % 2 === 0 ? -1 : 1) * endPos(), center.y + (i < 2 ? -1 : 1) * endPos());
        ctx.stroke();
    }
    // 호 그리기
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const margineArc = 0.2;
        ctx.arc( center.x , center.y , arcDistance(), Math.PI / 2 * i + margineArc + Math.PI/4, Math.PI / 2 * (i + 1) - margineArc + Math.PI/4);
        ctx.stroke();
    }

    // 글로우 효과 제거
    ctx.shadowBlur = 0;
}