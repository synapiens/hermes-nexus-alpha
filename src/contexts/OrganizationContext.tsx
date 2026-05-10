import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Organization {
  id: string;
  name: string;
  plan?: string;
}

interface OrganizationContextData {
  organization: Organization | null;
  userProfile: { name: string; role: string; avatar_url?: string } | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextData>({ 
  organization: null, 
  userProfile: null,
  loading: true, 
  error: null,
  refreshProfile: async () => {}
});

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; role: string; avatar_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  const fetchUserOrg = async () => {
    if (authLoading) return;
    if (!user) {
      setOrganization(null);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // 1. Get profile details (including organization_id, name, role)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, name, role, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profile) {
        setUserProfile({
          name: profile.name,
          role: profile.role,
          avatar_url: profile.avatar_url
        });
      }

      const orgId = profile?.organization_id;

      if (!orgId) {
        setErrorState('Usuário não vinculado a nenhuma organização.');
        setLoading(false);
        return;
      }

      // 2. Fetch organization details
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .maybeSingle();
      
      if (orgError) throw orgError;

      if (org) {
        setOrganization({
          id: org.id,
          name: org.name || org.nome || 'Empresa Sem Nome',
          plan: 'Enterprise'
        });
        setErrorState(null);
      } else {
        setErrorState('Organização não encontrada ou acesso negado (RLS).');
      }
    } catch (err: any) {
      console.error('Error fetching organization/profile:', err);
      setErrorState(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrg();
  }, [user, authLoading]);

  return (
    <OrganizationContext.Provider value={{ 
      organization, 
      userProfile,
      loading: loading || authLoading, 
      error: errorState,
      refreshProfile: fetchUserOrg
    }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  return useContext(OrganizationContext);
}
