import { Link, useLocation } from 'react-router-dom'
import { communitySections, getCommunitySectionFromPath } from './communitySections'

// 커뮤니티 작성 페이지 컴포넌트 (게시판, Q&A, 모집)
export default function CommunityWritePage() {
  // 커뮤니티 작성 페이지 데이터
  const { pathname } = useLocation()
  const sectionKey = getCommunitySectionFromPath(pathname)

  if (!sectionKey) return null

  const section = communitySections[sectionKey]
  if (!('writeLabel' in section) || !('writePath' in section)) return null

  const titlePlaceholder =
    sectionKey === 'qna'
      ? '질문 제목을 입력하세요'
      : sectionKey === 'recruit'
        ? '모집 제목을 입력하세요'
        : '제목을 입력하세요'

  const bodyPlaceholder =
    sectionKey === 'qna'
      ? '궁금한 내용을 자세히 작성해 주세요.'
      : sectionKey === 'recruit'
        ? '모집 내용, 지원 방법, 마감일 등을 작성해 주세요.'
        : '내용을 작성해 주세요.'

  return (
    <div className="rounded-xl border border-mistSkyBlue/50 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-bold text-deepOceanNavy md:text-2xl">{section.writeLabel}</h2>
      <p className="mt-2 text-sm text-secondary">
        API 연동 전 작성 화면 자리입니다. 저장 기능은 추후 연결됩니다.
      </p>

      <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="community-write-title" className="text-sm font-semibold text-deepOceanNavy">
            제목
          </label>
          <input
            id="community-write-title"
            type="text"
            placeholder={titlePlaceholder}
            className="mt-2 w-full rounded-lg border border-mistSkyBlue/45 bg-white px-3 py-2.5 text-sm text-deepOceanNavy outline-none transition-colors placeholder:text-softAquaBlue focus:border-waterlineBlue"
          />
        </div>

        <div>
          <label htmlFor="community-write-body" className="text-sm font-semibold text-deepOceanNavy">
            내용
          </label>
          <textarea
            id="community-write-body"
            rows={12}
            placeholder={bodyPlaceholder}
            className="mt-2 w-full resize-y rounded-lg border border-mistSkyBlue/45 bg-white px-3 py-2.5 text-sm leading-relaxed text-deepOceanNavy outline-none transition-colors placeholder:text-softAquaBlue focus:border-waterlineBlue"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <Link
            to={section.listPath}
            className="inline-flex items-center justify-center rounded-lg border border-mistSkyBlue/60 bg-white px-4 py-2.5 text-sm font-semibold text-deepOceanNavy transition-colors hover:border-waterlineBlue hover:text-waterlineBlue"
          >
            취소
          </Link>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-waterlineBlue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005EB8]"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  )
}
