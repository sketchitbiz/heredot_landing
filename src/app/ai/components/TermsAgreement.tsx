import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AppTextStyles } from '@/styles/textStyles';
import { AppColors } from '@/styles/colors';

interface TermsAgreementProps {
  onAgreeChange: (privacyAgreed: boolean, termsAgreed: boolean) => void;
  onViewDetails: (type: 'terms' | 'privacy') => void;
  initialPrivacyAgreed?: boolean;
  initialTermsAgreed?: boolean;
}

const CheckboxContainer = styled.div`
  margin-bottom: 16px;
  padding-top: 16px;
  border-top: 1px solid #dddddd;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CheckboxLabelGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 8px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  appearance: none;
  border: 1px solid #cccccc;
  border-radius: 4px;
  background-color: white;

  &:checked {
    background-color: #202055;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      display: block;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  &:focus {
    outline: none;
    border-color: #202055;
  }
`;

const CheckboxLabel = styled.label`
  ${AppTextStyles.body2}
  cursor: pointer;
`;

const ViewButton = styled.button`
  background: none;
  border: none;
  color: ${AppColors.primary};
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9em;
  padding: 0.25rem 0.5rem;
  &:hover {
    color: ${AppColors.secondary};
  }
`;

const TermsAgreement: React.FC<TermsAgreementProps> = ({
  onAgreeChange,
  onViewDetails,
  initialPrivacyAgreed = false,
  initialTermsAgreed = false,
}) => {
  const [allAgreed, setAllAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(initialPrivacyAgreed);
  const [termsAgreed, setTermsAgreed] = useState(initialTermsAgreed);

  useEffect(() => {
    setPrivacyAgreed(initialPrivacyAgreed);
    setTermsAgreed(initialTermsAgreed);
    setAllAgreed(initialPrivacyAgreed && initialTermsAgreed);
  }, [initialPrivacyAgreed, initialTermsAgreed]);

  useEffect(() => {
    onAgreeChange(privacyAgreed, termsAgreed);
  }, [privacyAgreed, termsAgreed, onAgreeChange]);

  const handleAllAgree = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setPrivacyAgreed(newValue);
    setTermsAgreed(newValue);
  };

  const handlePrivacyAgree = () => {
    const newValue = !privacyAgreed;
    setPrivacyAgreed(newValue);
    if (newValue && termsAgreed) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  };

  const handleTermsAgree = () => {
    const newValue = !termsAgreed;
    setTermsAgreed(newValue);
    if (newValue && privacyAgreed) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  };

  return (
    <CheckboxContainer>
      <CheckboxGroup>
        <CheckboxLabelGroup>
          <Checkbox
            type="checkbox"
            id="agree-all"
            checked={allAgreed}
            onChange={handleAllAgree}
          />
          <CheckboxLabel htmlFor="agree-all">전체 동의하기</CheckboxLabel>
        </CheckboxLabelGroup>
      </CheckboxGroup>

      <CheckboxGroup>
        <CheckboxLabelGroup>
          <Checkbox
            type="checkbox"
            id="agree-terms"
            checked={termsAgreed}
            onChange={handleTermsAgree}
          />
          <CheckboxLabel htmlFor="agree-terms">
            [필수] 이용약관 동의
          </CheckboxLabel>
        </CheckboxLabelGroup>
        <ViewButton onClick={() => onViewDetails('terms')}>보기</ViewButton>
      </CheckboxGroup>

      <CheckboxGroup>
        <CheckboxLabelGroup>
          <Checkbox
            type="checkbox"
            id="agree-privacy"
            checked={privacyAgreed}
            onChange={handlePrivacyAgree}
          />
          <CheckboxLabel htmlFor="agree-privacy">
            [필수] 개인정보 수집 및 이용
          </CheckboxLabel>
        </CheckboxLabelGroup>
        <ViewButton onClick={() => onViewDetails('privacy')}>보기</ViewButton>
      </CheckboxGroup>
    </CheckboxContainer>
  );
};

export default TermsAgreement;
