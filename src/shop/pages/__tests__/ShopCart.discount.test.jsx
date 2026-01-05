import { describe, it, expect } from 'vitest';
import { validateAndComputeDiscount } from '../ShopCart';

describe('validateAndComputeDiscount', () => {
  const now = new Date('2026-01-05T10:00:00Z');

  it('applies percentage discount when within min/max range', () => {
    const discount = {
      discount_type: 'percentage',
      discount_value: 10,
      min_price: 1000,
      max_price: 100000,
      start_date: '2025-12-01 00:00:00',
      end_date: '2026-12-31 23:59:59'
    };
    const res = validateAndComputeDiscount(discount, 50000, now);
    expect(res.valid).toBe(true);
    expect(res.amount).toBe(5000);
    expect(res.newTotal).toBe(45000);
  });

  it('applies fixed discount with no restrictions', () => {
    const discount = {
      discount_type: 'fixed',
      discount_value: 2000,
      min_price: null,
      max_price: null,
      start_date: null,
      end_date: null
    };
    const res = validateAndComputeDiscount(discount, 10000, now);
    expect(res.valid).toBe(true);
    expect(res.amount).toBe(2000);
    expect(res.newTotal).toBe(8000);
  });

  it('rejects when below minimum price', () => {
    const discount = {
      discount_type: 'percentage',
      discount_value: 10,
      min_price: 20000,
      max_price: null,
      start_date: null,
      end_date: null
    };
    const res = validateAndComputeDiscount(discount, 15000, now);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('below minimum');
  });

  it('rejects when above maximum price', () => {
    const discount = {
      discount_type: 'percentage',
      discount_value: 10,
      min_price: null,
      max_price: 10000,
      start_date: null,
      end_date: null
    };
    const res = validateAndComputeDiscount(discount, 15000, now);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('above maximum');
  });

  it('rejects before start date', () => {
    const discount = {
      discount_type: 'fixed',
      discount_value: 1000,
      start_date: '2026-02-01 00:00:00',
      end_date: '2026-12-31 23:59:59'
    };
    const res = validateAndComputeDiscount(discount, 5000, now);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('not started');
  });

  it('rejects after end date', () => {
    const discount = {
      discount_type: 'fixed',
      discount_value: 1000,
      start_date: '2025-01-01 00:00:00',
      end_date: '2026-01-01 00:00:00'
    };
    const res = validateAndComputeDiscount(discount, 5000, now);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('expired');
  });

  it('clamps discount amount to cart total', () => {
    const discount = {
      discount_type: 'fixed',
      discount_value: 10000
    };
    const res = validateAndComputeDiscount(discount, 8000, now);
    expect(res.valid).toBe(true);
    expect(res.amount).toBe(8000);
    expect(res.newTotal).toBe(0);
  });

  it('rejects unsupported discount type', () => {
    const discount = {
      discount_type: 'bonus',
      discount_value: 10
    };
    const res = validateAndComputeDiscount(discount, 10000, now);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Unsupported');
  });
}
) 
