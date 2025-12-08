'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import ProjectsTable from '@/components/Projects/ProjectsTable'
import { getProjects } from '@/lib/api'
import type { Project } from '@/types/projects'
import styles from './page.module.scss'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadProjects()
  }, [statusFilter])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await getProjects({
        status: statusFilter !== 'all' ? statusFilter : undefined,
      })
      setProjects(data)
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error)
    } finally {
      setLoading(false)
    }
  }

  const activeProjects = projects.filter((p) => p.status === 'active').length
  const completedProjects = projects.filter((p) => p.status === 'completed').length
  const pausedProjects = projects.filter((p) => p.status === 'paused').length

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Проекты</h1>
              <p className={styles.subtitle}>Управление проектами и задачами агентства</p>
            </div>
          </div>

          <div className={styles.filters}>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="completed">Завершенные</option>
              <option value="paused">Приостановленные</option>
            </select>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Всего проектов</div>
              <div className={styles.statValue}>{projects.length}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Активных</div>
              <div className={styles.statValue}>{activeProjects}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Завершенных</div>
              <div className={styles.statValue}>{completedProjects}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Приостановлено</div>
              <div className={styles.statValue}>{pausedProjects}</div>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <ProjectsTable projects={projects} onUpdate={loadProjects} />
          )}
        </main>
      </div>
    </div>
  )
}
