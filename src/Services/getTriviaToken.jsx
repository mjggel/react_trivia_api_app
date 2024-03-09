export async function getTriviaToken() {
  try {
    const URL = 'https://opentdb.com/api_token.php?command=request';
    const result = await fetch(URL);
    const { token } = await result.json();
    return token;
  } catch (error) {
    return error;
  }
}
