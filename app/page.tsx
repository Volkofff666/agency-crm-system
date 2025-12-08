'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import MetricCard from '@/components/Dashboard/MetricCard'
import { getClients, getProjects, getTasks } from '@/lib/api'
import type { Task } from '@/types/tasks'
import styles from './page.module.scss'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [clientsData, projectsData, tasksData] = await Promise.all([
        getClients(),
        getProjects(),
        getTasks(),
      ])
      setClients(clientsData)
      setProjects(projectsData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      setLoading(false)
    }
  }

  // Метрики
  const activeClients = clients.filter((c) => c.status === 'active').length
  const activeProjects = projects.filter((p) => p.status === 'active').length
  const activeTasks = tasks.filter((t) => t.status === 'new' || t.status === 'in_progress').length
  
  // Просроченные задачи
  const overdueTasks = tasks.filter((t) => {
    if (!t.due_date || t.status === 'completed') return false
    return new Date(t.due_date) < new Date()
  })

  // Финансы
  const totalRevenue = projects.reduce((sum, p) => sum + (p.our_budget || 0), 0)
  const totalProfit = projects.reduce((sum, p) => {
    if (p.our_budget && p.ad_budget) {
      return sum + (p.our_budget - p.ad_budget)
    }
    return sum
  }, 0)

  // Последние клиенты
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  // Последние проекты
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  // Задачи на сегодня и завтра
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const upcomingTasks = tasks.filter((t) => {
    if (!t.due_date || t.status === 'completed') return false
    const dueDate = new Date(t.due_date)
    return dueDate >= today && dueDate <= tomorrow
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
    })
  }

  if (loading) {
    return (
      <div className={styles.layout}>
        <Header />
        <div className={styles.container}>
          <Sidebar />
          <main className={styles.main}>
            <div className={styles.loading}>Загрузка...</div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Dashboard</h1>
              <p className={styles.subtitle}>Обзор ключевых метрик и активности</p>
            </div>
          </div>

          {/* Метрики */}
          <div className={styles.metrics}>
            <MetricCard
              title="Активные клиенты"
              value={activeClients}
              total={clients.length}
              link="/clients"
            />
            <MetricCard
              title="Активные проекты"
              value={activeProjects}
              total={projects.length}
              link="/projects"
            />
            <MetricCard
              title="Задачи в работе"
              value={activeTasks}
              total={tasks.length}
              link="/tasks"
              alert={overdueTasks.length}
            />
            <MetricCard
              title="Общая прибыль"
              value={`${totalProfit.toLocaleString('ru-RU')} ₽`}
              subtitle={`Доход: ${totalRevenue.toLocaleString('ru-RU')} ₽`}
              link="/finance"
            />
          </div>

          {/* Предупреждения */}
          {overdueTasks.length > 0 && (
            <div className={styles.alert}>
              <div className={styles.alertIcon}>⚠️</div>
              <div>
                <div className={styles.alertTitle}>Просроченные задачи</div>
                <div className={styles.alertText}>
                  У вас {overdueTasks.length} просроченных задач. <Link href="/tasks">Посмотреть</Link>
                </div>
              </div>
            </div>
          )}

          <div className={styles.grid}>
            {/* Задачи на сегодня/завтра */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Ближайшие задачи</h2>
                <Link href="/tasks" className={styles.sectionLink}>Все задачи</Link>
              </div>

              {upcomingTasks.length === 0 ? (
                <div className={styles.empty}>Нет задач на ближайшее время</div>
              ) : (
                <div className={styles.tasksList}>
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className={styles.taskItem}>
                      <div className={`${styles.taskPriority} ${styles[task.priority]}`} />
                      <div className={styles.taskContent}>
                        <div className={styles.taskTitle}>{task.title}</div>
                        <div className={styles.taskMeta}>
                          {task.project_name && <span>{task.project_name}</span>}
                          {task.due_date && <span>• {formatDate(task.due_date)}</span>}
                        </div>
                      </div>
                      <div className={`${styles.taskStatus} ${styles[task.status]}`}>
                        {task.status === 'new' ? 'Новая' : 'В работе'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Последние клиенты */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Новые клиенты</h2>
                <Link href="/clients" className={styles.sectionLink}>Все клиенты</Link>
              </div>

              {recentClients.length === 0 ? (
                <div className={styles.empty}>Нет клиентов</div>
              ) : (
                <div className={styles.list}>
                  {recentClients.map((client) => (
                    <Link key={client.id} href={`/clients/${client.id}`} className={styles.listItem}>
                      <div>
                        <div className={styles.listTitle}>{client.name}</div>
                        <div className={styles.listMeta}>{client.contact_person}</div>
                      </div>
                      <div className={`${styles.listStatus} ${styles[client.status]}`}>
                        {client.status === 'lead' ? 'Лид' : client.status === 'active' ? 'Активный' : 'Архив'}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Последние проекты */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Новые проекты</h2>
                <Link href="/projects" className={styles.sectionLink}>Все проекты</Link>
              </div>

              {recentProjects.length === 0 ? (
                <div className={styles.empty}>Нет проектов</div>
              ) : (
                <div className={styles.list}>
                  {recentProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`} className={styles.listItem}>
                      <div>
                        <div className={styles.listTitle}>{project.name}</div>
                        <div className={styles.listMeta}>
                          {project.client_name || 'Без клиента'}
                          {project.our_budget && (
                            <span> • {project.our_budget.toLocaleString('ru-RU')} ₽</span>
                          )}
                        </div>
                      </div>
                      <div className={`${styles.listStatus} ${styles[project.status]}`}>
                        {project.status === 'active' ? 'Активный' : project.status === 'completed' ? 'Завершен' : 'Приостановлен'}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
