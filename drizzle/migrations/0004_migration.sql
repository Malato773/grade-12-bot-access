ALTER TABLE public.bot_notifications ADD COLUMN IF NOT EXISTS payload jsonb;
ALTER TABLE public.bot_deliveries ADD COLUMN IF NOT EXISTS retryable boolean;
ALTER TABLE public.bot_deliveries ADD COLUMN IF NOT EXISTS retry_after timestamptz;
ALTER TABLE public.bot_deliveries ADD COLUMN IF NOT EXISTS retry_of uuid;