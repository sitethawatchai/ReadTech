# Export OFL font outlines, retaining the authored pen paths verbatim.
# Offline only; the website and its build do not require Python.
import json,sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
ROOT=Path(__file__).resolve().parents[1]
records=json.loads(Path(sys.argv[1]).read_text())
font=TTFont(ROOT/'node_modules/@fontsource/sarabun/files/sarabun-thai-400-normal.woff')
latin=TTFont(ROOT/'node_modules/@fontsource/sarabun/files/sarabun-latin-400-normal.woff')
result={}
for char,guide in {**records,'–':{'strokes':[]}}.items():
 f=latin if char=='–' else font
 name=f.getBestCmap()[ord(char)];glyph=f['glyf'][name];gs=f.getGlyphSet();pen=SVGPathPen(gs);gs[name].draw(pen)
 result[char]={'advance':f['hmtx'][name][0],'bounds':[glyph.xMin,glyph.yMin,glyph.xMax,glyph.yMax],'outline':pen.getCommands(),**guide}
(ROOT/'src/writingGeometry.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
print(f'Exported {len(result)} glyphs. Authored stroke order preserved; no skeleton projection.')
