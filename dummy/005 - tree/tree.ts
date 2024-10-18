/*

[ class ]   // 클래스 형태로 선언된 것들
    debugStateManager.ts    // 개발자 전용 코드, 디버깅을 위해 각종 값들을 on/off하는 클래스가 담겨있다
    effectStateManager.ts   // 각종 이펙트의 현재 실행 중, 이펙트 실행 위치 등의 정보를 담고 있는 클래스
    userSetting.ts  // 유저가 변경할 수 있는 값들이 담긴 클래스
[ func ]    // 기능을 구현하는 함수들이 담긴 폴더
    effectFunctions.ts  // 이펙트를 그리는 함수들이 담긴 파일
    functions.ts    // 잡다한 함수들을 정의해두는 파일
[ node ]    // 노드와 관련된 코드들이 담긴 폴더
    node.ts     // 노드의 설정 등이 담긴 클래스
    nodeFunctions.ts    // 노드가 사용하는 함수들을 정의하는 코드
    socket.ts   // 소켓의 설정 등이 담긴 클래스
[ sys ]     // 작동의 메인 축이 되는 코드들
    controller.ts   // 이벤트 리스너가 담긴 컨트롤러 클래스, 조작을 담당한다
    keyboard.ts    // 키보드 입력을 감지하는 클래스
    mouse.ts    // 마우스 입력을 감지하는 클래스
    viewport.ts     // 뷰포트의 각종 값을 담은 클래스
    viewportFunctions.ts     // 뷰포트에서 사용하는 함수들을 정의하는 코드
[ utils ]   // 전역에서 사용할만한 그런 것들
    domUtils.ts     // DOM을 다루는 함수들이 담긴 파일
    fieldUtils.ts   // 
    types.d.ts  // 타입스크립트에서 사용할 타입들을 정의해둔 파일
index.ts    // 모든 기능들을 하나로 모아서 합쳐주는 파일 (여기서는 조합만 하고 기능 추가는 함수로 선언하고 가져오기)

*/