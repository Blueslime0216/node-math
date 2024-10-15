/*

[ node ]    // 노드와 관련된 코드들이 담긴 폴더
    node.ts     // 노드의 설정 등이 담긴 클래스
    nodeFunctions.ts    // 노드가 사용하는 함수들을 정의하는 코드
    socket.ts   // 소켓의 설정 등이 담긴 클래스
[ utils ]   // ???
    debugStateManager.ts    // 개발자 전용 코드, 디버깅을 위해 각종 값들을 on/off하는 클래스가 담겨있다
    domUtils.ts     // DOM을 다루는 함수들이 담긴 파일
    effectFunctions.ts      // 이펙트를 그리는 함수들이 담긴 파일
    effectStateManager.ts   // 각종 이펙트가 지금 켜져있는지, 이펙트 실행 위치 등의 정보를 담고 있는 클래스
    fieldUtils.ts   // 
    functions.ts    // 여러 곳에서 사용할 함수들을 정의해두는 파일 (분할 필요)
    userSetting.ts  // 유저가 변경할 수 있는 값들이 담긴 클래스
controller.ts   // 
index.ts    // 모든 기능들을 하나로 모아서 합쳐주는 파일 (여기서는 조합만 하고 기능 추가는 함수로 선언하고 가져오기)
keyboardEvent.ts    // (삭제 하자)
types.d.ts  // 타입스크립트에서 사용할 타입들을 정의해둔 파일
viewport.ts     // 뷰포트의 각종 값을 담은 클래스
viewportFunctions.ts     // 뷰포트에서 사용하는 함수들을 정의하는 코드

*/