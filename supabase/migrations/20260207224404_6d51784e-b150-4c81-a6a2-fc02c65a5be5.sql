
-- Drop the existing delete policy that allows deleting global frameworks
DROP POLICY IF EXISTS "Users can delete own frameworks" ON public.frameworks;

-- Recreate with protection for global frameworks (user_id IS NULL)
CREATE POLICY "Users can delete own frameworks"
ON public.frameworks
FOR DELETE
USING (user_id IS NOT NULL AND auth.uid() = user_id);
