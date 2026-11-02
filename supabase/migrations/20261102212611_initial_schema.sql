CREATE TABLE public.messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content TEXT NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.messages FROM anon, authenticated;

GRANT SELECT ON TABLE public.messages TO anon;

CREATE POLICY "Anyone can read messages"
ON public.messages
FOR SELECT
TO anon
USING (true);