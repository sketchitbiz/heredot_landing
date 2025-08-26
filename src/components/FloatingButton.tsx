import React from 'react';

const FloatingButton = () => {
  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      zIndex: 1000,
      cursor: 'pointer'
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="168" height="168" viewBox="0 0 168 168" fill="none">
        <g filter="url(#filter0_d_439_21988)">
          <rect x="44" y="34" width="80" height="80" rx="40" fill="url(#paint0_linear_439_21988)"/>
        </g>
        <g filter="url(#filter1_ii_439_21988)">
          <path d="M83 89.25C91.2838 89.25 98 83.3737 98 76.125C98 68.8763 91.2838 63 83 63C74.7162 63 68 68.8763 68 76.125C68 79.425 69.3931 82.4438 71.6938 84.75C71.5119 86.655 70.9119 88.7438 70.2481 90.3113C70.1 90.66 70.3869 91.05 70.76 90.99C74.99 90.2963 77.5044 89.2313 78.5975 88.6763C80.0333 89.0606 81.5136 89.2535 83 89.25Z" fill="white"/>
        </g>
        <g filter="url(#filter2_i_439_21988)">
          <path d="M97.9996 67.3463L97.9916 67.3476L97.9443 67.371L97.931 67.3736L97.9216 67.371L97.8743 67.347C97.8672 67.3452 97.8619 67.3465 97.8583 67.351L97.8556 67.3576L97.8443 67.643L97.8476 67.6563L97.8543 67.665L97.9236 67.7143L97.9336 67.717L97.9416 67.7143L98.011 67.665L98.019 67.6543L98.0216 67.643L98.0103 67.3583C98.0085 67.3512 98.005 67.3472 97.9996 67.3463ZM98.1756 67.271L98.1663 67.2723L98.0436 67.3343L98.037 67.341L98.035 67.3483L98.047 67.635L98.0503 67.643L98.0556 67.6483L98.1896 67.7096C98.1981 67.7119 98.2045 67.7101 98.209 67.7043L98.2116 67.695L98.189 67.2856C98.1867 67.2772 98.1823 67.2723 98.1756 67.271ZM97.699 67.2723C97.696 67.2705 97.6925 67.27 97.6892 67.2707C97.6858 67.2714 97.6829 67.2735 97.681 67.2763L97.677 67.2856L97.6543 67.695C97.6547 67.703 97.6585 67.7083 97.6656 67.711L97.6756 67.7096L97.8096 67.6476L97.8163 67.6423L97.8183 67.635L97.8303 67.3483L97.8283 67.3403L97.8216 67.3336L97.699 67.2723Z" fill="white"/>
          <path d="M95.6749 55.2987C96.0736 54.132 97.6856 54.0967 98.1583 55.1927L98.1983 55.2993L98.7363 56.8727C98.8595 57.2335 99.0588 57.5637 99.3205 57.8409C99.5823 58.1182 99.9005 58.3361 100.254 58.48L100.398 58.534L101.972 59.0713C103.138 59.47 103.174 61.082 102.078 61.5547L101.972 61.5947L100.398 62.1327C100.037 62.2559 99.707 62.4551 99.4296 62.7168C99.1522 62.9786 98.9342 63.2968 98.7903 63.65L98.7363 63.794L98.1989 65.368C97.8003 66.5347 96.1883 66.57 95.7163 65.4747L95.6749 65.368L95.1376 63.7947C95.0144 63.4337 94.8152 63.1034 94.5534 62.826C94.2917 62.5486 93.9734 62.3306 93.6203 62.1867L93.4763 62.1327L91.9029 61.5953C90.7356 61.1967 90.7003 59.5847 91.7963 59.1127L91.9029 59.0713L93.4763 58.534C93.8371 58.4107 94.1673 58.2115 94.4445 57.9497C94.7218 57.688 94.9397 57.3698 95.0836 57.0167L95.1376 56.8727L95.6749 55.2987ZM102.27 53C102.395 53 102.517 53.035 102.623 53.101C102.729 53.167 102.814 53.2613 102.869 53.3733L102.901 53.4513L103.134 54.1353L103.819 54.3687C103.944 54.4111 104.053 54.4897 104.134 54.5945C104.214 54.6993 104.261 54.8256 104.27 54.9573C104.278 55.0891 104.247 55.2204 104.181 55.3345C104.115 55.4487 104.016 55.5406 103.898 55.5987L103.819 55.6307L103.135 55.864L102.902 56.5487C102.859 56.6736 102.78 56.7831 102.676 56.8633C102.571 56.9435 102.444 56.9908 102.313 56.9991C102.181 57.0075 102.05 56.9766 101.936 56.9103C101.821 56.8439 101.73 56.7452 101.672 56.6267L101.64 56.5487L101.406 55.8647L100.722 55.6313C100.597 55.5889 100.487 55.5103 100.407 55.4055C100.327 55.3007 100.279 55.1744 100.271 55.0427C100.262 54.9109 100.293 54.7796 100.359 54.6655C100.426 54.5513 100.524 54.4594 100.643 54.4013L100.722 54.3693L101.406 54.136L101.639 53.4513C101.684 53.3196 101.769 53.2053 101.882 53.1243C101.995 53.0434 102.131 52.9999 102.27 53Z" fill="white"/>
        </g>
        <defs>
          <filter id="filter0_d_439_21988" x="0" y="0" width="168" height="168" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="10"/>
            <feGaussianBlur stdDeviation="22"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.328627 0 0 0 0 0.12549 0 0 0 0 0.996078 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_439_21988"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_439_21988" result="shape"/>
          </filter>
          <filter id="filter1_ii_439_21988" x="66" y="61" width="34" height="31.9962" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="2" dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0652162 0 0 0 0 0.0016986 0 0 0 0 0.529898 0 0 0 0.36 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_439_21988"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="-2" dy="-2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0666667 0 0 0 0 0 0 0 0 0 0.529412 0 0 0 0.36 0"/>
            <feBlend mode="normal" in2="effect1_innerShadow_439_21988" result="effect2_innerShadow_439_21988"/>
          </filter>
          <filter id="filter2_i_439_21988" x="91" y="53" width="14.271" height="15.717" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="1" dy="1"/>
            <feGaussianBlur stdDeviation="1"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0749262 0 0 0 0 0.000993655 0 0 0 0 0.620192 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_439_21988"/>
          </filter>
          <linearGradient id="paint0_linear_439_21988" x1="84" y1="34" x2="84" y2="114" gradientUnits="userSpaceOnUse">
            <stop stop-color="#9579EC"/>
            <stop offset="1" stop-color="#1F1AAE"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default FloatingButton;

