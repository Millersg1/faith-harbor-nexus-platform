-- Insert sample financial data for the Financial Management Dashboard
-- First create a budget for the current fiscal year
INSERT INTO public.budgets (
  name, description, fiscal_year, total_amount, allocated_amount, spent_amount, status, created_by
) VALUES 
  (
    '2024 Annual Church Budget',
    'Main operating budget for all church ministries and operations for fiscal year 2024',
    2024,
    50000000, -- $500,000 in cents
    45000000, -- $450,000 allocated
    32500000, -- $325,000 spent
    'active',
    null
  ),
  (
    '2024 Building Fund',
    'Special fund for church building improvements and expansion projects',
    2024,
    15000000, -- $150,000 in cents
    12000000, -- $120,000 allocated
    8500000,  -- $85,000 spent
    'active',
    null
  );

-- Create budget categories
INSERT INTO public.budget_categories (
  budget_id, name, description, allocated_amount, spent_amount
) 
SELECT 
  b.id,
  category_name,
  category_desc,
  category_allocated,
  category_spent
FROM budgets b
CROSS JOIN (
  VALUES 
    ('Worship & Music', 'Worship team, music equipment, licensing', 5000000, 3200000),
    ('Children Ministry', 'Kids programs, supplies, events', 8000000, 6100000),
    ('Youth Ministry', 'Teen programs, camps, activities', 6000000, 4800000),
    ('Outreach & Missions', 'Community outreach, mission trips', 10000000, 7500000),
    ('Facilities & Maintenance', 'Building upkeep, utilities, repairs', 12000000, 8900000),
    ('Administration', 'Office supplies, software, communication', 4000000, 2000000)
) AS categories(category_name, category_desc, category_allocated, category_spent)
WHERE b.name = '2024 Annual Church Budget';

-- Insert sample expenses
INSERT INTO public.expenses (
  amount, description, vendor, expense_date, status, submitted_by, budget_category_id
) 
SELECT 
  expense_amount,
  expense_desc,
  expense_vendor,
  expense_date::date,
  expense_status,
  null,
  bc.id
FROM budget_categories bc
CROSS JOIN (
  VALUES 
    (25000, 'Monthly music licensing fees', 'CCLI', '2024-01-15', 'approved'),
    (15000, 'New microphone system', 'Guitar Center', '2024-01-20', 'approved'),
    (45000, 'Kids ministry craft supplies', 'Oriental Trading', '2024-02-01', 'approved'),
    (85000, 'Youth winter retreat', 'Camp Wildwood', '2024-02-15', 'approved'),
    (120000, 'Monthly utility bills', 'City Electric & Gas', '2024-01-31', 'approved'),
    (35000, 'Office software licenses', 'Microsoft', '2024-01-10', 'approved'),
    (250000, 'HVAC system repair', 'Premier HVAC', '2024-03-01', 'pending'),
    (18000, 'Communion supplies', 'Church Supply Co', '2024-02-28', 'approved')
) AS expenses(expense_amount, expense_desc, expense_vendor, expense_date, expense_status)
WHERE bc.name = CASE 
  WHEN expense_desc LIKE '%music%' OR expense_desc LIKE '%microphone%' THEN 'Worship & Music'
  WHEN expense_desc LIKE '%Kids%' OR expense_desc LIKE '%Communion%' THEN 'Children Ministry'
  WHEN expense_desc LIKE '%Youth%' THEN 'Youth Ministry'
  WHEN expense_desc LIKE '%utility%' OR expense_desc LIKE '%HVAC%' THEN 'Facilities & Maintenance'
  WHEN expense_desc LIKE '%Office%' OR expense_desc LIKE '%software%' THEN 'Administration'
  ELSE 'Administration'
END;

-- Insert sample donations (fixed to use valid email for anonymous)
INSERT INTO public.donations (
  donor_name, donor_email, amount, donation_type, category, currency, status, 
  anonymous, message, recurring_frequency, created_at
) VALUES 
  (
    'John and Mary Smith',
    'smithfamily@email.com',
    50000, -- $500
    'one_time',
    'general',
    'usd',
    'completed',
    false,
    'Blessed to support the church ministry',
    null,
    CURRENT_DATE - INTERVAL '2 days'
  ),
  (
    'Anonymous Donor',
    'anonymous@church.org',
    25000, -- $250
    'recurring',
    'building_fund',
    'usd',
    'completed',
    true,
    null,
    'monthly',
    CURRENT_DATE - INTERVAL '1 week'
  ),
  (
    'Sarah Johnson',
    'sarah.j@email.com',
    10000, -- $100
    'recurring',
    'general',
    'usd',
    'completed',
    false,
    'Monthly tithe',
    'monthly',
    CURRENT_DATE - INTERVAL '3 days'
  ),
  (
    'Michael Chen',
    'mchen@email.com',
    15000, -- $150
    'one_time',
    'missions',
    'usd',
    'completed',
    false,
    'For the Guatemala mission trip',
    null,
    CURRENT_DATE - INTERVAL '5 days'
  ),
  (
    'Family Foundation',
    'contact@familyfoundation.org',
    100000, -- $1000
    'one_time',
    'youth_ministry',
    'usd',
    'completed',
    false,
    'Supporting youth programs and activities',
    null,
    CURRENT_DATE - INTERVAL '1 week'
  ),
  (
    'Lisa and Robert Martinez',
    'martinez.family@email.com',
    7500, -- $75
    'recurring',
    'general',
    'usd',
    'completed',
    false,
    'Weekly offering',
    'weekly',
    CURRENT_DATE - INTERVAL '1 day'
  );

-- Insert sample pledges
INSERT INTO public.pledges (
  amount, frequency, start_date, end_date, category, status, fulfilled_amount, pledger_id
) VALUES 
  (
    120000, -- $1200 annual ($100/month)
    'monthly',
    '2024-01-01',
    '2024-12-31',
    'general',
    'active',
    30000, -- $300 fulfilled so far
    null
  ),
  (
    260000, -- $2600 annual ($50/week)
    'weekly',
    '2024-01-01',
    '2024-12-31',
    'building_fund',
    'active',
    60000, -- $600 fulfilled so far
    null
  ),
  (
    500000, -- $5000 total
    'quarterly',
    '2024-01-01',
    '2025-12-31',
    'missions',
    'active',
    125000, -- $1250 fulfilled (1 quarter)
    null
  ),
  (
    240000, -- $2400 annual ($200/month)
    'monthly',
    '2024-01-01',
    '2024-12-31',
    'youth_ministry',
    'active',
    80000, -- $800 fulfilled so far
    null
  );