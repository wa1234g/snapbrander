export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country: string;
  language: string;
  currency: string;
  timezone: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  user_id: number;
  name: string;
  business_name: string;
  business_type: 'company' | 'store' | 'landing';
  description?: string;
  domain?: string;
  subdomain?: string;
  status: 'draft' | 'generating' | 'active' | 'archived' | 'deleted';
  template_id?: number;
  colors?: ColorScheme;
  logo_path?: string;
  modules?: string[];
  wp_admin_url?: string;
  wp_username?: string;
  wp_password?: string;
  trial_expires_at?: string;
  archived_at?: string;
  created_at: string;
  updated_at: string;
  template?: Template;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  category: 'business' | 'ecommerce' | 'landing' | 'portfolio';
  preview_image: string;
  template_kit_path: string;
  demo_data?: any;
  requires_woocommerce: boolean;
  color_schemes?: any;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Module {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: 'communication' | 'ecommerce' | 'analytics' | 'social' | 'booking';
  icon?: string;
  config_schema?: any;
  price: number;
  is_free: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Draft {
  id: number;
  user_id: number;
  session_id?: string;
  current_step: number;
  step_data: any;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  isComplete: boolean;
  data?: any;
}

export interface BusinessInfo {
  name: string;
  business_name: string;
  business_type: 'company' | 'store' | 'landing';
  industry?: string;
  description?: string;
}

export interface AIGenerationRequest {
  business_name: string;
  business_type: string;
  industry?: string;
  language?: string;
}

export interface AIGenerationResponse {
  description?: string;
  colors?: ColorScheme;
  logo_path?: string;
  logo_url?: string;
  content?: string;
  translated_text?: string;
  response?: string;
  request_id: number;
}
