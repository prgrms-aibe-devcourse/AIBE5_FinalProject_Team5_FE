import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../../components/layout/Header.tsx'
import Footer from '../../../components/layout/Footer.tsx'
import CourseDetailBreadcrumb from '../components/CourseDetailBreadcrumb.tsx'
import CourseDetailHeader from '../components/CourseDetailHeader.tsx'
import CourseDetailTabs, { type CourseDetailTab } from '../components/CourseDetailTabs.tsx'
import CourseDetailInfoSections from '../components/CourseDetailInfoSections.tsx'
import CourseDetailReviewsSection from '../components/CourseDetailReviewsSection.tsx'
import CourseDetailSidebar from '../components/CourseDetailSidebar.tsx'
import { getMockCourseDetail } from '../data/mockCourseDetail.ts'

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [activeTab, setActiveTab] = useState<CourseDetailTab>('info')
  const [isBookmarked, setIsBookmarked] = useState(false)

  const course = useMemo(() => { // 과정 상세 데이터 조회
    if (!courseId) return null
    return getMockCourseDetail(courseId)
  }, [courseId])

  if (!course) { // 과정 상세 데이터가 없으면 에러 표시
    return (
      <div className="flex min-h-screen flex-col bg-white font-pretendard">
        <Header fixed={false} />
        <main className="flex flex-1 items-center justify-center px-8">
          <p className="text-deepOceanNavy">과정을 찾을 수 없습니다.</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-pretendard">
      <Header fixed={false} />
      
      {/* 메인 컨테이너 */}
      <main className="flex-1 min-h-[calc(100dvh-12rem)] px-6 pb-[15.6rem] pt-8 md:px-12 md:pb-[18.2rem] lg:px-20">
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-6 md:gap-8">
          {/* 네비게이션 메뉴 (과정 조회 > 과정 상세) */}
          <CourseDetailBreadcrumb />

          {/* 과정 상세 헤더 (과정 이미지, 제목, 기관, 모집 현황) */}
          <CourseDetailHeader 
            course={course} 
            isBookmarked={isBookmarked} // 스크랩 버튼 상태
            onToggleBookmark={() => setIsBookmarked((prev) => !prev)} // 스크랩 버튼 감지 
          />

          {/* 과정 상세 탭 (과정 정보, 후기) */}
          <CourseDetailTabs 
            activeTab={activeTab} // 탭 상태
            onTabChange={setActiveTab} // 탭 변경 감지 
          /> 

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            {/* 정보 섹션 (탭 콘텐츠) */}
            <div className="min-w-0 flex-1" role="tabpanel">
              {activeTab === 'info' ? <CourseDetailInfoSections course={course} /> : null}
              {activeTab === 'reviews' ? <CourseDetailReviewsSection /> : null}
            </div>

            {/* 과정 상세 사이드바 */}
            <CourseDetailSidebar course={course} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
