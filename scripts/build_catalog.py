"""Build the site catalogue from the scrape of megasolar.com.ua (research/catalog.json + descriptions.json).
Usage: python -I scripts/build_catalog.py <project-root>

Writes
  src/lib/catalog.json          compact list for listings, filters, search, cart (no descriptions)
  src/lib/catalog-details.json  description blocks per id, read only by the product pages (server side)
  public/images/products/<id>.webp  (from research/raw/products, 760 px, transparent where the source was)
"""
import json, os, re, sys, unicodedata

root = sys.argv[1]
R = os.path.join(root, 'research')
raw = json.load(open(os.path.join(R, 'catalog.json')))
desc = json.load(open(os.path.join(R, 'descriptions.json')))

BRANDS = ['DAH Solar', 'JA Solar', 'Jinko Solar', 'Longi', 'Suntech', 'Tongwei', 'Trina Solar', 'PoweReservoir', 'Risen',
          'Axioma', 'MUST', 'Voltronic', 'Deye', 'Huawei', 'Solis', 'Janitza', 'Dyness', 'Pylontech', 'UPSEN',
          'Schneider', 'ZUBR', 'ETI', 'GBL', 'LAP', 'Одескабель', 'IME']
BRAND_FIX = {'Longi': 'LONGi', 'Tongwei': 'Tongwei Solar', 'Risen': 'Risen Energy', 'Axioma': 'Axioma Energy', 'DEYE': 'Deye', 'Trina Solar': 'Trina Solar'}


def pid(url):
    s = unicodedata.normalize('NFKD', url).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def num(s):
    return float(s.replace(',', '.'))


def price(s):
    m = re.search(r'([\d,]+)\.\d\d', s or '')
    return int(m.group(1).replace(',', '')) if m else None


def brand(name):
    for b in BRANDS:
        if re.search(r'(?<![A-Za-zА-Яа-я])' + re.escape(b) + r'(?![A-Za-z])', name, re.I):
            return BRAND_FIX.get(b, b)
    return None


def category(x):
    c = x['cats'][0]
    n = x['name'].lower()
    if c.startswith('komplekty'):
        return 'stantsii', 'hybrid' if 'gibrydni' in c else 'grid'
    if 'paneli' in c:
        return 'paneli', 'panel'
    if 'invertory' in c or 'invertory' in ' '.join(x['cats']):
        if re.search(r'лічильник|smartlogger|оптимізатор|донгл|смарт-метер|трансформатор', n):
            return 'invertory', 'monitoring'
        if 'гібрид' in n:
            return 'invertory', 'hybrid'
        if 'автоном' in n:
            return 'invertory', 'autonomous'
        return 'invertory', 'grid'
    if 'akumulyatory' in c:
        if re.search(r'bms|контролер', n):
            return 'akumuliatory', 'bms'
        if 'стійка' in n:
            return 'akumuliatory', 'rack'
        if re.search(r'ups|безперебій', n):
            return 'akumuliatory', 'ups'
        return 'akumuliatory', 'battery'
    if 'kriplen' in c:
        return 'kriplennia', 'mount'
    if 'elektrofurnitura' in c:
        if 'кабель' in n:
            return 'elektrofurnitura', 'cable'
        if re.search(r'конектор', n):
            return 'elektrofurnitura', 'connector'
        if re.search(r'електрощит', n):
            return 'elektrofurnitura', 'box'
        return 'elektrofurnitura', 'protection'
    if 'poslugy' in c:
        return 'posluhy', 'service'
    raise SystemExit('unknown category ' + c)


def spec(cat, sub, name):
    """The one number buyers filter by: W for panels, kW for inverters/stations, kWh for batteries."""
    if cat == 'stantsii':
        m = re.search(r'(\d+)\s*кВт', name)
        return int(m.group(1)), 'кВт'
    if cat == 'paneli':
        m = re.search(r'(\d{3})\s*(?:W|Вт|Вт)', name)
        return int(m.group(1)), 'Вт'
    if cat == 'invertory' and sub != 'monitoring':
        m = re.search(r'(\d+)\s*кВт', name) or re.search(r'SUN-?(\d+)K', name) or re.search(r'SUN2000-(\d+)K', name) or re.search(r'GC(\d+)K', name)
        if m:
            return int(m.group(1)), 'кВт'
        m = re.search(r'(\d)(\d)\d\d(?:-48)?\b', name.split(' ')[-1] if 'Axpert' not in name else name.replace('IV ', ''))
        m = re.search(r'\b(\d{4})\b', name)
        if m:
            return round(int(m.group(1)) / 1000, 1), 'кВт'
    if cat == 'akumuliatory' and sub == 'battery':
        m = re.search(r'([\d.,]+)\s*(?:kWh|кВт·год|kWh)', name)
        if m:
            return num(m.group(1)), 'кВт·год'
        m = re.search(r'(\d+(?:[.,]\d+)?)\s*[VВ].*?(\d+)\s*(?:Ah|aH|А·год|A·год)', name, re.I) or re.search(r'(\d+)A-(\d+(?:\.\d+)?)v', name)
        if m:
            a, b = num(m.group(1)), num(m.group(2))
            return round(a * b / 1000, 1), 'кВт·год'
        if 'US5000' in name:
            return 4.8, 'кВт·год'
    return None, None


def clean_name(n):
    n = n.replace('“', '«').replace('”', '»').replace('"', '«', 1).replace('"', '»', 1)
    n = re.sub(r'\s+', ' ', n).strip()
    return n


def kit_facts(blocks):
    """Headline facts of a ready-made station from its two tables (labels differ from page to page)."""
    tabs = [b['table'] for b in blocks if 'table' in b]
    if not tabs:
        return None
    kv = {r[0]: r[1] for r in tabs[0] if len(r) >= 2}

    def pick(*keys):
        for x in keys:
            for k, v in kv.items():
                if x in k.lower() and 'гаранті' not in k.lower():
                    return v
        return None

    parts = []
    usd = None
    if len(tabs) > 1:
        for r in tabs[1][1:]:
            if len(r) == 2 and re.search(r'\$', r[1]):
                usd = r[1].replace(' ', '').replace('$', ' $').strip()
                continue
            if len(r) >= 3:
                parts.append({'kind': r[0], 'model': r[1], 'qty': r[2]})
    return {
        'phases': pick('фаз'),
        'panels': pick('кількість панелей', 'панелі'),
        'area': pick('площа'),
        'battery': pick('ємність', 'кількість акумулятор', 'акумуляторний резерв', 'акумулятори', 'акб', 'наявність акумулятор'),
        'autonomy': pick('автоном'),
        'warranty': next((v for k, v in kv.items() if 'гаранті' in k.lower()), None),
        'parts': parts,
        'usd': usd,
    }


items, details = [], {}
seen = set()
for x in raw:
    i = pid(x['url'])
    if i in seen:
        continue
    seen.add(i)
    cat, sub = category(x)
    name = clean_name(x['name'])
    value, unit = spec(cat, sub, name)
    blocks = desc.get(x['url'], [])
    lead = next((b['p'] for b in blocks if 'p' in b and len(b['p']) > 60), '')
    if len(lead) > 280:
        cut = max(lead.rfind('. ', 0, 280), lead.rfind('! ', 0, 280))
        lead = lead[:cut + 1] if cut > 80 else lead[:lead.rfind(' ', 0, 270)].rstrip(',;:—– ') + '…'
    img = os.path.exists(os.path.join(root, 'public/images/products', i + '.webp'))
    extra = {'kit': kit_facts(blocks)} if cat == 'stantsii' else {}
    items.append({
        **extra,
        'id': i, 'src': x['url'], 'cat': cat, 'sub': sub, 'name': name, 'brand': brand(name),
        'price': price(x['price']), 'value': value, 'unit': unit, 'lead': lead, 'img': img,
    })
    details[i] = blocks

order = ['stantsii', 'paneli', 'invertory', 'akumuliatory', 'kriplennia', 'elektrofurnitura', 'posluhy']
items.sort(key=lambda t: (order.index(t['cat']), t['sub'], t['value'] or 0, t['price'] or 0))
json.dump(items, open(os.path.join(root, 'src/lib/catalog.json'), 'w'), ensure_ascii=False, indent=0)
json.dump(details, open(os.path.join(root, 'src/lib/catalog-details.json'), 'w'), ensure_ascii=False)

from collections import Counter
print(len(items), Counter((t['cat'], t['sub']) for t in items))
for t in items:
    if t['value'] is None and t['cat'] in ('stantsii', 'paneli', 'invertory') and t['sub'] != 'monitoring' or t['brand'] is None and t['cat'] not in ('stantsii', 'posluhy', 'kriplennia'):
        print('CHECK', t['cat'], t['sub'], t['name'], t['value'], t['brand'])
