-- Run schema.sql first. Demo password for every account: Admin@1234
insert into public.users (name, email, password, address, role) values
('System Administrator User Account', 'admin@example.com', '$2a$12$miOfmDP686GdnYLmVeYIOu.nAAkiRyXnMJlqL70aL7TBV6NhGFJAi', '123 Admin Street, System City, SC 10001', 'ADMIN'),
('Normal Platform User Account Demo', 'user@example.com', '$2a$12$miOfmDP686GdnYLmVeYIOu.nAAkiRyXnMJlqL70aL7TBV6NhGFJAi', '456 User Avenue, Demo Town, DT 20002', 'USER'),
('Store Owner Account Demonstration Here', 'owner@example.com', '$2a$12$miOfmDP686GdnYLmVeYIOu.nAAkiRyXnMJlqL70aL7TBV6NhGFJAi', '789 Owner Boulevard, Commerce City, CC 30003', 'STORE_OWNER')
on conflict (email) do nothing;

insert into public.stores (name, email, address, owner_id) values
('The Grand Coffee House Downtown Location', 'coffeehouse@example.com', '10 Main Street, Downtown, DT 10001', (select id from public.users where email = 'owner@example.com')),
('Riverside Books and Stationery Emporium', 'bookstore@example.com', '22 River Road, Booktown, BT 20002', null),
('TechZone Electronics and Gadgets Superstore', 'techshop@example.com', '5 Innovation Drive, Tech Park, TP 30003', null)
on conflict (email) do nothing;

insert into public.ratings (user_id, store_id, rating) values
((select id from public.users where email = 'user@example.com'), (select id from public.stores where email = 'coffeehouse@example.com'), 5),
((select id from public.users where email = 'user@example.com'), (select id from public.stores where email = 'bookstore@example.com'), 4)
on conflict (user_id, store_id) do update set rating = excluded.rating, updated_at = now();
