"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  try {
    // 1. Fetch CSV from Google Sheets
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1YX1nCxzZSVl-znDcfVPoWu8c8r74eXtbKwRoT7LU-eg/export?format=csv';
    const response = await fetch(sheetUrl, { cache: 'no-store' });
    
    if (!response.ok) throw new Error('Sheet fetch failed');
    
    const csvData = await response.text();
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    const users = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(val => val.trim().replace(/^"|"$/g, ''));
      const user = {};
      headers.forEach((header, index) => {
        user[header] = row[index];
      });
      users.push(user);
    }

    // 2. Validate user
    const matchedUser = users.find(u => 
      u.username === username && 
      u.password === password && 
      u.status?.toLowerCase() === 'active'
    );

    if (matchedUser) {
      // In a real app, you'd set a secure cookie here.
      // Since the app currently relies on localStorage for the frontend state, 
      // we'll pass the success back so the frontend can still mount.
      // But for JS-free login, we redirect immediately.
      return { 
        success: true, 
        user: {
          username: matchedUser.username,
          company_name: matchedUser.company_name,
          email: matchedUser.email
        } 
      };
    } else {
      return { error: 'Invalid username or password' };
    }
  } catch (error) {
    console.error('Server Action Login Error:', error);
    return { error: 'Internal server error during login' };
  }
}
