// src/interfaces/admin.ts

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'content_manager';
  status: 'active' | 'inactive' | 'suspended';
  phone_number?: string;
  avatar?: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
  two_factor_enabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AdminUser;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface AdminSession {
  id: string;
  admin_email: string;
  admin_name: string;
  ip_address: string;
  created_at: string;
  expires_at: string;
  last_activity: string;
  is_current: boolean;
}

export interface LoginHistory {
  id: string;
  admin_user: AdminUser;
  ip_address: string;
  user_agent: string;
  login_time: string;
  logout_time?: string;
  status: 'success' | 'failed' | 'blocked';
  location?: string;
}

export interface AdminStatistics {
  total_admins: number;
  active_admins: number;
  admins_by_role: Array<{ role: string; count: number }>;
  recent_logins: number;
  failed_logins: number;
}

export interface LoginHistoryStats {
  total_logins: number;
  successful_logins: number;
  failed_logins: number;
  success_rate: number;
}