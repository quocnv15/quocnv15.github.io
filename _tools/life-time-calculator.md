---
layout: page
title: Life Time Calculator
permalink: /tools/life-time-calculator/
---

<div class="lifetime-calculator-page">
  <div class="calculator-container">
    <!-- Header -->
    <div class="calculator-header">
      <h1 class="calculator-title">⏳ Life Time Calculator</h1>
      <p class="calculator-subtitle">Bạn thực sự có bao nhiêu thời gian?</p>
    </div>

    <!-- Input Section -->
    <div class="input-section">
      <div class="input-grid">
        <div class="input-group">
          <label class="input-label">Tuổi hiện tại</label>
          <div class="input-wrapper">
            <input
              type="range"
              id="currentAge"
              min="1"
              max="100"
              value="25"
              class="range-input"
            />
            <span class="input-value" id="currentAgeValue">25 tuổi</span>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">Tuổi thọ dự kiến</label>
          <div class="input-wrapper">
            <input
              type="range"
              id="lifeExpectancy"
              min="50"
              max="110"
              value="85"
              class="range-input"
            />
            <span class="input-value" id="lifeExpectancyValue">85 tuổi</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div id="results" style="display: none;">
      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div class="metric-card metric-blue">
          <p class="metric-label">Thời gian còn lại</p>
          <p class="metric-value" id="timeRemaining">0</p>
          <p class="metric-unit">năm</p>
        </div>

        <div class="metric-card metric-purple">
          <p class="metric-label">Thời gian ý nghĩa</p>
          <p class="metric-value" id="realMeaningfulYears">0</p>
          <p class="metric-unit">năm</p>
        </div>

        <div class="metric-card metric-pink">
          <p class="metric-label">Ngày thực sự</p>
          <p class="metric-value" id="meaningfulDays">0</p>
          <p class="metric-unit">ngày</p>
        </div>

        <div class="metric-card metric-orange">
          <p class="metric-label">Giờ thực sự</p>
          <p class="metric-value" id="meaningfulHours">0</p>
          <p class="metric-unit">giờ</p>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <!-- Bar Chart -->
        <div class="chart-card">
          <h3 class="chart-title">Phân bổ Thời gian</h3>
          <canvas id="barChart"></canvas>
        </div>

        <!-- Pie Chart -->
        <div class="chart-card">
          <h3 class="chart-title">% Cuộc đời</h3>
          <canvas id="pieChart"></canvas>
        </div>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table class="activities-table">
          <thead>
            <tr>
              <th>Hoạt động</th>
              <th class="text-right">Năm</th>
              <th class="text-right">% Cuộc đời</th>
            </tr>
          </thead>
          <tbody id="activitiesTableBody">
          </tbody>
        </table>
      </div>

      <!-- CTA -->
      <div class="cta-section">
        <h2 class="cta-title">🔥 Never Go To Zero</h2>
        <p class="cta-text">
          Bạn chỉ còn <span class="cta-highlight" id="ctaDays">0</span> ngày để làm những điều ý nghĩa. 
          Hôm nay, hãy bắt đầu với ít nhất 1 việc!
        </p>
        <div class="cta-list">
          <div>✓ Nói KHÔNG với vô nghĩa</div>
          <div>✓ Loại bỏ độc hại</div>
          <div>✓ Ngừng trì hoãn</div>
          <div>✓ Đầu tư thời gian</div>
          <div>✓ Sống có chủ đích</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Chart.js Library -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<style>
.lifetime-calculator-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%);
  padding: 2rem 1rem;
}

.calculator-container {
  max-width: 1200px;
  margin: 0 auto;
}

.calculator-header {
  text-align: center;
  margin-bottom: 3rem;
}

.calculator-title {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin: 0 0 0.5rem 0;
}

.calculator-subtitle {
  font-size: 1.25rem;
  color: #cbd5e1;
  margin: 0;
}

.input-section {
  background: #1e293b;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #334155;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  display: block;
  color: #cbd5e1;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-input {
  flex: 1;
  height: 8px;
  background: #334155;
  border-radius: 8px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.range-input::-webkit-slider-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.range-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.range-input::-moz-range-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.input-value {
  font-size: 1.875rem;
  font-weight: bold;
  min-width: fit-content;
  color: #60a5fa;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid #334155;
}

.metric-blue {
  border-color: #1e40af;
  background: #1e3a8a;
}

.metric-purple {
  border-color: #7c3aed;
  background: #6b21a8;
}

.metric-pink {
  border-color: #be185d;
  background: #9f1239;
}

.metric-orange {
  border-color: #c2410c;
  background: #9a3412;
}

.metric-label {
  color: #cbd5e1;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.metric-blue .metric-value {
  color: #93c5fd;
}

.metric-purple .metric-value {
  color: #c4b5fd;
}

.metric-pink .metric-value {
  color: #f9a8d4;
}

.metric-orange .metric-value {
  color: #fdba74;
}

.metric-unit {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #334155;
}

.chart-title {
  color: white;
  font-size: 1.125rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.table-card {
  background: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #334155;
  margin-bottom: 2rem;
}

.activities-table {
  width: 100%;
  border-collapse: collapse;
}

.activities-table thead {
  background: #334155;
}

.activities-table th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  color: #cbd5e1;
  font-weight: 600;
}

.activities-table th.text-right {
  text-align: right;
}

.activities-table tbody tr {
  border-top: 1px solid #334155;
  transition: background 0.2s;
}

.activities-table tbody tr:hover {
  background: #334155;
}

.activities-table td {
  padding: 0.75rem 1.5rem;
  color: #cbd5e1;
}

.activities-table td.text-right {
  text-align: right;
}

.activities-table td:last-child {
  font-weight: 600;
  color: #60a5fa;
}

.cta-section {
  background: linear-gradient(135deg, #dc2626 0%, #ec4899 100%);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  border: 1px solid #ef4444;
}

.cta-title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin: 0 0 1rem 0;
}

.cta-text {
  font-size: 1.125rem;
  color: white;
  margin: 0 0 1.5rem 0;
}

.cta-highlight {
  font-weight: bold;
  font-size: 1.25rem;
}

.cta-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  font-size: 0.875rem;
  color: white;
}

@media (max-width: 768px) {
  .calculator-title {
    font-size: 2rem;
  }
  
  .calculator-subtitle {
    font-size: 1rem;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cta-list {
    grid-template-columns: 1fr;
  }
}
</style>

<script>
(function() {
  let currentAge = 25;
  let lifeExpectancy = 85;
  let barChart = null;
  let pieChart = null;

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#FF6B9D'];

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    const currentAgeInput = document.getElementById('currentAge');
    const lifeExpectancyInput = document.getElementById('lifeExpectancy');
    const currentAgeValue = document.getElementById('currentAgeValue');
    const lifeExpectancyValue = document.getElementById('lifeExpectancyValue');

    // Update values on input
    currentAgeInput.addEventListener('input', function() {
      currentAge = Number(this.value);
      currentAgeValue.textContent = currentAge + ' tuổi';
      calculateLifeTime();
    });

    lifeExpectancyInput.addEventListener('input', function() {
      lifeExpectancy = Number(this.value);
      lifeExpectancyValue.textContent = lifeExpectancy + ' tuổi';
      calculateLifeTime();
    });

    // Initial calculation
    calculateLifeTime();
  });

  function calculateLifeTime() {
    const timeRemaining = lifeExpectancy - currentAge;
    
    // Tính thời gian lãng phí mỗi ngày (giờ)
    const wastedHoursPerDay = 8 + 8 + 2.5 + 3.5 + 1.5; // ngủ + làm việc + ăn + giải trí + di chuyển
    const productiveHoursPerDay = 24 - wastedHoursPerDay;
    
    // Tính năm lãng phí (giả sử năm ốm đau = 8% thời gian)
    const sicknessYears = timeRemaining * 0.08;
    const wastedYears = (wastedHoursPerDay * timeRemaining * 365) / (24 * 365);
    
    // Thời gian thực sự có ý nghĩa
    const realMeaningfulYears = timeRemaining - wastedYears - sicknessYears;
    const meaningfulDays = Math.round(realMeaningfulYears * 365);
    const meaningfulHours = Math.round(realMeaningfulYears * 365 * productiveHoursPerDay);
    
    // Phân loại hoạt động
    const activities = [
      { name: '💤 Ngủ', years: timeRemaining * 0.33, percent: 33 },
      { name: '💼 Làm việc', years: timeRemaining * 0.17, percent: 17 },
      { name: '🍽️ Ăn & Sinh hoạt', years: timeRemaining * 0.08, percent: 8 },
      { name: '🏥 Ốm đau & Lão hóa', years: sicknessYears, percent: 8 },
      { name: '📱 Giải trí & Mạng xã hội', years: timeRemaining * 0.08, percent: 8 },
      { name: '🚗 Di chuyển & Việc vặt', years: timeRemaining * 0.05, percent: 5 },
      { name: '🎯 Thời gian ý nghĩa', years: realMeaningfulYears, percent: Math.round((realMeaningfulYears / timeRemaining) * 100) }
    ];

    const results = {
      timeRemaining: Math.round(timeRemaining),
      realMeaningfulYears: Math.round(realMeaningfulYears),
      meaningfulDays,
      meaningfulHours,
      activities,
      purposefulYears: Math.round(realMeaningfulYears * 0.4),
      wastedYears: Math.round(wastedYears)
    };

    displayResults(results);
  }

  function displayResults(results) {
    // Show results section
    document.getElementById('results').style.display = 'block';

    // Update metrics
    document.getElementById('timeRemaining').textContent = results.timeRemaining;
    document.getElementById('realMeaningfulYears').textContent = results.realMeaningfulYears;
    document.getElementById('meaningfulDays').textContent = results.meaningfulDays.toLocaleString();
    document.getElementById('meaningfulHours').textContent = results.meaningfulHours.toLocaleString();
    document.getElementById('ctaDays').textContent = results.meaningfulDays.toLocaleString();

    // Update table
    const tableBody = document.getElementById('activitiesTableBody');
    tableBody.innerHTML = '';
    results.activities.forEach(activity => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${activity.name}</td>
        <td class="text-right">${activity.years.toFixed(1)}</td>
        <td class="text-right">${activity.percent}%</td>
      `;
      tableBody.appendChild(row);
    });

    // Update charts
    updateBarChart(results.activities);
    updatePieChart(results.activities);
  }

  function updateBarChart(activities) {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;

    if (barChart) {
      barChart.destroy();
    }

    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: activities.map(a => a.name),
        datasets: [{
          label: 'Năm',
          data: activities.map(a => a.years),
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: '#475569',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return context.parsed.y.toFixed(1) + ' năm';
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#94a3b8',
              font: {
                size: 10
              },
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              color: '#475569'
            }
          },
          y: {
            ticks: {
              color: '#94a3b8'
            },
            grid: {
              color: '#475569'
            }
          }
        }
      }
    });
  }

  function updatePieChart(activities) {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    if (pieChart) {
      pieChart.destroy();
    }

    pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: activities.map(a => a.name),
        datasets: [{
          data: activities.map(a => a.percent),
          backgroundColor: COLORS.slice(0, activities.length),
          borderColor: '#1e293b',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#cbd5e1',
              padding: 15,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: '#475569',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return label + ': ' + value + '%';
              }
            }
          }
        }
      }
    });
  }
})();
</script>

