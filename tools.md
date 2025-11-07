---
layout: page
title: Tools
permalink: /tools/
---

<div class="tools-page">
  <div class="tools-header">
    <h1 class="tools-title">Tools & Utilities</h1>
    <p class="tools-subtitle">Useful tools and calculators to help you make better decisions</p>
  </div>

  <!-- Tools Grid -->
  <div class="tools-grid">
    <a href="/tools/life-time-calculator/" class="tool-card">
      <div class="tool-icon">⏳</div>
      <h3 class="tool-name">Life Time Calculator</h3>
      <p class="tool-description">Calculate how much meaningful time you really have left in your life</p>
      <div class="tool-badge">New</div>
    </a>
  </div>
</div>

<style>
.tools-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.tools-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tools-title {
  font-size: 2.8rem;
  color: #2c3e50;
  margin: 0 0 0.8rem 0;
  font-weight: 800;
  background: linear-gradient(135deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tools-subtitle {
  font-size: 1.2rem;
  color: #5a6c7d;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.tool-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.tool-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 48px rgba(52, 152, 219, 0.2);
  border-color: #3498db;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  border-radius: 16px 16px 0 0;
}

.tool-card:hover::before {
  transform: scaleX(1);
}

.tool-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.tool-name {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.tool-description {
  color: #5a6c7d;
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

.tool-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .tools-page {
    padding: 1rem 0.5rem;
  }
  
  .tools-header {
    padding: 1.5rem 1rem;
    margin-bottom: 2rem;
  }
  
  .tools-title {
    font-size: 2.2rem;
  }
  
  .tools-subtitle {
    font-size: 1.1rem;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .tool-card {
    padding: 1.5rem;
  }
}
</style>

