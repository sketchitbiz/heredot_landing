# API Naming 규칙 가이드 / API Naming Convention Guide

이 문서는 API 경로(URL)를 설계할 때의 네이밍 규칙을 정의합니다.  
접두 구조는 **순위별 의미 단위**로 나뉘며, 각 위치에 어떤 정보를 표현하는지 명확하게 설계합니다.

This document defines the naming conventions for API endpoint URLs.  
Each segment of the path follows a ranked structure, clearly identifying the purpose of each part.

---

## 기본 구조 / Basic Structure

```
/[0]api/[1]domain/[2]service/[3]function
```

---

## 네이밍 순위 및 설명 / Naming Levels and Descriptions

| 순위 | 분류           | suffix                  | 예시               | 조합 예시                                         | 비고                                                            |
|------|----------------|--------------------------|--------------------|--------------------------------------------------|-----------------------------------------------------------------|
| 0    | API 구분       | `api`                    | `api`              | `/api/...`                                       | **웹서버와 API 서버가 동일할 경우 `api` 포함**<br>If the API and web server are the same domain, include `api`. Otherwise, omit. |
| 1    | 도메인 / 권한  | `admin`, `dev`, `user`   | `admin`, `user`    | `/api/admin/...`                                 | `user`는 기본 도메인으로 **생략 가능**<br>`user` domain may be omitted if it's the default |
| 2    | 서비스명       | 테이블명 또는 기능명     | `card`, `user`     | `/api/admin/card`                                | Represents business logic or resource name (e.g. table) |
| 3    | 기능명         | CRUD or custom 기능명     | `get`, `check-id`  | `/api/admin/card/get`, `/api/admin/card/check-id` | Use CRUD or custom function name (e.g. `check-id`). Use `-list` for arrays |

---

##  조합 예시 / Examples

| 사용 예시                        | 설명 |
|----------------------------------|------|
| `/api/admin/user/get`           | 관리자 권한으로 사용자 정보 조회 / Admin fetching user info |
| `/api/card/get`                 | 기본 유저 권한으로 카드 정보 조회 / User fetching card info (default domain) |
| `/api/admin/card/create`        | 관리자 권한으로 카드 생성 / Admin creates card |
| `/admin/card/check-id`          | API prefix 생략 예시 / Without `api` prefix (e.g. different domain) |
| `/api/admin/user/get-list`      | 사용자 리스트 조회 (배열 응답) / Fetch user list (array response) |

---

##  기능 suffix 정의 / Function Suffix Definitions

| 기능 구분       | suffix         | 설명 |
|----------------|----------------|------|
| 조회 (단건)     | `get`          | 단일 항목 조회 / Get single item |
| 조회 (다건)     | `get-list`     | 리스트 조회 / Get multiple items |
| 생성           | `create`       | 리소스 생성 / Create resource |
| 수정           | `update`       | 리소스 수정 / Update resource |
| 삭제           | `delete`       | 리소스 삭제 / Delete resource |
| 검증           | `check-*`      | 특정 조건 확인 / Validate condition (e.g. `check-id`) |
| 활성화         | `enable`       | 리소스 활성화 / Enable resource |
| 비활성화       | `disable`      | 리소스 비활성화 / Disable resource |
| 기타 커스텀 기능 | `동사-목적어`  | 예: `sync-status`, `reset-password` / Verb-object for custom logic |

---

##  참고 / Notes

- API 경로는 HTTP 메서드와 별개로 동작을 명시해야 합니다.  
  API paths should describe the action explicitly, independent of HTTP methods.
- 동사-목적어 구조 또는 CRUD 키워드를 사용할 것  
  Use verb-object pattern or CRUD keywords for clarity.
- 소문자와 하이픈(`-`) 케이스를 사용할 것  
  Use lowercase and kebab-case in URLs (e.g. `check-id`, `get-list`).

---

##  API 카운트 및 분류 방식 / Grouping APIs by Page

- **Postman 사용 시**: 각 페이지별 API를 **Collection 단위로 분류**합니다.  
  When using Postman, group APIs by page or domain using collections.

- **Swagger(OpenAPI) 사용 시**: 각 페이지/도메인을 **Tag**로 분류합니다.  
  When using Swagger, group related endpoints under the same `tag`.

---

##  권장 구조 / Recommended Structure

```
/api               ← API prefix (same domain only)
/admin             ← Role or domain
/card              ← Service or resource
/get               ← Action (CRUD or verb-object)
```

---


