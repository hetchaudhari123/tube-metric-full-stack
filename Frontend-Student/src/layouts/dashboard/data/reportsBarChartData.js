/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/


export default {
  labels: ["M", "T", "W", "T", "F", "S", "S"],
  datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
};




// chartUtils.js
// const prepareChartData = (data) => {
//   const labels = data.map(item => item.title);
//   const viewCounts = data.map(item => item.viewCount);
//   return {
//     labels: labels,
//     datasets: [
//       {
//         label: 'View Count',
//         data: viewCounts,
//         backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for the bars
//         borderColor: 'rgba(75, 192, 192, 1)', // Border color for the bars
//         borderWidth: 1, // Border width for the bars
//       },
//     ],
//   };
// };

// export default prepareChartData;
// const prepareChartData = (data) => {
//   const labels = data.map(item => item.title); // Extract titles for x-axis
//   const viewCounts = data.map(item => item.viewCount); // Extract view counts for y-axis

//   return {
//     labels: labels, // Use the extracted titles
//     datasets: [
//       {
//         label: 'View Count', // Label for the dataset
//         data: viewCounts, // Use the extracted view counts
//         backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for the bars
//         borderColor: 'rgba(75, 192, 192, 1)', // Border color for the bars
//         borderWidth: 1, // Border width for the bars
//       },
//     ],
//   };
// };

// // Use the dummy data
// const dummyData = [
//   { title: "Video 1", viewCount: 150 },
//   { title: "Video 2", viewCount: 250 },
//   { title: "Video 3", viewCount: 100 },
//   { title: "Video 4", viewCount: 350 },
//   { title: "Video 5", viewCount: 200 },
// ];

// // Prepare chart data
// const chartData = prepareChartData(dummyData);
// console.log(chartData);


// export default prepareChartData;
