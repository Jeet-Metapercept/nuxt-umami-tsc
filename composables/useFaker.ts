import { faker } from '@faker-js/faker'
import type { QuizRow } from '~/utils/types/quiz.types'

export function useFaker() {
  function getUsers(take: number = 1) {
    const users = []
    const qty = take > 10 ? 10 : take

    for (let index = 0; index < qty; index++) {
      const user = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
      }

      users.push(user)
    }

    return users
  }

  function generateQuizName() {
    const adjectives = ['Challenging', 'Exciting', 'Brainy', 'Innovative', 'Creative', 'Intriguing', 'Dynamic', 'Interactive', 'Thought-Provoking', 'Captivating']
    const quizTypes = ['Quiz', 'Test', 'Exam', 'Challenge', 'Brain-Teaser', 'Trivia', 'Puzzle', 'Assessment', 'Expedition', 'Adventure']

    const adjective = Math.random() < 0.5
      ? useSample(adjectives)
      : useCapitalize(faker.commerce.productAdjective())

    const quizType = useSample(quizTypes)
    const randomNumber = faker.number.int({ min: 1000, max: 9999 })

    return `${adjective} ${quizType} ${randomNumber}`
  }

  function generateRandomQuiz() {
    const randomQuiz: QuizRow = {
      name: generateQuizName(),
      description: faker.lorem.sentence(),
      image_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${faker.lorem.words(3)}`,
      category: 'Random',
      size: faker.helpers.arrayElement([5, 10, 20, 30, 40, 50]),
      max_time: faker.helpers.arrayElement([10, 30, 45, 60, 90, 0]),
      difficulty: faker.helpers.arrayElement(Array.from({ length: 10 }, (_, index) => index + 1)),
      randomize: faker.datatype.boolean(),
      views: faker.number.int(1),
      author: faker.internet.email(),
      published: faker.datatype.boolean(),
      direct_link: faker.internet.url(),
      show_results: faker.datatype.boolean(),
      questions: [],
    }
    return randomQuiz
  }

  return {
    getUsers,
    generateQuizName,
    generateRandomQuiz,
  }
}
