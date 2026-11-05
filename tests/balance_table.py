#!/usr/bin/env python3
# usage: balance_table.py file1.json [file2.json ...]   (merges runs per hero, drops invalid starts, prints mean±sd, median)
import json, sys, statistics as st
d = {}
for f in sys.argv[1:]:
    for h, runs in json.load(open(f)).items():
        d.setdefault(h, []).extend(x for x in runs if x['time'] > 0 and x['ch'] == h)
for h, o in d.items():
    de = [x['deaths'] for x in o]; ti = [x['time'] for x in o]; wins = sum(x['win'] for x in o)
    print('%-8s n=%2d win=%2d  deaths %5.2f ±%4.2f (median %4.1f)   clear %6.1f ±%4.1f s (median %5.1f)' % (h, len(o), wins, st.mean(de), st.pstdev(de), st.median(de), st.mean(ti), st.pstdev(ti), st.median(ti)))
