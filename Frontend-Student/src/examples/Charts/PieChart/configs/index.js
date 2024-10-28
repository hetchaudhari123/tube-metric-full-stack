// // Material Dashboard 2 React base styles
// import { ContentPasteSearch } from "@mui/icons-material";
// import colors from "assets/theme/base/colors";

// const { gradients, dark } = colors;

// function configs(labels, datasets) {
//   // Set background colors for the pie chart
//   const backgroundColors = datasets.backgroundColor
//     ? datasets.backgroundColor
//     : [dark.main]; // Default color if none is provided
//   // console.log("Labels...",labels)
//   // console.log("datasets....",datasets)
//   return {
//     data: {
//       labels,
//       datasets: [
//         {
//           label: datasets.label,
//           data: datasets.data,
//           backgroundColor: backgroundColors,
//           borderColor: datasets.borderColor || dark.main, // Default border color
//           borderWidth: datasets.borderWidth || 1, // Default border width
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: true, // Show legend for pie charts
//         },
//       },
//     },
//   };
// }

// export default configs;







// Material Dashboard 2 React base styles
import { ContentPasteSearch } from "@mui/icons-material";
import colors from "assets/theme/base/colors";
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

const { gradients, dark } = colors;

function configs(labels, datasets) {
  // Set background colors for the pie chart
  const backgroundColors = datasets.backgroundColor
    ? datasets.backgroundColor
    : [dark.main]; // Default color if none is provided

  return {
    data: {
      labels,
      datasets: [
        {
          label: datasets.label,
          data: datasets.data,
          backgroundColor: backgroundColors,
          borderColor: datasets.borderColor || dark.main, // Default border color
          borderWidth: datasets.borderWidth || 1, // Default border width
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true, // Show legend for pie charts
        },
        // Configure the datalabels plugin
        datalabels: {
          display: true,
          color: 'white', // Customize the color of the labels
          formatter: (value) => {
            return value; // Show the value inside the pie slices
          },
        },
      },
    },
    plugins: [ChartDataLabels], // Add the datalabels plugin
  };
}

export default configs;
