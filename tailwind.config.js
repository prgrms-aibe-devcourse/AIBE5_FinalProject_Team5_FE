/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 레이아웃(Header/Footer/Page) — (모바일은 desktop 미만 구간에서 추후 적응형 추가 예정)
      screens: {
        desktop: '1024px',
      },
      maxWidth: {
        'desktop-content': '1280px', // 데스크톱 (콘텐츠 영역) 최대 너비
        'desktop-site': '1920px',   // 데스크톱 (화면 전체) 최대 너비
        // 'mobile-view': '...',    // 추후 — 특정 비율 모바일 뷰 너비
      },
      minWidth: {
        desktop: '320px', // 데스크톱 개발 중 최소 너비 (추후 desktop/mobile 분리 예정)
        // mobile: '...',         // 추후 — desktop 미만 적응형 지원 너비
      },

      // 컬러
      colors: {
        // 배경
        deepOceanNavy: '#344A64', // 메인 버튼 색상
        waterlineBlue: '#5484B7', // 보조 버튼 색상
        softAquaBlue: '#8BB4D2',  // 중간 색상
        mistSkyBlue: '#BBD3E0',   // 하늘색 전경 색상
        foamWhite: '#DAE5EA',    // 화이트 대체 색상
          
        // 텍스트
        primary: '#344A64',
        secondary: '#5484B7',
        accent: '#8BB4D2',
        surface: '#BBD3E0',
        background: '#DAE5EA',
      },

      // 폰트
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        pretendard: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
