-- Track how long a buyer took to complete each quiz (seconds).
ALTER TABLE public.quiz_results ADD COLUMN IF NOT EXISTS duration_seconds integer;
