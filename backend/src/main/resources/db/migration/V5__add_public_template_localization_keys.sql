ALTER TABLE public.trip_template_item
    ADD COLUMN localization_key character varying(150);

CREATE UNIQUE INDEX uq_trip_template_item_localization_key
    ON public.trip_template_item(localization_key)
    WHERE localization_key IS NOT NULL;

WITH localized_items(public_key, item_name, localization_key) AS (
    VALUES
        ('tokyo-highlights', 'Meiji Jingu', 'tokyo-highlights.meiji-jingu'),
        ('tokyo-highlights', 'Senso-ji and Asakusa', 'tokyo-highlights.sensoji-asakusa'),
        ('tokyo-highlights', 'Tokyo Skytree', 'tokyo-highlights.tokyo-skytree'),
        ('kyoto-cultural-weekend', 'Fushimi Inari Taisha', 'kyoto-cultural-weekend.fushimi-inari'),
        ('kyoto-cultural-weekend', 'Kiyomizu-dera and Gion', 'kyoto-cultural-weekend.kiyomizudera-gion'),
        ('kyoto-cultural-weekend', 'Nishiki Market', 'kyoto-cultural-weekend.nishiki-market'),
        ('tokyo-kyoto-first-visit', 'Tokyo Hotel', 'tokyo-kyoto-first-visit.tokyo-hotel'),
        ('tokyo-kyoto-first-visit', 'Shibuya and Harajuku', 'tokyo-kyoto-first-visit.shibuya-harajuku'),
        ('tokyo-kyoto-first-visit', 'Shinkansen to Kyoto', 'tokyo-kyoto-first-visit.shinkansen-kyoto'),
        ('tokyo-kyoto-first-visit', 'Kyoto Hotel', 'tokyo-kyoto-first-visit.kyoto-hotel'),
        ('tokyo-kyoto-first-visit', 'Fushimi Inari Taisha', 'tokyo-kyoto-first-visit.fushimi-inari')
)
UPDATE public.trip_template_item AS item
SET localization_key = localized.localization_key
FROM public.trip_template AS trip_template, localized_items AS localized
WHERE item.template_id = trip_template.id
  AND trip_template.public_key = localized.public_key
  AND item.name = localized.item_name;
