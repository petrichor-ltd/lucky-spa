#!/usr/bin/env python3
"""Check static publication files without third party dependencies."""

from collections import Counter
from functools import lru_cache
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import struct
import sys
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
errors = []


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.tags = []
        self.ids = []
        self.references = []
        self.images = []
        self.meta = {}
        self.canonical = None
        self.language = None
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append(tag)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "html":
            self.language = attrs.get("lang")
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property"))] = attrs.get("content")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if tag == "img":
            self.images.append(attrs)
            if "alt" not in attrs:
                errors.append(f"{self.path.name}: image missing alt")
        for key in ("src", "href"):
            if attrs.get(key):
                self.references.append(attrs[key])
        if attrs.get("srcset"):
            self.references.extend(item.strip().split()[0] for item in attrs["srcset"].split(","))
        if attrs.get("target") == "_blank" and "noopener" not in attrs.get("rel", "").split():
            errors.append(f"{self.path.name}: new window link missing noopener")


pages = {path: Page(path) for path in ROOT.glob("*.html")}
if len(pages) != 5:
    errors.append(f"Expected five public pages; found {len(pages)}")


def local_reference(source, value):
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        return
    path = (ROOT / unquote(parsed.path).lstrip("/")) if parsed.path.startswith("/") else source.parent / unquote(parsed.path)
    path = path.resolve() if parsed.path else source
    if path.is_dir():
        path = path / "index.html"
    if not path.is_relative_to(ROOT):
        errors.append(f"{source.name}: reference escapes publication root: {value}")
    elif not path.is_file():
        errors.append(f"{source.name}: missing local target: {value}")
    elif parsed.fragment and path in pages and unquote(parsed.fragment) not in pages[path].ids:
        errors.append(f"{source.name}: missing fragment: {value}")


@lru_cache(maxsize=None)
def webp_dimensions(path):
    """Read the canvas size from standard WebP headers without a decoder."""
    data = path.read_bytes()
    if len(data) < 12 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise ValueError("missing WebP RIFF header")
    offset = 12
    while offset + 8 <= len(data):
        chunk_type = data[offset:offset + 4]
        chunk_size = struct.unpack_from("<I", data, offset + 4)[0]
        payload = data[offset + 8:offset + 8 + chunk_size]
        if len(payload) != chunk_size:
            raise ValueError("truncated WebP chunk")
        if chunk_type == b"VP8X" and len(payload) >= 10:
            return (int.from_bytes(payload[4:7], "little") + 1,
                    int.from_bytes(payload[7:10], "little") + 1)
        if chunk_type == b"VP8L" and len(payload) >= 5 and payload[0] == 0x2F:
            dimensions = int.from_bytes(payload[1:5], "little")
            return ((dimensions & 0x3FFF) + 1,
                    ((dimensions >> 14) & 0x3FFF) + 1)
        if chunk_type == b"VP8 " and len(payload) >= 10 and payload[3:6] == b"\x9d\x01\x2a":
            width, height = struct.unpack_from("<HH", payload, 6)
            size = width & 0x3FFF, height & 0x3FFF
            if 0 in size:
                raise ValueError("WebP image has zero dimensions")
            return size
        offset += 8 + chunk_size + (chunk_size & 1)
    raise ValueError("missing WebP image dimensions")


def home_image_dimensions(reference):
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc:
        raise ValueError("homepage images must use local publication paths")
    path = (ROOT / unquote(parsed.path).lstrip("/")).resolve()
    if not path.is_relative_to(ROOT):
        raise ValueError("image path escapes publication root")
    return webp_dimensions(path)


for path, page in pages.items():
    if not page.language:
        errors.append(f"{path.name}: missing document language")
    for tag in ("h1", "main", "title"):
        if page.tags.count(tag) != 1:
            errors.append(f"{path.name}: expected one {tag}")
    for name in ("description", "viewport"):
        if not page.meta.get(name):
            errors.append(f"{path.name}: missing {name} metadata")
    for identifier, count in Counter(page.ids).items():
        if count > 1:
            errors.append(f"{path.name}: duplicate ID: {identifier}")
    for value in page.references:
        local_reference(path, value)

home = pages[ROOT / "index.html"]
domain = (ROOT / "CNAME").read_text().strip()
canonical = f"https://{domain}/"
if home.canonical != canonical or home.meta.get("og:url") != canonical:
    errors.append("index.html: canonical/og:url does not match CNAME")
for key in ("og:image", "twitter:image"):
    value = home.meta.get(key, "")
    parsed = urlsplit(value)
    if parsed.scheme != "https" or parsed.netloc != domain:
        errors.append(f"index.html: {key} must be an absolute HTTPS site URL")
    else:
        local_reference(ROOT / "index.html", parsed.path)
for image in home.images:
    has_dimensions = all(image.get(key, "").isdigit() and int(image[key]) > 0
                         for key in ("width", "height"))
    if not has_dimensions:
        errors.append(f"index.html: image missing explicit dimensions: {image.get('src')}")
    if not image.get("src", "").endswith(".webp"):
        errors.append(f"index.html: image is not an optimized WebP: {image.get('src')}")
    if "srcset" not in image:
        errors.append(f"index.html: responsive image missing srcset: {image.get('src')}")
    try:
        source_size = home_image_dimensions(image.get("src", ""))
        referenced_sizes = [source_size]
        for candidate in image.get("srcset", "").split(","):
            if not candidate.strip():
                continue
            parts = candidate.split()
            if len(parts) != 2 or not re.fullmatch(r"[1-9]\d*w", parts[1]):
                raise ValueError(f"invalid srcset width descriptor: {candidate.strip()}")
            candidate_size = home_image_dimensions(parts[0])
            if candidate_size[0] != int(parts[1][:-1]):
                raise ValueError(f"srcset width differs from actual image: {parts[0]}")
            expected_height = source_size[1] * candidate_size[0] / source_size[0]
            if abs(candidate_size[1] - expected_height) > 1:
                raise ValueError(f"srcset aspect ratio differs from source: {parts[0]}")
            referenced_sizes.append(candidate_size)
        if has_dimensions and (int(image["width"]), int(image["height"])) not in referenced_sizes:
            raise ValueError("width/height attributes do not match any referenced image")
    except (OSError, ValueError) as exc:
        errors.append(f"index.html: {image.get('src')}: {exc}")
if sum(image.get("fetchpriority") == "high" for image in home.images) != 1:
    errors.append("index.html: expected exactly one high priority hero image")

for css in (ROOT / "assets/css").glob("*.css"):
    for value in re.findall(r"url\(\s*['\"]?([^)'\"]+)['\"]?\s*\)", css.read_text()):
        local_reference(css, value.strip())
for pdf in (ROOT / "assets/pdf").glob("*.pdf"):
    with pdf.open("rb") as file:
        if file.read(5) != b"%PDF-":
            errors.append(f"{pdf.name}: invalid PDF header")

try:
    sitemap = ET.parse(ROOT / "sitemap.xml")
    urls = {node.text for node in sitemap.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")}
    expected = {canonical if path.name == "index.html" else canonical + path.name for path in pages}
    if urls != expected:
        errors.append("sitemap.xml: public page URLs do not match site pages")
except (OSError, ET.ParseError) as exc:
    errors.append(f"sitemap.xml: {exc}")
try:
    if f"Sitemap: {canonical}sitemap.xml" not in (ROOT / "robots.txt").read_text():
        errors.append("robots.txt: missing sitemap URL")
except OSError as exc:
    errors.append(f"robots.txt: {exc}")

if errors:
    print("Static publication checks failed:")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)
print(f"PASS: {len(pages)} pages, local links/fragments, CSS assets, PDF headers, responsive homepage images, SEO and sitemap.")
