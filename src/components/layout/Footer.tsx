import logo from '../../assets/bootsignal_transparent.png'

const serviceLinks = ['과정 탐색', '게시판', 'Q&A', '모집', '아티클']
const infoLinks = ['이용약관', '개인정보처리방침']
const supportLinks = ['고객센터', '문의하기']

export default function Footer() {
  return (
    <footer className="w-full bg-white px-6 py-8 md:px-12 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-md">
            <a href="/" className="inline-block">
              <img src={logo} alt="BootSignal" className="h-12 w-auto" />
            </a>
            <p className="mt-4 text-sm text-[#4a5568] font-pretendard">
              KDT 예비 수강생을 위한 후기 데이터 기반 의사결정 플랫폼
            </p>
          </div>

          <div className="grid grid-cols-3 gap-10">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[#2d3748] font-pretendard">서비스</p>
              {serviceLinks.map((label) => (
                <a key={label} href="/" className="block text-sm text-[#4a5568] hover:text-[#2f5fd0] font-pretendard">
                  {label}
                </a>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold text-[#2d3748] font-pretendard">정보</p>
              {infoLinks.map((label) => (
                <a key={label} href="/" className="block text-sm text-[#4a5568] hover:text-[#2f5fd0] font-pretendard">
                  {label}
                </a>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold text-[#2d3748] font-pretendard">고객지원</p>
              {supportLinks.map((label) => (
                <a key={label} href="/" className="block text-sm text-[#4a5568] hover:text-[#2f5fd0] font-pretendard">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-8 border-[#5b6575]" />

        <p className="text-center text-sm text-[#4a5568] font-pretendard">© 2026 InnerJoin</p>
      </div>
    </footer>
  )
}
