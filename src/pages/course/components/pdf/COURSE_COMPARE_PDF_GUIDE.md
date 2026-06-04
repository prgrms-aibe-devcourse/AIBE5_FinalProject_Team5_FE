# 과정 비교 PDF 출력 — 프론트 구현 가이드

## 개요

`PDF 출력` 버튼은 브라우저 인쇄(`window.print`)가 아니라 **`@react-pdf/renderer`로 A4 문서를 생성**해 다운로드합니다.  
화면 UI와 분리된 **문서 전용 레이아웃**이므로, 항목별 상세 비교 표를 표 형식으로 정리해 출력할 수 있습니다.

## 디렉터리 구조

```
src/pages/course/components/pdf/
├── COURSE_COMPARE_PDF_GUIDE.md   # 본 가이드
├── courseComparePdfTypes.ts        # PDF용 직렬화 타입
├── buildCourseComparePdfPayload.ts # 화면 데이터 → PDF payload
├── registerPdfFonts.ts             # 한글 폰트 등록 (Noto Sans KR)
├── CourseComparePdfDocument.tsx    # PDF 문서 레이아웃 (표·섹션)
└── downloadCourseComparePdf.tsx    # blob 생성 + 파일 다운로드
```

## 데이터 흐름

1. `CourseComparePage`에서 `courses`, `statsByColumn` 준비 (mock/API 동일 소스)
2. `buildCourseComparePdfPayload()`가 `COMPARE_TABLE_ROWS` / `groupCompareRows` 기준으로 **문자열 표 데이터** 생성
3. `CourseComparePdfDocument`가 payload만 받아 PDF 렌더
4. `downloadCourseComparePdf()`가 `.pdf` 파일 저장

화면 컴포넌트(`CourseCompareTable`)를 캡처하지 않습니다. **항목 정의는 `mockCourseCompare.ts` 한 곳**을 따릅니다.

## 문서 구성 (현재)

- 표지성 정보: 제목, 생성일시, 비교 대상 과정 목록
- **항목별 상세 비교**: 섹션(기본 정보, 모집 현황, …)마다
  - 섹션 제목 바
  - 표 헤더: `항목 | 과정 1 | 과정 2 | …`
  - 항목 행 + 통계 비교 행

비교 요약(막대 그래프)·상단 카드는 PDF에 넣지 않았습니다. 필요 시 `CourseComparePdfDocument`에 블록을 추가하면 됩니다.

## API 연동 시

`buildCourseComparePdfPayload` 입력만 실제 API 응답으로 바꾸면 됩니다.

```ts
// 예: compare API 응답을 CourseDetail[] 형태로 매핑 후
const payload = buildCourseComparePdfPayload(coursesFromApi, statsFromApi)
await downloadCourseComparePdf(payload)
```

표 항목을 바꿀 때는 **`mockCourseCompare.ts`의 `COMPARE_TABLE_ROWS`** 와 화면·PDF가 함께 갱신됩니다.

## 폰트

- `registerPdfFonts.ts`에서 **Noto Sans KR**(jsDelivr CDN) 등록
- 오프라인/방화벽 환경에서는 `public/fonts/`에 `.woff`를 두고 `src`를 로컬 경로로 변경하세요.

## 스타일 수정

- 색·여백: `CourseComparePdfDocument.tsx`의 `COLORS`, `StyleSheet`
- 페이지 나눔: 섹션 `wrap={false}` 조정 또는 행 단위 `wrap` 허용

## 의존성

- `@react-pdf/renderer`
- `@fontsource/noto-sans-kr` (CDN URL 참조용 버전 고정)

## 트러블슈팅

| 증상 | 확인 |
|------|------|
| 한글 깨짐 | `registerPdfFonts()` 호출 여부, CDN 차단 |
| 빈 PDF | payload `sections` 길이, 콘솔 에러 |
| 표 넘침 | 3과정 비교 시 글자 크기·열 너비(`valueColWidth`) 축소 |
