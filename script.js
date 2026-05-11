(() => {
  'use strict';

  // ── Constants ───────────────────────────────────────────────────────────────

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  const GBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

  let barChart = null;

  // ── Build the Data tab rows ─────────────────────────────────────────────────

  function buildDataTable() {
    const tbody = document.getElementById('data-tbody');
    const rows = MONTHS.map((month, i) => {
      const key = MONTH_KEYS[i];
      return `
        <tr>
          <td class="fw-semibold">${month}</td>
          <td>
            <div class="input-group input-group-sm">
              <span class="input-group-text">£</span>
              <input
                type="number"
                id="income-${key}"
                class="form-control income-input"
                min="0"
                step="0.01"
                placeholder="0.00"
                aria-label="${month} income"
              />
            </div>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <span class="input-group-text">£</span>
              <input
                type="number"
                id="expense-${key}"
                class="form-control expense-input"
                min="0"
                step="0.01"
                placeholder="0.00"
                aria-label="${month} expenses"
              />
            </div>
          </td>
        </tr>`;
    });
    tbody.innerHTML = rows.join('');
  }

  // ── Read all inputs ─────────────────────────────────────────────────────────

  function getData() {
    const income   = MONTH_KEYS.map(k => parseFloat(document.getElementById(`income-${k}`).value)  || 0);
    const expenses = MONTH_KEYS.map(k => parseFloat(document.getElementById(`expense-${k}`).value) || 0);
    return { income, expenses };
  }

  // ── Totals (footer + stat cards) ────────────────────────────────────────────

  function updateTotals() {
    const { income, expenses } = getData();
    const totalIncome   = income.reduce((a, b) => a + b, 0);
    const totalExpenses = expenses.reduce((a, b) => a + b, 0);
    const net           = totalIncome - totalExpenses;

    // Data tab footer
    document.getElementById('total-income').textContent   = GBP.format(totalIncome);
    document.getElementById('total-expenses').textContent = GBP.format(totalExpenses);

    // Chart tab stat cards
    document.getElementById('stat-income').textContent   = GBP.format(totalIncome);
    document.getElementById('stat-expenses').textContent = GBP.format(totalExpenses);

    const netEl = document.getElementById('stat-net');
    netEl.textContent = GBP.format(net);
    netEl.style.color = net < 0 ? '#dc3545' : '#145f44';
  }

  // ── Chart ───────────────────────────────────────────────────────────────────

  function buildChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    const { income, expenses } = getData();

    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MONTHS,
        datasets: [
          {
            label: 'Income',
            data: income,
            backgroundColor: 'rgba(25, 135, 84, 0.75)',
            borderColor:     'rgba(25, 135, 84, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Expenses',
            data: expenses,
            backgroundColor: 'rgba(220, 53, 69, 0.75)',
            borderColor:     'rgba(220, 53, 69, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: ctx => ` ${GBP.format(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => GBP.format(value),
            },
          },
        },
      },
    });
  }

  function updateChart() {
    const { income, expenses } = getData();

    if (!barChart) {
      buildChart();
      return;
    }

    barChart.data.datasets[0].data = income;
    barChart.data.datasets[1].data = expenses;
    barChart.update();
  }

  // ── Event wiring ────────────────────────────────────────────────────────────

  function init() {
    buildDataTable();
    updateTotals();

    // Delegated input listener on the whole table body
    document.getElementById('data-tbody').addEventListener('input', () => {
      updateTotals();
      // If the chart has already been built, keep it in sync
      if (barChart) updateChart();
    });

    // Build / refresh chart when the Chart tab is shown
    document.getElementById('chart-tab').addEventListener('shown.bs.tab', () => {
      updateChart();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
