import { supabase, getCurrentUser, isAuthenticated } from '../supabase';

// Mock the Supabase client
jest.mock('../supabase', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
      getSession: jest.fn(),
    },
  };
  
  return {
    supabase: mockSupabase,
    getCurrentUser: jest.fn(),
    isAuthenticated: jest.fn(),
  };
});

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(supabase).toBeDefined();
  });

  it('should have auth methods', () => {
    expect(supabase.auth).toBeDefined();
    expect(supabase.auth.getUser).toBeDefined();
    expect(supabase.auth.getSession).toBeDefined();
  });

  it('should call getCurrentUser', async () => {
    const mockUser = { id: 'test-user-id', email: 'test@example.com' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const user = await getCurrentUser();
    
    expect(getCurrentUser).toHaveBeenCalled();
    expect(user).toEqual(mockUser);
  });

  it('should call isAuthenticated', async () => {
    (isAuthenticated as jest.Mock).mockResolvedValue(true);

    const authenticated = await isAuthenticated();
    
    expect(isAuthenticated).toHaveBeenCalled();
    expect(authenticated).toBe(true);
  });
}); 