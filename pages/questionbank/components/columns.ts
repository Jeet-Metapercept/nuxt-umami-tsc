import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

import { priorities, statuses } from '../data/data'
import type { Question } from '../data/schema'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<Question>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox,
      { 'checked': table.getIsAllPageRowsSelected(), 'onUpdate:checked': (value: any) => table.toggleAllPageRowsSelected(!!value), 'ariaLabel': 'Select all', 'class': 'translate-y-[2px]' }),
    cell: ({ row }) => h(Checkbox,
      { 'checked': row.getIsSelected(), 'onUpdate:checked': (value: any) => row.toggleSelected(!!value), 'ariaLabel': 'Select row', 'class': 'translate-y-[2px]' }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'views',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'View' }),
    cell: ({ row }) => h('div', { class: 'w-[80px]' }, row.getValue('views')),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Category' }),
    cell: ({ row }) => {
      // const categories_find = categories.find(
      //   c => c === row.getValue('category'),
      // )

      // if (!categories_find)
      //   return null

      return h(Badge, { variant: 'secondary' }, () => row.getValue('category'))
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'question',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Question' }),
    cell: ({ row }) => {
      // const label = labels.find(label => label.value === row.original.category)

      // return h('div', { class: 'flex space-x-2' }, [
      //   label ? h(Badge, { variant: 'outline' }, () => label.label) : null,
      //   h('span', { class: 'max-w-[500px] truncate font-medium' }, row.original.question.text),
      // ])

      return h('div', { class: 'flex space-x-2' },
        h('span', { class: 'max-w-[500px] truncate font-medium' }, row.original.question.text),
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'difficulty',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Difficulty' }),
    cell: ({ row }) => h(Badge, { variant: 'outline' }, () => row.getValue('difficulty')),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),

    cell: ({ row }) => {
      const status = statuses.find(
        status => status.value === row.getValue('status'),
      )

      if (!status)
        return null

      return h('div', { class: 'flex w-[100px] items-center' }, [
        status.icon && h(status.icon, { class: 'mr-2 h-4 w-4 text-muted-foreground' }),
        h('span', status.label),
      ])
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Priority' }),
    cell: ({ row }) => {
      const priority = priorities.find(
        priority => priority.value === row.getValue('priority'),
      )

      if (!priority)
        return null

      return h('div', { class: 'flex items-center' }, [
        priority.icon && h(priority.icon, { class: 'mr-2 h-4 w-4' }),
        h('span', priority.label),
      ])
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
