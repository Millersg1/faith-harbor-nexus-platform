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
    console.log("Creating analytics test user...");

    // Use service role key to bypass RLS for user creation
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { email, password } = await req.json();
    
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    console.log(`Attempting to create user: ${email}`);

    // Create the user with admin privileges
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Skip email confirmation for test user
      user_metadata: {
        role: 'analytics_viewer',
        created_by: 'system'
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
        assigned_by: user.user.id, // Self-assigned by system
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
        user_id: user.user.id,
        email: user.user.email
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