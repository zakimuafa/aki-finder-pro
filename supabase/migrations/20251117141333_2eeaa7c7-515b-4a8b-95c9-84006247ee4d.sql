-- Create sales table for recording transactions
CREATE TABLE public.sales (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  total_price integer NOT NULL,
  sale_date timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sales
CREATE POLICY "Anyone authenticated can view sales"
ON public.sales
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert sales"
ON public.sales
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update sales"
ON public.sales
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete sales"
ON public.sales
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better query performance
CREATE INDEX idx_sales_product_id ON public.sales(product_id);
CREATE INDEX idx_sales_sale_date ON public.sales(sale_date);

-- Create function to update product stock after sale
CREATE OR REPLACE FUNCTION public.update_product_stock_after_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Decrease product stock
  UPDATE public.products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update stock
CREATE TRIGGER after_sale_insert
AFTER INSERT ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.update_product_stock_after_sale();