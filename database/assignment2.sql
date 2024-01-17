-- Insert a new record to the account table
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Update the new record in account table
UPDATE public.account
SET account_type = 'Admin'::account_type
WHERE account_id = 1;
-- Delete record from account table
DELETE FROM public.account
WHERE account_id = 1;
-- Update a substring in inventory table
UPDATE public.inventory
SET inv_description = REPLACE (
        'Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.',
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- Use an inner join to select query
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory
    INNER JOIN public.classification ON public.inventory.classification_id = public.classification.classification_id
WHERE public.inventory.classification_id = 2;
-- Update inventory image and thumbnail path
UPDATE public.inventory
SET inv_thumbnail = REGEXP_REPLACE(
        inv_thumbnail,
        '/images\M',
        '/images/vehicles',
        'gi'
    ),
    inv_image = REGEXP_REPLACE(inv_image, '/images\M', '/images/vehicles', 'gi');