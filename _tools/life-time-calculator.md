---
layout: page
title: Life Time Calculator
---

<div class="lifetime-calculator-page">
  <div class="calculator-container">
    <!-- Header -->
    <div class="calculator-header">
      <h1 class="calculator-title">Life Time Calculator</h1>
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
        <h2 class="cta-title">Never Go To Zero</h2>
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

<script>
(function() {
  let currentAge = 30;
  let lifeExpectancy = 75;
  let barChart = null;
  let pieChart = null;

  const COLORS = ['#2563eb', '#334155', '#dc2626', '#d97706', '#16a34a', '#0f172a', '#64748b'];

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
          backgroundColor: '#2563eb',
          borderColor: '#1d4ed8',
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
            backgroundColor: '#0f172a',
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
            backgroundColor: '#0f172a',
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

