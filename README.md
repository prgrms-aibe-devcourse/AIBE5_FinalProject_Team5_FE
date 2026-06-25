# BootSignal Frontend

<div align="center">

**"나와 비슷한 사람이 이 과정에서 살아남았는가?"**

> 부트캠프 예비 수강생이 자신과 비슷한 조건의 사람들이  
> 실제로 과정을 완주했는지, 어떤 어려움을 겪었는지,  
> 수강 후 어떤 결과를 얻었는지 확인할 수 있도록 돕는  
> **데이터 기반 부트캠프 의사결정 플랫폼**

</div>

<br>

## 📖 목차

1. [💡 서비스 소개](#-서비스-소개)
2. [🧑‍💻 팀 소개](#-팀-소개)
3. [🚀 주요 기능](#-주요-기능)
4. [🛠️ 기술 스택](#️-기술-스택)
5. [📂 프로젝트 구조](#-프로젝트-구조)
6. [⚙️ 실행 가이드](#️-실행-가이드)
7. [☁️ 배포](#️-배포)

<br>

## 💡 서비스 소개

부트캠프 수강을 고민하는 사람들이 가장 많이 찾는 정보는 **"나와 비슷한 사람이 실제로 어떤 경험을 했는가"** 입니다.

> 비전공자인 나도 완주할 수 있을까?  
> 직장을 다니면서 병행할 수 있는 강도일까?  
> 수료 후 실제로 취업이 됐을까?

사용자는 BootSignal에서 과정 탐색, 리뷰 작성, 수강 경험 공유를 하나의 흐름으로 이용할 수 있습니다.

### 프론트엔드가 담당하는 핵심 경험

- 조건별 리뷰 통계·수료율을 차트와 수치로 시각화
- 수강 인증 기반 신뢰 리뷰 작성·조회 플로우

<br>

## 🧑‍💻 팀 소개

| [![](https://avatars.githubusercontent.com/u/252306385?v=4)](https://github.com/Paley-Z) | [![](https://avatars.githubusercontent.com/u/115200565?v=4)](https://github.com/yongseong123) | [![](https://avatars.githubusercontent.com/u/126655454?v=4)](https://github.com/2mhh) | [![](https://avatars.githubusercontent.com/u/252306408?v=4)](https://github.com/hwangbohye03) | [![](https://avatars.githubusercontent.com/u/247369302?v=4)](https://github.com/holly000) |
|:---:|:---:|:---:|:---:|:---:|
| <p align="center">이상민</p> | <p align="center">최용성</p> | <p align="center">이민홍</p> | <p align="center">황보혜</p> | <p align="center">나윤하</p> |

<br>

## 🚀 주요 기능

- **🏠 메인 홈**
- **🔐 회원 / 인증**
- **📚 과정 탐색 / 비교**
- **⭐ 리뷰 / 통계**
- **📊 대시보드 (마이페이지)**
- **💬 커뮤니티**
- **📢 고객센터**
- **🛡️ 관리자**

<br>

## 🛠️ 기술 스택

| 영역 | 기술 |
|---|---|
| Framework | React 19, TypeScript 6 |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`) |
| Chart | Recharts |
| Icons | Lucide React |
| HTTP | Fetch API 기반 공통 `http` 클라이언트 (JWT · CSRF · 에러 리다이렉트) |
| State | React Context (`Bookmark`, `CompareCourses`) + 커스텀 훅 |
| Persistence | `localStorage` / `sessionStorage` (과정 비교, 최근 본 과정, 홈 인트로 재생 상태) |
| Infra | GitHub Actions, AWS S3, AWS CloudFront |
| Environment | Node.js 24+ / npm |

<br>

## 📂 프로젝트 구조

```text
AIBE5_FinalProject_Team5_FE/
├── .github/
│   └── workflows/
│       └── deploy-aws.yml          # CI/CD 배포
├── vite.config.ts                  # dev API 프록시
├── .env.example
│
└── src/
    ├── main.tsx                    # 앱 진입점
    ├── App.tsx                     # 라우팅
    ├── index.css
    │
    ├── components/
    │   ├── common/
    │   ├── layout/
    │   └── routing/                # 권한 가드
    │
    ├── contexts/                   # 전역 상태
    ├── hooks/
    │
    ├── pages/                      # 기능별 화면
    │   ├── auth/
    │   ├── course/
    │   ├── dashboard/
    │   ├── community/
    │   ├── support/
    │   ├── admin/
    │   └── ...
    │
    ├── services/                   # API 연동
    │   └── http.ts                 # 공통 HTTP 클라이언트
    │
    └── utils/
```

### 주요 라우트

| 경로 | 설명 | 접근 |
|---|---|---|
| `/` | 메인 홈 | 공개 |
| `/login`, `/signup` | 로그인 · 회원가입 | 공개 |
| `/forgot-password`, `/reset-password` | 비밀번호 찾기 · 재설정 | 공개 |
| `/auth/google/callback`, `/oauth/kakao/callback` | OAuth 콜백 | 공개 |
| `/courses` | 과정 검색 | 공개 |
| `/courses/:courseSessionId` | 과정 상세 | 공개 |
| `/courses/compare` | 과정 비교 (2~3개) | 공개 |
| `/dashboard` | 마이페이지 대시보드 | 로그인 필요 |
| `/dashboard/profile` | 프로필 · 계정 관리 | 로그인 필요 |
| `/dashboard/bookmarks` | 북마크 | 로그인 필요 |
| `/dashboard/posts` | 내가 쓴 글 | 로그인 필요 |
| `/dashboard/portfolio` | AI 포트폴리오 | 로그인 필요 |
| `/dashboard/inquiries` | 1:1 문의 | 로그인 필요 |
| `/community/posts` · `/qna` · `/recruit` · `/article` | 커뮤니티 | 공개 |
| `/support/notices` · `/certification` | 고객센터 | 공개 |
| `/admin` · `/admin/*` | 관리자 | ADMIN 역할 필요 |
| `/403`, `/404`, `/500` | 에러 페이지 | 공개 |


## ⚙️ 실행 가이드

### 사전 요구사항

- Node.js **24+**
- npm
- 로컬 API 연동 시 [백엔드](https://github.com/prgrms-aibe-devcourse/AIBE5_FinalProject_Team5_BE) 서버 실행 (`http://localhost:8080`)

### 1. 의존성 설치

레포지토리를 Clone 하거나 최신 코드를 Pull 받은 뒤 패키지를 설치합니다.

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 [`.env.example`](.env.example)을 참고해 값을 채웁니다.

| 변수 | 설명 |
|---|---|
| `VITE_API_BASE_URL` | 백엔드 API 베이스 URL (로컬 개발 시 비워두면 Vite `/api` 프록시 사용) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `VITE_GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret (개발용) |
| `VITE_KAKAO_CLIENT_ID` | Kakao REST API Key |

로컬 개발 시 `VITE_API_BASE_URL`을 비워 두면 `vite.config.ts`의 `/api` 프록시가 `http://localhost:8080`으로 요청을 전달합니다.

### 3. 백엔드 연동 후 로컬 개발 서버 실행

백엔드를 먼저 실행한 뒤, HMR이 적용된 프론트 개발 서버를 실행합니다.

```bash
npm run dev
```

기본 주소: `http://localhost:5173`

### 4. 프로덕션 빌드 · 미리보기

```bash
npm run build
npm run preview
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 5. 린트

```bash
npm run lint
```

<br>

## ☁️ 배포

`main` 브랜치 push 또는 GitHub Actions 수동 실행(`workflow_dispatch`) 시 아래 파이프라인으로 자동 배포됩니다.

**GitHub Actions → `npm run build` → AWS S3 → CloudFront 캐시 무효화**

워크플로: [`.github/workflows/deploy-aws.yml`](.github/workflows/deploy-aws.yml)

### GitHub Secrets (배포용)

| Secret | 용도 |
|---|---|
| `VITE_API_BASE_URL` | 빌드 시 API URL 주입 |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth |
| `VITE_GOOGLE_CLIENT_SECRET` | Google OAuth |
| `VITE_KAKAO_CLIENT_ID` | Kakao OAuth |
| `AWS_ACCESS_KEY_ID` | S3 · CloudFront 배포 |
| `AWS_SECRET_ACCESS_KEY` | S3 · CloudFront 배포 |
| `AWS_REGION` | AWS 리전 |
| `AWS_S3_BUCKET` | 정적 파일 업로드 버킷 |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | CDN 캐시 무효화 (선택) |

<br>

---

<div align="center">

_2026 프로그래머스 AIBE 5기 — Team 5_

</div>
