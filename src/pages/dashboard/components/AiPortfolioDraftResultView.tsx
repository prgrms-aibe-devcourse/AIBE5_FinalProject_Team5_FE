import { Check, Copy } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  buildPortfolioDraftSections,
  formatPortfolioDraftText,
  type PortfolioDraftProject,
  type PortfolioDraftResponse,
} from '../../../services/aiPortfolio'

type AiPortfolioDraftResultViewProps = {
  draft: PortfolioDraftResponse | null
  title?: string
  emptyMessage?: string
  className?: string
  scrollable?: boolean
  onCopyError?: (message: string) => void
}

function CopySectionButton({
  sectionId,
  copyText,
  copiedSectionId,
  onCopy,
  label,
  showLabel = false,
}: {
  sectionId: string
  copyText: string
  copiedSectionId: string | null
  onCopy: (sectionId: string, copyText: string) => void
  label?: string
  showLabel?: boolean
}) {
  const isCopied = copiedSectionId === sectionId
  const buttonLabel = label ?? (isCopied ? '복사됨' : '복사')

  return (
    <button
      type="button"
      onClick={() => onCopy(sectionId, copyText)}
      className={`inline-flex items-center rounded-lg border border-mistSkyBlue/60 bg-white font-pretendard text-[11px] font-semibold text-secondary transition-colors hover:border-waterlineBlue hover:bg-foamWhite hover:text-deepOceanNavy ${
        showLabel ? 'gap-1 px-2.5 py-1.5' : 'p-1.5'
      }`}
      aria-label={showLabel ? buttonLabel : `${sectionId} 복사`}
    >
      {isCopied ? (
        <Check className="h-3.5 w-3.5 text-waterlineBlue" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {showLabel ? buttonLabel : null}
    </button>
  )
}

function ProjectSectionContent({ project }: { project: PortfolioDraftProject }) {
  return (
    <dl className="space-y-2.5 font-pretendard text-sm leading-relaxed text-deepOceanNavy">
      {project.name?.trim() ? (
        <div>
          <dt className="text-xs font-semibold text-secondary">프로젝트명</dt>
          <dd className="mt-1">{project.name}</dd>
        </div>
      ) : null}
      {project.summary?.trim() ? (
        <div>
          <dt className="text-xs font-semibold text-secondary">요약</dt>
          <dd className="mt-1">{project.summary}</dd>
        </div>
      ) : null}
      {project.role?.trim() ? (
        <div>
          <dt className="text-xs font-semibold text-secondary">담당 역할</dt>
          <dd className="mt-1">{project.role}</dd>
        </div>
      ) : null}
      {project.techStack.length > 0 ? (
        <div>
          <dt className="text-xs font-semibold text-secondary">사용 기술</dt>
          <dd className="mt-1">{project.techStack.join(', ')}</dd>
        </div>
      ) : null}
      {project.highlights.length > 0 ? (
        <div>
          <dt className="text-xs font-semibold text-secondary">주요 성과</dt>
          <dd className="mt-1">
            <ul className="list-disc space-y-1 pl-4">
              {project.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </dd>
        </div>
      ) : null}
    </dl>
  )
}

export default function AiPortfolioDraftResultView({
  draft,
  title = '생성 결과',
  emptyMessage = '초안 생성 후 필드별 결과가 표시됩니다.',
  className = '',
  scrollable = true,
  onCopyError,
}: AiPortfolioDraftResultViewProps) {
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null)

  const sections = useMemo(() => (draft ? buildPortfolioDraftSections(draft) : []), [draft])
  const fullCopyText = useMemo(() => (draft ? formatPortfolioDraftText(draft) : ''), [draft])

  async function handleCopy(sectionId: string, copyText: string) {
    if (!copyText) return

    try {
      await navigator.clipboard.writeText(copyText)
      setCopiedSectionId(sectionId)
      window.setTimeout(() => {
        setCopiedSectionId((current) => (current === sectionId ? null : current))
      }, 1800)
    } catch {
      onCopyError?.('복사에 실패했습니다. 텍스트를 직접 선택해 복사해 주세요.')
    }
  }

  const containerClassName = scrollable ? 'flex min-h-0 flex-1 flex-col' : 'flex flex-col'
  const sectionsClassName = scrollable
    ? 'min-h-0 flex-1 space-y-3 overflow-y-auto pr-1'
    : 'space-y-3'

  if (!draft || sections.length === 0) {
    return (
      <div className={`${containerClassName} ${className}`.trim()}>
        <div className="mb-3 shrink-0">
          <h3 className="font-pretendard text-base font-bold text-deepOceanNavy">{title}</h3>
        </div>
        <div className="flex min-h-72 flex-1 items-center justify-center rounded-lg border border-dashed border-mistSkyBlue/60 bg-foamWhite/35 px-4 text-center">
          <p className="font-pretendard text-sm leading-relaxed text-secondary">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${containerClassName} ${className}`.trim()}>
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <h3 className="font-pretendard text-base font-bold text-deepOceanNavy">{title}</h3>
        <CopySectionButton
          sectionId="all"
          copyText={fullCopyText}
          copiedSectionId={copiedSectionId}
          onCopy={handleCopy}
          showLabel
          label={copiedSectionId === 'all' ? '복사됨' : '전체 복사'}
        />
      </div>

      <div className={sectionsClassName}>
        {sections.map((section) => (
          <section
            key={section.id}
            className="rounded-lg border border-mistSkyBlue/45 bg-white/75 p-3.5"
          >
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <h4 className="min-w-0 font-pretendard text-sm font-bold text-deepOceanNavy">{section.title}</h4>
              <CopySectionButton
                sectionId={section.id}
                copyText={section.copyText}
                copiedSectionId={copiedSectionId}
                onCopy={handleCopy}
              />
            </div>

            {section.kind === 'text' && section.text ? (
              <p className="whitespace-pre-wrap font-pretendard text-sm leading-relaxed text-deepOceanNavy">
                {section.text}
              </p>
            ) : null}

            {section.kind === 'list' && section.items ? (
              <ul className="list-disc space-y-1.5 pl-4 font-pretendard text-sm leading-relaxed text-deepOceanNavy">
                {section.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : null}

            {section.kind === 'project' && section.project ? (
              <ProjectSectionContent project={section.project} />
            ) : null}
          </section>
        ))}
      </div>
    </div>
  )
}
