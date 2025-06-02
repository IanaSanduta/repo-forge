import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User data types
export interface UserData {
  id: string;
  github_token: string;
  github_username: string;
  github_avatar?: string;
  github_name?: string;
  created_at?: string;
  updated_at?: string;
}

// Portfolio data types
export interface PortfolioData {
  id: string;
  user_id: string;
  name: string;
  description: string;
  color_scheme: ColorScheme;
  repositories: Repository[];
  template_id: string;
  deployment_url?: string;
  github_pages_url?: string;
  last_deployed?: string;
  created_at?: string;
  updated_at?: string;
}

// Repository type
export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

// Color scheme type
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  darkMode: boolean;
}

// Template type
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview_image: string;
  features: string[];
}

// User data operations
export async function saveUserData(userData: Omit<UserData, 'id' | 'created_at' | 'updated_at'>): Promise<UserData | null> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('github_username', userData.github_username)
      .single();
    
    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update({
          github_token: userData.github_token,
          github_avatar: userData.github_avatar,
          github_name: userData.github_name,
          updated_at: new Date().toISOString()
        })
        .eq('github_username', userData.github_username)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            github_username: userData.github_username,
            github_token: userData.github_token,
            github_avatar: userData.github_avatar,
            github_name: userData.github_name
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    return null;
  }
}

export async function getUserData(githubUsername: string): Promise<UserData | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('github_username', githubUsername)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Portfolio data operations
export async function savePortfolioData(portfolioData: Omit<PortfolioData, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioData | null> {
  try {
    // Check if portfolio already exists for this user and template
    const { data: existingPortfolio } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', portfolioData.user_id)
      .eq('template_id', portfolioData.template_id)
      .single();
    
    if (existingPortfolio) {
      // Update existing portfolio
      const { data, error } = await supabase
        .from('portfolios')
        .update({
          name: portfolioData.name,
          description: portfolioData.description,
          color_scheme: portfolioData.color_scheme,
          repositories: portfolioData.repositories,
          deployment_url: portfolioData.deployment_url,
          github_pages_url: portfolioData.github_pages_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPortfolio.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new portfolio
      const { data, error } = await supabase
        .from('portfolios')
        .insert([portfolioData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    return null;
  }
}

export async function getPortfoliosByUser(userId: string): Promise<PortfolioData[]> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return [];
  }
}

export async function getPortfolioData(userId: string): Promise<PortfolioData | null> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No portfolio found, not an error
        return null;
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return null;
  }
}

export async function getPortfolioById(portfolioId: string): Promise<PortfolioData | null> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

// Template operations
export async function getTemplates(): Promise<Template[]> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}

export async function getTemplateById(templateId: string): Promise<Template | null> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching template:', error);
    return null;
  }
}
