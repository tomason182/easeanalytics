import styles from "./Cards.module.css";


export default function Device() {
  return (
    <div className={styles.card}>
      <h3>Divices breakdown</h3>
      <table>
        <caption>Total anual visitors breakdown by device</caption>
        <thead>
          <tr>
            <th scope="col">Device</th>
            <th scope="col">Visitors</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Firefox</th>
            <td>55k</td>
          </tr>
          <tr>
            <th scope="row">Brave</th>
            <td>34k</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
