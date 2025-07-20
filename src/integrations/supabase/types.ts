export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          priority: string | null
          published_at: string | null
          status: string | null
          target_audience: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          priority?: string | null
          published_at?: string | null
          status?: string | null
          target_audience?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          priority?: string | null
          published_at?: string | null
          status?: string | null
          target_audience?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          adult_count: number | null
          attendance_date: string
          child_count: number | null
          created_at: string | null
          event_id: string | null
          id: string
          recorded_by: string | null
          service_plan_id: string | null
          service_type: string | null
          special_events: string | null
          total_count: number
          visitor_count: number | null
          weather_conditions: string | null
        }
        Insert: {
          adult_count?: number | null
          attendance_date: string
          child_count?: number | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          recorded_by?: string | null
          service_plan_id?: string | null
          service_type?: string | null
          special_events?: string | null
          total_count: number
          visitor_count?: number | null
          weather_conditions?: string | null
        }
        Update: {
          adult_count?: number | null
          attendance_date?: string
          child_count?: number | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          recorded_by?: string | null
          service_plan_id?: string | null
          service_type?: string | null
          special_events?: string | null
          total_count?: number
          visitor_count?: number | null
          weather_conditions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_service_plan_id_fkey"
            columns: ["service_plan_id"]
            isOneToOne: false
            referencedRelation: "service_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      budget_categories: {
        Row: {
          allocated_amount: number
          budget_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          spent_amount: number | null
        }
        Insert: {
          allocated_amount: number
          budget_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          spent_amount?: number | null
        }
        Update: {
          allocated_amount?: number
          budget_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          spent_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          allocated_amount: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          fiscal_year: number
          id: string
          name: string
          spent_amount: number | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          allocated_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          fiscal_year: number
          id?: string
          name: string
          spent_amount?: number | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          allocated_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          fiscal_year?: number
          id?: string
          name?: string
          spent_amount?: number | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      chatbot_conversations: {
        Row: {
          ai_response: string
          context_used: string | null
          created_at: string
          feedback: string | null
          id: string
          rating: number | null
          user_id: string | null
          user_message: string
        }
        Insert: {
          ai_response: string
          context_used?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
          user_message: string
        }
        Update: {
          ai_response?: string
          context_used?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
          user_message?: string
        }
        Relationships: []
      }
      chatbot_knowledge: {
        Row: {
          active: boolean | null
          category: string
          chunk_index: number | null
          content: string
          created_at: string
          id: string
          total_chunks: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string
          chunk_index?: number | null
          content: string
          created_at?: string
          id?: string
          total_chunks?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string
          chunk_index?: number | null
          content?: string
          created_at?: string
          id?: string
          total_chunks?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          check_in_method: string | null
          check_in_time: string | null
          checked_in_by: string | null
          event_id: string | null
          id: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          check_in_method?: string | null
          check_in_time?: string | null
          checked_in_by?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          check_in_method?: string | null
          check_in_time?: string | null
          checked_in_by?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      client_websites: {
        Row: {
          client_id: string | null
          content: Json
          created_at: string | null
          domain: string | null
          id: string
          name: string
          published: boolean | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          content?: Json
          created_at?: string | null
          domain?: string | null
          id?: string
          name: string
          published?: boolean | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          content?: Json
          created_at?: string | null
          domain?: string | null
          id?: string
          name?: string
          published?: boolean | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_websites_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_form_submissions: {
        Row: {
          confirmation_token: string | null
          created_at: string | null
          email: string
          id: string
          interests: string[] | null
          is_subscribed: boolean
          location: string | null
          message: string
          name: string
          preferences: Json | null
          status: string
          subject: string
          subscription_confirmed: boolean | null
          updated_at: string | null
        }
        Insert: {
          confirmation_token?: string | null
          created_at?: string | null
          email: string
          id?: string
          interests?: string[] | null
          is_subscribed?: boolean
          location?: string | null
          message: string
          name: string
          preferences?: Json | null
          status?: string
          subject: string
          subscription_confirmed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          confirmation_token?: string | null
          created_at?: string | null
          email?: string
          id?: string
          interests?: string[] | null
          is_subscribed?: boolean
          location?: string | null
          message?: string
          name?: string
          preferences?: Json | null
          status?: string
          subject?: string
          subscription_confirmed?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          access_level: string | null
          category: string | null
          created_at: string
          description: string | null
          download_count: number | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_active: boolean | null
          parent_document_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string | null
          version_number: number | null
        }
        Insert: {
          access_level?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_active?: boolean | null
          parent_document_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          version_number?: number | null
        }
        Update: {
          access_level?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          parent_document_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          anonymous: boolean | null
          category: string | null
          created_at: string | null
          currency: string | null
          donation_type: string
          donor_email: string
          donor_id: string | null
          donor_name: string
          id: string
          message: string | null
          recurring_frequency: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          anonymous?: boolean | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          donation_type: string
          donor_email: string
          donor_id?: string | null
          donor_name: string
          id?: string
          message?: string | null
          recurring_frequency?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          anonymous?: boolean | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          donation_type?: string
          donor_email?: string
          donor_id?: string | null
          donor_name?: string
          id?: string
          message?: string | null
          recurring_frequency?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          click_count: number | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          open_count: number | null
          recipient_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          template_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          click_count?: number | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          open_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          template_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          click_count?: number | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          open_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_tracking: {
        Row: {
          bounced_at: string | null
          campaign_id: string | null
          clicked_at: string | null
          id: string
          opened_at: string | null
          recipient_email: string
          sent_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          bounced_at?: string | null
          campaign_id?: string | null
          clicked_at?: string | null
          id?: string
          opened_at?: string | null
          recipient_email: string
          sent_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          bounced_at?: string | null
          campaign_id?: string | null
          clicked_at?: string | null
          id?: string
          opened_at?: string | null
          recipient_email?: string
          sent_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_tracking_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          accessibility_needs: string | null
          attendee_email: string
          attendee_name: string
          attendee_phone: string | null
          checked_in: boolean | null
          checked_in_at: string | null
          dietary_restrictions: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          event_id: string | null
          id: string
          number_of_guests: number | null
          payment_status: string | null
          registered_at: string | null
          registration_data: Json | null
          special_requests: string | null
          user_id: string | null
        }
        Insert: {
          accessibility_needs?: string | null
          attendee_email: string
          attendee_name: string
          attendee_phone?: string | null
          checked_in?: boolean | null
          checked_in_at?: string | null
          dietary_restrictions?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          event_id?: string | null
          id?: string
          number_of_guests?: number | null
          payment_status?: string | null
          registered_at?: string | null
          registration_data?: Json | null
          special_requests?: string | null
          user_id?: string | null
        }
        Update: {
          accessibility_needs?: string | null
          attendee_email?: string
          attendee_name?: string
          attendee_phone?: string | null
          checked_in?: boolean | null
          checked_in_at?: string | null
          dietary_restrictions?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          event_id?: string | null
          id?: string
          number_of_guests?: number | null
          payment_status?: string | null
          registered_at?: string | null
          registration_data?: Json | null
          special_requests?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          image_url: string | null
          location: string | null
          max_capacity: number | null
          organizer_id: string | null
          registration_deadline: string | null
          registration_required: boolean | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_capacity?: number | null
          organizer_id?: string | null
          registration_deadline?: string | null
          registration_required?: boolean | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_capacity?: number | null
          organizer_id?: string | null
          registration_deadline?: string | null
          registration_required?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          approved_by: string | null
          budget_category_id: string | null
          created_at: string | null
          description: string
          expense_date: string
          id: string
          receipt_url: string | null
          status: string | null
          submitted_by: string | null
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          amount: number
          approved_by?: string | null
          budget_category_id?: string | null
          created_at?: string | null
          description: string
          expense_date: string
          id?: string
          receipt_url?: string | null
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          approved_by?: string | null
          budget_category_id?: string | null
          created_at?: string | null
          description?: string
          expense_date?: string
          id?: string
          receipt_url?: string | null
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_budget_category_id_fkey"
            columns: ["budget_category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_analytics: {
        Row: {
          conversion_count: number | null
          created_at: string
          date_recorded: string | null
          funnel_id: string | null
          id: string
          step_index: number
          visitor_count: number | null
        }
        Insert: {
          conversion_count?: number | null
          created_at?: string
          date_recorded?: string | null
          funnel_id?: string | null
          id?: string
          step_index: number
          visitor_count?: number | null
        }
        Update: {
          conversion_count?: number | null
          created_at?: string
          date_recorded?: string | null
          funnel_id?: string | null
          id?: string
          step_index?: number
          visitor_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "funnel_analytics_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "user_funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_templates: {
        Row: {
          conversion_rate: number | null
          created_at: string
          description: string | null
          funnel_type: string
          id: string
          is_premium: boolean | null
          name: string
          niche: string
          preview_images: string[] | null
          steps: number | null
          template_data: Json
          updated_at: string
        }
        Insert: {
          conversion_rate?: number | null
          created_at?: string
          description?: string | null
          funnel_type: string
          id?: string
          is_premium?: boolean | null
          name: string
          niche: string
          preview_images?: string[] | null
          steps?: number | null
          template_data?: Json
          updated_at?: string
        }
        Update: {
          conversion_rate?: number | null
          created_at?: string
          description?: string | null
          funnel_type?: string
          id?: string
          is_premium?: boolean | null
          name?: string
          niche?: string
          preview_images?: string[] | null
          steps?: number | null
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      member_engagement: {
        Row: {
          activity_details: Json | null
          activity_type: string
          created_at: string | null
          engagement_score: number | null
          id: string
          user_id: string | null
        }
        Insert: {
          activity_details?: Json | null
          activity_type: string
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          user_id?: string | null
        }
        Update: {
          activity_details?: Json | null
          activity_type?: string
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      member_onboarding_progress: {
        Row: {
          completed_at: string | null
          completed_steps: number[] | null
          current_step: number | null
          id: string
          started_at: string | null
          status: string | null
          user_id: string | null
          workflow_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: number[] | null
          current_step?: number | null
          id?: string
          started_at?: string | null
          status?: string | null
          user_id?: string | null
          workflow_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_steps?: number[] | null
          current_step?: number | null
          id?: string
          started_at?: string | null
          status?: string | null
          user_id?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_onboarding_progress_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "onboarding_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      member_roles: {
        Row: {
          active: boolean | null
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          role_description: string | null
          role_name: string
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role_description?: string | null
          role_name: string
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role_description?: string | null
          role_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      message_threads: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          last_message_at: string | null
          participants: string[]
          subject: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_message_at?: string | null
          participants: string[]
          subject: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_message_at?: string | null
          participants?: string[]
          subject?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          recipient_id: string | null
          sender_id: string | null
          subject: string
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          subject: string
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          subject?: string
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ministry_resources: {
        Row: {
          access_level: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          external_url: string | null
          file_url: string | null
          id: string
          ministry_area: string | null
          resource_type: string
          tags: string[] | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          access_level?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          external_url?: string | null
          file_url?: string | null
          id?: string
          ministry_area?: string | null
          resource_type: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          access_level?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          external_url?: string | null
          file_url?: string | null
          id?: string
          ministry_area?: string | null
          resource_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          confirmation_token: string | null
          confirmed: boolean | null
          email: string
          id: string
          preferences: Json | null
          subscribed: boolean | null
          subscribed_at: string | null
          unsubscribed_at: string | null
          user_id: string | null
        }
        Insert: {
          confirmation_token?: string | null
          confirmed?: boolean | null
          email: string
          id?: string
          preferences?: Json | null
          subscribed?: boolean | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Update: {
          confirmation_token?: string | null
          confirmed?: boolean | null
          email?: string
          id?: string
          preferences?: Json | null
          subscribed?: boolean | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string | null
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      onboarding_workflows: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          steps: Json
          updated_at: string | null
          workflow_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          steps: Json
          updated_at?: string | null
          workflow_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          steps?: Json
          updated_at?: string | null
          workflow_type?: string
        }
        Relationships: []
      }
      pledges: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          end_date: string | null
          frequency: string | null
          fulfilled_amount: number | null
          id: string
          pledger_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          end_date?: string | null
          frequency?: string | null
          fulfilled_amount?: number | null
          id?: string
          pledger_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          end_date?: string | null
          frequency?: string | null
          fulfilled_amount?: number | null
          id?: string
          pledger_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prayer_request_updates: {
        Row: {
          created_at: string
          id: string
          is_answer: boolean | null
          prayer_request_id: string
          update_text: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_answer?: boolean | null
          prayer_request_id: string
          update_text: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_answer?: boolean | null
          prayer_request_id?: string
          update_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_request_updates_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          answer_description: string | null
          answered_at: string | null
          category: string | null
          created_at: string
          description: string
          id: string
          is_anonymous: boolean | null
          privacy_level: string | null
          requester_email: string | null
          requester_id: string | null
          requester_name: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          answer_description?: string | null
          answered_at?: string | null
          category?: string | null
          created_at?: string
          description: string
          id?: string
          is_anonymous?: boolean | null
          privacy_level?: string | null
          requester_email?: string | null
          requester_id?: string | null
          requester_name?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          answer_description?: string | null
          answered_at?: string | null
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          is_anonymous?: boolean | null
          privacy_level?: string | null
          requester_email?: string | null
          requester_id?: string | null
          requester_name?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          created_at: string | null
          currency: string
          id: string
          interval: string | null
          interval_count: number | null
          product_id: string | null
          stripe_price_id: string
          type: string
          unit_amount: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          currency: string
          id?: string
          interval?: string | null
          interval_count?: number | null
          product_id?: string | null
          stripe_price_id: string
          type: string
          unit_amount: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          currency?: string
          id?: string
          interval?: string | null
          interval_count?: number | null
          product_id?: string | null
          stripe_price_id?: string
          type?: string
          unit_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          stripe_product_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          stripe_product_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          stripe_product_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          church_role: string | null
          city: string | null
          created_at: string
          date_joined: string | null
          date_of_birth: string | null
          display_name: string | null
          early_access_status: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          id: string
          interests: string[] | null
          last_name: string | null
          marital_status: string | null
          member_status: string | null
          membership_type: string | null
          ministry_interests: string[] | null
          occupation: string | null
          onboarding_completed: boolean | null
          organization_name: string | null
          organization_type: string | null
          phone: string | null
          profile_image_url: string | null
          skills: string[] | null
          state: string | null
          updated_at: string
          user_id: string
          visibility_settings: Json | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          church_role?: string | null
          city?: string | null
          created_at?: string
          date_joined?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          early_access_status?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          interests?: string[] | null
          last_name?: string | null
          marital_status?: string | null
          member_status?: string | null
          membership_type?: string | null
          ministry_interests?: string[] | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          organization_name?: string | null
          organization_type?: string | null
          phone?: string | null
          profile_image_url?: string | null
          skills?: string[] | null
          state?: string | null
          updated_at?: string
          user_id: string
          visibility_settings?: Json | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          church_role?: string | null
          city?: string | null
          created_at?: string
          date_joined?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          early_access_status?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          interests?: string[] | null
          last_name?: string | null
          marital_status?: string | null
          member_status?: string | null
          membership_type?: string | null
          ministry_interests?: string[] | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          organization_name?: string | null
          organization_type?: string | null
          phone?: string | null
          profile_image_url?: string | null
          skills?: string[] | null
          state?: string | null
          updated_at?: string
          user_id?: string
          visibility_settings?: Json | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      room_bookings: {
        Row: {
          approved_by: string | null
          attendee_count: number | null
          booked_by: string | null
          created_at: string | null
          end_time: string
          equipment_needed: string[] | null
          event_title: string
          id: string
          purpose: string | null
          room_id: string | null
          setup_requirements: string | null
          start_time: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          attendee_count?: number | null
          booked_by?: string | null
          created_at?: string | null
          end_time: string
          equipment_needed?: string[] | null
          event_title: string
          id?: string
          purpose?: string | null
          room_id?: string | null
          setup_requirements?: string | null
          start_time: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          attendee_count?: number | null
          booked_by?: string | null
          created_at?: string | null
          end_time?: string
          equipment_needed?: string[] | null
          event_title?: string
          id?: string
          purpose?: string | null
          room_id?: string | null
          setup_requirements?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[] | null
          booking_rules: string | null
          capacity: number | null
          created_at: string | null
          equipment: string[] | null
          id: string
          location: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          booking_rules?: string | null
          capacity?: number | null
          created_at?: string | null
          equipment?: string[] | null
          id?: string
          location?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          booking_rules?: string | null
          capacity?: number | null
          created_at?: string | null
          equipment?: string[] | null
          id?: string
          location?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string
          filters: Json
          id: string
          is_public: boolean | null
          name: string
          search_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          filters: Json
          id?: string
          is_public?: boolean | null
          name: string
          search_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          is_public?: boolean | null
          name?: string
          search_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sermons: {
        Row: {
          audio_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          notes_url: string | null
          scripture_reference: string | null
          series_name: string | null
          sermon_date: string
          speaker_name: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          notes_url?: string | null
          scripture_reference?: string | null
          series_name?: string | null
          sermon_date: string
          speaker_name: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          notes_url?: string | null
          scripture_reference?: string | null
          series_name?: string | null
          sermon_date?: string
          speaker_name?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      service_elements: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          duration_minutes: number | null
          element_type: string
          id: string
          notes: string | null
          order_index: number
          service_plan_id: string | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          element_type: string
          id?: string
          notes?: string | null
          order_index: number
          service_plan_id?: string | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          element_type?: string
          id?: string
          notes?: string | null
          order_index?: number
          service_plan_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_elements_service_plan_id_fkey"
            columns: ["service_plan_id"]
            isOneToOne: false
            referencedRelation: "service_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      service_plans: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          scripture_reading: string | null
          sermon_speaker: string | null
          sermon_title: string | null
          service_date: string
          service_type: string | null
          status: string | null
          tech_lead: string | null
          theme: string | null
          updated_at: string | null
          worship_leader: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          scripture_reading?: string | null
          sermon_speaker?: string | null
          sermon_title?: string | null
          service_date: string
          service_type?: string | null
          status?: string | null
          tech_lead?: string | null
          theme?: string | null
          updated_at?: string | null
          worship_leader?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          scripture_reading?: string | null
          sermon_speaker?: string | null
          sermon_title?: string | null
          service_date?: string
          service_type?: string | null
          status?: string | null
          tech_lead?: string | null
          theme?: string | null
          updated_at?: string | null
          worship_leader?: string | null
        }
        Relationships: []
      }
      small_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "small_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "small_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      small_groups: {
        Row: {
          age_group: string | null
          category: string | null
          co_leader_id: string | null
          created_at: string
          description: string | null
          gender_preference: string | null
          id: string
          image_url: string | null
          is_open_enrollment: boolean | null
          leader_id: string | null
          location: string | null
          max_capacity: number | null
          meeting_day: string | null
          meeting_time: string | null
          name: string
          requirements: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          age_group?: string | null
          category?: string | null
          co_leader_id?: string | null
          created_at?: string
          description?: string | null
          gender_preference?: string | null
          id?: string
          image_url?: string | null
          is_open_enrollment?: boolean | null
          leader_id?: string | null
          location?: string | null
          max_capacity?: number | null
          meeting_day?: string | null
          meeting_time?: string | null
          name: string
          requirements?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          age_group?: string | null
          category?: string | null
          co_leader_id?: string | null
          created_at?: string
          description?: string | null
          gender_preference?: string | null
          id?: string
          image_url?: string | null
          is_open_enrollment?: boolean | null
          leader_id?: string | null
          location?: string | null
          max_capacity?: number | null
          meeting_day?: string | null
          meeting_time?: string | null
          name?: string
          requirements?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string
          current_period_start: string
          id: string
          price_id: string | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          price_id?: string | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          price_id?: string | null
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      system_upgrades: {
        Row: {
          completed_at: string | null
          id: string
          notes: string | null
          performed_by: string | null
          rollback_data: Json | null
          started_at: string | null
          status: string
          upgrade_type: string
          version_from: string
          version_to: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          notes?: string | null
          performed_by?: string | null
          rollback_data?: Json | null
          started_at?: string | null
          status?: string
          upgrade_type?: string
          version_from: string
          version_to: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          notes?: string | null
          performed_by?: string | null
          rollback_data?: Json | null
          started_at?: string | null
          status?: string
          upgrade_type?: string
          version_from?: string
          version_to?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string | null
          status: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          leader_id: string | null
          meeting_schedule: string | null
          name: string
          status: string | null
          team_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          leader_id?: string | null
          meeting_schedule?: string | null
          name: string
          status?: string | null
          team_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          leader_id?: string | null
          meeting_schedule?: string | null
          name?: string
          status?: string | null
          team_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string
          content: Json
          created_at: string | null
          description: string | null
          id: string
          name: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          content?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_funnels: {
        Row: {
          analytics_data: Json | null
          created_at: string
          funnel_type: string
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          steps_data: Json
          template_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          analytics_data?: Json | null
          created_at?: string
          funnel_type: string
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          steps_data?: Json
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          analytics_data?: Json | null
          created_at?: string
          funnel_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          steps_data?: Json
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_funnels_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "funnel_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          active: boolean | null
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          active?: boolean | null
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          active?: boolean | null
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_websites: {
        Row: {
          analytics_data: Json | null
          content_data: Json
          created_at: string
          custom_domain: string | null
          domain: string | null
          id: string
          is_published: boolean | null
          name: string
          published_at: string | null
          seo_settings: Json | null
          template_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          analytics_data?: Json | null
          content_data?: Json
          created_at?: string
          custom_domain?: string | null
          domain?: string | null
          id?: string
          is_published?: boolean | null
          name: string
          published_at?: string | null
          seo_settings?: Json | null
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          analytics_data?: Json | null
          content_data?: Json
          created_at?: string
          custom_domain?: string | null
          domain?: string | null
          id?: string
          is_published?: boolean | null
          name?: string
          published_at?: string | null
          seo_settings?: Json | null
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_websites_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "website_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_applications: {
        Row: {
          application_message: string | null
          applied_at: string
          availability: string | null
          hours_completed: number | null
          id: string
          opportunity_id: string
          relevant_experience: string | null
          responded_at: string | null
          response_message: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          application_message?: string | null
          applied_at?: string
          availability?: string | null
          hours_completed?: number | null
          id?: string
          opportunity_id: string
          relevant_experience?: string | null
          responded_at?: string | null
          response_message?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          application_message?: string | null
          applied_at?: string
          availability?: string | null
          hours_completed?: number | null
          id?: string
          opportunity_id?: string
          relevant_experience?: string | null
          responded_at?: string | null
          response_message?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "volunteer_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_opportunities: {
        Row: {
          application_deadline: string | null
          coordinator_id: string | null
          created_at: string
          current_volunteers: number | null
          department: string | null
          description: string
          end_date: string | null
          id: string
          is_urgent: boolean | null
          location: string | null
          max_volunteers: number | null
          requirements: string | null
          schedule_type: string | null
          skills_needed: string[] | null
          start_date: string | null
          status: string | null
          time_commitment: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          coordinator_id?: string | null
          created_at?: string
          current_volunteers?: number | null
          department?: string | null
          description: string
          end_date?: string | null
          id?: string
          is_urgent?: boolean | null
          location?: string | null
          max_volunteers?: number | null
          requirements?: string | null
          schedule_type?: string | null
          skills_needed?: string[] | null
          start_date?: string | null
          status?: string | null
          time_commitment?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          coordinator_id?: string | null
          created_at?: string
          current_volunteers?: number | null
          department?: string | null
          description?: string
          end_date?: string | null
          id?: string
          is_urgent?: boolean | null
          location?: string | null
          max_volunteers?: number | null
          requirements?: string | null
          schedule_type?: string | null
          skills_needed?: string[] | null
          start_date?: string | null
          status?: string | null
          time_commitment?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          is_premium: boolean | null
          name: string
          niche: string
          preview_image: string | null
          template_data: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          is_premium?: boolean | null
          name: string
          niche: string
          preview_image?: string | null
          template_data?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          is_premium?: boolean | null
          name?: string
          niche?: string
          preview_image?: string | null
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "pastor" | "staff" | "member" | "volunteer" | "guest"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "pastor", "staff", "member", "volunteer", "guest"],
    },
  },
} as const
