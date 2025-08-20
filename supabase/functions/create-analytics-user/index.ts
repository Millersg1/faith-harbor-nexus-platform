import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authentication and admin role for this function
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client with service role key to bypass RLS for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Create Supabase client with anon key to verify requesting user
    const supabaseAnon = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verify the requesting user is authenticated and has admin privileges
    const { data: userData, error: userError } = await supabaseAnon.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error('Invalid authentication token');
    }

    console.log(`Admin ${userData.user.email} creating analytics test user...`);

    // Check if user has admin privileges
    const { data: userRoles, error: roleError } = await supabaseAdmin
      .from('member_roles')
      .select('role_name')
      .eq('user_id', userData.user.id)
      .eq('active', true);

    if (roleError || !userRoles?.some(role => role.role_name === 'admin')) {
      throw new Error('Insufficient privileges - admin access required');
    }

    const { email } = await req.json();
    const testEmail = email || 'analytics.tester@faithharborministryplatform.com';
    const password = 'AnalyticsTest2024!'; // Secure temporary password
    
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    console.log(`Attempting to create user: ${testEmail}`);

    // Create the user with admin privileges
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: password,
      email_confirm: true, // Skip email confirmation for test user
      user_metadata: {
        first_name: 'Analytics',
        last_name: 'Tester',
        display_name: 'Analytics Tester'
      }
    });

    if (userError) {
      console.error("User creation error:", userError);
      throw userError;
    }

    if (!user.user) {
      throw new Error("Failed to create user");
    }

    console.log(`User created successfully: ${user.user.id}`);

    // Assign the analytics_viewer role
    const { error: roleError } = await supabaseAdmin
      .from("member_roles")
      .insert({
        user_id: user.user.id,
        role_name: "analytics_viewer",
        assigned_by: userData.user.id, // Assigned by requesting admin
        role_description: "Read-only access to analytics and SEO data",
        active: true
      });

    if (roleError) {
      console.error("Role assignment error:", roleError);
      throw roleError;
    }

    console.log("Analytics viewer role assigned successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Analytics test user created successfully",
        user: {
          id: user.user.id,
          email: testEmail,
          role: 'analytics_viewer'
        },
        credentials: {
          email: testEmail,
          password: password,
          note: 'Please change password after first login'
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in create-analytics-user function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to create analytics user",
        details: error
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});