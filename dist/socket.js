export default class Socket {
    constructor(node, index, type) {
        this._id = Math.random().toString(36).substring(2, 18); // 소켓 아이디
        this._hitboxSize = 10; // 소켓 히트박스 크기
        this._connectedSocket = null; // 연결된 소켓
        this._node = node;
        this._index = index;
        this._type = type;
    }
    get id() { return this._id; }
    get node() { return this._node; }
    get index() { return this._index; }
    get type() { return this._type; }
    draw(_ctx, _bounds, _gridSpacing) {
        const _size = _gridSpacing / 2;
        const _x = _bounds.x + (_bounds.width / 2) * _gridSpacing * (this._type === ESocketType.input ? -1 : 1);
        const _y = _bounds.y + (_bounds.height / 2) * _gridSpacing + (this._index * _gridSpacing);
        const _radius = _size / 2;
        // 소켓 그리기
        _ctx.save();
        _ctx.fillStyle = 'hsl(210, 70%, 50%)';
        _ctx.beginPath();
        _ctx.arc(_x, _y, _radius, 0, Math.PI * 2);
        _ctx.fill();
        _ctx.restore();
    }
    connect(socket) {
        this._connectedSocket = socket;
    }
    disconnect() {
        this._connectedSocket = null;
    }
}
