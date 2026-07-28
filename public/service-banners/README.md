# Service banners

Place service-specific banner images in this directory and reference them from
the corresponding Markdown file:

```md
---
banner: /service-banners/consultoria.png
---
# Consultoria
```

When `banner` is omitted or the referenced image cannot be loaded, the site
uses `services-banner.png` as the fallback.
