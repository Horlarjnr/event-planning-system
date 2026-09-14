-- =========================================
-- SEED DATA (Final Corrected Version)
-- =========================================

insert into vendors (id, user_id, vendor_type, business_name, description, phone, email, location, status)
values
  -- Managed by Vendor Account 1
  (gen_random_uuid(), 'f476bd49-3681-49e4-a68a-b5d1545ddce2', 'venue', 'Grand Pavilion Events', 'Elegant event space in the heart of Lagos', '08012345001', 'grandpavilion@demo.com', 'Lekki, Lagos', 'approved'),
  (gen_random_uuid(), 'f476bd49-3681-49e4-a68a-b5d1545ddce2', 'venue', 'Skyline Banquet Hall', 'Modern rooftop venue with city views', '08012345002', 'skyline@demo.com', 'Victoria Island, Lagos', 'approved'),
  (gen_random_uuid(), 'f476bd49-3681-49e4-a68a-b5d1545ddce2', 'venue', 'Garden Court Centre', 'Outdoor garden venue for intimate gatherings', '08012345003', 'gardencourt@demo.com', 'Ikeja, Lagos', 'approved'),
  (gen_random_uuid(), 'f476bd49-3681-49e4-a68a-b5d1545ddce2', 'venue', 'Royal Suites Hall', 'Spacious hall ideal for weddings and conferences', '08012345004', 'royalsuites@demo.com', 'Abuja, FCT', 'approved'),
  (gen_random_uuid(), 'f476bd49-3681-49e4-a68a-b5d1545ddce2', 'venue', 'The Terrace Lounge', 'Chic indoor-outdoor venue with a lounge feel', '08012345005', 'terrace@demo.com', 'Port Harcourt, Rivers', 'approved'),

  -- Managed by Vendor Account 2
  (gen_random_uuid(), '7a042038-f11c-4dbc-8be8-55fe1c5600c4', 'caterer', 'Savory Bites Catering', 'Continental and intercontinental dishes', '08099990001', 'savorybites@demo.com', 'Lekki, Lagos', 'approved'),
  (gen_random_uuid(), '7a042038-f11c-4dbc-8be8-55fe1c5600c4', 'caterer', 'Naija Delight Caterers', 'Authentic Nigerian cuisine for all occasions', '08099990002', 'naijadelight@demo.com', 'Ikeja, Lagos', 'approved'),
  (gen_random_uuid(), '7a042038-f11c-4dbc-8be8-55fe1c5600c4', 'caterer', 'Golden Spoon Events', 'Continental fusion with a modern twist', '08099990003', 'goldenspoon@demo.com', 'Abuja, FCT', 'approved'),
  (gen_random_uuid(), '7a042038-f11c-4dbc-8be8-55fe1c5600c4', 'caterer', 'Spice Route Catering', 'Indian and continental specialty menus', '08099990004', 'spiceroute@demo.com', 'Victoria Island, Lagos', 'approved'),
  (gen_random_uuid(), '7a042038-f11c-4dbc-8be8-55fe1c5600c4', 'caterer', 'Coastal Flavors', 'Seafood-forward Nigerian and continental menus', '08099990005', 'coastalflavors@demo.com', 'Port Harcourt, Rivers', 'approved');

insert into venues (vendor_id, name, description, location, capacity, price, facilities, image_url)
select id, 'Grand Pavilion Events', 'A beautifully decorated hall perfect for weddings and large receptions.', 'Lekki, Lagos', 300, 450000, array['Parking', 'AC', 'Sound system', 'Generator'], 'https://images.unsplash.com/photo-1746739802530-b490abdfc8e6?auto=format&fit=crop&w=1000&q=80'
from vendors where business_name = 'Grand Pavilion Events';

insert into venues (vendor_id, name, description, location, capacity, price, facilities, image_url)
select id, 'Skyline Banquet Hall', 'Rooftop hall with panoramic city views, great for evening events.', 'Victoria Island, Lagos', 200, 600000, array['Parking', 'AC', 'Rooftop access', 'Bar area'], 'https://images.unsplash.com/photo-1762765684673-d22ece602b10?auto=format&fit=crop&w=1000&q=80'
from vendors where business_name = 'Skyline Banquet Hall';

insert into venues (vendor_id, name, description, location, capacity, price, facilities, image_url)
select id, 'Garden Court Centre', 'Lush outdoor garden setting for intimate ceremonies.', 'Ikeja, Lagos', 120, 280000, array['Parking', 'Garden lighting', 'Gazebo'], 'https://images.unsplash.com/photo-1762765685319-fdaf8d22085d?auto=format&fit=crop&w=1000&q=80'
from vendors where business_name = 'Garden Court Centre';

insert into venues (vendor_id, name, description, location, capacity, price, facilities, image_url)
select id, 'Royal Suites Hall', 'Large formal hall suited for weddings, conferences and galas.', 'Abuja, FCT', 500, 750000, array['Parking', 'AC', 'Stage', 'Projector', 'Generator'], 'https://images.unsplash.com/photo-1687213280116-234f93b15b44?auto=format&fit=crop&w=1000&q=80'
from vendors where business_name = 'Royal Suites Hall';

insert into venues (vendor_id, name, description, location, capacity, price, facilities, image_url)
select id, 'The Terrace Lounge', 'Stylish indoor-outdoor space with a relaxed lounge atmosphere.', 'Port Harcourt, Rivers', 150, 350000, array['Parking', 'AC', 'Outdoor terrace', 'Bar area'], 'https://images.unsplash.com/photo-1745685962285-1e58456871ff?auto=format&fit=crop&w=1000&q=80'
from vendors where business_name = 'The Terrace Lounge';

insert into caterers (vendor_id, name, description, location, cuisine_type, image_url)
select id, 'Savory Bites Catering', 'Continental and intercontinental dishes crafted for any event size.', 'Lekki, Lagos', 'Continental', 'https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=1000&q=80'
from vendors where business_name = 'Savory Bites Catering';

insert into caterers (vendor_id, name, description, location, cuisine_type, image_url)
select id, 'Naija Delight Caterers', 'Authentic Nigerian dishes made with fresh, local ingredients.', 'Ikeja, Lagos', 'Nigerian', 'https://images.unsplash.com/photo-1664993101841-036f189719b6?auto=format&fit=crop&w=1000&q=80'
from vendors where business_name = 'Naija Delight Caterers';

insert into caterers (vendor_id, name, description, location, cuisine_type, image_url)
select id, 'Golden Spoon Events', 'Modern continental fusion menus tailored to your event theme.', 'Abuja, FCT', 'Continental Fusion', 'https://images.unsplash.com/photo-1750943082452-c714763f73b2?auto=format&fit=crop&w=1000&q=80'
from vendors where business_name = 'Golden Spoon Events';

insert into caterers (vendor_id, name, description, location, cuisine_type, image_url)
select id, 'Spice Route Catering', 'Indian and continental specialty menus with bold, rich flavors.', 'Victoria Island, Lagos', 'Indian', 'https://images.unsplash.com/photo-1711153419402-336ee48f2138?auto=format&fit=crop&w=1000&q=80'
from vendors where business_name = 'Spice Route Catering';

insert into caterers (vendor_id, name, description, location, cuisine_type, image_url)
select id, 'Coastal Flavors', 'Seafood-forward Nigerian and continental dishes.', 'Port Harcourt, Rivers', 'Seafood', 'https://images.unsplash.com/photo-1681108933468-d6ee56f1f97e?auto=format&fit=crop&w=1000&q=80'
from vendors where business_name = 'Coastal Flavors';

insert into catering_packages (caterer_id, name, description, price_per_person, minimum_guests)
select id, 'Classic Package', 'Rice, protein, sides and one dessert.', 8500, 50 from caterers where name = 'Savory Bites Catering';
insert into catering_packages (caterer_id, name, description, price_per_person, minimum_guests)
select id, 'Premium Package', 'Multi-course meal with appetizers, mains and dessert bar.', 15000, 50 from caterers where name = 'Savory Bites Catering';
insert into catering_packages (caterer_id, name, description, price_per_person, minimum_guests)
select id, 'Owambe Special', 'Jollof rice, assorted proteins, small chops and drinks.', 7000, 80 from caterers where name = 'Naija Delight Caterers';
insert into catering_packages (caterer_id, name, description, price_per_person, minimum_guests)
select id, 'Traditional Feast', 'Full Nigerian spread with pounded yam, soups and grilled meats.', 10000, 80 from caterers where name = 'Naija Delight Caterers';
insert into catering_packages (caterer_id, name, description, price_per_person, minimum_guests)
select id, 'Fusion Standard', 'Continental mains with a Nigerian twist, plated service.', 12000, 40 from caterers where name = 'Golden Spoon Events';
insert into catering_packages (caterer_id, name, description, price_per_person, minimum_guests)
select id, 'Spice Trail', 'Butter chicken, biryani, naan and continental sides.', 11000, 40 from caterers where name = 'Spice Route Catering';
insert into catering_packages (caterer_id, name, description, price_per_person, minimum_guests)
select id, 'Catch of the Day', 'Grilled fish, shrimp platters and seafood rice.', 13500, 60 from caterers where name = 'Coastal Flavors';