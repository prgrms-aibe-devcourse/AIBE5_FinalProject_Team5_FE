// 아티클 목록 데이터 (RSS Feed 데이터)
import type { ArticleItem } from './types'

export const articleCategories = ['전체', '카카오 테크'] as const

export const mockArticles: ArticleItem[] = [
  {
    id: 822,
    title: '메시징 서버의 스트레스 테스트 노하우와 AI가 덜어 준 부분',
    summary:
      'Part 1. 개요 - 안정적인 운영을 위한 노력들\n안녕하세요 저는 톡메시징플랫폼 서버개발자 쟈미(jyami)입니다. 톡메시징 개발 플랫폼팀은 카카오톡의 메시지 수발신 채팅방 목록...',
    category: '카카오 테크',
    author: 'Kakao Tech Blog',
    createdAt: '2026-05-21',
    readTimeMinutes: 8,
    externalUrl: 'https://tech.kakao.com/posts/822',
    thumbnailUrl: 'https://t1.kakaocdn.net/kakao_tech/media/51df7c44019e00001.png',
    coverVariant: 2,
  },
  {
    id: 821,
    title: '음성 AI 모델을 프로덕션에 올리기까지: Kanana-O 서빙 최적화 여정',
    summary:
      'TL;DR\nkanana-o는 텍스트·이미지·오디오를 종합적으로 이해하고 자연스러운 텍스트와 음성으로 응답하는 멀티모달 모델입니다(자세히 알아보기). 모델을 학습하는 것과 사용자에게...',
    category: '카카오 테크',
    author: 'Kakao Tech Blog',
    createdAt: '2026-05-05',
    readTimeMinutes: 9,
    externalUrl: 'https://tech.kakao.com/posts/821',
    thumbnailUrl: 'https://t1.kakaocdn.net/kakao_tech/media/fc5b5d8e019d00001.jpg',
    coverVariant: 1,
  },
  {
    id: 820,
    title: '카카오톡 예약하기에서 그려 본 캘린더',
    summary:
      '안녕하세요 저는 카카오톡 예약하기라는 서비스에서 FE 개발을 담당하고 있는 Joy 라고 합니다.\n이 글에서는 우리에게 친근한 캘린더를 직접 만들어보면서 경험한 이야기를 해보자 합니...',
    category: '카카오 테크',
    author: 'Kakao Tech Blog',
    createdAt: '2026-04-22',
    readTimeMinutes: 7,
    externalUrl: 'https://tech.kakao.com/posts/820',
    thumbnailUrl: 'https://t1.kakaocdn.net/kakao_tech/media/aec7e17c019d00001.png',
    coverVariant: 4,
  },
]
