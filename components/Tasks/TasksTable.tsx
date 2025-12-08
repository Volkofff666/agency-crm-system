import Link from 'next/link'
import { updateTask } from '@/lib/api'
import type { Task } from '@/types/tasks'
import styles from './TasksTable.module.scss'

interface TasksTableProps {
  tasks: Task[]
  onUpdate: () => void
}

const statusLabels: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена',
}

const priorityLabels: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
}

export default function TasksTable({ tasks, onUpdate }: TasksTableProps) {
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const isOverdue = (dueDate: string | undefined, status: string) => {
    if (!dueDate || status === 'completed') return false
    return new Date(dueDate) < new Date()
  }

  const handleStatusChange = async (taskId: string | number, newStatus: string) => {
    try {
      await updateTask(String(taskId), { status: newStatus })
      onUpdate()
    } catch (error) {
      console.error('Ошибка изменения статуса:', error)
    }
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Задача</th>
            <th>Проект</th>
            <th>Клиент</th>
            <th>Приоритет</th>
            <th>Статус</th>
            <th>Ответственный</th>
            <th>Дедлайн</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.empty}>
                Задач нет
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id} className={isOverdue(task.due_date, task.status) ? styles.overdue : ''}>
                <td>
                  <div className={styles.taskTitle}>{task.title}</div>
                  {task.description && (
                    <div className={styles.taskDescription}>{task.description}</div>
                  )}
                </td>
                <td>
                  {task.project_name ? (
                    <Link href={`/projects/${task.project_id}`} className={styles.link}>
                      {task.project_name}
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  {task.client_name ? (
                    <Link href={`/clients/${task.client_id}`} className={styles.link}>
                      {task.client_name}
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <span className={`${styles.priority} ${styles[task.priority]}`}>
                    {priorityLabels[task.priority]}
                  </span>
                </td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={`${styles.statusSelect} ${styles[task.status]}`}
                  >
                    <option value="new">Новая</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершена</option>
                    <option value="cancelled">Отменена</option>
                  </select>
                </td>
                <td>{task.assignee || '—'}</td>
                <td className={isOverdue(task.due_date, task.status) ? styles.overdueDate : ''}>
                  {formatDate(task.due_date)}
                  {isOverdue(task.due_date, task.status) && (
                    <span className={styles.overdueLabel}>Просрочено!</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
