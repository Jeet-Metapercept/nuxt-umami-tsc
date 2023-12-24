import type { QuizRow } from '~/utils/types/quiz.types'
import { useFaker } from '~/composables/useFaker'

const faker = useFaker()

// Sample Quiz Object
export const sampleQuiz: QuizRow = {
  name: 'Quiz 044',
  description: 'A quiz about classical music',
  image_url: 'http://example.com/quiz_image3.jpg',
  category: 'Random',
  size: 10,
  max_time: 30,
  randomize: true,
  difficulty: 5,
  views: 0,
  author: 'author37@example.com',
  published: true,
  direct_link: 'https://example.com/quiz5',
  show_results: false,
  questions: [],
}

// Generating a sample Quiz object using Faker
export const randomQuiz: QuizRow = () => {
  return faker.generateRandomQuiz()
}
