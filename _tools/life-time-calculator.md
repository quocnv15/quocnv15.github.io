---
layout: page
title: Life Time Calculator
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
              value="30"
              class="range-input"
            />
            <span class="input-value" id="currentAgeValue">30 tuổi</span>
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
              value="75"
              class="range-input"
            />
            <span class="input-value" id="lifeExpectancyValue">75 tuổi</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div id="results">
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
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.calculator-container {
  max-width: 1200px;
  margin: 0 auto;
}

.calculator-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.calculator-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 0.8rem 0;
  background: linear-gradient(135deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.calculator-subtitle {
  font-size: 1.2rem;
  color: #5a6c7d;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

.input-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e8e8e8;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
  color: #2c3e50;
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
  background: #e8e8e8;
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
  background: #3498db;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
}

.range-input::-webkit-slider-thumb:hover {
  background: #2980b9;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
}

.range-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #3498db;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
}

.range-input::-moz-range-thumb:hover {
  background: #2980b9;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
}

.input-value {
  font-size: 1.875rem;
  font-weight: bold;
  min-width: fit-content;
  color: #3498db;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid #e8e8e8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.metric-blue {
  border-left-color: #3498db;
}

.metric-blue .metric-value {
  color: #3498db;
}

.metric-purple {
  border-left-color: #9b59b6;
}

.metric-purple .metric-value {
  color: #9b59b6;
}

.metric-pink {
  border-left-color: #e91e63;
}

.metric-pink .metric-value {
  color: #e91e63;
}

.metric-orange {
  border-left-color: #f39c12;
}

.metric-orange .metric-value {
  color: #f39c12;
}

.metric-label {
  color: #5a6c7d;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 500;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.metric-unit {
  color: #7f8c8d;
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
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e8e8e8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.chart-title {
  color: #2c3e50;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.table-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.activities-table {
  width: 100%;
  border-collapse: collapse;
}

.activities-table thead {
  background: #f8f9fa;
}

.activities-table th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

.activities-table th.text-right {
  text-align: right;
}

.activities-table tbody tr {
  border-top: 1px solid #e8e8e8;
  transition: background 0.2s;
}

.activities-table tbody tr:hover {
  background: #f8f9fa;
}

.activities-table td {
  padding: 0.75rem 1.5rem;
  color: #2c3e50;
}

.activities-table td.text-right {
  text-align: right;
}

.activities-table td:last-child {
  font-weight: 600;
  color: #3498db;
}

.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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
  opacity: 0.95;
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
  .lifetime-calculator-page {
    padding: 1rem 0.5rem;
  }
  
  .calculator-header {
    padding: 1.5rem 1rem;
    margin-bottom: 2rem;
  }
  
  .calculator-title {
    font-size: 2.2rem;
  }
  
  .calculator-subtitle {
    font-size: 1.1rem;
  }
  
  .input-section {
    padding: 1.5rem;
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
  
  .cta-section {
    padding: 1.5rem;
  }
  
  .cta-title {
    font-size: 1.5rem;
  }
  
  .cta-list {
    grid-template-columns: 1fr;
  }
}
</style>

<script>
(function() {
  let currentAge = 30;
  let lifeExpectancy = 75;
  let barChart = null;
  let pieChart = null;

  const COLORS = ['#3498db', '#9b59b6', '#e91e63', '#f39c12', '#27ae60', '#e74c3c', '#1abc9c'];

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
          backgroundColor: '#3498db',
          borderColor: '#2980b9',
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
            backgroundColor: '#2c3e50',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#3498db',
            borderWidth: 1,
            padding: 12,
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
              color: '#5a6c7d',
              font: {
                size: 10
              },
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              color: '#e8e8e8'
            }
          },
          y: {
            ticks: {
              color: '#5a6c7d'
            },
            grid: {
              color: '#e8e8e8'
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
          borderColor: '#ffffff',
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
              color: '#2c3e50',
              padding: 15,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            backgroundColor: '#2c3e50',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#3498db',
            borderWidth: 1,
            padding: 12,
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

