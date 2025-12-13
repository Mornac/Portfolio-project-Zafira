// app/api/beneficiaires/route.ts
import { NextResponse } from 'next/server';

// ✅ Simule un utilisateur connecté (à remplacer par un vrai système JWT plus tard)
let fakeUser = {
  id: 1,
  email: 'beneficiaire@zafira.fr',
  name: 'Jean Dupont'
};

// 🟢 GET /api/beneficiaires
export async function GET() {
  return NextResponse.json({ success: true, data: fakeUser });
}

// 🟡 PUT /api/beneficiaires
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json({ success: false, message: 'Email manquant' }, { status: 400 });
    }

    // Simule la modification
    fakeUser.email = body.email;

    return NextResponse.json({
      success: true,
      message: 'Email mis à jour avec succès',
      data: fakeUser,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du bénéficiaire', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

// 🔴 DELETE /api/beneficiaires
export async function DELETE() {
  fakeUser = { id: 0, email: '', name: '' };

  return NextResponse.json({
    success: true,
    message: 'Compte supprimé avec succès',
  });
}
