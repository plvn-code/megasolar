"""Build web media from research/raw (gitignored): hero video (Pexels 32966305, licensed, free),
montage band + client review from the client's Instagram reels, object stills from
megasolar.com.ua/portfolio and reel frames. Usage:
  ~/Desktop/aluabri/research/.venv/bin/python -I scripts/build_media.py . [stills|video|sizes|all]
"""
import glob, json, os, subprocess, sys
import imageio_ffmpeg
from PIL import Image, ImageEnhance

FF = imageio_ffmpeg.get_ffmpeg_exe()
root = sys.argv[1]
what = sys.argv[2] if len(sys.argv) > 2 else 'all'
R = os.path.join(root, 'research/raw')
OUT_IMG = os.path.join(root, 'public/images')
OUT_VID = os.path.join(root, 'public/video')
TMP = os.path.join(R, 'tmp')
for d in (OUT_IMG, OUT_VID, TMP):
    os.makedirs(d, exist_ok=True)


def run(*a):
    r = subprocess.run([FF, '-y', '-loglevel', 'error', *a], capture_output=True, text=True)
    if r.returncode:
        print(r.stderr[-800:]); raise SystemExit(1)


FULL = (0, 0, 1, 1)
NOMARK = (0, 0, 0.94, 0.9)          # drone reels carry the client's logo bottom-right
VERT = (0, 0.14, 1, 0.8)            # vertical reel: logo top-right, captions below
# (output under public/images, source under research/raw, time s or None, crop box x0,y0,x1,y1)
STILLS = [
    # Website portfolio (original photos) — order: cover first
    *[(f'objects/{s}/{i:02d}', f'site/{s}/{j:02d}.webp', None, FULL) for s, order in {
        'hibryd-85-kvt': [2, 4, 5, 3, 1],
        'hibryd-5-kvt': [4, 1, 2, 3],
        'merezheva-250-kvt': [4, 2, 3, 1],
        'hibryd-100-kvt-dah': [2, 4, 5, 3, 1],
        'merezheva-60-kvt': [3, 2, 4, 5, 1],
        'merezheva-20-kvt': [3, 1, 2],
        'merezheva-70-kvt': [3, 1, 2],
        'hibryd-100-kvt-longi': [2, 3, 4, 5, 1],
        'merezheva-120-kvt': [3, 1, 2, 4, 5, 6],
    }.items() for i, j in enumerate(order, 1)],
    # 250 кВт: drone reel DKzQKZxpJlk adds the crew at work
    ('objects/merezheva-250-kvt/05', 'ig/DKzQKZxpJlk.mp4', 19, NOMARK),
    ('objects/merezheva-250-kvt/06', 'ig/DKzQKZxpJlk.mp4', 13, NOMARK),
    ('objects/merezheva-250-kvt/07', 'ig/DKzQKZxpJlk.mp4', 25, NOMARK),
    ('objects/merezheva-250-kvt/08', 'ig/DKzQKZxpJlk.mp4', 7, NOMARK),
    # 120 кВт гібрид + мережа (DMFO04-pBEZ, 190 × TWMNH 620 Вт, Deye 50 + 50 кВт)
    ('objects/hibryd-merezha-118-kvt/01', 'ig/DMFO04-pBEZ.mp4', 44, NOMARK),
    ('objects/hibryd-merezha-118-kvt/02', 'ig/DMFO04-pBEZ.mp4', 48, NOMARK),
    ('objects/hibryd-merezha-118-kvt/03', 'ig/DMFO04-pBEZ.mp4', 36, NOMARK),
    ('objects/hibryd-merezha-118-kvt/04', 'ig/DMFO04-pBEZ.mp4', 40, NOMARK),
    ('objects/hibryd-merezha-118-kvt/05', 'ig/DMFO04-pBEZ.mp4', 20, NOMARK),
    ('objects/hibryd-merezha-118-kvt/06', 'ig/DMFO04-pBEZ.mp4', 6, NOMARK),
    # Наземна 200 кВт (DZwY_fMMA1w, vertical)
    ('objects/nazemna-200-kvt/01', 'ig/DZwY_fMMA1w.mp4', 62, VERT),
    ('objects/nazemna-200-kvt/02', 'ig/DZwY_fMMA1w.mp4', 35, VERT),
    ('objects/nazemna-200-kvt/03', 'ig/DZwY_fMMA1w.mp4', 55, VERT),
    ('objects/nazemna-200-kvt/04', 'ig/DZwY_fMMA1w.mp4', 15, VERT),
    ('objects/nazemna-200-kvt/05', 'ig/DZwY_fMMA1w.mp4', 25, VERT),
    # About
    ('about/office', 'site/about/01.webp', None, FULL),
    ('about/crew', 'ig/DKzQKZxpJlk.mp4', 16, NOMARK),
    ('about/cctv', 'ig/DJoA0BppTlp.mp4', 35, (0, 0.04, 1, 0.94)),
]


def grade(im):
    """Editorial grade: a touch of contrast, calmer colour, warm highlights."""
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(0.92)
    return im


def stills():
    for out, src, t, box in STILLS:
        path = os.path.join(R, src)
        if t is not None:
            tmp = os.path.join(TMP, 'f.png')
            run('-ss', str(t), '-i', path, '-frames:v', '1', tmp)
            im = Image.open(tmp).convert('RGB')
        else:
            im = Image.open(path).convert('RGB')
        W, H = im.size
        x0, y0, x1, y1 = box
        im = im.crop((int(W * x0), int(H * y0), int(W * x1), int(H * y1)))
        im.thumbnail((1400, 1400), Image.LANCZOS)
        im = grade(im)
        dst = os.path.join(OUT_IMG, out + '.webp')
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        im.save(dst, 'WEBP', quality=80, method=6)
    print('stills', len(STILLS))


ENC = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-movflags', '+faststart', '-profile:v', 'high']
# Deep green shadows, warm golden highlights — the field stays green, the panels go deep.
GRADE = 'eq=brightness=-0.04:contrast=1.1:saturation=0.86,colorbalance=rs=-0.05:gs=0.03:bs=-0.02:rh=0.07:gh=0.04:bh=-0.07'


def boomerang(chain, a, b):
    return f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS,fps=30,{chain},split[x][y];[y]reverse[r];[x][r]concat=n=2:v=1[v]"


def video():
    hero = os.path.join(R, 'stock/hero.mp4')
    run('-i', hero, '-filter_complex', boomerang(f'scale=1600:900:flags=lanczos,{GRADE}', 0, 7), '-map', '[v]', '-an', *ENC, '-crf', '29', '-maxrate', '3800k', '-bufsize', '7M', os.path.join(OUT_VID, 'hero.mp4'))
    mob = f'crop=ih*9/16:ih:iw*0.55-ih*9/32:0,scale=720:1280:flags=lanczos,{GRADE}'
    run('-i', hero, '-filter_complex', boomerang(mob, 0, 8), '-map', '[v]', '-an', *ENC, '-crf', '27', '-maxrate', '3M', '-bufsize', '6M', os.path.join(OUT_VID, 'hero-mobile.mp4'))
    run('-ss', '0.2', '-i', hero, '-frames:v', '1', '-vf', f'scale=1920:1080:flags=lanczos,{GRADE}', '-q:v', '78', os.path.join(OUT_IMG, 'hero-poster.webp'))
    run('-ss', '0.2', '-i', hero, '-frames:v', '1', '-vf', mob, '-q:v', '76', os.path.join(OUT_IMG, 'hero-poster-mobile.webp'))
    # Montage band: drone over the 250 kW roof while the crew lays panels (client's reel)
    mont = os.path.join(R, 'ig/DKzQKZxpJlk.mp4')
    crop = 'crop=iw*0.94:ih*0.9:0:0,'
    run('-i', mont, '-filter_complex', boomerang(f'{crop}scale=1280:720:flags=lanczos,{GRADE}', 16, 24), '-map', '[v]', '-an', *ENC, '-crf', '28', '-maxrate', '2500k', '-bufsize', '5M', os.path.join(OUT_VID, 'montazh.mp4'))
    run('-ss', '16.2', '-i', mont, '-frames:v', '1', '-vf', f'{crop}scale=1280:720:flags=lanczos,{GRADE}', '-q:v', '76', os.path.join(OUT_IMG, 'montazh-poster.webp'))
    # Client review (played on click, with sound)
    rev = os.path.join(R, 'ig/DQ6JnikCUVk.mp4')
    run('-i', rev, '-vf', 'scale=540:960:flags=lanczos', *ENC, '-crf', '27', '-c:a', 'aac', '-b:a', '96k', os.path.join(OUT_VID, 'vidguk.mp4'))
    run('-ss', '26', '-i', rev, '-frames:v', '1', '-vf', 'scale=540:960:flags=lanczos', '-q:v', '78', os.path.join(OUT_IMG, 'vidguk-poster.webp'))
    for f in sorted(os.listdir(OUT_VID)):
        print(f, round(os.path.getsize(os.path.join(OUT_VID, f)) / 1048576, 2), 'MB')


def sizes():
    """src/lib/media.json: width/height of every object/about image, for galleries and layout."""
    out = {}
    for p in sorted(glob.glob(os.path.join(OUT_IMG, '**/*.webp'), recursive=True)):
        if '/products/' in p:
            continue
        with Image.open(p) as im:
            out['/' + os.path.relpath(p, os.path.join(root, 'public'))] = im.size
    json.dump(out, open(os.path.join(root, 'src/lib/media.json'), 'w'), indent=0)
    print('media.json', len(out))


if what in ('stills', 'all'):
    stills()
if what in ('video', 'all'):
    video()
if what in ('stills', 'all', 'sizes'):
    sizes()
