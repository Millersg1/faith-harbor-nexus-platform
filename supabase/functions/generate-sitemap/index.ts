import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get sitemap configuration
    const { data: config } = await supabaseClient
      .from('sitemap_config')
      .select('*')
      .single();

    const siteUrl = config?.site_url || 'https://faithharbor.church';
    const priorityPages = config?.priority_pages || [];
    const excludedPages = config?.excluded_pages || [];

    // Get all SEO pages
    const { data: seoPages } = await supabaseClient
      .from('seo_pages')
      .select('page_url, last_updated, priority')
      .order('page_url');

    // Get dynamic content URLs
    const { data: events } = await supabaseClient
      .from('events')
      .select('id, updated_at')
      .eq('status', 'published');

    const { data: announcements } = await supabaseClient
      .from('announcements')
      .select('id, updated_at')
      .eq('is_published', true);

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add SEO pages
    if (seoPages) {
      for (const page of seoPages) {
        if (!excludedPages.includes(page.page_url)) {
          const priority = priorityPages.includes(page.page_url) ? '1.0' : '0.8';
          const lastmod = new Date(page.last_updated).toISOString().split('T')[0];
          
          sitemap += `
  <url>
    <loc>${siteUrl}${page.page_url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
        }
      }
    }

    // Add dynamic event pages
    if (events) {
      for (const event of events) {
        const lastmod = new Date(event.updated_at).toISOString().split('T')[0];
        sitemap += `
  <url>
    <loc>${siteUrl}/events/${event.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    }

    // Add dynamic announcement pages
    if (announcements) {
      for (const announcement of announcements) {
        const lastmod = new Date(announcement.updated_at).toISOString().split('T')[0];
        sitemap += `
  <url>
    <loc>${siteUrl}/announcements/${announcement.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
      }
    }

    sitemap += `
</urlset>`;

    // Update last generated timestamp
    await supabaseClient
      .from('sitemap_config')
      .update({ last_generated: new Date().toISOString() })
      .eq('id', config?.id);

    return new Response(JSON.stringify({ sitemap }), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      },
      status: 200,
    });

  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});