
function stackedBarConfigs(labels, datasets) {
    return {
      data: {
        labels,
        datasets: datasets.map((dataset) => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor: dataset.backgroundColor || "rgba(75, 192, 192, 0.6)", // Default color if none provided
          borderWidth: 0,
          borderRadius: 4,
          maxBarThickness: 25,
          stack: "Stack 0", // Ensures all datasets are stacked together
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: "#fff", // Change color of legend text
              font: {
                size: 14,
                weight: 500,
                family: "Roboto",
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`; // Show dataset label and value
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index", // Allows hovering over the same index for multiple datasets
        },
        scales: {
          y: {
            grid: {
              drawBorder: false,
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
              borderDash: [5, 5],
              color: "rgba(255, 255, 255, .2)",
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 500,
              beginAtZero: true,
              padding: 10,
              font: {
                size: 14,
                weight: 300,
                family: "Roboto",
                style: "normal",
                lineHeight: 2,
              },
              color: "#fff",
            },
          },
          x: {
            stacked: true, // Enable stacking on the x-axis
            grid: {
              drawBorder: false,
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
              borderDash: [5, 5],
              color: "rgba(255, 255, 255, .2)",
            },
            ticks: {
              display: true,
              color: "#f8f9fa",
              padding: 10,
              font: {
                size: 14,
                weight: 300,
                family: "Roboto",
                style: "normal",
                lineHeight: 2,
              },
            },
          },
        },
      },
    };
  }
  
  export default stackedBarConfigs;