import styles from "./Cards.module.css";


export default function Referrers() {
  return (
    <div className={styles.card}>
      <table>
        <caption>Total visitors per country last year</caption>
        <thead>
          <tr>
            <th scope="col">Country</th>
            <th scope="col">Visitors</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Argentina</th>
            <td>36k</td>
          </tr>
          <tr>
            <th scope="row">Chile</th>
            <td>25k</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
