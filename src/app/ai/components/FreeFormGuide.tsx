'use client';

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import useAiFlowStore from '@/store/aiFlowStore';
import { getStepData, ChatDictionary } from '@/app/ai/components/StepData';
import { useTranslation } from 'react-i18next';

// 스타일 컴포넌트
const FreeFormGuideContainer = styled.div<{ $isNarrowScreen?: boolean }>`
  width: 100%;
  /* max-width: 48rem; */
  font-weight: 300;
  padding: 0;
  background-color: ${AppColors.background};
  border-radius: 8px;
  text-align: ${(props) =>
    props.$isNarrowScreen ? 'left' : 'left'}; // 항상 왼쪽 정렬
  color: #9ca3af;
  line-height: 1.6;

  .profile-section {
    margin-bottom: ${(props) => (props.$isNarrowScreen ? '1rem' : '1.5rem')};
  }

  .conversational-intro {
    margin-bottom: 2rem;
    p {
      margin-bottom: 0.75rem;
      color: ${AppColors.onBackground};
      font-weight: 300;
    }
    ul {
      list-style: disc;
      padding-left: 20px;
      margin-bottom: 1rem;
      li {
        margin-bottom: 0.5rem;
        color: #ffffff;
        &::before {
          /* 기본 disc 스타일 사용을 위해 제거 또는 수정 */
          content: none;
        }
      }
    }
  }

  .content-title {
    font-weight: 400;
    color: ${AppColors.onBackground};
    margin-bottom: 0.75rem;
    font-size: 1.1em;
  }

  .file-support-content {
    padding-left: 0.5rem; /* 기존 content 클래스의 padding과 유사하게 */
    p {
      margin-bottom: 1rem;
      color: ${AppColors.onBackground};
      font-weight: 300;
    }
    ul {
      list-style: none;
      padding-left: 0;
      margin-bottom: 1.5rem;
      text-align: left;
    }
    li {
      margin-bottom: 0.75rem;
      color: #ffffff;
      padding-left: 1.25rem;
      position: relative;
      font-weight: 300; /* 일관성을 위해 300으로 */

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        top: 0;
        color: ${AppColors.primary};
      }
      span {
        color: ${AppColors.onPrimaryGray};
        display: block;
        margin-left: 0.5rem;
        margin-top: 0.25rem;
        font-weight: 300;
      }
    }
  }
`;

const ProfileContainer = styled.div<{ $isNarrowScreen?: boolean }>`
  display: flex;
  align-items: center;
  width: ${(props) => (props.$isNarrowScreen ? '100%' : 'auto')};
  justify-content: flex-start;
`;

const ProfileImage = styled.img<{ $isNarrowScreen?: boolean }>`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

const ProfileName = styled.p`
  font-size: 20px;
  color: ${AppColors.onBackground};
  font-weight: bold;
  margin: 0;
`;

interface FreeFormGuideProps {
  isNarrowScreen: boolean;
  lang: 'ko' | 'en';
  onSurveyDataReady?: (surveyData: string) => void;

  handleGeminiSubmit: (
    e?: React.FormEvent | null,
    actionPrompt?: string,
    isSystemInitiatedPrompt?: boolean
  ) => void;
}

const FreeFormGuide: React.FC<FreeFormGuideProps> = ({
  isNarrowScreen,
  lang,
  onSurveyDataReady,
  handleGeminiSubmit,
}) => {
  const tFromDictionary = aiChatDictionary[lang];
  const { t: translate } = useTranslation();
  const selections = useAiFlowStore((state) => state.selections);
  const stepData = getStepData(tFromDictionary as any as ChatDictionary);

  const selectionStrings = Object.entries(selections)
    .map(([stepId, selectedIds]) => {
      const step = stepData.find((s) => s.id === stepId);
      if (!step) return '';
      const labels = selectedIds
        .map((id) => step.options.find((opt) => opt.id === id)?.label)
        .filter((label): label is string => !!label);
      return labels.length > 0 ? labels.join(', ') : '';
    })
    .filter(Boolean)
    .join(' / ');

  useEffect(() => {
    if (selectionStrings && onSurveyDataReady) {
      onSurveyDataReady(selectionStrings);
    }
  }, [selectionStrings, onSurveyDataReady]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleGeminiSubmit(null, '안녕하세요! 어떤 걸 적어야 더 세심하게 프로젝트 견적서를 짜주나요', true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const guideText = tFromDictionary.freeFormGuide || {
    greeting:
      lang === 'ko'
        ? '안녕하세요! {profileName}입니다.'
        : "Hello! I'm {profileName}.",
    acknowledgmentCore:
      lang === 'ko'
        ? '견적 요청 주셔서 감사합니다. 선택하신 내용은 다음과 같습니다: {selections}'
        : 'Thank you for your estimate request. Your selected options are: {selections}',
    transitionToQuestions:
      lang === 'ko'
        ? '먼저 몇 가지 추가 질문을 드려도 될까요?'
        : 'May I ask a few more questions first?',
    followUpQuestions:
      lang === 'ko'
        ? [
            '주요 내용: 구상 중이신 서비스의 주요 상품 또는 내용은 무엇인가요?',
            'UI 디자인: UI 디자인에 대한 특별한 선호 사항이나 참고하고 싶으신 웹사이트가 있으신가요?',
            '필수 기능: 해당 플랫폼에 꼭 필요한 기능이 있다면 말씀해주세요.',
          ]
        : [
            'Main Content: What are the main products or services for the platform you are envisioning?',
            "UI Design: Do you have any specific preferences for UI design or any websites you'd like to reference?",
            'Essential Features: Please tell us if there are any essential features for this platform.',
          ],
    closing:
      lang === 'ko'
        ? '그럼, 답변을 기다리겠습니다!'
        : 'I look forward to your answers!',
    defaultIntro:
      lang === 'ko'
        ? '어떤 프로젝트를 구상 중이신가요? 자세히 알려주시면 맞춤형 제안을 드리는 데 도움이 됩니다.'
        : 'What project are you envisioning? Telling me more will help me make personalized suggestions.',
  };

  const greeting = guideText.greeting.replace(
    '{profileName}',
    tFromDictionary.profileName
  );
  const acknowledgment = guideText.acknowledgmentCore.replace(
    '{selections}',
    selectionStrings ||
      (lang === 'ko' ? '선택하신 내용 없음' : 'No selections made')
  );

  return (
    <FreeFormGuideContainer $isNarrowScreen={isNarrowScreen}>
      <div className="profile-section">
        <ProfileContainer $isNarrowScreen={isNarrowScreen}>
          <ProfileImage
            $isNarrowScreen={isNarrowScreen}
            src="/ai/pretty.png"
            alt="AI 프로필"
          />
          <ProfileName>
            <strong>{tFromDictionary.profileName}</strong>
          </ProfileName>
        </ProfileContainer>
      </div>

      {/* <div className="conversational-intro">
        <p>{greeting}</p>
        {selectionStrings ? (
          <p>{acknowledgment}</p>
        ) : (
          <p>{guideText.defaultIntro}</p>
        )}
        {selectionStrings && (
          <>
            <p>{guideText.transitionToQuestions}</p>
            <ul>
              {guideText.followUpQuestions.map(
                (question: string, index: number) => (
                  <li key={index}>{question}</li>
                )
              )}
            </ul>
            <p>{guideText.closing}</p>
          </>
        )}
      </div> */}

      <div className="file-support-content">
        <p className="content-title">{tFromDictionary.fileSupport.title}</p>
        <ul>
          <li>
            {tFromDictionary.fileSupport.url}
            <br />
            <span>&quot;{tFromDictionary.fileSupport.urlExample}&quot;</span>
          </li>
          <li>{tFromDictionary.fileSupport.image}</li>
          <li>
            {tFromDictionary.fileSupport.pdf}
            <br />
            <span>{tFromDictionary.fileSupport.unsupported}</span>
          </li>
        </ul>
        <p>{tFromDictionary.fileSupport.message}</p>
      </div>
    </FreeFormGuideContainer>
  );
};

export default FreeFormGuide;
