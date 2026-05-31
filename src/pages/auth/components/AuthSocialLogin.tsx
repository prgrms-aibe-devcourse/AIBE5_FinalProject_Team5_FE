import googleIcon from '../../../assets/icons/Google.png'
import kakaoIcon from '../../../assets/icons/kakao.png'

const providers = [
  { name: 'Google', icon: googleIcon },
  { name: 'Kakao', icon: kakaoIcon },
] as const

/** Google · Kakao 소셜 로그인 버튼 */
export default function AuthSocialLogin() {
  return (
    <div className="flex items-center justify-center gap-5">
      {providers.map(({ name, icon }) => (
        <button
          key={name}
          type="button"
          aria-label={`${name} 로그인`}
          className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-mistSkyBlue transition-shadow hover:shadow-md"
        >
          <img src={icon} alt="" className="h-full w-full object-contain p-2" />
        </button>
      ))}
    </div>
  )
}
