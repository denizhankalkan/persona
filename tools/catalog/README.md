# tools/catalog — Python

Sırada. Katalog hattı:

- `import_feed.py` — Trendyol Partner / Awin ürün akışlarını (CSV/JSON) okur, marka ve kategoriye göre normalize eder, API'ye yazar.
- `fetch_images.py` — resmi ürün sayfalarından og:image toplar, doğrular, boyutlandırır.
- `dedupe.py` — aynı modelin farklı renk/beden kayıtlarını tek modelde birleştirir.

Python 3.12, `requests`, `beautifulsoup4`, `pandas`. İstek yolunda Python yok; her şey API'ye yazar.
