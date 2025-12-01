-- Create enums
CREATE TYPE public.user_type AS ENUM ('client', 'supplier');
CREATE TYPE public.app_role AS ENUM ('admin', 'client', 'supplier');
CREATE TYPE public.order_status AS ENUM ('pending', 'shipped', 'completed');
CREATE TYPE public.dispute_status AS ENUM ('open', 'resolved', 'rejected');
CREATE TYPE public.withdrawal_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.supplier_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  user_type user_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Client details
CREATE TABLE public.client_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  custom_fee_rate DECIMAL(5,2) DEFAULT 5.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.client_details ENABLE ROW LEVEL SECURITY;

-- Supplier details
CREATE TABLE public.supplier_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  supplier_id TEXT NOT NULL UNIQUE,
  alipay_qr_code_url TEXT,
  contact_info TEXT,
  approval_status supplier_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.supplier_details ENABLE ROW LEVEL SECURITY;

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  supplier_id UUID REFERENCES auth.users(id) NOT NULL,
  amount_brl DECIMAL(12,2) NOT NULL,
  amount_cny DECIMAL(12,2) NOT NULL,
  fee_rate DECIMAL(5,2) NOT NULL,
  fee_amount DECIMAL(12,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status order_status DEFAULT 'pending',
  tracking_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order images
CREATE TABLE public.order_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_images ENABLE ROW LEVEL SECURITY;

-- Disputes
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  opened_by UUID REFERENCES auth.users(id) NOT NULL,
  reason TEXT NOT NULL,
  status dispute_status DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Withdrawals
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status withdrawal_status DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id),
  supplier_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Storage bucket for QR codes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('alipay-qrcodes', 'alipay-qrcodes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket for order images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('order-images', 'order-images', true)
ON CONFLICT (id) DO NOTHING;

-- Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to generate supplier ID
CREATE OR REPLACE FUNCTION public.generate_supplier_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM public.supplier_details WHERE supplier_id = new_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_id;
END;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for client_details
CREATE POLICY "Clients can view own details"
  ON public.client_details FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Clients can update own details"
  ON public.client_details FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all client details"
  ON public.client_details FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update client details"
  ON public.client_details FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for supplier_details
CREATE POLICY "Suppliers can view own details"
  ON public.supplier_details FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Suppliers can update own details"
  ON public.supplier_details FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage supplier details"
  ON public.supplier_details FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view approved suppliers"
  ON public.supplier_details FOR SELECT
  USING (approval_status = 'approved' AND public.has_role(auth.uid(), 'client'));

-- RLS Policies for orders
CREATE POLICY "Clients can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Suppliers can view their orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "Clients can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Suppliers can update their orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = supplier_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for order_images
CREATE POLICY "Users can view related order images"
  ON public.order_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_images.order_id
      AND (orders.client_id = auth.uid() OR orders.supplier_id = auth.uid())
    )
  );

CREATE POLICY "Suppliers can upload order images"
  ON public.order_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_images.order_id
      AND orders.supplier_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order images"
  ON public.order_images FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for disputes
CREATE POLICY "Users can view related disputes"
  ON public.disputes FOR SELECT
  USING (
    auth.uid() = opened_by OR
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = disputes.order_id
      AND (orders.client_id = auth.uid() OR orders.supplier_id = auth.uid())
    )
  );

CREATE POLICY "Users can create disputes"
  ON public.disputes FOR INSERT
  WITH CHECK (auth.uid() = opened_by);

CREATE POLICY "Admins can manage disputes"
  ON public.disputes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for withdrawals
CREATE POLICY "Suppliers can view own withdrawals"
  ON public.withdrawals FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can request withdrawals"
  ON public.withdrawals FOR INSERT
  WITH CHECK (auth.uid() = supplier_id);

CREATE POLICY "Admins can manage withdrawals"
  ON public.withdrawals FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for transactions
CREATE POLICY "Suppliers can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for alipay-qrcodes
CREATE POLICY "Suppliers can upload their QR codes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'alipay-qrcodes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Suppliers can update their QR codes"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'alipay-qrcodes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Everyone can view QR codes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'alipay-qrcodes');

-- Storage policies for order-images
CREATE POLICY "Suppliers can upload order images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'order-images');

CREATE POLICY "Everyone can view order images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'order-images');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();