import { useState } from "react"
import Graph from "./components/Graph.tsx";
import TopPages from "./components/Cards/TopPages.tsx";
import Referres from "./components/Cards/Referres.tsx";
import Device from "./components/Cards/Device.tsx";
import Countries from "./components/Cards/Countries.tsx";
import styles from "./App.module.css"

function App() {


  const mockedData = {
    "labels": ["2025-08-15", "2025-08-16", "2015-08-17"],
    "pageViews": [120, 95, 140]
  }

  const labels = mockedData.labels;
  const counts = mockedData.pageViews;

  return (
    <div className={styles.mainContainer}>
      <header>
        <p>Ease Analitics</p>
        <button className={styles.profileBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-user-round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
        </button>
      </header>
      <div className={styles.statsContainer}>
          <ul className={styles.stats}>
            <li>
              <h3>TOTAL VISITS</h3>
              <span>1.3M</span>
            </li>
            <li>
              <h3>UNIQUE VISITORS</h3>
              <span>834K</span>
            </li>
            <li>
              <h3>TOTAL PAGES VIEWS</h3>
              <span>983</span>
            </li>
          </ul>
        <div className="graphContainer">
         <Graph labels={labels} data={counts} />
        </div>
        
      </div>

      <div className={styles.gridContainer}>
        <TopPages />
        <Referres />
        <Device />
        <Countries />
      </div>
    </div>

 )
}

export default App
