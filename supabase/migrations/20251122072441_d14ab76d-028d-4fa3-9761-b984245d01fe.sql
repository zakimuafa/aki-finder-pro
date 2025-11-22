-- Add warranty_months column to sales table
ALTER TABLE public.sales 
ADD COLUMN warranty_months integer DEFAULT 0;