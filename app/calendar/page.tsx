'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import Calendar from '@/components/Calendar/Calendar'
import TaskModal from '@/components/Tasks/TaskModal'
import { getTasks } from '@/lib/api'
import type { Task } from '@/types/tasks'
import styles from './page.module.scss'

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await getTasks()
      setTasks(data)
    } catch (error) {
      console.error('Ошибка загрузки задач:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleTaskSuccess = () => {
    loadTasks()
    setSelectedDate(null)
  }

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Календарь</h1>
              <p className={styles.subtitle}>Планирование задач и дедлайнов</p>
            </div>
            <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
              + Добавить задачу
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <Calendar tasks={tasks} onDateClick={handleDateClick} onTaskUpdate={loadTasks} />
          )}
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDate(null)
        }}
        onSuccess={handleTaskSuccess}
      />
    </div>
  )
}
