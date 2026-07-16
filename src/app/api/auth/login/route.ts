import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json()
    
    if (!login || !password) {
      return NextResponse.json({ error: 'Login e senha obrigatórios' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { login } })
    
    if (!user || user.status !== 'active') {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = await createToken({
      userId: user.id,
      login: user.login,
      role: user.role,
      name: user.name,
    })

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, role: user.role, avatar: user.avatar },
    })
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (err: any) {
    console.error('LOGIN_ERROR', err?.message || err)
    return NextResponse.json({ error: 'Erro interno: ' + (err?.message || 'desconhecido') }, { status: 500 })
  }
}
