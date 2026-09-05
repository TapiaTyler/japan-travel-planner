WITH template AS (
    INSERT INTO public.trip_template (
        name, duration_days, notes, public_key, is_public, created_at, updated_at
    ) VALUES (
        'Tokyo Highlights', 3,
        'A compact introduction to classic Tokyo neighborhoods and landmarks.',
        'tokyo-highlights', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING id
)
INSERT INTO public.trip_template_item (
    template_id, item_type, name, date_offset, cost, cost_status,
    location, start_time, end_time, map_search_query
)
SELECT id, 'Activity', 'Meiji Jingu', 0, 0, 'CONFIRMED',
       'Shibuya', TIME '09:00', TIME '11:00', 'Meiji Jingu, Tokyo'
FROM template
UNION ALL
SELECT id, 'Activity', 'Senso-ji and Asakusa', 1, 0, 'UNKNOWN',
       'Asakusa', TIME '09:00', TIME '12:00', 'Senso-ji, Tokyo'
FROM template
UNION ALL
SELECT id, 'Activity', 'Tokyo Skytree', 2, 3100, 'ESTIMATED',
       'Sumida', TIME '14:00', TIME '17:00', 'Tokyo Skytree'
FROM template;

WITH template AS (
    INSERT INTO public.trip_template (
        name, duration_days, notes, public_key, is_public, created_at, updated_at
    ) VALUES (
        'Kyoto Cultural Weekend', 3,
        'Temples, historic streets, and a relaxed market visit in Kyoto.',
        'kyoto-cultural-weekend', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING id
)
INSERT INTO public.trip_template_item (
    template_id, item_type, name, date_offset, cost, cost_status,
    location, start_time, end_time, map_search_query
)
SELECT id, 'Activity', 'Fushimi Inari Taisha', 0, 0, 'CONFIRMED',
       'Kyoto', TIME '07:00', TIME '10:00', 'Fushimi Inari Taisha, Kyoto'
FROM template
UNION ALL
SELECT id, 'Activity', 'Kiyomizu-dera and Gion', 1, 500, 'ESTIMATED',
       'Kyoto', TIME '09:00', TIME '16:00', 'Kiyomizu-dera, Kyoto'
FROM template
UNION ALL
SELECT id, 'Activity', 'Nishiki Market', 2, NULL, 'UNKNOWN',
       'Kyoto', TIME '10:00', TIME '13:00', 'Nishiki Market, Kyoto'
FROM template;

WITH template AS (
    INSERT INTO public.trip_template (
        name, duration_days, notes, public_key, is_public, created_at, updated_at
    ) VALUES (
        'Tokyo and Kyoto First Visit', 7,
        'A first-time route combining Tokyo highlights with several days in Kyoto.',
        'tokyo-kyoto-first-visit', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING id
)
INSERT INTO public.trip_template_item (
    template_id, item_type, name, date_offset, cost, cost_status, notes,
    map_search_query, location, start_time, end_time,
    transportation_type, departure_location, arrival_location,
    departure_date_offset, departure_time, arrival_date_offset, arrival_time,
    check_in_date_offset, check_out_date_offset
)
SELECT id, 'Lodging', 'Tokyo Hotel', 0, NULL, 'UNKNOWN', NULL,
       'Tokyo Station', 'Tokyo', NULL, NULL,
       NULL, NULL, NULL,
       NULL::integer, NULL::time, NULL::integer, NULL::time,
       0, 3
FROM template
UNION ALL
SELECT id, 'Activity', 'Shibuya and Harajuku', 1, 0, 'CONFIRMED', NULL,
       'Shibuya Crossing', 'Tokyo', TIME '10:00', TIME '17:00',
       NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
FROM template
UNION ALL
SELECT id, 'Transportation', 'Shinkansen to Kyoto', 3, 14000, 'ESTIMATED', NULL,
       'Kyoto Station', NULL, NULL, NULL,
       'TRAIN', 'Tokyo Station', 'Kyoto Station', 3, TIME '09:00', 3, TIME '11:15', NULL, NULL
FROM template
UNION ALL
SELECT id, 'Lodging', 'Kyoto Hotel', 3, NULL, 'UNKNOWN', NULL,
       'Kyoto Station', 'Kyoto', NULL, NULL,
       NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 6
FROM template
UNION ALL
SELECT id, 'Activity', 'Fushimi Inari Taisha', 4, 0, 'CONFIRMED', NULL,
       'Fushimi Inari Taisha, Kyoto', 'Kyoto', TIME '07:00', TIME '10:00',
       NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
FROM template;
