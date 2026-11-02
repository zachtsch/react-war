ALTER TABLE public.messages
ADD COLUMN user_id UUID
REFERENCES auth.users(id)
DEFAULT auth.uid();

ALTER TABLE public.messages
ADD CONSTRAINT message_length
CHECK (char_length(content) BETWEEN 1 AND 500);

GRANT SELECT ON public.messages TO authenticated;

GRANT INSERT (content)
ON public.messages TO authenticated;

CREATE POLICY "Authenticated users can post"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = (SELECT auth.uid())
);