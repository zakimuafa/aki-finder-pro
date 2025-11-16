import { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any }>;
  updateEmail: (newEmail: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Check admin role when session changes
      if (session?.user) {
        setTimeout(() => {
          checkAdminRole(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        checkAdminRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      console.log("Checking admin role for user:", userId);
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      console.log("Admin check result:", { data, error });

      if (!error && data) {
        console.log("User is admin");
        setIsAdmin(true);
      } else {
        console.log("User is not admin");
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Gagal",
          description: error.message,
          variant: "destructive",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Login Gagal",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Attempting to sign up user:", { email, fullName });
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log(
        "Supabase Key exists:",
        !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
      );
      const redirectUrl =
        "https://aki-finder-8s8pzr5bp-jeks-projects-078da0ba.vercel.app/";

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      console.log("Raw sign up response:", { data, error });
      console.log("User created:", data?.user);
      console.log("Session:", data?.session);
      console.log("User ID:", data?.user?.id);
      console.log("User email:", data?.user?.email);

      if (error) {
        console.error("Sign up error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        toast({
          title: "Registrasi Gagal",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log(
          "Sign up successful, checking if user was created in auth.users..."
        );

        // Test if we can query the profiles table
        if (data?.user?.id) {
          console.log("Testing profiles table access...");
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          console.log("Profile check result:", { profileData, profileError });
        }

        if (data?.user && !data?.session) {
          toast({
            title: "Registrasi Berhasil",
            description: "Silakan cek email Anda untuk konfirmasi akun.",
          });
        } else {
          toast({
            title: "Registrasi Berhasil",
            description: "Akun Anda telah dibuat. Silakan login.",
          });
        }
      }

      return { error };
    } catch (error: any) {
      console.error("Sign up exception:", error);
      toast({
        title: "Registrasi Gagal",
        description: "Terjadi kesalahan saat registrasi",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updateEmail = async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        toast({
          title: "Update Email Gagal",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Update Email Berhasil",
          description: "Silakan cek email baru Anda untuk konfirmasi.",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Update Email Gagal",
        description: "Terjadi kesalahan saat update email",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signIn,
        signUp,
        updateEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
