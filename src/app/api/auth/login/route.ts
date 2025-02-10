import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    console.log('Login attempt:', { username, password }); // Debug log

    if (
      username === process.env.DASHBOARD_USERNAME &&
      password === process.env.DASHBOARD_PASSWORD
    ) {
      const token = Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = NextResponse.json({ success: true });
      
      // Set cookie in the response
      response.cookies.set('auth_token', token, {
        httpOnly: false, // Allow JavaScript access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      console.log('Auth cookie set:', token); // Debug log
      return response;
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 