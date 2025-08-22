import styles from "./Cards.module.css";


export default function Countries() {
  return (
    <div className={styles.card}>
      <h3>Countries distribution</h3>
      <table>
        <caption>Total amount of visitors segmented by Countries</caption>
        <thead>
          <tr>
            <th scope="col">Country</th>
            <th scope="col">Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Argentina</th>
            <td>35%</td>
          </tr>
          <tr>
            <th scope="row">Chile</th>
            <td>22%</td>
          </tr>
          <tr>
            <th scope="row">Other</th>
            <td>43%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
