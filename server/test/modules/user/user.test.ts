import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '~/app';

describe('GET /api/users', () => {
  it('should return a list of users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should filter users by name', async () => {
    const res = await request(app)
      .get('/api/users')
      .query({ filter: 'name=John' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((user: any) => {
      expect(user.name).toBe('John');
    });
  });
});
