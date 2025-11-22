-- Add down_payment column to sales table
ALTER TABLE public.sales
ADD COLUMN down_payment integer DEFAULT 0;