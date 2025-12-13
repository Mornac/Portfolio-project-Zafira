// app/api/temoignages/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Message vide' }, { status: 400 });
    }

    // Simule un enregistrement "en attente"
    const temoignage = {
      id: Date.now(),
      userId: 1,
      message,
      status: 'pending', // ✅ pas encore validé par l’admin
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Témoignage soumis et en attente de validation.',
      data: temoignage,
    });
  } catch (error) {
    console.error('Erreur lors de la création du témoignage', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
