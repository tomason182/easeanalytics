import styles from "./Cards.module.css";


export default function Countries() {
  return (
    <div className={styles.card}>
      <h3>Countries</h3>
      <table>
        <caption>Total amount of visitors segmented by Countries</caption>
        <thead>
          <tr>
            <th scope="col">Country</th>
            <th scope="col">Visitors</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Argentina</th>
            <td>35k</td>
          </tr>
          <tr>
            <th scope="row">Chile</th>
            <td>22k</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
