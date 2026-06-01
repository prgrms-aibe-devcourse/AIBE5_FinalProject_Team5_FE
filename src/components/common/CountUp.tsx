import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  /** 도달할 목표 값 */
  to: number
  /** 애니메이션 길이(ms) */
  duration?: number
  /** 숫자 뒤에 붙는 단위/기호 (예: '+', '%', '만') */
  suffix?: string
}

/** 뷰포트에 들어오면 0 → to 까지 숫자가 올라가는 카운트업 (P3R 스탯 모션) */
export default function CountUp({ to, duration = 1600, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      setValue(to)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          // easeOutCubic
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Math.round(eased * to))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [to, duration])

  return (
    <span ref={ref}>
      {value.toLocaleString('ko-KR')}
      {suffix}
    </span>
  )
}
