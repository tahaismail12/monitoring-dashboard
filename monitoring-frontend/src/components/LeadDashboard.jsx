import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LeadDashboard.css';
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

function LeadDashboard() {
  const [contacts, setContacts] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/contacts')
      .then(res => setContacts(res.data))
      .catch(err => console.error('Error fetching contacts:', err));
  }, []);

  const statuses = [...new Set(contacts.map((c) => c.initcap).filter(Boolean))];

  const filteredContacts = contacts.filter(c => {
    const date = new Date(c.day);
    const afterStart = startDate ? date >= startDate : true;
    const beforeEnd = endDate ? date <= endDate : true;
    const matchesStatus = selectedStatus ? c.initcap === selectedStatus : true;
    return afterStart && beforeEnd && matchesStatus;
  });

  const chartData = filteredContacts.reduce((acc, item) => {
    const status = item.initcap || 'Unknown';
    const existing = acc.find(d => d.status === status);
    if (existing) {
      existing.total += item.total_contacts;
    } else {
      acc.push({ status, total: item.total_contacts });
    }
    return acc;
  }, []);

  return (
    <div className="dashboard-content">
      <h2>Lead Dashboard</h2>

      <table>
        <thead>
          <tr>
            <th>
              <div>Date</div>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                placeholderText="Start Date"
                dateFormat="MM/dd/yyyy"
                isClearable
              />
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                placeholderText="End Date"
                dateFormat="MM/dd/yyyy"
                isClearable
              />
            </th>
            <th>
              <div>Status</div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All</option>
                {statuses.map((status, idx) => (
                  <option key={idx} value={status}>{status}</option>
                ))}
              </select>
            </th>
            <th><div>Total Contacts</div></th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((c, idx) => (
            <tr key={idx}>
              <td>{new Date(c.day).toLocaleDateString()}</td>
              <td>{c.initcap}</td>
              <td>{c.total_contacts}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Contacts by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LeadDashboard;






