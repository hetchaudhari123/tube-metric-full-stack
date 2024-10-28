import { Line } from 'react-chartjs-2';

const ReportsAreaChart = ({ data, title, color }) => {
    // Set default values for labels and values if data is undefined or empty
    const chartData = {
        labels: data?.labels || ["No Data"],  // Default label
        datasets: [
            {
                label: title,
                data: data?.values || [0],  // Default value
                backgroundColor: color === "secondary" ? "rgba(72, 72, 176, 0.2)" : "rgba(0, 123, 255, 0.2)", // Adjust as needed
                borderColor: color === "secondary" ? "rgba(72, 72, 176, 1)" : "rgba(0, 123, 255, 1)",
                fill: true, // Enable fill for area chart
                tension: 0.4 // Optional: smoothes the line
            }
        ]
    };

    return <Line data={chartData} options={{ maintainAspectRatio: false }} />;
};

export default ReportsAreaChart;
