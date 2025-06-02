import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DealDashboard.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

function DealDashboard() {
  const [deals, setDeals] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/deals')
      .then((res) => setDeals(res.data))
      .catch((err) => console.error('Error fetching deals:', err));
  }, []);

  const pipelines = [...new Set(deals.map((d) => d.pipeline_label).filter(Boolean))];
  const stages = [...new Set(deals.map((d) => d.stage_label).filter(Boolean))];

  const filteredDeals = deals.filter((d) => {
    const dealDate = new Date(d.day);
    const isAfterStart = startDate ? dealDate >= startDate : true;
    const isBeforeEnd = endDate ? dealDate <= endDate : true;
    const matchesPipeline = selectedPipeline ? d.pipeline_label === selectedPipeline : true;
    const matchesStage = selectedStage ? d.stage_label === selectedStage : true;
    return isAfterStart && isBeforeEnd && matchesPipeline && matchesStage;
  });

  const chartData = filteredDeals.reduce((acc, item) => {
    const stage = item.stage_label || 'Unknown';
    const found = acc.find((d) => d.stage === stage);
    if (found) {
      found.total += item.total_deals;
    } else {
      acc.push({ stage, total: item.total_deals });
    }
    return acc;
  }, []);

  return (
    <div className="dashboard-content">
      <h2>Deals Dashboard</h2>

      <table>
        <thead>
          {/* Filter Row */}
          <tr>
            <th>
              <div>Date</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Start Date"
                  className="filter-date"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="End Date"
                  className="filter-date"
                />
              </div>
            </th>
            <th>
              <div>Pipeline</div>
              <select
                value={selectedPipeline}
                onChange={(e) => setSelectedPipeline(e.target.value)}
                className="filter-select"
              >
                <option value="">All Pipelines</option>
                {pipelines.map((p, idx) => (
                  <option key={idx} value={p}>{p}</option>
                ))}
              </select>
            </th>
            <th>
              <div>Stage</div>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="filter-select"
              >
                <option value="">All Stages</option>
                {stages.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))}
              </select>
            </th>
            <th>Total Deals</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeals.map((d, idx) => (
            <tr key={idx}>
              <td>{new Date(d.day).toLocaleDateString()}</td>
              <td>{d.pipeline_label}</td>
              <td>{d.stage_label}</td>
              <td>{d.total_deals}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Deals by Stage</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DealDashboard;









