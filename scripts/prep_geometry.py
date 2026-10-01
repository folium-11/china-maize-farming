"""Filter Natural Earth 1:10m admin-1 boundaries to China and work out which provinces touch.
Input : data/ne_admin1.geojson (Natural Earth, public domain)
Output: data/china_provinces.json  (31 mainland provinces + 3 grey territories, full 1:10m detail)
        data/adjacency.json
"""
import json, itertools, collections

SRC = "data/ne_admin1.geojson"
EN = {  # Natural Earth name -> name used by the National Bureau of Statistics
    "Inner Mongol": "Inner Mongolia", "Xizang": "Tibet",
}
d = json.load(open(SRC))
provs, terr = [], collections.defaultdict(list)
for f in d["features"]:
    p = f["properties"]; a3 = p["adm0_a3"]
    if a3 == "CHN" and p["name"] != "Paracel Islands":
        provs.append(f)
    elif a3 in ("TWN", "HKG", "MAC"):
        terr[a3].append(f)

def polys(geom):
    return [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]

def rnd(c):  # 5 decimals is about 1 m on the ground
    return [[[round(x, 5), round(y, 5)] for x, y in ring] for ring in c]

out = []
for f in provs:
    p = f["properties"]
    out.append({"code": p["iso_3166_2"].split("-")[1], "en": EN.get(p["name"], p["name"]), "zh": p["name_zh"],
                "kind": "province", "polygons": [rnd(pg) for pg in polys(f["geometry"])]})
names = {"TWN": ("TW", "Taiwan", "台湾"), "HKG": ("HK", "Hong Kong", "香港"), "MAC": ("MO", "Macao", "澳门")}
for a3, fs in terr.items():
    code, en, zh = names[a3]
    pgs = []
    for f in fs:
        pgs += [rnd(pg) for pg in polys(f["geometry"])]
    out.append({"code": code, "en": en, "zh": zh, "kind": "territory", "polygons": pgs})
out.sort(key=lambda r: (r["kind"], r["code"]))
json.dump(out, open("data/china_provinces.json", "w"), separators=(",", ":"), ensure_ascii=False)
print(len(out), "features,", sum(len(r["polygons"]) for r in out), "polygons")

# adjacency from shared vertices (Natural Earth is topologically consistent)
owner = collections.defaultdict(set)
for r in out:
    if r["kind"] != "province": continue
    for pg in r["polygons"]:
        for ring in pg:
            for x, y in ring:
                owner[(round(x, 4), round(y, 4))].add(r["code"])
cnt = collections.Counter()
for codes in owner.values():
    for a, b in itertools.combinations(sorted(codes), 2):
        cnt[(a, b)] += 1
adj = {r["code"]: set() for r in out if r["kind"] == "province"}
for (a, b), n in cnt.items():
    if n >= 2:
        adj[a].add(b); adj[b].add(a)
for a, b in [("HI", "GD"), ("HI", "GX"), ("SD", "LN"), ("HE", "LN")]:  # close across water
    adj[a].add(b); adj[b].add(a)
json.dump({k: sorted(v) for k, v in sorted(adj.items())}, open("data/adjacency.json", "w"))
for k, v in sorted(adj.items()):
    print(k, len(v), sorted(v))
