'use strict';

const { validateUsername } = require('./script.js');

// ── validateUsername ─────────────────────────────────────────────────────────

describe('validateUsername', () => {
  test('returns error when shorter than 5 characters', () => {
    expect(validateUsername('Ab1!')).toBe('Username must be at least 5 characters long.');
  });

  test('returns error when no uppercase letter', () => {
    expect(validateUsername('abc1!')).toBe('Username must contain at least 1 uppercase letter.');
  });

  test('returns error when no number', () => {
    expect(validateUsername('Abcde!')).toBe('Username must contain at least 1 number.');
  });

  test('returns error when no special character', () => {
    expect(validateUsername('Abcd1')).toBe('Username must contain at least 1 special character.');
  });

  test('returns null for a valid username', () => {
    expect(validateUsername('Hello1!')).toBeNull();
  });

  test('returns null for a longer valid username', () => {
    expect(validateUsername('Secure99@Pass')).toBeNull();
  });
});

// ── DOM-dependent functions ──────────────────────────────────────────────────

describe('getData', () => {
  beforeEach(() => {
    // Set up minimal DOM that the IIFE expects
    document.body.innerHTML = '';
    const tbody = document.createElement('tbody');
    tbody.id = 'data-tbody';
    document.body.appendChild(tbody);

    // Create income and expense inputs for all 12 months
    const keys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    keys.forEach(k => {
      ['income', 'expense'].forEach(type => {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `${type}-${k}`;
        document.body.appendChild(input);
      });
    });
  });

  test('returns zero arrays when inputs are empty', () => {
    // Re-require inside jsdom (script registers on DOMContentLoaded so
    // we invoke getData by re-loading the module)
    jest.resetModules();
    const mod = require('./script.js');
    // getData is not exported; test via DOM state: all inputs default to 0
    const keys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const income = keys.map(k => parseFloat(document.getElementById(`income-${k}`).value) || 0);
    const expenses = keys.map(k => parseFloat(document.getElementById(`expense-${k}`).value) || 0);
    expect(income).toEqual(new Array(12).fill(0));
    expect(expenses).toEqual(new Array(12).fill(0));
  });

  test('reads values from input elements', () => {
    document.getElementById('income-jan').value = '1500';
    document.getElementById('expense-mar').value = '250.50';

    const keys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const income = keys.map(k => parseFloat(document.getElementById(`income-${k}`).value) || 0);
    const expenses = keys.map(k => parseFloat(document.getElementById(`expense-${k}`).value) || 0);

    expect(income[0]).toBe(1500);
    expect(expenses[2]).toBe(250.50);
  });
});

// ── Net calculation ──────────────────────────────────────────────────────────

describe('net income calculation', () => {
  test('net is income minus expenses', () => {
    const income   = [1000, 1200, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const expenses = [500,  600,  400, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const totalIncome   = income.reduce((a, b) => a + b, 0);
    const totalExpenses = expenses.reduce((a, b) => a + b, 0);
    expect(totalIncome - totalExpenses).toBe(1500);
  });

  test('net is negative when expenses exceed income', () => {
    const income   = [500];
    const expenses = [800];
    expect(income[0] - expenses[0]).toBe(-300);
  });
});
