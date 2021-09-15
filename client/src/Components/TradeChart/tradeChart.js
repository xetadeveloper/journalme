// Modules
import React, { useEffect, useState, useRef } from 'react';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { chartDefaults } from '../../config';

// Styles
import style from './tradeChart.module.css';

// Components
import { Bar, Chart } from 'react-chartjs-2';
import { enUS } from 'date-fns/locale';
import SmallButton from '../Buttons/SmallButton/smallButton';

export default function TradeChart(props) {
  const { chartData, chartOptions } = props;

  const { wheelEnabled, panEnabled, pinchEnabled } = chartOptions || {};
  const { showControls, chartTitle, axisFont } = chartOptions || {};

  const { chartName, font } = chartTitle || {};

  // Effects
  // Registering chart default values
  useEffect(() => {
    Chart.register(zoomPlugin);
    const globalFont = axisFont ? axisFont : chartDefaults.font;
    Chart.defaults.font = { ...Chart.defaults.font, ...globalFont };
  });

  // This function handles the chart zooming in
  function chartZoomIn(evt) {
    Chart.getChart('tradesChart').zoom(1.3);
  }

  // This function handles the chart zooming out
  function chartZoomOut(evt) {
    Chart.getChart('tradesChart').zoom(0.7);
  }

  // This function handles resetting zoom
  function chartResetZoom(evt) {
    Chart.getChart('tradesChart').resetZoom();
  }

  return (
    <section className={`${style.chartHolder}`}>
      <Bar
        id='tradesChart'
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                displayFormats: {
                  month: 'MMM',
                },
              },
              title: {
                display: true,
                text: 'Time of Trade',
              },
              adapters: {
                date: {
                  locale: enUS,
                },
              },
              grid: {
                display: false,
              },
            },
            y: {
              // type: 'category',
              title: {
                text: 'P/L (USD)',
                display: true,
              },
              ticks: {
                callback: (value, index, values) => {
                  return value >= 0 ? '$' + value : '-$' + Math.abs(value);
                },
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: `${chartName}` || 'Chart',
              font: font || { size: 23 },
              color: '#166cec',
            },
            zoom: {
              pan: {
                enabled: panEnabled,
                mode: 'x',
              },

              zoom: {
                wheel: { enabled: wheelEnabled },
                pinch: { enabled: pinchEnabled },
                mode: 'x',
              },
            },
          },
        }}
      />

      {showControls && (
        <div className={`flex justify-content-center ${style.controlHolder}`}>
          <div className={`${style.controlButton}`}>
            <SmallButton btnText='+' clickHandler={chartZoomIn} />
          </div>
          <div className={`${style.controlButtonReset}`}>
            <SmallButton btnText='Reset' clickHandler={chartResetZoom} />
          </div>
          <div className={`${style.controlButton}`}>
            <SmallButton btnText='-' clickHandler={chartZoomOut} />
          </div>
        </div>
      )}
    </section>
  );
}
