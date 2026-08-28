/* "How do you know that is correct?" — a Google question, an Uber question,
   and the one part of DSA prep almost nobody rehearses out loud. Static
   content, so this is a server component. */
export default function Proof({ proof }: { proof: any }) {
  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">DSA · argument shapes</div>
        <h1>Why it is correct</h1>
        <p className="pane-sub">{proof.intro}</p>
      </div>

      <div className="learn">{proof.note}</div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Shape</th><th>When it applies</th>
              <th>The sentence you say</th><th>Where it shows up</th>
            </tr>
          </thead>
          <tbody>
            {proof.rows.map((r: any, i: number) => (
              <tr key={i}>
                <td className="fire">{r[0]}</td>
                <td className="trig">{r[1]}</td>
                <td>{r[2]}</td>
                <td className="canon">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="exit" style={{ marginTop: 20 }}><b>Drill.</b> {proof.drill}</div>
    </>
  );
}
