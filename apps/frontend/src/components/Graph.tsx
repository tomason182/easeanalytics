import {Line} from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type Props = {
  labels: string[];
  data: number[];
}

export default function Graph({labels, data}: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Page View",
        data,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.3
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true},
      title: { display: true, text: "Page Views Over Time"},
    },
  }

  return <Line data={chartData} options={options}  />
}
