export async function registerUser(data) {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    console.log(result.message);
  }
  
  // Example usage
  registerUser({ username: 'testuser', email: 'test@example.com', password: 'password123' });