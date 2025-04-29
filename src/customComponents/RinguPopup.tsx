'use client';

import { ProjectPopupContent } from '@/customComponents/ProjectPopupContent';

export const RinguPopup = () => {
  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/ringu.png"
      leftHeader={<p>이 프로젝트는 A 기능을 중심으로 설계된 고도화 서비스입니다.</p>}
      projectIntro={
        <p>
          하드웨어 센서 기반으로 자폭 · 공격 드론을 식별·탐지한 뒤, 이를 무력화하는 시스템으로, 
          국방 및 주요 국가 시설에 납품되는 제품입니다.
        </p>
      }
      featureList={
        <div>
          <div>[RabbitMQ]</div>
          <div style={{ marginBottom: '16px' }}>센싱 데이터를 실시간 연계 및 활용</div>
          <div>[Web Push]</div>
          <div style={{ marginBottom: '16px' }}>드론 침입 · 무력화 시 실시간 알림</div>
          <div>[3D Map]</div>
          <div style={{ marginBottom: '16px' }}>드론 위치를 실시간으로 3D 맵 이동 구현</div>
          <div>[RealTime]</div>
          <div>Streaming API를 통한 실시간 이동 식별</div>
        </div>
      }
      projectScreenshots={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4>사용자 화면</h4>
            <img
              src="/assets/portpolio_popup/antidron_1.png"
              alt="사용자 화면"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <h4>관리자 화면</h4>
            <img
              src="/assets/portpolio_popup/antidron_2.png"
              alt="관리자 화면"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      }
      pjtVolume={<p>화면 분량 30장 내외</p>}
      pjtScope={
        <div>
          <div>* 총 3종 웹 구성</div>
          <div>사용자 관제 웹</div>
          <div>하드웨어 설정 웹</div>
          <div>관리자용 웹</div>
        </div>
      }
      pjtStack={
        <div>
          <div>FE: React.js</div>
          <div>BE: Python</div>
          <div>Server: 독립 서버</div>
          <div>OS: Linux</div>
          <div>DB: PostgreSQL, MongoDB</div>
        </div>
      }
      pjtDuration={
        <div>
          <div>스토리보드 4주</div>
          <div>UI/UX 디자인 4주</div>
          <div>FE/BE 개발 14주</div>
        </div>
      }
    />
  );
};

