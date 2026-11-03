-- Track tab/window switches during quiz to detect potential cheating.
ALTER TABLE public.quiz_results ADD COLUMN IF NOT EXISTS tab_switches integer DEFAULT 0;
