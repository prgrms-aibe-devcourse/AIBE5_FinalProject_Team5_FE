# ⚡ BootSignal (부트시그널) - Frontend

> KDT 예비 수강생을 위한 후기 데이터 기반 의사결정 플랫폼

---

## 🛠️ Tech Stack

* **Build Tool:** Vite v8.0
* **Library:** React v19.2
* **Language:** TypeScript v6.0
* **Styling:** Tailwind CSS v4.3 (`@tailwindcss/postcss`)
* **UI/Animation:** React Bits (인터랙티브 애니메이션 컴포넌트)
* **Environment:** Node.js v24+ / npm

---

## 📂 Project Structure

```text
AIBE5_FinalProject_Team5_FE/
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json                    # 패키지 관리
├── postcss.config.js               # Tailwind와 CSS 연결 플러그인 설정
├── tailwind.config.js              # Tailwind CSS v4 스타일 적용 범위 설정
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
├── node_modules/
│
├── public/                         # [정적] 로고, favicon 등
│
└── src/                            # [소스코드]
    ├── main.tsx                    # 앱 진입점
    ├── App.tsx                     # 페이지 이동(라우팅) 및 전체 화면 관리
    ├── index.css                   # Tailwind v4 전역 스타일시트
    │
    ├── assets/                     # [미디어] 코드 내에서 임포트할 이미지/아이콘
    │   └── icons/                  # 서비스 로고, 인증 뱃지 등 UI용 아이콘
    │
    ├── components/                 # [공통 UI] 2개 이상 페이지에서 공유하는 부품
    │   ├── common/                 # 버튼, 인풋, 모달, 통계 차트, React Bits 공통 효과 등 최소 단위
    │   └── layout/                 # 헤더, 푸터, 네비게이션바 등 고정 레이아웃
    │
    ├── pages/                      # [화면]
    │   ├── home/                   # 1. 메인 홈
    │   │   ├── components/         # 전용 UI 요소 (홈 전용 React Bits 포함)
    │   │   └── Page.tsx            # 화면
    │   │
    │   ├── courses/                # 2. 과정 조회
    │   │   ├── components/         # 전용 UI 요소 (과정 카드, 통계 그래프 등)
    │   │   └── Page.tsx            # 화면
    │   │
    │   ├── community/              # 3. 커뮤니티
    │   │   ├── components/         # 전용 UI 요소 (탭 전환기, 구인 카드 등)
    │   │   └── Page.tsx            # 화면
    │   │
    │   └── mypage/                 # 4. 마이페이지
    │       ├── components/         # 전용 UI 요소 (업로드존, 내 활동 탭 등)
    │       └── Page.tsx            # 화면
    │
    ├── hooks/                      # [커스텀 훅] 비즈니스 로직 분리
    ├── services/                   # [API 통신] 백엔드 및 AI 연동 함수
    ├── types/                      # [타입 정의]
    └── utils/                      # [공통 함수] 통계, 날짜 포맷터 등 가공 함수
```

---

## 🚀 실행 가이드

### 최초 프로젝트 환경 구축

레포지토리를 처음 Clone 하거나 최신 코드를 Pull 받은 뒤 패키지를 설치하는 단계입니다.

실행 명령어:

```bash
npm install
```

<br>

### 로컬 개발 서버 구동

HMR이 적용된 로컬 개발 서버를 실행합니다.

기본 실행 주소: `http://localhost:5173`

실행 명령어:

```bash
npm run dev
```

<br>

### 배포용 최적화 파일 빌드

상용 서버 업로드용 최적화 배포 폴더(`dist/`)를 생성합니다.

실행 명령어:

```bash
npm run build
```