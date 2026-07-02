# ProjectWiki - 개발 로드맵

**프로젝트 기간**: 10주 (5개 Sprint, 각 2주)  
**목표**: MVP 완성 (검색, 에디터, 버전 관리)  
**기술 스택**: Next.js 16.2 · Drizzle 0.31 + better-sqlite3 · shadcn/ui 2.9

---

## Sprint 0: 프로젝트 셋업 (1주)

### 목표
Next.js 16 프로젝트 초기화 및 개발 환경 구성

### 완료 기준

- [ ] `npx create-next-app@latest --yes` 로 프로젝트 생성
  - TypeScript, ESLint, Tailwind CSS v4, App Router 포함
  - `eslint.config.mjs` 직접 구성 (Next 16에서 `next lint` 제거됨)
- [ ] `npx shadcn@latest init -d` 로 shadcn/ui 초기화
  - Radix 기반 컴포넌트 라이브러리
  - next-themes 설정 (다크 모드 지원)
- [ ] `npm install drizzle-orm better-sqlite3 @types/better-sqlite3 drizzle-kit`
  - `drizzle.config.ts` 파일 생성
  - `.env.local` 생성: `DATABASE_URL=./sqlite.db`
- [ ] 프로젝트 폴더 구조 초기화
  ```
  src/
  ├── app/
  ├── components/
  ├── lib/
  ├── db/
  │   ├── schema.ts
  │   └── index.ts
  └── hooks/
  ```
- [ ] GitHub 저장소 연결
- [ ] 로컬 SQLite 데이터베이스 생성 (`sqlite.db`)

### 예상 시간
3~4일

---

## Sprint 1: 데이터 스키마 & Repository 레이어 (2주)

### 목표
SQLite 스키마 정의 및 데이터 접근 계층 구현

### 완료 기준

#### 1.1 Drizzle 스키마 정의 (`src/db/schema.ts`)

- [ ] `documents` 테이블 정의
  ```typescript
  // 타입: id(int), slug(text), title(text), path(text), content(text), 
  //      parentId(int FK), isFolder(boolean), isPublic(boolean),
  //      createdAt(integer), updatedAt(integer), viewCount(integer)
  ```
  - **주의**: Drizzle에서 `createdAt`/`updatedAt`은 `integer` 타입 사용 (Unix timestamp)
  - 예: `sql<number>` 캐스팅 활용

- [ ] `document_versions` 테이블 정의
  ```typescript
  // 타입: id(int), documentId(int FK), content(text),
  //      changedBy(text), changedAt(integer), changeType(text)
  ```

- [ ] SQLite FTS5 인덱스 생성
  ```sql
  CREATE VIRTUAL TABLE documents_fts USING fts5(title, content, path);
  ```
  - Drizzle에서 raw SQL로 생성

- [ ] `backlinks` 테이블 정의
  ```typescript
  // fromDocumentId, toDocumentId, mentionContext
  ```

- [ ] `search_history` 테이블 정의
  ```typescript
  // query, executedAt
  ```

#### 1.2 Repository 레이어 구현 (`src/db/repository/`)

- [ ] `DocumentRepository` 클래스
  - `findById(id: number): Promise<Document>`
  - `findBySlug(slug: string): Promise<Document>`
  - `findAll(): Promise<Document[]>`
  - `findByParent(parentId: number): Promise<Document[]>`
  - `create(data: CreateDocumentInput): Promise<Document>`
  - `update(id: number, data: UpdateDocumentInput): Promise<Document>`
  - `delete(id: number): Promise<void>`
  - `incrementViewCount(id: number): Promise<void>`

- [ ] `DocumentVersionRepository` 클래스
  - `findByDocumentId(documentId: number): Promise<DocumentVersion[]>`
  - `createVersion(data: CreateVersionInput): Promise<DocumentVersion>`
  - `findByTimestamp(documentId: number, timestamp: number): Promise<DocumentVersion>`
  - `restore(documentId: number, versionId: number): Promise<void>`

- [ ] `SearchRepository` 클래스
  - `searchFTS(query: string): Promise<SearchResult[]>`
  - `saveSearchHistory(query: string): Promise<void>`
  - `getSearchHistory(limit: number): Promise<string[]>`
  - **주의**: Drizzle + FTS5 쿼리는 raw SQL 활용

- [ ] 트랜잭션 지원
  - `withTransaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T>`

#### 1.3 데이터베이스 마이그레이션

- [ ] `npx drizzle-kit generate` 로 마이그레이션 파일 생성
- [ ] `npx drizzle-kit push` 로 데이터베이스 스키마 적용
- [ ] 개발용 시드 데이터 생성 (`src/db/seed.ts`)
  - 샘플 폴더 3개, 문서 5개

#### 1.4 Drizzle 제네릭 설정

- [ ] `BetterSQLite3Database<typeof schema>` 타입 정의
  ```typescript
  import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
  import * as schema from './schema';
  
  export type DB = BetterSQLite3Database<typeof schema>;
  ```

- [ ] 데이터베이스 인스턴스 생성 (`src/db/index.ts`)
  ```typescript
  import Database from 'better-sqlite3';
  
  const db = new Database(process.env.DATABASE_URL);
  export const drizzle = drizzleDb(db, { schema });
  ```

### 예상 시간
7~8일

---

## Sprint 2: 에디터 & 뷰어 UI (2주)

### 목표
마크다운 에디터, 실시간 미리보기, 읽기 뷰 구현

### 완료 기준

#### 2.1 마크다운 에디터 컴포넌트

- [ ] `MarkdownEditor` 컴포넌트 구현
  - 좌측: 마크다운 텍스트 입력 (textarea 또는 코드 에디터)
  - 우측: HTML 렌더링 미리보기
  - **라이브러리 선택**:
    - 에디터: `react-textarea-autosize` (간단) 또는 `codemirror` (고급)
    - 렌더러: `react-markdown` + `remark-gfm` (GFM 지원)
  - 실시간 동기화 (입력 즉시 미리보기 업데이트)

- [ ] `FileUploadDropZone` 컴포넌트
  - 이미지 드래그 드롭 업로드
  - 업로드된 이미지를 마크다운 문법으로 자동 삽입
  - 이미지 경로 관리 (`public/uploads/...`)

- [ ] 자동 저장 기능
  - 마크다운 변경 후 1초 후 자동 저장
  - `useEffect` + debounce 활용
  - "저장 중...", "저장됨", "저장 오류" 상태 표시

- [ ] 페이지 제목 & 메타정보 입력
  - 제목 입력 필드
  - 공개/비공개 토글

#### 2.2 마크다운 렌더러

- [ ] `MarkdownViewer` 컴포넌트 (읽기 전용)
  - `react-markdown` + `remark-gfm` 사용
  - 지원 문법: 제목, 리스트, 코드 블록, 표, 링크, 이미지, 강조
  - 코드 하이라이팅: `react-syntax-highlighter` 또는 `shiki`
  - 목차(Table of Contents) 생성 및 앵커 링크

- [ ] XSS 방지
  - `sanitize-html` 라이브러리로 렌더링 전 새니타이징
  - 신뢰할 수 없는 마크다운 입력 안전 처리

#### 2.3 페이지 라우팅

- [ ] Next.js App Router 구조 (`src/app/`)
  ```
  /                    // 대시보드
  /editor/[slug]       // 에디터 페이지 (await params 사용)
  /view/[slug]         // 읽기 전용 뷰
  /settings            // 설정
  ```

- [ ] 동적 라우팅 구현
  - Next 16의 `await params` 패턴 사용
  - 예: `const { slug } = await params;`

#### 2.4 API 라우트

- [ ] `POST /api/documents` - 문서 생성
- [ ] `PUT /api/documents/[id]` - 문서 수정
- [ ] `GET /api/documents/[id]` - 문서 조회
- [ ] `DELETE /api/documents/[id]` - 문서 삭제

### 예상 시간
9~10일

---

## Sprint 3: 트리 네비게이션 & 폴더 관리 (2주)

### 목표
폴더 계층구조 표시 및 페이지 관리 기능 구현

### 완료 기준

#### 3.1 사이드바 트리 컴포넌트

- [ ] `FolderTree` 컴포넌트
  - 재귀적 폴더 구조 렌더링
  - 폴더 펼치기/접기 상태 관리 (localStorage)
  - 활성 페이지 하이라이트
  - 즐겨찾기 핀 기능

- [ ] 페이지 관리 메뉴
  - 우클릭 컨텍스트 메뉴 (이름 변경, 삭제, 복사 링크)
  - 드래그 드롭으로 폴더 이동 (선택 사항)

#### 3.2 폴더 & 페이지 CRUD

- [ ] `FolderRepository` 클래스 추가
  - `createFolder(name: string, parentId: number): Promise<Document>`
  - `renameFolder(id: number, newName: string): Promise<void>`
  - `deleteFolder(id: number, recursive: boolean): Promise<void>`

- [ ] 페이지 생성 플로우
  - 폴더 선택 → 페이지명 입력 → 에디터로 이동
  - 또는 "+ 새 페이지" 버튼 → 루트 또는 현재 폴더에 생성

- [ ] 페이지 이름 변경 & 삭제
  - slug 자동 업데이트 (한글 → URL 인코딩)
  - 삭제 시 확인 대화상자

#### 3.3 대시보드 (첫 버전)

- [ ] `Dashboard` 페이지 (`/`)
  - 최근 수정 문서 5개
  - 전체 문서 개수
  - 폴더 개수
  - 총 단어 수
  - 마지막 수정 시간

#### 3.4 레이아웃 구성

- [ ] 3-pane 레이아웃
  ```
  ┌─────────────┬────────────────────────┐
  │   사이드바  │   에디터 또는 뷰어     │
  │  (폴더트리) │   (우측 패널)          │
  │             │                        │
  │ (고정 너비) │   (반응형 확대)        │
  └─────────────┴────────────────────────┘
  ```

- [ ] 반응형 디자인
  - 데스크톱(1024px+): 3-pane
  - 태블릿(768px~1024px): 사이드바 콜렙스, 메인 콘텐츠 확대
  - 모바일(< 768px): 1-pane (네비게이션 드로어)

### 예상 시간
9~10일

---

## Sprint 4: 검색 & 버전 이력 (2주)

### 목표
전체 텍스트 검색, 변경 이력 추적 및 Diff 뷰 구현

### 완료 기준

#### 4.1 전문 검색 UI

- [ ] `SearchBar` 컴포넌트
  - 헤더 또는 사이드바에 검색 입력 필드
  - 실시간 검색 결과 (입력 시 즉시)
  - 검색 결과 드롭다운 또는 전용 페이지로 이동

- [ ] `SearchResultsPage` (`/search`)
  - 검색어 입력
  - 결과 목록 표시 (제목, 경로, 매칭된 스니펫)
  - 필터: 문서만 / 폴더만 / 전체
  - 정렬: 관련도 / 최근 수정 / 조회수

#### 4.2 FTS5 검색 구현

- [ ] `SearchRepository.searchFTS(query: string)`
  ```typescript
  // raw SQL 사용
  db.query(`
    SELECT documents.id, documents.title, documents.slug, documents.path,
           documents_fts.rank
    FROM documents
    JOIN documents_fts ON documents.id = documents_fts.rowid
    WHERE documents_fts MATCH ?
    ORDER BY documents_fts.rank ASC
    LIMIT 20
  `).all(query);
  ```

- [ ] 검색 결과 스니펫 생성
  - 매칭된 부분 주변 문장 추출
  - 검색어 하이라이트 (`<mark>` 태그)

- [ ] 검색 이력 저장
  - 사용자가 검색한 쿼리 저장
  - 최근 검색 5개 표시 (localStorage 또는 DB)

#### 4.3 변경 이력 관리

- [ ] 문서 수정 시 자동 버전 생성
  ```typescript
  // DocumentService에서 수정 후
  await versionRepository.createVersion({
    documentId: doc.id,
    content: doc.content,  // 전체 마크다운 스냅샷
    changeType: 'UPDATE',
    changedAt: Date.now(),
  });
  ```

- [ ] `HistoryViewer` 컴포넌트
  - 타임라인 표시 (최신 → 오래된 순)
  - 각 버전의 변경 시간, 크기, 요약
  - 클릭 시 Diff 뷰로 이동

#### 4.4 Diff 뷰

- [ ] `DiffViewer` 컴포넌트
  - 두 버전 간 차이점 표시
  - 라이브러리 선택: `react-diff-viewer-continued` 또는 `diff-match-patch`
  - 추가된 줄: 녹색, 삭제된 줄: 빨간색
  - Side-by-side 또는 inline 뷰 선택

- [ ] 버전 복원 기능
  - 특정 이전 버전으로 되돌리기
  - 복원 시 새로운 버전 생성 (감시 추적)

#### 4.5 API 라우트

- [ ] `GET /api/search?q=...&limit=20` - 검색
- [ ] `GET /api/documents/[id]/versions` - 버전 목록
- [ ] `GET /api/documents/[id]/versions/[versionId]` - 특정 버전 조회
- [ ] `POST /api/documents/[id]/versions/[versionId]/restore` - 복원

### 예상 시간
9~10일

---

## Sprint 5: 대시보드 & 통계, 마무리 (2주)

### 목표
통계 대시보드 구현, 테스트, 문서화, 배포 준비

### 완료 기준

#### 5.1 대시보드 고도화

- [ ] 통계 카드 구현
  - 전체 문서 수
  - 전체 폴더 수
  - 총 단어 수
  - 마지막 수정 시간
  - 가장 많이 본 페이지 TOP 5
  - 이번 주 생성된 문서 수

- [ ] 차트 및 시각화 (Recharts)
  - 주별 문서 생성 수 (라인 차트)
  - 폴더별 문서 분포 (원형 차트)
  - 월별 수정 빈도 (막대 차트)

- [ ] 최근 활동 타임라인
  - 최근 수정된 10개 문서
  - 각 항목에 수정 시간, 변경된 단어 수

#### 5.2 설정 페이지

- [ ] 프로젝트 설정
  - 프로젝트명 & 설명 입력
  - 로컬 마크다운 폴더 경로 설정
  - 파일 시스템 watch 설정 (외부 변경 감지)

- [ ] 사용자 설정
  - 테마 (라이트/다크/자동)
  - 자동 저장 간격 (밀리초)
  - 언어 (한국어/English)

- [ ] 데이터 관리
  - 모든 문서 내보내기 (Markdown ZIP)
  - 데이터베이스 백업 (SQLite 파일 다운로드)
  - 데이터 초기화 (위험)

#### 5.3 오류 처리 & 상태 UI

- [ ] 빈 상태 (Empty State)
  - 문서 없을 때: "문서가 없습니다. 새 문서를 만들어 보세요."
  - 검색 결과 없을 때: "검색 결과가 없습니다."

- [ ] 로딩 상태 (Skeleton)
  - 문서 로딩 중: 스켈레톤 로더
  - 검색 결과 로딩: 로딩 스피너

- [ ] 오류 상태 (Error State)
  - 문서 로드 실패: "문서를 불러올 수 없습니다. 다시 시도해 주세요."
  - 저장 실패: 재시도 버튼 포함

#### 5.4 접근성 (Accessibility)

- [ ] WCAG 2.1 AA 준수
  - [ ] 모든 컴포넌트에 ARIA 라벨 추가
  - [ ] 키보드 네비게이션 테스트
  - [ ] 포커스 표시 (outline)
  - [ ] 색상 대비 비율 (4.5:1 이상)
  - [ ] 스크린 리더 테스트

#### 5.5 성능 최적화

- [ ] 번들 크기 분석 및 최적화
  - 큰 라이브러리 lazy loading
  - 동적 import 활용

- [ ] 렌더링 성능
  - React.memo로 불필요한 재렌더링 방지
  - useMemo/useCallback 활용

- [ ] 데이터베이스 쿼리 최적화
  - N+1 쿼리 문제 해결
  - 인덱스 생성 (slug, parentId, createdAt)

#### 5.6 테스트

- [ ] 단위 테스트 (Jest + React Testing Library)
  - Repository 함수 테스트
  - 유틸리티 함수 테스트 (검색, Diff 등)

- [ ] 통합 테스트
  - 문서 생성 → 수정 → 삭제 플로우
  - 검색 기능 (FTS5 쿼리)
  - 버전 이력 및 복원

- [ ] E2E 테스트 (Playwright)
  - 에디터 페이지에서 문서 작성 및 저장
  - 검색 기능 테스트
  - 네비게이션 테스트

#### 5.7 문서화

- [ ] README.md 작성
  - 설치 및 실행 방법
  - 기본 사용법
  - 기술 스택

- [ ] 개발자 가이드
  - 구조 및 아키텍처
  - API 엔드포인트 문서
  - Database 스키마

- [ ] 사용자 가이드
  - 페이지 생성 방법
  - 마크다운 문법
  - 검색 팁

#### 5.8 배포 준비

- [ ] Vercel 배포 설정
  - `vercel.json` 설정
  - 환경 변수 구성 (DATABASE_URL)

- [ ] 데이터베이스 마이그레이션 자동화
  - 배포 후 자동으로 스키마 적용

- [ ] 성능 모니터링
  - Next.js Analytics 설정
  - Core Web Vitals 모니터링

### 예상 시간
10~12일

---

## 기술 주의사항

### Next.js 16 변경사항

1. **`await params` 패턴**
   ```typescript
   // ✅ 올바른 방법
   export default async function Page({ params }) {
     const { slug } = await params;
     const doc = await getDocument(slug);
     return <div>{doc.title}</div>;
   }

   // ❌ 잘못된 방법 (params를 바로 사용)
   const slug = params.slug;
   ```

2. **ESLint 설정**
   - `next lint` 명령어가 제거됨
   - `eslint.config.mjs` 직접 구성 필요
   - ESLint 9 호환

### Drizzle ORM + SQLite

1. **Integer Timestamp 패턴**
   ```typescript
   import { sql } from 'drizzle-orm';

   const table = {
     createdAt: integer('created_at')
       .notNull()
       .default(sql`(cast(strftime('%s', 'now') as integer))`),
   };
   ```

2. **BetterSQLite3 제네릭**
   ```typescript
   import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
   import * as schema from './schema';

   type DB = BetterSQLite3Database<typeof schema>;

   export const db: DB = drizzle(sqliteDb, { schema });
   ```

3. **FTS5 쿼리 (Raw SQL)**
   ```typescript
   // Drizzle은 FTS5를 완벽히 지원하지 않으므로 raw SQL 사용
   const results = db.run(sql`
     SELECT * FROM documents
     JOIN documents_fts ON documents.id = documents_fts.rowid
     WHERE documents_fts MATCH ${query}
   `);
   ```

4. **sql<number> 캐스팅**
   ```typescript
   // 타입 안전성을 위해 명시적 캐스팅
   const count = db.select({
     viewCount: sql<number>`CAST(view_count AS INTEGER)`,
   }).from(documents);
   ```

### 마크다운 렌더링 라이브러리 선택

| 라이브러리 | 장점 | 단점 | 추천 |
|-----------|------|------|------|
| **react-markdown** | GFM 플러그인 지원, 가볍음 | 커스터마이징 제한 | ⭐ MVP에 추천 |
| **markdown-it** | 매우 커스터마이징 가능 | JS 라이브러리 (React 컴포넌트 아님) | 고급 기능 필요 시 |
| **remark + rehype** | 플러그인 시스템 강력 | 학습 곡선 높음 | 장기 프로젝트용 |
| **unified** | 매우 확장 가능 | 복잡함 | 엔터프라이즈용 |

**MVP 선택**: `react-markdown` + `remark-gfm` + `react-syntax-highlighter`

### WAL 모드 활성화

```typescript
import Database from 'better-sqlite3';

const sqlite = new Database(process.env.DATABASE_URL);
sqlite.pragma('journal_mode = WAL');  // 동시성 및 성능 향상

export const db = drizzle(sqlite, { schema });
```

---

## 마일스톤 요약

| Sprint | 주제 | 핵심 산출물 | 예상 완료율 |
|--------|------|-----------|----------|
| 0 | 셋업 | Next.js 프로젝트, 개발 환경 | 5% |
| 1 | DB & Repository | SQLite 스키마, CRUD 레이어 | 25% |
| 2 | 에디터 & 뷰어 | 마크다운 에디터, 렌더러 | 50% |
| 3 | 네비게이션 | 폴더 트리, 대시보드 | 70% |
| 4 | 검색 & 버전 | FTS5 검색, Diff 뷰 | 90% |
| 5 | 통계 & 마무리 | 대시보드, 테스트, 배포 | 100% |

---

## 위험 요소 & 완화 전략

| 위험 | 영향 | 확률 | 완화 전략 |
|-----|------|------|---------|
| SQLite 동시성 문제 | 여러 사용자 편집 시 충돌 | 중 | WAL 모드, 페이지 잠금 구현 |
| FTS5 성능 저하 | 10,000개 문서 이상에서 느림 | 낮음 | 인덱싱 최적화, 페이지네이션 |
| 마크다운 렌더링 XSS | 보안 취약점 | 중 | sanitize-html 라이브러리 사용 |
| 이미지 저장 용량 증가 | 저장 공간 부족 | 중 | 이미지 최적화, 용량 제한 설정 |
| Next.js 버전 호환성 | 라이브러리 충돌 | 낮음 | 정기적인 의존성 업데이트 검토 |

---

## 기타 팁

- 정기적인 데이터베이스 백업 (매주)
- 로컬 개발 시 `.env.local` 사용 (버전 관리 제외)
- PR 리뷰 체계 구축 (최소 1명)
- 사용자 피드백 수집 (Beta 사용자 모집)
