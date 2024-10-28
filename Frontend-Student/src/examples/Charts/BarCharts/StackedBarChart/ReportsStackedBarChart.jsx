import { useMemo } from "react";
import PropTypes from "prop-types";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import stackedBarConfigs from "examples/Charts/BarCharts/StackedBarChart/configs/index";
import { Divider } from "@mui/material";
import Icon from "@mui/material/Icon";
// Function to generate random colors
const getRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};

function ReportsStackedBarChart({ color, title, chart }) {
  const trimLabel = (label, maxLength) => {
    return label.length > maxLength ? label.substring(0, maxLength) + "..." : label;
  };

  // Trim each label in the chart labels
  const trimmedLabels = chart?.labels?.map(label => trimLabel(label, 25)); // Trim to 25 characters, adjust as needed

  // Prepare datasets for stacked bar chart
  const datasets = chart?.datasets?.map((dataset, index) => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || getRandomColor(), // Use random color if not provided
  })) || [];

  // Use the new stackedBarConfigs for chart data and options
  const { data, options } = stackedBarConfigs(trimmedLabels, datasets);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox padding="1rem">
        {useMemo(
          () => (
            <MDBox
              variant="gradient"
              bgColor={color}
              borderRadius="lg"
              coloredShadow={color}
              py={2}
              pr={0.5}
              mt={-5}
              height="20rem" // Set height for the stacked bar chart
            >
              <Chart type="bar" data={data} options={options} />
            </MDBox>
          ),
          [data, options, color] // Depend on data and options
        )}
        <MDBox pt={3} pb={1} px={1}>
          <MDTypography variant="h6" textTransform="capitalize">
            {title}
          </MDTypography>
          {/* <MDTypography component="div" variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography> */}
          <Divider />
          <MDBox display="flex" alignItems="center">
            <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
              <Icon>schedule</Icon>
            </MDTypography>
            {/* <MDTypography variant="button" color="text" fontWeight="light">
              {date}
            </MDTypography> */}
          </MDBox>
        </MDBox>
        {/* <MDBox pt={3} pb={1} px={1}>
          <MDTypography variant="h6" textTransform="capitalize">
            {title}
          </MDTypography>
        </MDBox> */}
      </MDBox>
    </Card>
  );
}

// Default props for the stacked bar chart component
ReportsStackedBarChart.defaultProps = {
  color: "dark",
};

// Prop types for the stacked bar chart component
ReportsStackedBarChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
};

export default ReportsStackedBarChart;
