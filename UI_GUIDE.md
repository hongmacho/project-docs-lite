# ProjectWiki - UI/UX 가이드

**목표**: 간단하면서도 전문적인 문서 도구다운 디자인  
**기반**: shadcn/ui + Tailwind CSS v4  
**색상**: Neutral + Slate 기반의 차분한 톤

---

## 1. 색상 팔레트

### Primary Color (주색)

문서 도구다운 차분한 블루-그레이 톤:

```typescript
const colors = {
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',   // Main brand color
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',   // Success (저장 완료, 링크 추가)
    600: '#16a34a',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',   // Warning (미저장, 변경 사항)
    600: '#d97706',
  },

  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',   // Error (삭제, 오류)
    600: '#dc2626',
  },

  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};
```

### 사용 규칙

- **Primary (Slate 500)**: 주요 버튼, 링크, 강조
- **Accent (Green 500)**: 저장 완료, 활성 상태, 성공 피드백
- **Warning (Amber 500)**: 변경 사항 있음, 경고
- **Danger (Red 500)**: 삭제, 오류, 위험
- **Neutral (Gray 500~900)**: 텍스트, 배경, 구분선

### 다크 모드

Tailwind의 `dark:` 클래스로 다크 모드 자동 지원:

```css
/* 라이트 모드 */
.bg-white text-slate-900

/* 다크 모드 */
dark:bg-slate-900 dark:text-slate-50
```

---

## 2. 타이포그래피

### 폰트 스택

```typescript
// globals.css 또는 CSS 변수
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

/* 본문 */
font-family: 'Inter', sans-serif;

/* 코드 */
font-family: 'JetBrains Mono', monospace;
```

### 크기 및 가중치

| 용도 | 크기 | 가중치 | 예시 |
|-----|------|--------|------|
| 페이지 제목 | 32px | 700 | 문서 제목, 페이지 헤더 |
| 섹션 제목 | 24px | 600 | 주요 섹션, 모달 제목 |
| 부제 | 18px | 600 | 대시보드 카드 제목 |
| 본문 | 16px | 400 | 일반 텍스트, 마크다운 렌더링 |
| 라벨 | 14px | 500 | 폼 라벨, 버튼 텍스트 |
| 작은 텍스트 | 12px | 400 | 설명, 메타정보 (변경 시간 등) |
| 코드 | 13px | 400 | 코드 블록 |

---

## 3. 컴포넌트 목록 (shadcn/ui)

### 기본 컴포넌트

#### 버튼 (Button)
```tsx
import { Button } from '@/components/ui/button';

// 기본 버튼
<Button>저장</Button>

// 바리에이션
<Button variant="default">기본</Button>
<Button variant="secondary">보조</Button>
<Button variant="outline">테두리</Button>
<Button variant="ghost">고스트</Button>
<Button variant="destructive">삭제</Button>

// 크기
<Button size="sm">작음</Button>
<Button size="default">기본</Button>
<Button size="lg">큼</Button>

// 상태
<Button disabled>비활성</Button>
<Button isLoading>저장 중...</Button>
```

#### 입력 필드 (Input)
```tsx
import { Input } from '@/components/ui/input';

<Input 
  placeholder="문서 제목을 입력하세요"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

#### 텍스트 영역 (Textarea)
```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea 
  placeholder="마크다운 형식으로 입력하세요"
  rows={20}
  value={content}
  onChange={(e) => setContent(e.target.value)}
/>
```

#### 카드 (Card)
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>최근 문서</CardTitle>
    <CardDescription>지난 7일간 수정된 문서</CardDescription>
  </CardHeader>
  <CardContent>
    {/* 콘텐츠 */}
  </CardContent>
</Card>
```

#### 드롭다운 메뉴 (DropdownMenu)
```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">메뉴</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>이름 변경</DropdownMenuItem>
    <DropdownMenuItem>삭제</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### 모달 (Dialog)
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>새 문서</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>새 문서 만들기</DialogTitle>
      <DialogDescription>문서명을 입력하세요</DialogDescription>
    </DialogHeader>
    {/* 폼 */}
  </DialogContent>
</Dialog>
```

#### 토글 버튼 (Toggle)
```tsx
import { Toggle } from '@/components/ui/toggle';

<Toggle 
  pressed={isPublic}
  onPressedChange={setIsPublic}
>
  공개
</Toggle>
```

#### 배지 (Badge)
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">생성</Badge>
<Badge variant="secondary">수정</Badge>
<Badge variant="outline">초안</Badge>
```

#### 스핀너 (Spinner)
```tsx
// 커스텀 구현 또는 lucide-react 아이콘 활용
import { Loader } from 'lucide-react';

<Loader className="animate-spin" />
```

#### 토스트 알림 (Toast)
```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  title: '저장되었습니다',
  description: '문서가 저장되었습니다.',
  duration: 3000,
});

// Destructive
toast({
  title: '오류',
  description: '저장할 수 없습니다.',
  variant: 'destructive',
});
```

#### 스켈레톤 로더 (Skeleton)
```tsx
import { Skeleton } from '@/components/ui/skeleton';

<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-4/5" />
</div>
```

### 폼 컴포넌트

#### Form (react-hook-form + shadcn)
```tsx
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const form = useForm({
  defaultValues: { title: '', isPublic: false },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>제목</FormLabel>
          <FormControl>
            <Input placeholder="문서 제목" {...field} />
          </FormControl>
          <FormDescription>문서의 제목을 입력하세요</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">저장</Button>
  </form>
</Form>
```

---

## 4. 레이아웃 구조

### 메인 레이아웃 (3-Pane)

```
┌────────────────────────────────────────────────────────────────┐
│                         헤더 (Header)                           │
│  [로고] [검색 바] [프로필 메뉴] [테마 토글]                     │
├──────────────────┬─────────────────────────────────────────────┤
│                  │                                             │
│   사이드바        │        메인 콘텐츠 영역                    │
│  (240px 고정)    │                                             │
│                  │  ┌─────────────────────────────────────┐  │
│  • 최근 문서     │  │  페이지 제목 입력                  │  │
│  • 모든 페이지   │  ├─────────────────────────────────────┤  │
│  • 📁 폴더 1     │  │ 좌측 에디터 │ 우측 미리보기         │  │
│    ├─ 페이지 A   │  │            │                        │  │
│    └─ 페이지 B   │  │  마크다운   │ HTML 렌더링           │  │
│  • 📁 폴더 2     │  │   입력      │                        │  │
│                  │  │            │                        │  │
│                  │  └─────────────────────────────────────┘  │
│  [설정]          │                                             │
└──────────────────┴─────────────────────────────────────────────┘
```

### 반응형 레이아웃

#### 데스크톱 (1024px+)
- 사이드바 고정 (240px)
- 3-pane 레이아웃 (에디터 좌측, 미리보기 우측)

#### 태블릿 (768px ~ 1024px)
- 사이드바 콜렉스 (토글 아이콘)
- 2-pane 레이아웃 유지

#### 모바일 (< 768px)
- 1-pane 레이아웃 (에디터만 표시)
- 사이드바는 드로어 (햄버거 메뉴)
- 미리보기는 탭 전환

---

## 5. 화면별 와이어프레임 & UI

### 화면 1: 대시보드 (`/`)

**목적**: 프로젝트 개요 및 빠른 접근

```
┌─────────────────────────────────────────────────────────────┐
│ ProjectWiki Dashboard                              [⚙️] [🌙] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │📄 문서 개수     │  │📁 폴더 개수     │  │📝 총 단어   │ │
│  │  45개           │  │  8개            │  │  12,543개   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 최근 수정된 문서 (TOP 5)                                 │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ • 온보딩 가이드          2시간 전    👁️ 234            │ │
│  │ • API 문서              4시간 전    👁️ 156            │ │
│  │ • 배포 체크리스트       1일 전     👁️ 89             │ │
│  │ • 팀 규칙               2일 전     👁️ 67             │ │
│  │ • 기술 스택             3일 전     👁️ 45             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │ 가장 많이 본 페이지   │  │ 주별 문서 생성 수           │ │
│  ├──────────────────────┤  ├──────────────────────────────┤ │
│  │ 1. API 문서    (312) │  │ [라인 차트]                 │ │
│  │ 2. FAQ         (234) │  │    Mon Tue Wed ...          │ │
│  │ 3. 온보딩      (189) │  │                             │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**주요 요소**:
- 통계 카드 4개 (문서, 폴더, 단어, 마지막 수정)
- 최근 문서 목록 (타임스탬프, 조회수)
- 차트 2개 (라인: 생성 수, 원형: 폴더별 분포)

---

### 화면 2: 마크다운 에디터 (`/editor/[slug]`)

**목적**: 문서 작성 및 실시간 미리보기

```
┌─────────────────────────────────────────────────────────────┐
│ ProjectWiki                        [🔍] [⚙️] [🌙] [👤]    │
├──────────────────┬──────────────────────────────────────────┤
│  📁 폴더 구조     │  제목: [____________________] [공개 🔓] │
│                  ├────────────────────────────────────────┤
│  • 📄 페이지 A   │                                        │
│  • 📄 페이지 B   │ 좌측 에디터          │ 우측 미리보기  │
│                  │ ─────────────────────┼────────────────│
│  📁 섹션         │                      │                │
│  ├─ 📄 페이지 C  │ # 문서 제목          │ 문서 제목      │
│  ├─ 📄 페이지 D  │                      │ ═══════════    │
│  └─ 📄 페이지 E  │ 마크다운 입력...     │                │
│                  │                      │ 마크다운 입력  │
│  ⭐ 즐겨찾기     │ ## 섹션 1            │ ...            │
│  • 온보딩        │                      │                │
│                  │ 본문 내용            │ 섹션 1         │
│  [+ 새 페이지]   │                      │ ──────         │
│  [+ 새 폴더]     │ ## 섹션 2            │ 본문 내용      │
│                  │                      │                │
│                  │ 더 많은 내용...      │ 섹션 2         │
│                  │                      │ ──────         │
│                  │                      │ 더 많은 내용.. │
│  [⚙️ 설정]       │  [저장됨] ✓          │                │
└──────────────────┴────────────────────────────────────────┘
```

**주요 요소**:
- 제목 입력 필드
- 공개/비공개 토글
- 좌측: Textarea로 마크다운 입력
- 우측: HTML 렌더링 프리뷰
- 하단: 저장 상태 표시
- 목차(TOC) 미니맵 (오른쪽 끝)

**상호작용**:
- 입력 시 실시간 미리보기 업데이트
- 1초 debounce 후 자동 저장
- 저장 상태 변화: "저장 중..." → "저장됨" (체크 아이콘)
- 변경사항 있음: "저장됨" → 노란색 "변경 사항 있음"

---

### 화면 3: 읽기 뷰 (`/view/[slug]`)

**목적**: 문서 읽기 (편집 불가)

```
┌─────────────────────────────────────────────────────────────┐
│ ProjectWiki                        [🔍] [⚙️] [🌙] [👤]    │
├──────────────────┬──────────────────────────────────────────┤
│  📁 폴더 구조    │                                          │
│                  │  [← 뒤로] [✏️ 편집] [⋮ 메뉴]           │
│  • 📄 페이지 A   │  ────────────────────────────────────   │
│  • 📄 페이지 B   │                                          │
│  (현재)          │  # 문서 제목                             │
│                  │  작성자: John | 수정: 2시간 전          │
│  📁 섹션         │  ────────────────────────────────────   │
│  ├─ 📄 페이지 C  │                                          │
│  ├─ 📄 페이지 D  │  ## 목차                                 │
│  └─ 📄 페이지 E  │  1. 섹션 1                              │
│                  │  2. 섹션 2                              │
│  ⭐ 즐겨찾기     │  3. 참고                                 │
│                  │  ────────────────────────────────────   │
│                  │                                          │
│  [+ 새 페이지]   │  ## 섹션 1                              │
│  [+ 새 폴더]     │  본문 내용...                            │
│                  │                                          │
│  [⚙️ 설정]       │  ## 섹션 2                              │
│                  │  본문 내용...                            │
│                  │                                          │
│                  │  ────────────────────────────────────   │
│                  │  ### 백링크 (이 페이지를 참조하는 문서)   │
│                  │  • API 문서                              │
│                  │  • 온보딩 가이드                        │
│                  │                                          │
└──────────────────┴────────────────────────────────────────┘
```

**주요 요소**:
- 풀 너비 콘텐츠 (에디터보다 넓음)
- 목차(TOC) 및 앵커 링크
- 작성자 & 수정 시간 메타정보
- 백링크 섹션 (이 페이지를 링크하는 다른 문서들)
- 편집 버튼 (에디터로 이동)
- 메뉴 버튼 (공유, 버전 이력, 삭제)

---

### 화면 4: 검색 결과 (`/search?q=...`)

**목적**: 전문 검색 결과 표시

```
┌─────────────────────────────────────────────────────────────┐
│ ProjectWiki                        [🔍] [⚙️] [🌙] [👤]    │
├──────────────────┬──────────────────────────────────────────┤
│  📁 폴더 구조    │  [🔍 검색]  [API 인증]                   │
│                  │  검색 결과: 12개                         │
│  ⭐ 즐겨찾기    │  [관련도 ▼] [최근 수정 ▼]                │
│                  │  ────────────────────────────────────   │
│  🔍 최근 검색     │                                          │
│  • API 인증      │  ✓ API 인증 가이드                      │
│  • 배포          │  /docs/api-auth                         │
│  • 설정          │  ...사용자 인증을 위한 OAuth 2.0       │
│                  │  설정 방법을 설명합니다...              │
│  [+ 새 페이지]   │                                          │
│                  │  ✓ 백엔드 API 명세서                    │
│                  │  /docs/backend/api-spec                │
│                  │  ...인증(authorization)을 위해 API   │
│                  │  키를 헤더에 포함해야 합니다...        │
│                  │                                          │
│  [⚙️ 설정]       │  ✓ 프론트엔드 인증 모듈                │
│                  │  /src/auth/index                       │
│                  │  ...토큰 인증 로직 구현 가이드...      │
│                  │                                          │
│                  │  ✓ 배포 체크리스트                     │
│                  │  /docs/deployment                      │
│                  │  ...프로덕션 환경 인증 설정이          │
│                  │  필요합니다...                         │
│                  │                                          │
│                  │  [더 불러오기]                         │
│                  │                                          │
└──────────────────┴────────────────────────────────────────┘
```

**주요 요소**:
- 검색 입력 필드 (헤더)
- 검색 결과 수 표시
- 정렬 필터 (관련도, 최근 수정, 조회수)
- 각 결과 항목:
  - 제목 + 경로
  - 매칭된 컨텍스트 스니펫 (검색어 하이라이트)
  - 관련도 점수 (선택)
- 최근 검색 목록 (사이드바)
- 페이지네이션 또는 무한 스크롤

---

### 화면 5: 변경 이력 (`/editor/[slug]/history`)

**목적**: 문서 버전 추적 및 복원

```
┌─────────────────────────────────────────────────────────────┐
│ ProjectWiki                        [🔍] [⚙️] [🌙] [👤]    │
├──────────────────┬──────────────────────────────────────────┤
│  📁 폴더 구조    │  온보딩 가이드 > 변경 이력               │
│                  │  ────────────────────────────────────   │
│  • 📄 페이지 A   │                                          │
│  (현재)          │  총 15개의 변경                          │
│                  │  ────────────────────────────────────   │
│  📁 섹션         │                                          │
│                  │  ⏱️ 2024-07-02 14:30  [최신]            │
│                  │     수정됨 (+120 단어, -45 단어)        │
│                  │     [diff 보기] [이 버전으로 복원]      │
│                  │                                          │
│                  │  ⏱️ 2024-07-02 10:15                    │
│                  │     수정됨 (+50 단어)                   │
│                  │     [diff 보기] [이 버전으로 복원]      │
│                  │                                          │
│                  │  ⏱️ 2024-07-01 16:00                    │
│                  │     생성됨                              │
│                  │     [diff 보기]                         │
│                  │                                          │
│                  │  [더 보기]                              │
│                  │                                          │
└──────────────────┴────────────────────────────────────────┘
```

**주요 요소**:
- 타임라인 (시간순 역순)
- 각 버전 항목:
  - 타임스탬프
  - 변경 유형 (생성/수정/삭제)
  - 변경 통계 (+/-단어 수)
  - Diff 보기 버튼
  - 복원 버튼 (최신 버전 제외)
- "최신" 배지
- 페이지네이션

---

### 화면 6: 설정 (`/settings`)

**목적**: 프로젝트 및 사용자 설정

```
┌─────────────────────────────────────────────────────────────┐
│ ProjectWiki Settings               [🔍] [⚙️] [🌙] [👤]    │
├──────────────────┬──────────────────────────────────────────┤
│  📁 폴더 구조    │  ⚙️ 설정                                │
│                  │  ────────────────────────────────────   │
│                  │                                          │
│                  │  ## 프로젝트 설정                        │
│                  │  프로젝트 이름                          │
│                  │  [ProjectWiki Demo_____________________]│
│                  │                                          │
│                  │  프로젝트 설명                          │
│                  │  [내 문서 프로젝트를 정리하는 위키...] │
│                  │                                          │
│                  │  로컬 마크다운 폴더 경로                │
│                  │  [/Users/john/docs/my-project______] [📁]│
│                  │  ⓘ 이 폴더의 .md 파일이 자동 로드됩니다│
│                  │                                          │
│                  │  ## 사용자 설정                          │
│                  │  테마                                   │
│                  │  ◉ 라이트  ○ 다크  ○ 자동              │
│                  │                                          │
│                  │  자동 저장 간격                         │
│                  │  [1000_] ms                             │
│                  │                                          │
│                  │  언어                                   │
│                  │  [한국어 ▼]                             │
│                  │                                          │
│                  │  ## 데이터 관리                          │
│                  │  [📥 모든 문서 내보내기]  [ZIP]         │
│                  │  [💾 데이터베이스 백업]                 │
│                  │  [🗑️ 모든 데이터 초기화]  ⚠️          │
│                  │                                          │
│                  │  [저장하기] [취소]                      │
│                  │                                          │
└──────────────────┴────────────────────────────────────────┘
```

**주요 요소**:
- 프로젝트 정보 (이름, 설명)
- 폴더 경로 입력 + 파일 선택 버튼
- 테마 선택 (라디오 버튼)
- 자동 저장 간격 입력
- 언어 선택 드롭다운
- 데이터 관리 버튼들
- 저장/취소 버튼

---

## 6. 상태별 UI

### 6.1 빈 상태 (Empty State)

**문서 없을 때**:
```
┌────────────────────────────────────────┐
│                                        │
│           📄                           │
│                                        │
│   문서가 없습니다                      │
│                                        │
│   처음 시작하시나요?                   │
│   새 문서를 만들어 보세요.             │
│                                        │
│         [+ 새 문서]                    │
│                                        │
└────────────────────────────────────────┘
```

**검색 결과 없을 때**:
```
┌────────────────────────────────────────┐
│   🔍                                   │
│                                        │
│   검색 결과가 없습니다                 │
│                                        │
│   다른 검색어를 시도해보세요.          │
│                                        │
│   💡 검색 팁:                          │
│   • 제목과 본문에서 검색합니다         │
│   • 공백으로 여러 단어 검색 가능       │
│                                        │
└────────────────────────────────────────┘
```

### 6.2 로딩 상태 (Skeleton)

**문서 로딩**:
```
┌────────────────────────────────────────┐
│ [████████████████████] (제목)          │
│                                        │
│ [██████████] [██████] [████████]       │
│                                        │
│ [████████████████████████████████]     │
│ [████████████████████████████████]     │
│ [████████████████████████]             │
│                                        │
│ [████████████████████████████████]     │
│ [████████████████████████████████]     │
│                                        │
└────────────────────────────────────────┘
```

**검색 결과 로딩**:
```
┌────────────────────────────────────────┐
│ 🔄 검색 중...                          │
│                                        │
│ [██████████████████████████████] 100%  │
│                                        │
└────────────────────────────────────────┘
```

### 6.3 오류 상태 (Error State)

**문서 로드 실패**:
```
┌────────────────────────────────────────┐
│           ⚠️                           │
│                                        │
│   문서를 불러올 수 없습니다            │
│                                        │
│   오류: 파일을 읽을 수 없습니다        │
│                                        │
│         [다시 시도]  [이전 페이지로]   │
│                                        │
└────────────────────────────────────────┘
```

**저장 실패**:
```
┌────────────────────────────────────────┐
│ ❌ 저장 실패                           │
│ 네트워크 오류가 발생했습니다.          │
│                                        │
│                            [다시 시도] │
│                                        │
└────────────────────────────────────────┘
```

### 6.4 중간 상태 (Transition)

**저장 진행도**:
```
저장 중...    → ✓ 저장됨    → 변경 사항 있음
```

**페이지 이동**:
```
현재 페이지 ─[페이드 아웃]─> 로딩 중... ─[페이드 인]─> 새 페이지
```

---

## 7. 반응형 디자인 전략

### 미디어 쿼리 정의

```typescript
// tailwind.config.ts
const config = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
};
```

### 레이아웃 변경

| 화면 크기 | 사이드바 | 에디터 레이아웃 | 미리보기 |
|---------|---------|----------------|--------|
| 데스크톱 (1024px+) | 고정 (240px) | 3-pane (좌우 분할) | 우측 패널 |
| 태블릿 (768px~1024px) | 토글 드로어 | 2-pane (상하 분할 옵션) | 탭 전환 |
| 모바일 (< 768px) | 햄버거 메뉴 | 1-pane (에디터만) | 탭 전환 |

### 컴포넌트별 반응형

```tsx
// 예시: 사이드바
<aside className="hidden lg:block w-60 fixed bg-white">
  {/* 데스크톱에만 표시 */}
</aside>

<button className="lg:hidden" onClick={toggleSidebar}>
  {/* 모바일에만 표시 */}
</button>

// 예시: 에디터 레이아웃
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {/* 모바일: 1열, 데스크톱: 2열 */}
  <textarea className="col-span-1" />
  <div className="col-span-1 hidden lg:block" />
</div>
```

### 터치 최적화

```tsx
// 모바일에서 탭 대상 최소 44x44px
<button className="min-h-11 min-w-11" />

// 모바일에서 더 큰 타이핑 영역
<textarea className="text-base md:text-sm" />

// 모바일에서 햄버거 메뉴
<button className="md:hidden">☰</button>
```

---

## 8. 아이콘 및 Emoji 가이드

### Lucide React 아이콘 (권장)

```tsx
import { 
  Search, 
  FileText, 
  Folder, 
  Settings,
  Save,
  Edit,
  Trash,
  Share,
  Clock,
  Eye,
  Copy,
  MoreVertical,
} from 'lucide-react';

<Button variant="ghost">
  <Search className="w-4 h-4" />
</Button>
```

### Emoji 사용 (간단한 아이콘)

| 아이콘 | 용도 |
|--------|------|
| 📄 | 문서, 페이지 |
| 📁 | 폴더 |
| 🔍 | 검색 |
| ⚙️ | 설정 |
| 💾 | 저장 |
| ✏️ | 편집 |
| 🗑️ | 삭제 |
| 📋 | 복사 |
| 👁️ | 조회수 |
| ⏱️ | 시간, 타임스탬프 |
| ✓ | 성공, 완료 |
| ⚠️ | 경고, 주의 |
| ❌ | 오류 |
| 🌙 | 다크 모드 |
| ☀️ | 라이트 모드 |

---

## 9. 접근성 (Accessibility)

### 색상 대비

- 텍스트 vs 배경: 최소 4.5:1 (WCAG AA)
- UI 컴포넌트: 최소 3:1

```typescript
// 라이트 모드
text-slate-900 on bg-white       // 16:1 ✓
text-slate-600 on bg-slate-50    // 8.5:1 ✓

// 다크 모드
text-slate-50 on bg-slate-900    // 18:1 ✓
text-slate-300 on bg-slate-800   // 8:1 ✓
```

### ARIA 라벨

```tsx
// 버튼에 라벨 추가
<button aria-label="문서 저장">💾</button>

// 입력 필드 라벨
<label htmlFor="title">제목</label>
<input id="title" />

// 아이콘 버튼 (시각적 라벨 없음)
<button aria-label="메뉴 열기">⋮</button>
```

### 키보드 네비게이션

```tsx
// Tab 순서 관리
<input tabIndex={0} />
<button tabIndex={0} />

// 포커스 스타일
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500" />

// 로컬 단축키 (선택)
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveDocument();
    }
  };
  window.addEventListener('keydown', handleKeyPress);
}, []);
```

### 스크린 리더

```tsx
// Live region (동적 알림)
<div role="status" aria-live="polite">
  저장되었습니다
</div>

// Skip link (페이지 처음부터 시작)
<a href="#main-content" className="sr-only">
  주요 콘텐츠로 이동
</a>

// Semantic HTML
<nav> {/* 네비게이션 */}
<main> {/* 주요 콘텐츠 */}
<article> {/* 문서 */}
<section> {/* 섹션 */}
```

---

## 10. 애니메이션 & 전환

### Transition 효과

```tsx
// 페이드 인/아웃
<div className="animate-fade-in" />

// 슬라이드
<div className="animate-slide-in-from-left" />

// 스핀 (로딩)
<div className="animate-spin" />
```

### tailwind.config.ts 커스터마이징

```typescript
const config = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-in-from-left': 'slideInFromLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
};
```

### 성능 최적화

```tsx
// 불필요한 애니메이션 비활성화 (prefers-reduced-motion)
<div className="motion-safe:animate-bounce motion-reduce:animate-none" />
```

---

## 체크리스트

UI 구현 시 다음을 확인하세요:

- [ ] shadcn/ui 컴포넌트 사용 (커스텀 최소화)
- [ ] 색상은 정의된 팔레트 사용
- [ ] 라이트/다크 모드 모두 테스트
- [ ] 모바일 (375px), 태블릿 (768px), 데스크톱 (1024px) 반응형 확인
- [ ] 마크다운 렌더링 XSS 방지 (sanitize-html)
- [ ] WCAG 2.1 AA 색상 대비 확인
- [ ] 키보드 네비게이션 테스트 (Tab, Enter, Esc)
- [ ] 스크린 리더 호환성 검증
- [ ] 로딩 및 에러 상태 UI 구현
- [ ] 토스트 알림 및 확인 대화상자 테스트
