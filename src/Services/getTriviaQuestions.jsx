export async function getTriviaQuestions(
  token,
  difficulty = 'medium',
  category = 0
) {
  try {
    const URL = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&token=${token}`;
    const result = await fetch(URL);
    const data = await result.json();
    return data;
  } catch (error) {
    return error;
  }
}
