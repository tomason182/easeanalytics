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
            <th scope="col">Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Desktop</th>
            <td>60%</td>
          </tr>
          <tr>
            <th scope="row">Mobile</th>
            <td>35%</td>
          </tr>
          <tr>
            <th scope="row">Tablet</th>
            <td>5%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
