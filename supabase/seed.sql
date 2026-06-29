-- ============================================================
--  SAYARATI — Demo seed (run this SECOND, after schema.sql)
--
--  Creates ready-to-use accounts + sample agencies, cars, reviews.
--  Demo logins:
--    Admin   : admin@sayarati.tn   / Admin@123
--    Agency  : agency@sayarati.tn  / Agency@123
--    Agency 2: agency2@sayarati.tn / Agency@123
--    Client  : client@sayarati.tn  / Client@123
--
--  Idempotent: re-running it recreates the demo data cleanly.
-- ============================================================

do $$
declare
  admin_id   uuid;
  ag1_owner  uuid;
  ag2_owner  uuid;
  client_id  uuid;
  ag1_id     uuid;
  ag2_id     uuid;
begin
  -- Clean up any previous demo users (cascades to profiles/agencies/cars...)
  delete from auth.users
   where email in ('admin@sayarati.tn','agency@sayarati.tn','agency2@sayarati.tn','client@sayarati.tn');

  -- Helper to create a confirmed email/password user and return its id
  -- (inline via repeated blocks since plpgsql has no easy local funcs)

  -- ADMIN
  admin_id := gen_random_uuid();
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
                          email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
                          created_at, updated_at)
  values ('00000000-0000-0000-0000-000000000000', admin_id, 'authenticated','authenticated',
          'admin@sayarati.tn', '$2b$10$C7MWVlL/R/lLQhz6/j/fV.wQ3sUw3szsEe0zMPPFKJG5xX6hrnkQ2', now(),
          '{"provider":"email","providers":["email"]}',
          '{"full_name":"مشرف سيارتي / Admin","role":"admin"}', now(), now());
  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), admin_id, 'admin@sayarati.tn',
          json_build_object('sub', admin_id::text, 'email','admin@sayarati.tn','email_verified',true),
          'email', now(), now(), now());

  -- AGENCY OWNER 1
  ag1_owner := gen_random_uuid();
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
                          email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  values ('00000000-0000-0000-0000-000000000000', ag1_owner, 'authenticated','authenticated',
          'agency@sayarati.tn', '$2b$10$I0XByhdZcrV1rkk9yrHCH.FVOQFPl6Csme98hAC8HqXsLCHmqfh4.', now(),
          '{"provider":"email","providers":["email"]}',
          '{"full_name":"Karim Ben Salah","role":"agency","phone":"+216 22 111 222"}', now(), now());
  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), ag1_owner, 'agency@sayarati.tn',
          json_build_object('sub', ag1_owner::text,'email','agency@sayarati.tn','email_verified',true),
          'email', now(), now(), now());

  -- AGENCY OWNER 2
  ag2_owner := gen_random_uuid();
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
                          email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  values ('00000000-0000-0000-0000-000000000000', ag2_owner, 'authenticated','authenticated',
          'agency2@sayarati.tn', '$2b$10$I0XByhdZcrV1rkk9yrHCH.FVOQFPl6Csme98hAC8HqXsLCHmqfh4.', now(),
          '{"provider":"email","providers":["email"]}',
          '{"full_name":"Sonia Trabelsi","role":"agency","phone":"+216 24 333 444"}', now(), now());
  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), ag2_owner, 'agency2@sayarati.tn',
          json_build_object('sub', ag2_owner::text,'email','agency2@sayarati.tn','email_verified',true),
          'email', now(), now(), now());

  -- CLIENT
  client_id := gen_random_uuid();
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
                          email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  values ('00000000-0000-0000-0000-000000000000', client_id, 'authenticated','authenticated',
          'client@sayarati.tn', '$2b$10$W8gTSW5sQBKPVencCSfSm.q5NwrN/kIZZrG4CAk0pAgCNSjBcHUWC', now(),
          '{"provider":"email","providers":["email"]}',
          '{"full_name":"Ahmed Gharbi","role":"customer","phone":"+216 50 555 666"}', now(), now());
  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), client_id, 'client@sayarati.tn',
          json_build_object('sub', client_id::text,'email','client@sayarati.tn','email_verified',true),
          'email', now(), now(), now());

  -- Profiles are auto-created by the trigger; make sure roles are correct.
  update public.profiles set role='admin'    where id = admin_id;
  update public.profiles set role='agency'   where id in (ag1_owner, ag2_owner);
  update public.profiles set role='customer' where id = client_id;

  -- ---------- AGENCIES ----------
  ag1_id := gen_random_uuid();
  ag2_id := gen_random_uuid();

  insert into public.agencies (id, owner_id, name, name_fr, description, description_fr, city, phone, logo_url, status)
  values
    (ag1_id, ag1_owner, 'وكالة قرطاج لكراء السيارات', 'Carthage Rent a Car',
     'وكالة رائدة في كراء السيارات بأسعار تنافسية وخدمة ممتازة.',
     'Agence leader de location de voitures à prix compétitifs et service premium.',
     'Tunis', '+216 71 800 800',
     'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=200&q=70', 'approved'),
    (ag2_id, ag2_owner, 'الصحراء لكراء السيارات', 'Sahara Cars',
     'سيارات حديثة ودفع رباعي لاستكشاف الجنوب التونسي.',
     'Voitures récentes et 4x4 pour explorer le sud tunisien.',
     'Djerba', '+216 75 600 600',
     'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=200&q=70', 'approved');

  -- ---------- CARS ----------
  insert into public.cars (agency_id, brand, model, year, category, transmission, fuel, seats, price_per_day, image_url, city, available, description) values
    (ag1_id,'Volkswagen','Golf 8',2023,'compact','automatic','diesel',5,120,'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=70','Tunis',true,'سيارة مدمجة عملية واقتصادية.'),
    (ag1_id,'Renault','Clio 5',2022,'economy','manual','gasoline',5,85,'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=70','Tunis',true,'الخيار الاقتصادي الأمثل للمدينة.'),
    (ag1_id,'Mercedes-Benz','C-Class',2023,'luxury','automatic','diesel',5,320,'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=70','Tunis',true,'فخامة وأداء لرحلات الأعمال.'),
    (ag1_id,'Peugeot','3008',2022,'suv','automatic','diesel',5,210,'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=70','Tunis',true,'دفع رباعي مريح للعائلة.'),
    (ag2_id,'Toyota','Land Cruiser',2021,'suv','automatic','diesel',7,450,'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=70','Djerba',true,'الأقوى لمغامرات الصحراء.'),
    (ag2_id,'Dacia','Duster',2022,'suv','manual','diesel',5,150,'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=70','Djerba',true,'دفع رباعي اقتصادي وموثوق.'),
    (ag2_id,'Hyundai','i10',2023,'economy','manual','gasoline',4,70,'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?auto=format&fit=crop&w=900&q=70','Djerba',true,'صغيرة ومثالية للتنقل اليومي.'),
    (ag2_id,'Tesla','Model 3',2023,'luxury','automatic','electric',5,380,'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=70','Djerba',true,'سيارة كهربائية فاخرة وصديقة للبيئة.');

  -- ---------- REVIEWS ----------
  insert into public.reviews (agency_id, customer_id, rating, comment) values
    (ag1_id, client_id, 5, 'خدمة ممتازة وسيارة نظيفة، أنصح بها بشدة!'),
    (ag2_id, client_id, 4, 'تجربة جيدة جداً، السيارة كانت في حالة ممتازة.');

  -- ---------- SAMPLE BOOKING ----------
  insert into public.bookings (car_id, customer_id, agency_id, start_date, end_date, total_price, status)
  select c.id, client_id, ag1_id, current_date + 3, current_date + 6, c.price_per_day * 3, 'confirmed'
  from public.cars c where c.agency_id = ag1_id limit 1;

end $$;
