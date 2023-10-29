export default function multiplyDifficultyPoints(score, { difficulty }) {
  switch (difficulty) {
    case 'easy':
      return 1 * score;
    case 'medium':
      return 2 * score;
    case 'hard':
      return 3 * score;
    default:
      return 0;
  }
}
