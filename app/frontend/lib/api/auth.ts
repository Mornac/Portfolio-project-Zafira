export async function login(credentials: {email: string; password: string}) {
  const res = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function register(payload: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) {
  const res = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      firstName: payload.firstname,
      lastName: payload.lastname,
    }),
  });
  if (!res.ok) throw new Error('Erreur register');
  return res.json();
}

export async function loginWithGoogle() {
   window.location.href = 'http://localhost:3001/api/auth/google';
}

export async function fetchUser() {
  const res = await fetch('http://localhost:3001/api/auth/me', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    return
  }

  const data = await res.json();
  console.log('✅ fetchUser success:', data);
  return data;
}


export async function logout() {
  const res = await fetch('http://localhost:3001/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Logout failed');

  return res.json();
}

