import type { User } from '@supabase/supabase-js'

export function returnUnauthorized() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: getRandomReturnMessage(),
      })
    }, 1000) // Delay for authenticity and to prevent spam
  })
}

export function getRandomReturnMessage() {
  const messages = [
    'Hey, looks like you\'ve stumbled upon a premium feature! Upgrade now to unlock it and get the most out of our platform.',
    'This feature is exclusive to our premium members. Upgrade your account now to get access and enjoy all the benefits of our premium membership.',
    'Sorry, this feature is only available to our premium members. Upgrade now to enjoy exclusive perks and access to our best features.',
    'Hey there! This feature is one of the many benefits of our premium membership. Upgrade now to unlock it and start enjoying our premium features.',
    'This feature is part of our premium membership package. Upgrade now to unlock it and get access to our premium features.',
    'Sorry, you need to be a premium member to access this feature. Upgrade now to enjoy all the perks of our premium membership.',
    'Hey, it looks like you\'re missing out on a premium feature! Upgrade now to get access and start enjoying all our premium features.',
    'This feature is reserved for our premium members. Upgrade now to unlock it and get access to all our premium features and perks.',
    'Sorry, this feature is only available to our premium members. Upgrade now to get access and start enjoying all the benefits of our premium membership.',
    'Hey there! This feature is one of the many benefits of our premium membership. Upgrade now to unlock it and start enjoying our premium features.',
    'This feature is part of our premium membership package. Upgrade now to unlock it and get access to our premium features.',
    'Sorry, you need to be a premium member to access this feature. Upgrade now to enjoy all the perks of our premium membership.',
    'Hey, it looks like you\'re missing out on a premium feature! Upgrade now to get access and start enjoying all our premium features.',
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

export function checkPerms(user: User | null) {
  if (!user)
    return false
    // Do some other check here, checking a custom user field, etc.
  return true
}
