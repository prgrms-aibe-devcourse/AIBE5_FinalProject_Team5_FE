import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import BoardSection from './community/components/BoardSection'
import QnaSection from './community/components/QnaSection'
import RecruitmentSection from './community/components/RecruitmentSection'
import ArticleSection from './community/components/ArticleSection'

type Tab = '게시판' | 'Q&A' | '모집' | '아티클'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>('게시판')

  const tabs: Tab[] = ['게시판', 'Q&A', '모집', '아티클']

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 w-full pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">커뮤니티</h1>
            <p className="text-gray-600">다양한 정보와 경험을 공유하는 공간입니다.</p>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-4 text-lg font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === '게시판' && <BoardSection />}
            {activeTab === 'Q&A' && <QnaSection />}
            {activeTab === '모집' && <RecruitmentSection />}
            {activeTab === '아티클' && <ArticleSection />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
