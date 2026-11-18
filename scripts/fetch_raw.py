"""Download raw images from megasolar.com.ua into research/raw (gitignored).
Usage: python -I scripts/fetch_raw.py <project-root>
Products: first gallery image of every catalogue item (research/catalog.json).
Portfolio: original photos of the 9 objects on megasolar.com.ua/portfolio.
"""
import json, os, re, sys, time, unicodedata, urllib.error, urllib.request

root = sys.argv[1]
R = os.path.join(root, 'research')
UP = 'https://www.megasolar.com.ua/wp-content/uploads/'


def pid(url: str) -> str:
    s = unicodedata.normalize('NFKD', url).encode('ascii', 'ignore').decode().lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s


def get(src, dst):
    if os.path.exists(dst) and os.path.getsize(dst) > 0:
        return
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    req = urllib.request.Request(src, headers={'User-Agent': 'Mozilla/5.0 (site redesign media fetch)'})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            with open(dst, 'wb') as f:
                f.write(data)
            time.sleep(0.7)  # the client's host rate-limits (429)
            return
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(10 * (attempt + 1))
                continue
            print('FAIL', src, e)
            return
        except Exception as e:
            print('FAIL', src, e)
            return
    print('FAIL 429', src)


PORTFOLIO = {
    'hibryd-85-kvt': ['2025/06/gibrydna-sonyachna-elektrostancziya-85-kvt.png', '2025/06/screenshot_3.png', '2025/06/screenshot_6.png', '2025/06/screenshot_4.png', '2025/06/screenshot_5.png'],
    'hibryd-5-kvt': ['2025/06/photo_2025-05-15_11-27-48.jpg', '2025/06/photo_2025-05-15_11-27-55.jpg', '2025/06/photo_2025-05-15_11-27-52.jpg', '2025/06/6-kvt-2.png'],
    'merezheva-250-kvt': ['2025/06/6-kvt-1.png', '2025/06/3947596d-2753-4feb-9e22-9914704e5c63.png', '2025/06/2-1.png', '2025/06/4.png'],
    'hibryd-100-kvt-dah': ['2025/05/6-kvt-2-5.png', '2025/05/1.png', '2025/05/4.png', '2025/05/5.png', '2025/05/6.png'],
    'merezheva-60-kvt': ['2025/04/dyzajn-bez-nazvy-2.png', '2025/04/4dbd5aad-2e62-4a2b-b2dc-0803eab9027a-e1745999144961.jpg', '2025/04/d1697d2f-7aa1-41a3-a13f-04f2c4fb82af-e1745999176635.jpg', '2025/04/photo_2025-04-15_14-49-19-e1745999211632.jpg', '2025/04/d45066a8-b9ca-4efb-b8df-7f906ba8151b-e1745999620537.jpg'],
    'merezheva-20-kvt': ['2025/04/2f720558-e4c0-4f31-9df5-34effca2767b.jpg', '2025/04/51c7b1e8-7b84-4bd1-a662-fd3bfc344587.jpg', '2025/04/e86797d1-9960-4e5b-8b74-68968ece6ed2.jpg'],
    'merezheva-70-kvt': ['2025/04/dyzajn-bez-nazvy-1-e1746006205786.png', '2025/04/img_9048-3-scaled.jpg', '2025/04/img_9557-3-scaled-e1746006265954.jpg'],
    'hibryd-100-kvt-longi': ['2025/04/dyzajn-bez-nazvy.png', '2025/04/1.png', '2025/04/photo_2025-03-31_14-47-59.jpg', '2025/04/photo_2025-04-16_15-37-48-2.jpg', '2025/04/photo_2025-04-16_15-37-48.jpg'],
    'merezheva-120-kvt': ['2021/08/portfolio.webp', '2021/08/1.png', '2021/08/2.png', '2021/08/3.png', '2021/08/4.png', '2021/08/5.png'],
}

jobs = []
cat = json.load(open(os.path.join(R, 'catalog.json')))
for x in cat:
    if x['gallery']:
        src = x['gallery'][0]
        src = re.sub(r'-\d+x\d+(\.\w+)$', r'\1', src)
        ext = os.path.splitext(src)[1] or '.png'
        jobs.append((UP + src, os.path.join(R, 'raw/products', pid(x['url']) + ext)))
for slug, files in PORTFOLIO.items():
    for i, f in enumerate(files, 1):
        jobs.append((UP + f, os.path.join(R, 'raw/site', slug, f'{i:02d}' + os.path.splitext(f)[1])))

for j in jobs:
    get(*j)
print('done', len(jobs))
