import details from "@/lib/catalog-details.json";

export type Block = { h?: string; p?: string; ul?: string[]; table?: string[][] };
const all = details as unknown as Record<string, Block[]>;

/** Description blocks of a catalogue item, as scraped from megasolar.com.ua (server only). */
export const blocksOf = (id: string): Block[] => all[id] ?? [];

/** Two-column tables (characteristics) become key/value pairs. */
export function specPairs(blocks: Block[]) {
  const t = blocks.find((b) => b.table && b.table.length > 2 && b.table.every((r) => r.length === 2));
  if (!t?.table) return [];
  const rows = t.table.filter((r) => r[0] && r[1]);
  return (/характеристик|параметр/i.test(rows[0][0]) ? rows.slice(1) : rows).map(([k, v]) => ({ k, v }));
}

export function Blocks({ blocks, skipTables = 0 }: { blocks: Block[]; skipTables?: number }) {
  let tables = 0;
  const out: React.ReactNode[] = [];
  blocks.forEach((b, i) => {
    if (b.h) {
      // Drop headings that only introduced a table we render elsewhere.
      const next = blocks[i + 1];
      if (next?.table && tables < skipTables) return;
      if (/схема станції|^ціна$/i.test(b.h)) return;
      out.push(<h3 key={i}>{b.h.replace(/:$/, "")}</h3>);
    } else if (b.p) {
      out.push(<p key={i}>{b.p}</p>);
    } else if (b.ul) {
      out.push(
        <ul key={i} className="blocks-list">
          {b.ul.map((li) => (
            <li key={li}>{li}</li>
          ))}
        </ul>,
      );
    } else if (b.table) {
      tables += 1;
      if (tables <= skipTables) return;
      const [head, ...rows] = b.table;
      const isHead = head.length > 2 || /характеристик|параметр|послуга|потужність сес|товар/i.test(head[0]);
      out.push(
        <div key={i} className="blocks-table-wrap">
          <table className="blocks-table">
            {isHead && (
              <thead>
                <tr>
                  {head.map((c, k) => (
                    <th key={k}>{c}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(isHead ? rows : b.table).map((r, k) => (
                <tr key={k}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    }
  });
  return <div className="blocks">{out}</div>;
}
