// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  
  const { email, password, name } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Missing' }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) return NextResponse.json({success:false, error: 'Email exists' }, { status: 409 });

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed, name },
    select: { id: true, email: true, name: true },
  });

  
  // const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' });

  // const cookie = serialize('token', token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'lax',
  //   path: '/',
  //   maxAge: 60 * 60, // 1 hour
  // });

  return NextResponse.json({ 
    success:true,
    message:"User Created Successfully!"
   });
}
