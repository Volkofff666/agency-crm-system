'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import TasksTable from '@/components/Tasks/TasksTable'
import TaskModal from '@/components/Tasks/TaskModal'
import { getTasks } from '@/lib/api'
import type { Task } from '@/types/tasks'
import styles from './page.module.scss'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [statusFilter, priorityFilter])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await getTasks({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      })
      setTasks(data)
    } catch (error) {
      console.error('Ошибка загрузки задач:', error)
    } finally {
      setLoading(false)
    }
  }

  const newTasks = tasks.filter((t) => t.status === 'new').length
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const overdueTasks = tasks.filter((t) => {
    if (!t.due_date || t.status === 'completed') return false
    return new Date(t.due_date) < new Date()
  }).length

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Задачи</h1>
              <p className={styles.subtitle}>Управление задачами и контроль дедлайнов</p>
            </div>
            <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
              + Добавить задачу
            </button>
          </div>

          <div className={styles.filters}>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершенные</option>
            </select>

            <select
              className={styles.filterSelect}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Все приоритеты</option>
              <option value="critical">Критический</option>
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Новые</div>
              <div className={styles.statValue}>{newTasks}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>В работе</div>
              <div className={styles.statValue}>{inProgressTasks}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Завершено</div>
              <div className={styles.statValue}>{completedTasks}</div>
            </div>
            <div className={`${styles.stat} ${styles.overdue}`}>
              <div className={styles.statLabel}>Просрочено</div>
              <div className={styles.statValue}>{overdueTasks}</div>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <TasksTable tasks={tasks} onUpdate={loadTasks} />
          )}
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadTasks}
      />
    </div>
  )
}
