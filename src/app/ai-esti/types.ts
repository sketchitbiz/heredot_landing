// src/app/ai-esti/types.ts

export interface ProjectEstimateItem {
  name: string;
  price: string; // e.g., "10,000,000"
  description: string;
}

export interface ProjectEstimateSubCategory {
  sub_category_name: string;
  items: ProjectEstimateItem[];
}

export interface ProjectEstimateCategory {
  category_name: string;
  sub_categories: ProjectEstimateSubCategory[];
}

export interface ProjectEstimate {
  project_name: string;
  total_price: string;
  vat_included_price: string;
  estimated_period: string; // e.g., "22주"
  categories: ProjectEstimateCategory[];
}

