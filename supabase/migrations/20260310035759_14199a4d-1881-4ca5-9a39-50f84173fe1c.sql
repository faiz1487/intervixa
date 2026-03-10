
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Jobs table
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_name text NOT NULL,
  location text DEFAULT '',
  skills_required text[] DEFAULT '{}',
  apply_link text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read jobs" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert jobs" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update jobs" ON public.jobs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete jobs" ON public.jobs
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Interview questions table
CREATE TABLE public.interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  topic text NOT NULL,
  question text NOT NULL,
  answer text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read questions" ON public.interview_questions
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert questions" ON public.interview_questions
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update questions" ON public.interview_questions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete questions" ON public.interview_questions
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- HR contacts table
CREATE TABLE public.hr_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  email text DEFAULT '',
  linkedin text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.hr_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can select hr_contacts" ON public.hr_contacts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert hr_contacts" ON public.hr_contacts
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update hr_contacts" ON public.hr_contacts
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hr_contacts" ON public.hr_contacts
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Resume templates table
CREATE TABLE public.resume_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read templates" ON public.resume_templates
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert templates" ON public.resume_templates
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update templates" ON public.resume_templates
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete templates" ON public.resume_templates
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for resume templates
INSERT INTO storage.buckets (id, name, public) VALUES ('resume-templates', 'resume-templates', true);

CREATE POLICY "Admins can upload templates" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resume-templates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete template files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'resume-templates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read template files" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resume-templates');
