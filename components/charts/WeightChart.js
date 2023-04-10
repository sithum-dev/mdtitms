import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
// import "chartjs-plugin-annotation";

// Chart.pluginService.register(annotationPlugin);

const config = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Date",
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "Value",
      },
    },
  },
};

function WeightChart({ chartData }) {
  return <Line data={chartData} options={config} />;
}

export default WeightChart;
