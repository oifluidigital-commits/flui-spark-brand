
-- Add length and range constraints for profiles table
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_name_length CHECK (length(name) <= 200),
ADD CONSTRAINT profiles_valid_onboarding_step CHECK (onboarding_step BETWEEN 1 AND 10),
ADD CONSTRAINT profiles_company_length CHECK (length(company) <= 200),
ADD CONSTRAINT profiles_role_length CHECK (length(role) <= 200);

-- Add length constraint for brands name
ALTER TABLE public.brands
ADD CONSTRAINT brands_name_length CHECK (length(name) <= 200);

-- Add length constraints for ideas
ALTER TABLE public.ideas
ADD CONSTRAINT ideas_title_length CHECK (length(title) <= 500),
ADD CONSTRAINT ideas_description_length CHECK (length(description) <= 5000);

-- Add length constraints for sprints
ALTER TABLE public.sprints
ADD CONSTRAINT sprints_title_length CHECK (length(title) <= 500),
ADD CONSTRAINT sprints_description_length CHECK (length(description) <= 5000),
ADD CONSTRAINT sprints_theme_length CHECK (length(theme) <= 200);

-- Add length constraints for sprint_contents
ALTER TABLE public.sprint_contents
ADD CONSTRAINT sprint_contents_title_length CHECK (length(title) <= 500),
ADD CONSTRAINT sprint_contents_description_length CHECK (length(description) <= 5000),
ADD CONSTRAINT sprint_contents_hook_length CHECK (length(hook) <= 1000);

-- Add length constraints for content_pillars
ALTER TABLE public.content_pillars
ADD CONSTRAINT content_pillars_name_length CHECK (length(name) <= 200),
ADD CONSTRAINT content_pillars_description_length CHECK (length(description) <= 2000);

-- Add length constraints for frameworks
ALTER TABLE public.frameworks
ADD CONSTRAINT frameworks_name_length CHECK (length(name) <= 200),
ADD CONSTRAINT frameworks_description_length CHECK (length(description) <= 2000);

-- Add length constraints for trends
ALTER TABLE public.trends
ADD CONSTRAINT trends_title_length CHECK (length(title) <= 500),
ADD CONSTRAINT trends_description_length CHECK (length(description) <= 5000);

-- Harden handle_new_user with name length truncation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    substring(COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 1, 200)
  );
  RETURN NEW;
END;
$function$;
