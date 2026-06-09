import { useMemo, useState } from 'react'
import { getMockComments } from '../data/mockComments'

// ISO 형식의 현재 날짜를 반환하는 유틸
function isoNow() { 
  return new Date().toISOString()
}

// ISO 형식의 날짜를 `방금`, `분 전`, `시간 전`, `일 전` 형태로 표시하기 위한 유틸
function formatRelative(iso: string) { 
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '방금'
  if (diffMin < 60) return `${diffMin}분 전`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}시간 전`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}일 전`
}

// 커뮤니티 댓글 섹션 컴포넌트 타입
type CommunityCommentsSectionProps = {
  resourceKey: string
}

// 커뮤니티 상세 페이지 댓글 섹션 컴포넌트
export default function CommunityCommentsSection({ resourceKey }: CommunityCommentsSectionProps) {
  const seeded = useMemo(() => getMockComments(resourceKey), [resourceKey])

  const [comments, setComments] = useState(seeded)
  const [value, setValue] = useState('')

  const handleSubmit = () => { // 댓글 등록 핸들러
    const content = value.trim()
    if (!content) return

    const next = {
      id: `${resourceKey}-${Date.now()}`,
      author: '나',
      content,
      createdAt: isoNow(),
    }

    setComments((prev) => [next, ...prev])
    setValue('')
  }

  return (
    <section aria-label="댓글" className="space-y-5">
      
      {/* 댓글 헤더 */}
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-base font-semibold text-deepOceanNavy">댓글</h3>
        <p className="text-sm text-secondary tabular-nums">총 {comments.length}개</p>
      </div>

      {/* 댓글 입력 폼 */}
      <div className="rounded-xl border border-mistSkyBlue/45 bg-foamWhite/30 p-4 md:p-5">
        <label className="sr-only" htmlFor="community-comment-input">
          댓글 입력
        </label>
        <textarea
          id="community-comment-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="댓글을 입력하세요"
          rows={3}
          className="w-full resize-none rounded-lg border border-mistSkyBlue/45 bg-white px-3 py-2.5 text-sm leading-relaxed text-deepOceanNavy outline-none transition-colors placeholder:text-softAquaBlue focus:border-waterlineBlue"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-waterlineBlue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#005EB8]"
          >
            등록
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      {comments.length === 0 ? ( // 댓글 목록이 없으면
        <p className="rounded-xl border border-mistSkyBlue/35 bg-white/20 px-4 py-6 text-center text-sm text-secondary">
          아직 댓글이 없습니다.
        </p>
      ) : ( // 댓글 목록이 있으면
        <ul className="divide-y divide-mistSkyBlue/35 rounded-xl border border-mistSkyBlue/35 bg-white/20">
          {comments.map((comment) => ( // 댓글 목록 아이템
            <li key={comment.id} className="px-4 py-4 md:px-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-deepOceanNavy/85">{comment.author}</span> {/* 댓글 작성자 */}
                <time dateTime={comment.createdAt} className="text-xs text-softAquaBlue"> {/* 댓글 작성일 */} 
                  {formatRelative(comment.createdAt)}
                </time>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-deepOceanNavy/90">{comment.content}</p> {/* 댓글 내용 */}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

