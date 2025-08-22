import styles from "./Cards.module.css";


export default function Referrers() {
  return (
    <div className={styles.card}>
      <h3>Referres</h3>
      <table>
        <caption>Total visitors per type of source</caption>
        <thead>
          <tr>
            <th scope="col">Source</th>
            <th scope="col">Visitors</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Direct</th>
            <td>36k</td>
          </tr>
          <tr>
            <th scope="row">DuckDuckGo</th>
            <td>25k</td>
          </tr>
          <tr>
            <th scope="row">Google</th>
            <td>13k</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
