// src/lib/styles/colors.ts

/**
 * AppColors는 애플리케이션 전반에 걸쳐 사용하는 색상 팔레트를 정의합니다.
 * UI 요소들의 일관된 디자인을 유지하고, 테마 색상을 중앙에서 관리하기 위한 목적으로 사용됩니다.
 * 변수명은 유지하고, 값은 프로젝트 디자인 가이드에 맞게 변경해주세요
 * AppColors defines the color palette used throughout the application.
 * It helps maintain consistent design across UI elements and allows centralized theme color management.
 * Please keep the variable names and change the values according to your project design guidelines.
 */

export const AppColors = {
  // 기본색상
  // Base Colors
  primary: "#1976D2",
  secondary: "#9C27B0",
  tertiary: "#FFC107",
  background: "#FFFFFF",
  surface: "#FFFFFF",

  // 텍스트 또는 any on 기본색상
  // Text or any content on base colors
  onPrimary: "#d82323",
  onSecondary: "#FFFFFF",
  onTertiary: "#000000",
  onBackground: "#000000",
  onSurface: "#000000",

  // 상태
  // Status Colors
  disabled: "#A9A9A9",
  error: "#B00020",
  success: "#4CAF50",
  warning: "#FFC107",
  info: "#2196F3",

  // 버튼
  // Button Colors
  buttonPrimary: "#1976D2",
  buttonPrimaryHover: "#1565C0",
  buttonPrimaryActive: "#0D47A1",
  buttonSecondary: "#9C27B0",
  buttonSecondaryHover: "#8E24AA",
  buttonSecondaryActive: "#6A1B9A",
  buttonDisabled: "#E0E0E0",

  // 테그
  // Tag Colors
  tagPrimary: "#1976D2",
  tagSuccess: "#4CAF50",
  tagWarning: "#FFC107",
  tagError: "#B00020",
  tagInfo: "#2196F3",
  tagActive: "#FF5722",
  tagDisabled: "#9E9E9E",

  // 네비게이션
  // Navigation
  navigationBackground: "#1976D2",
  navigationText: "#FFFFFF",

  // 아이콘
  // Icon Colors
  iconPrimary: "#1976D2",
  iconSecondary: "#9C27B0",
  iconTertiary: "#FFC107",
  iconSuccess: "#4CAF50",
  iconWarning: "#FFC107",
  iconError: "#B00020",
  iconDisabled: "#9E9E9E",

  // 보더
  // Border Colors
  borderLight: "#E0E0E0",
  borderDark: "#9E9E9E",
  borderError: "#B00020",

  // 기타
  // Others / Miscellaneous
  divider: "#E0E0E0",
  overlay: "#000000",
  shadowLight: "#E0E0E0",
  shadowMedium: "#B0BEC5",
  shadowDark: "#78909C",

  link: "#1976D2",
  linkHover: "#1565C0",
  linkActive: "#0D47A1",
  linkDisabled: "#9E9E9E",

  // *************** 추가 *********** 
  // 프로젝트 특성 상 추가적인 색상 정의가 필요한 경우 하단에 추가
  // Additional Colors
  // For project-specific color definitions, add them below

} as const;
