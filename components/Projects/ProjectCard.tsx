import Link from 'next/link'
import type { ProjectDetail } from '@/types/projects'
import styles from './ProjectCard.module.scss'

interface ProjectCardProps {
  project: ProjectDetail
  onUpdate: () => void
}

const statusLabels: Record<string, string> = {
  active: 'Активный',
  completed: 'Завершен',
  paused: 'Приостановлен',
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{project.name}</h1>
          <span className={`${styles.status} ${styles[project.status]}`}>
            {statusLabels[project.status]}
          </span>
        </div>
        <div className={styles.actions}>
          <button className={styles.editButton}>Редактировать</button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Информация о проекте</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Бюджет</div>
              <div className={styles.infoValue}>{project.budget || '—'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Создан</div>
              <div className={styles.infoValue}>{formatDate(project.created_at)}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Последнее обновление</div>
              <div className={styles.infoValue}>{formatDate(project.updated_at)}</div>
            </div>
          </div>
        </div>

        {project.client && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Клиент</h2>
            <div className={styles.clientCard}>
              <Link href={`/clients/${project.client.id}`} className={styles.clientName}>
                {project.client.name}
              </Link>
              <div className={styles.clientContact}>{project.client.contact_person}</div>
              <div className={styles.clientDetails}>
                <a href={`tel:${project.client.phone}`}>{project.client.phone}</a>
                {project.client.email && (
                  <a href={`mailto:${project.client.email}`}>{project.client.email}</a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
