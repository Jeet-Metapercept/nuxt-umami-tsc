import { h } from 'vue'
import { Icon } from '#components'

const ArrowDownIcon = h(Icon, { name: 'radix-icons:arrow-down' })
const ArrowRightIcon = h(Icon, { name: 'radix-icons:arrow-right' })
const ArrowUpIcon = h(Icon, { name: 'radix-icons:arrow-up' })
const CheckCircledIcon = h(Icon, { name: 'radix-icons:check-circled' })
const CircleIcon = h(Icon, { name: 'radix-icons:circle' })
const CrossCircledIcon = h(Icon, { name: 'radix-icons:cross-circled' })
const QuestionMarkCircledIcon = h(Icon, { name: 'radix-icons:question-mark-circled' })
const StopwatchIcon = h(Icon, { name: 'radix-icons:stopwatch' })
const CategoryIcon = h(Icon, { name: 'radix-icons:shadow' })

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: h(QuestionMarkCircledIcon),
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: h(CircleIcon),
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: h(StopwatchIcon),
  },
  {
    value: 'done',
    label: 'Done',
    icon: h(CheckCircledIcon),
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: h(CrossCircledIcon),
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: h(ArrowDownIcon),
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: h(ArrowRightIcon),
  },
  {
    label: 'High',
    value: 'high',
    icon: h(ArrowUpIcon),
  },
]

export const categories = [
  {
    label: 'Low',
    value: 'low',
    icon: h(CategoryIcon),
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: h(CategoryIcon),
  },
  {
    label: 'High',
    value: 'high',
    icon: h(CategoryIcon),
  },
]
// const originalCategories = [
//   'Community Medicine',
//   'ENT',
//   'Ophthalmology',
//   'Medicine',
//   'Surgery',
//   'Pathology',
//   'Microbiology',
//   'Dermatology',
//   'Pediatrics',
//   'Orthopaedics',
//   'Anaesthesia',
//   'Forensic Medicine',
//   'Gynaecology',
//   'Anatomy',
//   'Physiology',
//   'Biochemistry',
// ]

// function convertCategories(categories: string[]) {
//   return categories.map((category) => {
//     return {
//       label: category,
//       value: category.toLowerCase(),
//       icon: h(CategoryIcon),
//     }
//   })
// }
// export const categories = convertCategories(originalCategories)
