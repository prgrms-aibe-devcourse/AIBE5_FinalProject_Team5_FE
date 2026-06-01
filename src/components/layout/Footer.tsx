import favicon from '../../assets/bootsignal_fabicon.png'

const serviceLinks = ['과정 탐색', '게시판', 'Q&A', '모집', '아티클']
const infoLinks = ['이용약관', '개인정보처리방침']
const supportLinks = ['고객센터', '문의하기']

const linkColumns = [
  { title: '서비스', links: serviceLinks },
  { title: '정보', links: infoLinks },
  { title: '고객지원', links: supportLinks },
]

export default function Footer() {
  return (
    <footer className="w-full min-w-desktop bg-deepOceanNavy px-6 py-12 font-pretendard text-foamWhite md:px-12 md:py-16">
      <div className="mx-auto w-full max-w-desktop-content">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="flex max-w-md flex-col gap-16 md:min-h-44 md:justify-between">
            <div className="flex items-center gap-2 text-base leading-snug md:text-lg">
              <img src={favicon} alt="BootSignal logo" className="h-[1.5lh] w-auto shrink-0" />
              <p>BOOTSIGNAL | 후기 데이터 기반 비사정 플랫폼</p>
            </div>
            <div className="space-y-1.5 text-sm leading-relaxed">
              <p>주소 | 서울특별시 서초구 반포대로 45 4층</p>
              <p>Designed &amp; Developed by AIBE5 Final Project Team 1</p>
              <p>COPYRIGHT © 2026 BOOTSIGNAL. All rights reserved.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 md:gap-3">
            {linkColumns.map(({ title, links }) => (
              <div key={title} className="space-y-3">
                <p className="text-base font-semibold">{title}</p>
                <ul className="space-y-2">
                  {links.map((label) => (
                    <li key={label}>
                      <a href="/" className="text-sm transition-colors hover:text-waterlineBlue">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
