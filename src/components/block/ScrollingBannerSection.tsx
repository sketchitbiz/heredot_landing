"use client";

import { ScrollingBanner as OriginalScrollingBanner } from "@/components/Landing/ScrollingBanner";

// 스크롤링 배너 데이터
const bannerData = [
  {
    id: "b1",
    imageUrl: "/landing/banner/landing.webp",
    mobileImageUrl: "/landing/banner/landing_mobile.webp",
    altText: "랜딩 배너",
  },
  {
    id: "b2",
    imageUrl: "/landing/banner/quote.webp",
    mobileImageUrl: "/landing/banner/quote_mobile.webp",
    altText: "인용 배너",
  },
  {
    id: "b3",
    imageUrl: "/landing/banner/coupon.webp",
    mobileImageUrl: "/landing/banner/coupon_mobile.webp",
    altText: "쿠폰 배너",
  },
];

export const ScrollingBannerSection = () => {
  return <OriginalScrollingBanner banners={bannerData} />;
};
