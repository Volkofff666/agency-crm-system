'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import ProjectCard from '@/components/Projects/ProjectCard'
import { getProject } from '@/lib/api'
import type { ProjectDetail } from '@/types/projects'
import styles from './page.module.scss'

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    loadProject()
  }, [id])

  const loadProject = async () => {
    try {
      setLoading(true)
      const data = await getProject(id)
      setProject(data)
    } catch (error) {
      console.error('Ошибка загрузки проекта:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
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

  if (error || !project) {
    return (
      <div className={styles.layout}>
        <Header />
        <div className={styles.container}>
          <Sidebar />
          <main className={styles.main}>
            <div className={styles.notFound}>
              <h1>Проект не найден</h1>
              <Link href="/projects" className={styles.backButton}>
                Вернуться к списку
              </Link>
            </div>
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
          <div className={styles.breadcrumbs}>
            <Link href="/projects">Проекты</Link>
            <span>/</span>
            <span>{project.name}</span>
          </div>

          <ProjectCard project={project} onUpdate={loadProject} />
        </main>
      </div>
    </div>
  )
}
