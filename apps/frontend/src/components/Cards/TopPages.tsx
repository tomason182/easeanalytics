import styles from "./Cards.module.css";

export default function TopPages() {
  return (
    <div className={styles.card}>
        <h3>Top Pages</h3>
        <table>
          <caption>Top pages visited by unique users</caption>
          <thead>
            <tr>
              <th scope="col">Entry page</th>
              <th scope="col">Visitors</th>
            </tr>
          </thead>
          <tbody>
            <tr scope="row">
              <th>/</th>
              <td>385k</td>
            </tr>
            <tr scope="row">
              <th>/blog</th>
              <td>85k</td>
            </tr>
            <tr>
              <th>/auth</th>
              <td>35k</td>
            </tr>
          </tbody>
        </table>

    </div>
  )
}
