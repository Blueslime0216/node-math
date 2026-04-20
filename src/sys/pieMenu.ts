// ====================================================================================================
// 노드 생성을 위한 파이 메뉴 클래스 (개선된 SVG 버전)
// ====================================================================================================

import { createNode } from "./viewportFunctions.js";
import viewport from "./viewport.js";

interface SubNode {
    type: NodeType;
    label: string;
}

interface Category {
    id: string;
    label: string;
    color: string;
    children: SubNode[];
}

const CATEGORIES: Category[] = [
    {
        id: 'math',
        label: 'Math',
        color: 'hsl(210, 70%, 50%)',
        children: [
            { type: 'add', label: 'Add' },
            { type: 'subtract', label: 'Subtract' },
            { type: 'multiply', label: 'Multiply' },
            { type: 'divide', label: 'Divide' }
        ]
    },
    {
        id: 'constant',
        label: 'Constant',
        color: 'hsl(10, 60%, 50%)',
        children: [
            { type: 'value', label: 'Value' }
        ]
    },
    {
        id: 'data',
        label: 'Data',
        color: 'hsl(150, 70%, 50%)',
        children: [
            { type: 'variable', label: 'Variable' }
        ]
    },
    {
        id: 'display',
        label: 'Display',
        color: 'hsl(280, 70%, 60%)',
        children: [
            { type: 'display', label: 'Display' }
        ]
    }
];

class PieMenu {
    private container: HTMLDivElement | null = null;
    private svg: SVGSVGElement | null = null;
    private subGroup: SVGGElement | null = null;
    private isOpen: boolean = false;
    private targetPos: TPoint = {x: 0, y: 0}; // 캔버스 내부 기준 위치
    private activeCategory: string | null = null;

    constructor() {
        this.initDOM();
    }

    private getSlicePath(innerR: number, outerR: number, startAngle: number, endAngle: number, gap: number = 2) {
        // 간격을 위해 각도 약간 축소
        const start = startAngle + gap / 2;
        const end = endAngle - gap / 2;
        
        const startRad = (start - 90) * Math.PI / 180;
        const endRad = (end - 90) * Math.PI / 180;
        
        const x1 = Math.cos(startRad) * innerR;
        const y1 = Math.sin(startRad) * innerR;
        const x2 = Math.cos(startRad) * outerR;
        const y2 = Math.sin(startRad) * outerR;
        
        const x3 = Math.cos(endRad) * outerR;
        const y3 = Math.sin(endRad) * outerR;
        const x4 = Math.cos(endRad) * innerR;
        const y4 = Math.sin(endRad) * innerR;
        
        const largeArcFlag = end - start <= 180 ? 0 : 1;
        
        return `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`;
    }

    private getTextPos(innerR: number, outerR: number, startAngle: number, endAngle: number) {
        const midRad = (((startAngle + endAngle) / 2) - 90) * Math.PI / 180;
        const midR = (innerR + outerR) / 2;
        return {
            x: Math.cos(midRad) * midR,
            y: Math.sin(midRad) * midR
        };
    }

    private initDOM() {
        if (document.getElementById('pie-menu-container')) return;

        this.container = document.createElement('div');
        this.container.id = 'pie-menu-container';
        
        // CSS 스타일 추가
        const style = document.createElement('style');
        style.innerHTML = `
            #pie-menu-container {
                position: absolute;
                display: none;
                z-index: 1000;
                width: 400px;
                height: 400px;
                transform: translate(-50%, -50%) scale(0.8);
                pointer-events: none;
                transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                opacity: 0;
            }
            #pie-menu-container.show {
                opacity: 1;
                pointer-events: auto;
                transform: translate(-50%, -50%) scale(1);
            }
            .pie-svg {
                width: 100%;
                height: 100%;
                overflow: visible;
                filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
            }
            .pie-slice {
                fill: rgba(30, 30, 30, 0.85);
                stroke: rgba(255, 255, 255, 0.1);
                stroke-width: 1.5;
                cursor: pointer;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
            }
            .pie-slice:hover, .pie-slice.active {
                fill: rgba(60, 60, 60, 0.95);
                stroke-width: 3;
            }
            .pie-text {
                fill: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 13px;
                font-weight: bold;
                text-anchor: middle;
                dominant-baseline: central;
                pointer-events: none;
                transition: all 0.2s ease;
            }
            .pie-slice:hover + .pie-text, .pie-slice.active + .pie-text {
                font-size: 14px;
            }
            .center-btn {
                fill: rgba(20, 20, 20, 0.9);
                stroke: rgba(255, 255, 255, 0.2);
                stroke-width: 2;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .center-btn:hover {
                fill: rgba(50, 50, 50, 1);
                stroke: rgba(255, 255, 255, 0.4);
            }
            .center-text {
                fill: #aaa;
                font-family: Arial, sans-serif;
                font-size: 16px;
                font-weight: bold;
                text-anchor: middle;
                dominant-baseline: central;
                pointer-events: none;
            }
            .sub-group {
                transition: opacity 0.2s ease;
                opacity: 0;
                pointer-events: none;
            }
            .sub-group.show {
                opacity: 1;
                pointer-events: auto;
            }
        `;
        document.head.appendChild(style);

        // SVG 구성
        const svgNS = "http://www.w3.org/2000/svg";
        this.svg = document.createElementNS(svgNS, "svg");
        this.svg.setAttribute("class", "pie-svg");
        this.svg.setAttribute("viewBox", "-200 -200 400 400");

        // 1단계 카테고리 렌더링
        const catGroup = document.createElementNS(svgNS, "g");
        const anglePerCat = 360 / CATEGORIES.length;
        
        CATEGORIES.forEach((cat, i) => {
            const startAngle = i * anglePerCat;
            const endAngle = (i + 1) * anglePerCat;
            
            const slice = document.createElementNS(svgNS, "path");
            slice.setAttribute("d", this.getSlicePath(40, 110, startAngle, endAngle, 3));
            slice.setAttribute("class", "pie-slice");
            
            // 호버 시 해당 색상으로 빛나는 효과
            slice.addEventListener("mouseenter", () => {
                slice.style.stroke = cat.color;
                this.showSubMenu(cat.id, startAngle, endAngle);
            });
            
            const textPos = this.getTextPos(40, 110, startAngle, endAngle);
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", textPos.x.toString());
            text.setAttribute("y", textPos.y.toString());
            text.setAttribute("class", "pie-text");
            text.textContent = cat.label;

            catGroup.appendChild(slice);
            catGroup.appendChild(text);
        });
        
        this.svg.appendChild(catGroup);

        // 2단계 서브 메뉴 그룹 렌더링용
        this.subGroup = document.createElementNS(svgNS, "g");
        this.subGroup.setAttribute("class", "sub-group");
        this.svg.appendChild(this.subGroup);

        // 중앙 X 버튼
        const centerBtn = document.createElementNS(svgNS, "circle");
        centerBtn.setAttribute("r", "35");
        centerBtn.setAttribute("class", "center-btn");
        centerBtn.addEventListener("click", () => this.hide());
        
        const centerText = document.createElementNS(svgNS, "text");
        centerText.setAttribute("class", "center-text");
        centerText.textContent = "X";

        this.svg.appendChild(centerBtn);
        this.svg.appendChild(centerText);

        this.container.appendChild(this.svg);
        document.body.appendChild(this.container);

        // 외부 클릭 시 닫기
        document.addEventListener('mousedown', (e) => {
            if (this.isOpen && e.target !== this.container && !this.container?.contains(e.target as Node)) {
                this.hide();
            }
        });
    }

    private showSubMenu(catId: string, parentStart: number, parentEnd: number) {
        if (!this.subGroup) return;
        if (this.activeCategory === catId) return; // 이미 열려있음
        
        this.activeCategory = catId;
        const cat = CATEGORIES.find(c => c.id === catId);
        if (!cat) return;

        // 서브 그룹 비우기
        while (this.subGroup.firstChild) {
            this.subGroup.removeChild(this.subGroup.firstChild);
        }

        const svgNS = "http://www.w3.org/2000/svg";
        const numChildren = cat.children.length;
        // 서브 메뉴는 부모의 각도 범위 내에서 분배
        const anglePerChild = (parentEnd - parentStart) / numChildren;

        cat.children.forEach((child, i) => {
            const startAngle = parentStart + i * anglePerChild;
            const endAngle = parentStart + (i + 1) * anglePerChild;

            const slice = document.createElementNS(svgNS, "path");
            // 바깥쪽 링 (반지름 115 ~ 180)
            slice.setAttribute("d", this.getSlicePath(115, 180, startAngle, endAngle, 2));
            slice.setAttribute("class", "pie-slice");
            
            slice.addEventListener("mouseenter", () => {
                slice.style.stroke = cat.color;
            });
            slice.addEventListener("mouseleave", () => {
                slice.style.stroke = "";
            });
            slice.addEventListener("click", () => {
                this.selectItem(child.type);
            });

            const textPos = this.getTextPos(115, 180, startAngle, endAngle);
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", textPos.x.toString());
            text.setAttribute("y", textPos.y.toString());
            text.setAttribute("class", "pie-text");
            // 자식 노드의 라벨 렌더링
            text.textContent = child.label;

            this.subGroup!.appendChild(slice);
            this.subGroup!.appendChild(text);
        });

        // 서브 메뉴 표시
        this.subGroup.classList.add("show");
    }

    public show(clientX: number, clientY: number, canvasOffsetX: number, canvasOffsetY: number) {
        if (!this.container) return;
        
        this.targetPos = {
            x: (clientX - canvasOffsetX - viewport.offset.x) / viewport.zoom,
            y: (clientY - canvasOffsetY - viewport.offset.y) / viewport.zoom
        };

        this.container.style.left = `${clientX}px`;
        this.container.style.top = `${clientY}px`;
        this.container.style.display = 'block';
        
        // 서브 메뉴 초기화
        if (this.subGroup) {
            this.subGroup.classList.remove("show");
            while (this.subGroup.firstChild) {
                this.subGroup.removeChild(this.subGroup.firstChild);
            }
        }
        this.activeCategory = null;

        // 슬라이스 테두리 초기화
        const slices = this.container.querySelectorAll('.pie-slice');
        slices.forEach(s => (s as SVGPathElement).style.stroke = '');

        setTimeout(() => {
            this.container?.classList.add('show');
        }, 10);
        
        this.isOpen = true;
    }

    public hide() {
        if (!this.container) return;
        this.container.classList.remove('show');
        setTimeout(() => {
            if (this.container) this.container.style.display = 'none';
        }, 200);
        this.isOpen = false;
    }

    private selectItem(type: NodeType) {
        createNode(this.targetPos, type);
        this.hide();
    }
}

export default new PieMenu();
