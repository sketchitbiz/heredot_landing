###  언제 이 주석 템플릿을 사용할까?  
**When should you use this comment template?**

-  **비즈니스 로직이 포함된 CustomComponent 또는 함수**  
  **Components or functions that include business logic**  
  - 다양한 상태, 조건 분기, 입력/출력이 있는 경우 전체 템플릿 사용  
    Use the full template when there's branching logic, multiple states, or complex input/output.

- **도메인 모델 기반 컴포넌트**  
  **Domain-model-based components**  
  - 예: `Card(user: UserModel)`  
    e.g., `Card(user: UserModel)`
  - 복잡한 로직이 포함된 경우에 필요에 따라 이 템플릿을 사용할 수 있습니다.
    You may use this template when the component involves complex logic.
    

-  **Atomic 컴포넌트, StyledComponent, Layout 컴포넌트**  
  **Atomic/Styled/Layout-only components**  
  - 간소화 주석 또는 생략 가능  
    Use simplified comments or skip entirely if logic is minimal.
  - 예: `InputElement`, `Divider`, `ScreenWrapper`
    e.g., `InputElement`, `Divider`, `ScreenWrapper`


/**
 *  이 주석 템플릿은 VSCode 등의 IDE에 스니펫(snippet)으로 등록해 사용하면 편리합니다.
 *    자주 사용하는 패턴을 자동 완성하여 일관된 주석 작성이 가능합니다.
 *
 *  You can register this comment template as a snippet in your IDE (e.g., VSCode).
 *    This allows consistent and efficient documentation using autocomplete.
 *
 *  추천 prefix: `cm` or `comment`
 *    → 입력 시 자동 완성으로 주석 포맷 삽입
 *
 *  Recommended prefix: `cm` or `comment`
 *    → Triggers the comment template via autocomplete
 */


* 아래 주석 형태를 유지해주세요 (한글/영문 순서와 필수/선택 항목 포함)
* Please maintain the comment format below (Korean/English + Required/Optional structure)


/**
 * 주석 이름 / Section: [컴포넌트명 또는 기능 이름]  (필수 / Required)
 * 코드 목적 / Purpose: [이 컴포넌트 또는 코드의 핵심 역할] (필수 / Required)
 *
 * 산출물 / Output: [이 코드가 생성하거나 반환하는 결과] (선택 / Optional)
 *
 * 시나리오(알고리즘) / Scenario (Algorithm Flow): (선택 / Optional)
 *   1. [처리 순서 1]
 *   2. [처리 순서 2]
 *   3. [출력 또는 리턴 형태]
 *
 * 관련 모듈/클래스 / Related Modules/Classes: [연관된 훅, 모듈, 서비스 등] (선택 / Optional)
 * 입력 값 / Input Values: [props, 파라미터 요약] (선택 / Optional)
 * 예외 처리 / Exception Handling: [에러 상황 및 처리 방식] (선택 / Optional)
 */
