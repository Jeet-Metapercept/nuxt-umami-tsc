export default defineEventHandler(() => ({
  message: 'Greetings from Server',
  timestamp: new Date().getTime(),
}))
