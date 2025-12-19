
import { supabase } from '../supabaseClient';

export interface SignUpResult {
  user: any;
  profile: any;
  session: any;
}

/**
 * Signs up a user.
 * It passes profile data as metadata so the DB trigger can create the profile row securely.
 * It falls back to a manual insert if the trigger doesn't exist, failing gracefully if RLS blocks it.
 */
export const signUpWithProfile = async (
  email: string, 
  password: string, 
  profileData: { username: string; role: 'buyer' | 'supplier'; [key: string]: any }
): Promise<SignUpResult> => {
  
  // 1. Sign up the user with Metadata
  // We keep phone and company_role here in metadata so they are accessible via user.user_metadata
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: profileData.username,
        role: profileData.role,
        phone: profileData.phone,
        company_role: profileData.company_role
      }
    }
  });

  if (signUpError) throw signUpError;
  if (!authData.user) throw new Error("Sign up failed: No user returned");

  // 2. Prepare profile object for manual fallback
  // STRICT SCHEMA MAPPING: Only include columns that exist in the 'profiles' table definition
  const newProfile = {
    id: authData.user.id,
    email: email,
    username: profileData.username,
    role: profileData.role
    // Note: 'phone' and 'company_role' are excluded from the DB insert 
    // because they do not exist in the public.profiles table schema provided.
  };

  // 3. Fallback: Attempt to fetch or insert profile
  // If the DB Trigger ran, this select will find the profile.
  // If not, we try to insert it manually.
  let profile = null;

  if (authData.session) {
    try {
        const { data: existing, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is 'not found'
            // If it's a network error (Failed to fetch), we just warn and proceed with optimistic profile
            console.warn("Profile check warning:", fetchError.message);
        }

        profile = existing;

        if (!existing) {
            const { data: created, error: insertError } = await supabase
                .from('profiles')
                .insert(newProfile)
                .select()
                .single();
            
            if (insertError) {
                // We log this but do NOT throw. 
                // If RLS blocks insert, it's often because the Trigger already created it 
                // but the client hasn't realized it yet, or policy is strict.
                // We prioritize the Auth User creation success.
                console.warn("Manual profile insert skipped/failed (likely handled by DB trigger):", insertError.message);
            } else {
                profile = created;
            }
        }
    } catch (e: any) {
        console.warn("Profile sync warning:", e.message || e);
    }
  }

  return { 
    user: authData.user, 
    session: authData.session,
    profile: profile || newProfile // Return optimistic profile if fetch failed
  };
};
