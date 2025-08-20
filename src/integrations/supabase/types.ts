export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      advanced_permissions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          granted_by: string | null
          id: string
          permission_level: string
          resource_id: string | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          permission_level: string
          resource_id?: string | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          permission_level?: string
          resource_id?: string | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_dashboards: {
        Row: {
          configuration: Json
          created_at: string | null
          id: string
          is_shared: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          session_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backup_status: {
        Row: {
          backup_type: string
          backup_url: string | null
          completed_at: string | null
          error_message: string | null
          file_size: number | null
          id: string
          started_at: string | null
          status: string
        }
        Insert: {
          backup_type: string
          backup_url?: string | null
          completed_at?: string | null
          error_message?: string | null
          file_size?: number | null
          id?: string
          started_at?: string | null
          status: string
        }
        Update: {
          backup_type?: string
          backup_url?: string | null
          completed_at?: string | null
          error_message?: string | null
          file_size?: number | null
          id?: string
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      baptism_certificates: {
        Row: {
          baptism_id: string | null
          certificate_number: string
          certificate_url: string | null
          created_at: string
          id: string
          issued_by: string | null
          issued_date: string
          mailed: boolean | null
          mailing_address: string | null
          printed: boolean | null
          recipient_name: string
          template_used: string | null
        }
        Insert: {
          baptism_id?: string | null
          certificate_number: string
          certificate_url?: string | null
          created_at?: string
          id?: string
          issued_by?: string | null
          issued_date?: string
          mailed?: boolean | null
          mailing_address?: string | null
          printed?: boolean | null
          recipient_name: string
          template_used?: string | null
        }
        Update: {
          baptism_id?: string | null
          certificate_number?: string
          certificate_url?: string | null
          created_at?: string
          id?: string
          issued_by?: string | null
          issued_date?: string
          mailed?: boolean | null
          mailing_address?: string | null
          printed?: boolean | null
          recipient_name?: string
          template_used?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "baptism_certificates_baptism_id_fkey"
            columns: ["baptism_id"]
            isOneToOne: false
            referencedRelation: "baptisms"
            referencedColumns: ["id"]
          },
        ]
      }
      baptism_preparation_attendance: {
        Row: {
          attendance_date: string | null
          attended: boolean | null
          baptism_id: string | null
          id: string
          notes: string | null
          session_id: string | null
        }
        Insert: {
          attendance_date?: string | null
          attended?: boolean | null
          baptism_id?: string | null
          id?: string
          notes?: string | null
          session_id?: string | null
        }
        Update: {
          attendance_date?: string | null
          attended?: boolean | null
          baptism_id?: string | null
          id?: string
          notes?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "baptism_preparation_attendance_baptism_id_fkey"
            columns: ["baptism_id"]
            isOneToOne: false
            referencedRelation: "baptisms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baptism_preparation_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "baptism_preparation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      baptism_preparation_sessions: {
        Row: {
          cost: number | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          instructor_id: string | null
          location: string | null
          materials_provided: Json | null
          max_participants: number | null
          requirements: string | null
          session_date: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_id?: string | null
          location?: string | null
          materials_provided?: Json | null
          max_participants?: number | null
          requirements?: string | null
          session_date: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_id?: string | null
          location?: string | null
          materials_provided?: Json | null
          max_participants?: number | null
          requirements?: string | null
          session_date?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      baptisms: {
        Row: {
          baptism_date: string
          baptism_method: Database["public"]["Enums"]["baptism_method"] | null
          candidate_email: string | null
          candidate_id: string | null
          candidate_name: string
          candidate_phone: string | null
          certificate_issued: boolean | null
          certificate_number: string | null
          counseling_sessions_completed: number | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          location: string
          medical_considerations: string | null
          notes: string | null
          officiant_id: string | null
          parent_guardian_email: string | null
          parent_guardian_name: string | null
          parent_guardian_phone: string | null
          photos: Json | null
          preparation_completed: boolean | null
          preparation_completion_date: string | null
          sacrament_type: Database["public"]["Enums"]["sacrament_type"]
          special_requests: string | null
          status: string | null
          updated_at: string
          video_url: string | null
          witnesses: Json | null
        }
        Insert: {
          baptism_date: string
          baptism_method?: Database["public"]["Enums"]["baptism_method"] | null
          candidate_email?: string | null
          candidate_id?: string | null
          candidate_name: string
          candidate_phone?: string | null
          certificate_issued?: boolean | null
          certificate_number?: string | null
          counseling_sessions_completed?: number | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          location: string
          medical_considerations?: string | null
          notes?: string | null
          officiant_id?: string | null
          parent_guardian_email?: string | null
          parent_guardian_name?: string | null
          parent_guardian_phone?: string | null
          photos?: Json | null
          preparation_completed?: boolean | null
          preparation_completion_date?: string | null
          sacrament_type?: Database["public"]["Enums"]["sacrament_type"]
          special_requests?: string | null
          status?: string | null
          updated_at?: string
          video_url?: string | null
          witnesses?: Json | null
        }
        Update: {
          baptism_date?: string
          baptism_method?: Database["public"]["Enums"]["baptism_method"] | null
          candidate_email?: string | null
          candidate_id?: string | null
          candidate_name?: string
          candidate_phone?: string | null
          certificate_issued?: boolean | null
          certificate_number?: string | null
          counseling_sessions_completed?: number | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          location?: string
          medical_considerations?: string | null
          notes?: string | null
          officiant_id?: string | null
          parent_guardian_email?: string | null
          parent_guardian_name?: string | null
          parent_guardian_phone?: string | null
          photos?: Json | null
          preparation_completed?: boolean | null
          preparation_completion_date?: string | null
          sacrament_type?: Database["public"]["Enums"]["sacrament_type"]
          special_requests?: string | null
          status?: string | null
          updated_at?: string
          video_url?: string | null
          witnesses?: Json | null
        }
        Relationships: []
      }
      bereavement_care: {
        Row: {
          care_coordinator_id: string | null
          care_type: string
          completed_date: string | null
          created_at: string
          description: string | null
          family_member_id: string | null
          id: string
          memorial_id: string | null
          notes: string | null
          scheduled_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          care_coordinator_id?: string | null
          care_type: string
          completed_date?: string | null
          created_at?: string
          description?: string | null
          family_member_id?: string | null
          id?: string
          memorial_id?: string | null
          notes?: string | null
          scheduled_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          care_coordinator_id?: string | null
          care_type?: string
          completed_date?: string | null
          created_at?: string
          description?: string | null
          family_member_id?: string | null
          id?: string
          memorial_id?: string | null
          notes?: string | null
          scheduled_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bereavement_care_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
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
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          current_module_id: string | null
          enrolled_at: string
          id: string
          progress_percentage: number | null
          student_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          current_module_id?: string | null
          enrolled_at?: string
          id?: string
          progress_percentage?: number | null
          student_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          current_module_id?: string | null
          enrolled_at?: string
          id?: string
          progress_percentage?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_current_module_id_fkey"
            columns: ["current_module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          order_index: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          order_index?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          course_id: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          student_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          student_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_hours: number | null
          id: string
          instructor_id: string
          is_published: boolean | null
          learning_objectives: string[] | null
          prerequisites: string[] | null
          price: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id: string
          is_published?: boolean | null
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          price?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id?: string
          is_published?: boolean | null
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          price?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
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
      domain_verifications: {
        Row: {
          created_at: string | null
          dns_records: Json | null
          domain: string
          id: string
          last_checked: string | null
          ssl_status: string
          status: string
          updated_at: string | null
          user_id: string | null
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          dns_records?: Json | null
          domain: string
          id?: string
          last_checked?: string | null
          ssl_status?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          verification_token?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          dns_records?: Json | null
          domain?: string
          id?: string
          last_checked?: string | null
          ssl_status?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: []
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
      emergency_broadcasts: {
        Row: {
          channels: Json
          created_at: string
          delivery_stats: Json | null
          id: string
          message: string
          priority: string
          recipient_count: number | null
          scheduled_for: string | null
          sent_at: string | null
          sent_by: string | null
          status: string
          target_groups: Json
          title: string
          updated_at: string
        }
        Insert: {
          channels?: Json
          created_at?: string
          delivery_stats?: Json | null
          id?: string
          message: string
          priority?: string
          recipient_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          target_groups?: Json
          title: string
          updated_at?: string
        }
        Update: {
          channels?: Json
          created_at?: string
          delivery_stats?: Json | null
          id?: string
          message?: string
          priority?: string
          recipient_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          target_groups?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      grief_session_registrations: {
        Row: {
          attendance_status: string | null
          id: string
          notes: string | null
          participant_id: string | null
          registration_date: string
          session_id: string | null
        }
        Insert: {
          attendance_status?: string | null
          id?: string
          notes?: string | null
          participant_id?: string | null
          registration_date?: string
          session_id?: string | null
        }
        Update: {
          attendance_status?: string | null
          id?: string
          notes?: string | null
          participant_id?: string | null
          registration_date?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grief_session_registrations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "grief_support_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      grief_support_sessions: {
        Row: {
          cost: number | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          facilitator_id: string | null
          id: string
          location: string | null
          max_participants: number | null
          registration_required: boolean | null
          resources: string | null
          session_date: string
          session_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          facilitator_id?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          registration_required?: boolean | null
          resources?: string | null
          session_date: string
          session_type: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          facilitator_id?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          registration_required?: boolean | null
          resources?: string | null
          session_date?: string
          session_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      member_connections: {
        Row: {
          created_at: string
          id: string
          message: string | null
          requested_id: string
          requester_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          requested_id: string
          requester_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          requested_id?: string
          requester_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      member_directory: {
        Row: {
          contact_preferences: Json | null
          created_at: string
          directory_bio: string | null
          id: string
          is_visible: boolean | null
          show_address: boolean | null
          show_birthday: boolean | null
          show_email: boolean | null
          show_ministry_interests: boolean | null
          show_phone: boolean | null
          show_skills: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_preferences?: Json | null
          created_at?: string
          directory_bio?: string | null
          id?: string
          is_visible?: boolean | null
          show_address?: boolean | null
          show_birthday?: boolean | null
          show_email?: boolean | null
          show_ministry_interests?: boolean | null
          show_phone?: boolean | null
          show_skills?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_preferences?: Json | null
          created_at?: string
          directory_bio?: string | null
          id?: string
          is_visible?: boolean | null
          show_address?: boolean | null
          show_birthday?: boolean | null
          show_email?: boolean | null
          show_ministry_interests?: boolean | null
          show_phone?: boolean | null
          show_skills?: boolean | null
          updated_at?: string
          user_id?: string
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
      memorial_tributes: {
        Row: {
          author_id: string | null
          author_name: string | null
          created_at: string
          id: string
          is_public: boolean | null
          memorial_id: string | null
          tribute_text: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          memorial_id?: string | null
          tribute_text: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          memorial_id?: string | null
          tribute_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_tributes_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorials: {
        Row: {
          biography: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          date_of_passing: string
          deceased_name: string
          family_contact_info: string | null
          id: string
          memorial_fund_info: string | null
          photo_url: string | null
          service_date: string | null
          service_location: string | null
          status: string
          updated_at: string
        }
        Insert: {
          biography?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          date_of_passing: string
          deceased_name: string
          family_contact_info?: string | null
          id?: string
          memorial_fund_info?: string | null
          photo_url?: string | null
          service_date?: string | null
          service_location?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          biography?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          date_of_passing?: string
          deceased_name?: string
          family_contact_info?: string | null
          id?: string
          memorial_fund_info?: string | null
          photo_url?: string | null
          service_date?: string | null
          service_location?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      memory_book_pages: {
        Row: {
          canvas_data: Json
          created_at: string
          id: string
          memory_book_id: string | null
          page_number: number
          template_id: string
          updated_at: string
        }
        Insert: {
          canvas_data?: Json
          created_at?: string
          id?: string
          memory_book_id?: string | null
          page_number: number
          template_id: string
          updated_at?: string
        }
        Update: {
          canvas_data?: Json
          created_at?: string
          id?: string
          memory_book_id?: string | null
          page_number?: number
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_book_pages_memory_book_id_fkey"
            columns: ["memory_book_id"]
            isOneToOne: false
            referencedRelation: "memory_books"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_book_templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_premium: boolean | null
          name: string
          preview_image_url: string | null
          template_data: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name: string
          preview_image_url?: string | null
          template_data?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
          preview_image_url?: string | null
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      memory_books: {
        Row: {
          allow_comments: boolean | null
          canvas_data: Json
          created_at: string
          creator_id: string | null
          description: string | null
          id: string
          is_public: boolean | null
          is_published: boolean | null
          memorial_id: string | null
          settings: Json | null
          template_id: string
          title: string
          updated_at: string
        }
        Insert: {
          allow_comments?: boolean | null
          canvas_data?: Json
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_published?: boolean | null
          memorial_id?: string | null
          settings?: Json | null
          template_id: string
          title: string
          updated_at?: string
        }
        Update: {
          allow_comments?: boolean | null
          canvas_data?: Json
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_published?: boolean | null
          memorial_id?: string | null
          settings?: Json | null
          template_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_books_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_comments: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          author_email: string | null
          author_id: string | null
          author_name: string | null
          comment_text: string
          id: string
          is_approved: boolean | null
          is_included: boolean | null
          memory_book_id: string | null
          memory_title: string | null
          photo_url: string | null
          submitted_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          comment_text: string
          id?: string
          is_approved?: boolean | null
          is_included?: boolean | null
          memory_book_id?: string | null
          memory_title?: string | null
          photo_url?: string | null
          submitted_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          comment_text?: string
          id?: string
          is_approved?: boolean | null
          is_included?: boolean | null
          memory_book_id?: string | null
          memory_title?: string | null
          photo_url?: string | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_comments_memory_book_id_fkey"
            columns: ["memory_book_id"]
            isOneToOne: false
            referencedRelation: "memory_books"
            referencedColumns: ["id"]
          },
        ]
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
      module_progress: {
        Row: {
          completed_at: string | null
          enrollment_id: string
          id: string
          module_id: string
          notes: string | null
          time_spent_minutes: number | null
        }
        Insert: {
          completed_at?: string | null
          enrollment_id: string
          id?: string
          module_id: string
          notes?: string | null
          time_spent_minutes?: number | null
        }
        Update: {
          completed_at?: string | null
          enrollment_id?: string
          id?: string
          module_id?: string
          notes?: string | null
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "module_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
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
          action_text: string | null
          action_url: string | null
          category: string | null
          created_at: string
          id: string
          message: string
          priority: string | null
          read: boolean | null
          scheduled_for: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_text?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          message: string
          priority?: string | null
          read?: boolean | null
          scheduled_for?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_text?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          message?: string
          priority?: string | null
          read?: boolean | null
          scheduled_for?: string | null
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
      premarriage_sessions: {
        Row: {
          completion_status: string | null
          counselor_id: string | null
          couple_id: string | null
          created_at: string | null
          duration_minutes: number | null
          homework_assigned: string | null
          id: string
          next_session_date: string | null
          notes: string | null
          session_date: string
          session_type: string
          topics_covered: string[] | null
          updated_at: string | null
        }
        Insert: {
          completion_status?: string | null
          counselor_id?: string | null
          couple_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          homework_assigned?: string | null
          id?: string
          next_session_date?: string | null
          notes?: string | null
          session_date: string
          session_type: string
          topics_covered?: string[] | null
          updated_at?: string | null
        }
        Update: {
          completion_status?: string | null
          counselor_id?: string | null
          couple_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          homework_assigned?: string | null
          id?: string
          next_session_date?: string | null
          notes?: string | null
          session_date?: string
          session_type?: string
          topics_covered?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "premarriage_sessions_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "wedding_couples"
            referencedColumns: ["id"]
          },
        ]
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
          admin_notes: string | null
          avatar_url: string | null
          bio: string | null
          bio_name: string | null
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
          logo_url: string | null
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
          admin_notes?: string | null
          avatar_url?: string | null
          bio?: string | null
          bio_name?: string | null
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
          logo_url?: string | null
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
          admin_notes?: string | null
          avatar_url?: string | null
          bio?: string | null
          bio_name?: string | null
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
          logo_url?: string | null
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
      provider_profiles: {
        Row: {
          average_rating: number | null
          bio: string | null
          business_name: string | null
          certifications: string[] | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          portfolio_images: Json | null
          service_area: string | null
          social_links: Json | null
          specialties: string[] | null
          total_bookings: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string | null
          verification_documents: Json | null
          website_url: string | null
          years_experience: number | null
        }
        Insert: {
          average_rating?: number | null
          bio?: string | null
          business_name?: string | null
          certifications?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          portfolio_images?: Json | null
          service_area?: string | null
          social_links?: Json | null
          specialties?: string[] | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          verification_documents?: Json | null
          website_url?: string | null
          years_experience?: number | null
        }
        Update: {
          average_rating?: number | null
          bio?: string | null
          business_name?: string | null
          certifications?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          portfolio_images?: Json | null
          service_area?: string | null
          social_links?: Json | null
          specialties?: string[] | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          verification_documents?: Json | null
          website_url?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      push_notification_tokens: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          platform: string
          token: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          token: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          token?: string
          updated_at?: string | null
          user_id?: string | null
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
      seo_analytics: {
        Row: {
          avg_session_duration: number | null
          bounce_rate: number | null
          created_at: string
          date_recorded: string
          id: string
          keyword_rankings: Json | null
          organic_traffic: number | null
          page_id: string | null
        }
        Insert: {
          avg_session_duration?: number | null
          bounce_rate?: number | null
          created_at?: string
          date_recorded?: string
          id?: string
          keyword_rankings?: Json | null
          organic_traffic?: number | null
          page_id?: string | null
        }
        Update: {
          avg_session_duration?: number | null
          bounce_rate?: number | null
          created_at?: string
          date_recorded?: string
          id?: string
          keyword_rankings?: Json | null
          organic_traffic?: number | null
          page_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_analytics_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "seo_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_pages: {
        Row: {
          created_at: string
          created_by: string | null
          focus_keyword: string | null
          id: string
          last_updated: string
          meta_description: string | null
          meta_keywords: string[] | null
          page_title: string
          page_url: string
          seo_score: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          focus_keyword?: string | null
          id?: string
          last_updated?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          page_title: string
          page_url: string
          seo_score?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          focus_keyword?: string | null
          id?: string
          last_updated?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          page_title?: string
          page_url?: string
          seo_score?: number | null
        }
        Relationships: []
      }
      sermon_transcriptions: {
        Row: {
          audio_url: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          status: string
          title: string
          transcription_text: string | null
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          status?: string
          title: string
          transcription_text?: string | null
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          status?: string
          title?: string
          transcription_text?: string | null
          updated_at?: string
          user_id?: string
          word_count?: number | null
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
      service_bookings: {
        Row: {
          booking_date: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          completed_at: string | null
          created_at: string
          customer_id: string | null
          customer_notes: string | null
          duration_minutes: number | null
          id: string
          payment_intent_id: string | null
          payment_status: string | null
          provider_id: string | null
          provider_notes: string | null
          service_id: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          booking_date?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          customer_notes?: string | null
          duration_minutes?: number | null
          id?: string
          payment_intent_id?: string | null
          payment_status?: string | null
          provider_id?: string | null
          provider_notes?: string | null
          service_id?: string | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          booking_date?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          customer_notes?: string | null
          duration_minutes?: number | null
          id?: string
          payment_intent_id?: string | null
          payment_status?: string | null
          provider_id?: string | null
          provider_notes?: string | null
          service_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
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
      service_reviews: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          is_public: boolean | null
          provider_id: string | null
          rating: number
          review_text: string | null
          reviewer_id: string | null
          service_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          provider_id?: string | null
          rating: number
          review_text?: string | null
          reviewer_id?: string | null
          service_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          provider_id?: string | null
          rating?: number
          review_text?: string | null
          reviewer_id?: string | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "service_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          available_days: string[] | null
          available_hours: Json | null
          cancellation_policy: string | null
          category_id: string | null
          created_at: string
          description: string
          duration_minutes: number | null
          hourly_rate: number | null
          id: string
          images: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          location_details: string | null
          location_type: string
          max_advance_booking_days: number | null
          min_advance_booking_hours: number | null
          price_amount: number | null
          price_type: string
          provider_id: string | null
          requirements: string | null
          short_description: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          available_days?: string[] | null
          available_hours?: Json | null
          cancellation_policy?: string | null
          category_id?: string | null
          created_at?: string
          description: string
          duration_minutes?: number | null
          hourly_rate?: number | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location_details?: string | null
          location_type: string
          max_advance_booking_days?: number | null
          min_advance_booking_hours?: number | null
          price_amount?: number | null
          price_type: string
          provider_id?: string | null
          requirements?: string | null
          short_description?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          available_days?: string[] | null
          available_hours?: Json | null
          cancellation_policy?: string | null
          category_id?: string | null
          created_at?: string
          description?: string
          duration_minutes?: number | null
          hourly_rate?: number | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location_details?: string | null
          location_type?: string
          max_advance_booking_days?: number | null
          min_advance_booking_hours?: number | null
          price_amount?: number | null
          price_type?: string
          provider_id?: string | null
          requirements?: string | null
          short_description?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      sitemap_config: {
        Row: {
          created_at: string
          excluded_pages: Json | null
          id: string
          last_generated: string | null
          priority_pages: Json | null
          site_url: string
          update_frequency: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          excluded_pages?: Json | null
          id?: string
          last_generated?: string | null
          priority_pages?: Json | null
          site_url: string
          update_frequency?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          excluded_pages?: Json | null
          id?: string
          last_generated?: string | null
          priority_pages?: Json | null
          site_url?: string
          update_frequency?: string | null
          updated_at?: string
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
      social_media_accounts: {
        Row: {
          access_token: string | null
          account_handle: string | null
          account_name: string
          created_at: string
          expires_at: string | null
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          platform: string
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          account_handle?: string | null
          account_name: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          platform: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          account_handle?: string | null
          account_name?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          platform?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_media_analytics: {
        Row: {
          account_id: string | null
          clicks: number | null
          comments: number | null
          created_at: string
          date_recorded: string
          id: string
          impressions: number | null
          likes: number | null
          post_id: string | null
          profile_visits: number | null
          reach: number | null
          saves: number | null
          shares: number | null
          website_clicks: number | null
        }
        Insert: {
          account_id?: string | null
          clicks?: number | null
          comments?: number | null
          created_at?: string
          date_recorded?: string
          id?: string
          impressions?: number | null
          likes?: number | null
          post_id?: string | null
          profile_visits?: number | null
          reach?: number | null
          saves?: number | null
          shares?: number | null
          website_clicks?: number | null
        }
        Update: {
          account_id?: string | null
          clicks?: number | null
          comments?: number | null
          created_at?: string
          date_recorded?: string
          id?: string
          impressions?: number | null
          likes?: number | null
          post_id?: string | null
          profile_visits?: number | null
          reach?: number | null
          saves?: number | null
          shares?: number | null
          website_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "social_media_analytics_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "social_media_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_media_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_media_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_posts: {
        Row: {
          account_id: string | null
          content: string
          created_at: string
          engagement_metrics: Json | null
          hashtags: string[] | null
          id: string
          location: string | null
          media_urls: Json | null
          mentions: string[] | null
          platform_post_id: string | null
          published_at: string | null
          scheduled_for: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          content: string
          created_at?: string
          engagement_metrics?: Json | null
          hashtags?: string[] | null
          id?: string
          location?: string | null
          media_urls?: Json | null
          mentions?: string[] | null
          platform_post_id?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          content?: string
          created_at?: string
          engagement_metrics?: Json | null
          hashtags?: string[] | null
          id?: string
          location?: string | null
          media_urls?: Json | null
          mentions?: string[] | null
          platform_post_id?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_media_posts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "social_media_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_public: boolean | null
          name: string
          platforms: string[] | null
          updated_at: string
          usage_count: number | null
          user_id: string
          variables: Json | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          name: string
          platforms?: string[] | null
          updated_at?: string
          usage_count?: number | null
          user_id: string
          variables?: Json | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          name?: string
          platforms?: string[] | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string
          variables?: Json | null
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
      system_health_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          recorded_at: string | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          recorded_at?: string | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
        }
        Relationships: []
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
      user_activity_logs: {
        Row: {
          activity_description: string
          activity_type: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          page_url: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_description: string
          activity_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_description?: string
          activity_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          api_key_encrypted: string
          created_at: string
          id: string
          is_active: boolean | null
          service_label: string | null
          service_name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          api_key_encrypted: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          service_label?: string | null
          service_name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          api_key_encrypted?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          service_label?: string | null
          service_name?: string
          updated_at?: string
          user_id?: string | null
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
      user_notification_preferences: {
        Row: {
          created_at: string
          id: string
          preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          created_at: string
          current_page: string | null
          id: string
          last_seen: string
          session_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_page?: string | null
          id?: string
          last_seen?: string
          session_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_page?: string | null
          id?: string
          last_seen?: string
          session_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      user_two_factor: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          last_used_at: string | null
          secret: string
          user_id: string | null
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_used_at?: string | null
          secret: string
          user_id?: string | null
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_used_at?: string | null
          secret?: string
          user_id?: string | null
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
      wedding_ceremonies: {
        Row: {
          bride_vows: string | null
          ceremony_date: string
          ceremony_type: string | null
          couple_id: string | null
          created_at: string | null
          custom_vows: boolean | null
          estimated_duration_minutes: number | null
          florist_id: string | null
          groom_vows: string | null
          id: string
          livestream_enabled: boolean | null
          livestream_url: string | null
          music_selections: Json | null
          officiant_id: string | null
          order_of_service: Json | null
          photographer_id: string | null
          rehearsal_date: string | null
          special_elements: Json | null
          special_instructions: string | null
          updated_at: string | null
          venue_location: string
          videographer_id: string | null
        }
        Insert: {
          bride_vows?: string | null
          ceremony_date: string
          ceremony_type?: string | null
          couple_id?: string | null
          created_at?: string | null
          custom_vows?: boolean | null
          estimated_duration_minutes?: number | null
          florist_id?: string | null
          groom_vows?: string | null
          id?: string
          livestream_enabled?: boolean | null
          livestream_url?: string | null
          music_selections?: Json | null
          officiant_id?: string | null
          order_of_service?: Json | null
          photographer_id?: string | null
          rehearsal_date?: string | null
          special_elements?: Json | null
          special_instructions?: string | null
          updated_at?: string | null
          venue_location: string
          videographer_id?: string | null
        }
        Update: {
          bride_vows?: string | null
          ceremony_date?: string
          ceremony_type?: string | null
          couple_id?: string | null
          created_at?: string | null
          custom_vows?: boolean | null
          estimated_duration_minutes?: number | null
          florist_id?: string | null
          groom_vows?: string | null
          id?: string
          livestream_enabled?: boolean | null
          livestream_url?: string | null
          music_selections?: Json | null
          officiant_id?: string | null
          order_of_service?: Json | null
          photographer_id?: string | null
          rehearsal_date?: string | null
          special_elements?: Json | null
          special_instructions?: string | null
          updated_at?: string | null
          venue_location?: string
          videographer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wedding_ceremonies_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "wedding_couples"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_couples: {
        Row: {
          bride_id: string | null
          bride_name: string
          budget_amount: number | null
          ceremony_type: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          engagement_date: string | null
          estimated_guests: number | null
          groom_id: string | null
          groom_name: string
          id: string
          planning_status: string | null
          reception_location: string | null
          relationship_status: string
          special_requests: string | null
          updated_at: string | null
          venue_location: string | null
          wedding_date: string | null
        }
        Insert: {
          bride_id?: string | null
          bride_name: string
          budget_amount?: number | null
          ceremony_type?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          engagement_date?: string | null
          estimated_guests?: number | null
          groom_id?: string | null
          groom_name: string
          id?: string
          planning_status?: string | null
          reception_location?: string | null
          relationship_status?: string
          special_requests?: string | null
          updated_at?: string | null
          venue_location?: string | null
          wedding_date?: string | null
        }
        Update: {
          bride_id?: string | null
          bride_name?: string
          budget_amount?: number | null
          ceremony_type?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          engagement_date?: string | null
          estimated_guests?: number | null
          groom_id?: string | null
          groom_name?: string
          id?: string
          planning_status?: string | null
          reception_location?: string | null
          relationship_status?: string
          special_requests?: string | null
          updated_at?: string | null
          venue_location?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
      wedding_guests: {
        Row: {
          accommodation_needed: boolean | null
          couple_id: string | null
          created_at: string | null
          dietary_restrictions: string | null
          gift_received: string | null
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          guest_type: string | null
          id: string
          invitation_sent: boolean | null
          invitation_sent_at: string | null
          notes: string | null
          plus_one_name: string | null
          rsvp_date: string | null
          rsvp_status: string | null
          thank_you_sent: boolean | null
        }
        Insert: {
          accommodation_needed?: boolean | null
          couple_id?: string | null
          created_at?: string | null
          dietary_restrictions?: string | null
          gift_received?: string | null
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          guest_type?: string | null
          id?: string
          invitation_sent?: boolean | null
          invitation_sent_at?: string | null
          notes?: string | null
          plus_one_name?: string | null
          rsvp_date?: string | null
          rsvp_status?: string | null
          thank_you_sent?: boolean | null
        }
        Update: {
          accommodation_needed?: boolean | null
          couple_id?: string | null
          created_at?: string | null
          dietary_restrictions?: string | null
          gift_received?: string | null
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          guest_type?: string | null
          id?: string
          invitation_sent?: boolean | null
          invitation_sent_at?: string | null
          notes?: string | null
          plus_one_name?: string | null
          rsvp_date?: string | null
          rsvp_status?: string | null
          thank_you_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "wedding_guests_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "wedding_couples"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_tasks: {
        Row: {
          actual_cost: number | null
          assigned_to: string | null
          category: string
          completed: boolean | null
          completed_at: string | null
          couple_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimated_cost: number | null
          id: string
          notes: string | null
          priority: string | null
          task_name: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          actual_cost?: number | null
          assigned_to?: string | null
          category: string
          completed?: boolean | null
          completed_at?: string | null
          couple_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          priority?: string | null
          task_name: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          actual_cost?: number | null
          assigned_to?: string | null
          category?: string
          completed?: boolean | null
          completed_at?: string | null
          couple_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          priority?: string | null
          task_name?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wedding_tasks_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "wedding_couples"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_vendors: {
        Row: {
          availability_calendar: Json | null
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          id: string
          is_preferred: boolean | null
          portfolio_images: Json | null
          pricing_info: string | null
          rating: number | null
          review_count: number | null
          service_id: string | null
          specialties: string[] | null
          updated_at: string | null
          vendor_name: string
          vendor_type: string
          website_url: string | null
        }
        Insert: {
          availability_calendar?: Json | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_preferred?: boolean | null
          portfolio_images?: Json | null
          pricing_info?: string | null
          rating?: number | null
          review_count?: number | null
          service_id?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          vendor_name: string
          vendor_type: string
          website_url?: string | null
        }
        Update: {
          availability_calendar?: Json | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_preferred?: boolean | null
          portfolio_images?: Json | null
          pricing_info?: string | null
          rating?: number | null
          review_count?: number | null
          service_id?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          vendor_name?: string
          vendor_type?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wedding_vendors_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_websites: {
        Row: {
          access_password: string | null
          couple_id: string | null
          created_at: string | null
          custom_domain: string | null
          gift_registry_links: Json | null
          id: string
          is_published: boolean | null
          password_protected: boolean | null
          photo_gallery: Json | null
          rsvp_enabled: boolean | null
          template_id: string
          updated_at: string | null
          visitor_count: number | null
          website_data: Json
          website_url: string | null
        }
        Insert: {
          access_password?: string | null
          couple_id?: string | null
          created_at?: string | null
          custom_domain?: string | null
          gift_registry_links?: Json | null
          id?: string
          is_published?: boolean | null
          password_protected?: boolean | null
          photo_gallery?: Json | null
          rsvp_enabled?: boolean | null
          template_id: string
          updated_at?: string | null
          visitor_count?: number | null
          website_data?: Json
          website_url?: string | null
        }
        Update: {
          access_password?: string | null
          couple_id?: string | null
          created_at?: string | null
          custom_domain?: string | null
          gift_registry_links?: Json | null
          id?: string
          is_published?: boolean | null
          password_protected?: boolean | null
          photo_gallery?: Json | null
          rsvp_enabled?: boolean | null
          template_id?: string
          updated_at?: string | null
          visitor_count?: number | null
          website_data?: Json
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wedding_websites_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "wedding_couples"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_course_progress: {
        Args: { enrollment_uuid: string }
        Returns: number
      }
      create_sample_websites_for_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "pastor" | "staff" | "member" | "volunteer" | "guest"
      baptism_method: "immersion" | "sprinkling" | "pouring"
      sacrament_type:
        | "baptism"
        | "confirmation"
        | "communion"
        | "dedication"
        | "blessing"
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
      baptism_method: ["immersion", "sprinkling", "pouring"],
      sacrament_type: [
        "baptism",
        "confirmation",
        "communion",
        "dedication",
        "blessing",
      ],
    },
  },
} as const
