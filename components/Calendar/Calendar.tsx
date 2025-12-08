'use client'

import { useState } from 'react'
import { updateTask } from '@/lib/api'
import type { Task } from '@/types/tasks'
import styles from './Calendar.module.scss'

interface CalendarProps {
  tasks: Task[]
  onDateClick: (date: Date) => void
  onTaskUpdate: () => void
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const priorityColors: Record<string, string> = {
  low: '#9ca3af',
  medium: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444',
}

export default function Calendar({ tasks, onDateClick, onTaskUpdate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Первый день месяца
  const firstDay = new Date(year, month, 1)
  // Последний день месяца
  const lastDay = new Date(year, month + 1, 0)
  
  // День недели первого дня (0 = воскресенье, нужно сделать понедельник = 0)
  let startWeekday = firstDay.getDay() - 1
  if (startWeekday === -1) startWeekday = 6

  // Дни месяца
  const daysInMonth = lastDay.getDate()

  // Предыдущий месяц
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  // Следующий месяц
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  // Получить задачи для определенной даты
  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return tasks.filter(task => {
      if (!task.due_date) return false
      const taskDate = new Date(task.due_date).toISOString().split('T')[0]
      return taskDate === dateStr
    })
  }

  // Проверка на сегодня
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Проверка на выбранную дату
  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  // Смена статуса задачи
  const handleStatusChange = async (taskId: string | number, newStatus: string) => {
    try {
      await updateTask(String(taskId), { status: newStatus })
      onTaskUpdate()
    } catch (error) {
      console.error('Ошибка изменения статуса:', error)
    }
  }

  // Создаем массив дней для отображения
  const calendarDays = []
  
  // Пустые ячейки в начале
  for (let i = 0; i < startWeekday; i++) {
    calendarDays.push(null)
  }
  
  // Дни месяца
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day))
  }

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <div className={styles.header}>
          <button onClick={prevMonth} className={styles.navButton}>‹</button>
          <h2 className={styles.monthTitle}>
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} className={styles.navButton}>›</button>
        </div>

        <div className={styles.weekdays}>
          {WEEKDAYS.map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.days}>
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className={styles.emptyDay} />
            }

            const dayTasks = getTasksForDate(date)
            const hasOverdue = dayTasks.some(task => 
              task.status !== 'completed' && new Date(task.due_date!) < new Date()
            )

            return (
              <div
                key={index}
                className={`
                  ${styles.day}
                  ${isToday(date) ? styles.today : ''}
                  ${isSelected(date) ? styles.selected : ''}
                `}
                onClick={() => {
                  setSelectedDate(date)
                  onDateClick(date)
                }}
              >
                <div className={styles.dayNumber}>{date.getDate()}</div>
                
                {dayTasks.length > 0 && (
                  <div className={styles.taskDots}>
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`${styles.taskDot} ${hasOverdue ? styles.overdue : ''}`}
                        style={{ backgroundColor: priorityColors[task.priority] }}
                        title={task.title}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className={styles.moreCount}>+{dayTasks.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Список задач выбранной даты */}
      {selectedDate && (
        <div className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>
            Задачи на {selectedDate.toLocaleDateString('ru-RU', { 
              day: 'numeric', 
              month: 'long',
              year: 'numeric'
            })}
          </h3>

          <div className={styles.tasksList}>
            {getTasksForDate(selectedDate).length === 0 ? (
              <div className={styles.noTasks}>Задач нет</div>
            ) : (
              getTasksForDate(selectedDate).map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <div
                      className={styles.taskPriority}
                      style={{ backgroundColor: priorityColors[task.priority] }}
                    />
                    <div className={styles.taskTitle}>{task.title}</div>
                  </div>
                  
                  {task.description && (
                    <div className={styles.taskDescription}>{task.description}</div>
                  )}

                  <div className={styles.taskFooter}>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className={`${styles.statusSelect} ${styles[task.status]}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="new">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="completed">Завершена</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
