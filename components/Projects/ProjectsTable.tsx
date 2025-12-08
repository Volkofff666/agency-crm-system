import Link from 'next/link'
import { updateProjectStatus } from '@/lib/api'
import type { Project } from '@/types/projects'
import styles from './ProjectsTable.module.scss'

interface ProjectsTableProps {
  projects: Project[]
  onUpdate: () => void
}

const statusLabels: Record<string, string> = {
  active: 'Активный',
  completed: 'Завершен',
  paused: 'Приостановлен',
}

export default function ProjectsTable({ projects, onUpdate }: ProjectsTableProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const handleStatusChange = async (projectId: string | number, newStatus: string) => {
    try {
      await updateProjectStatus(String(projectId), newStatus)
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
            <th>Проект</th>
            <th>Клиент</th>
            <th>Бюджет</th>
            <th>Статус</th>
            <th>Создан</th>
            <th>Обновлен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.empty}>
                Проекты не найдены
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <Link href={`/projects/${project.id}`} className={styles.projectName}>
                    {project.name}
                  </Link>
                </td>
                <td>
                  {project.client_name ? (
                    <Link href={`/clients/${project.client_id}`} className={styles.clientLink}>
                      {project.client_name}
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
                <td>{project.budget || '—'}</td>
                <td>
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project.id, e.target.value)}
                    className={`${styles.statusSelect} ${styles[project.status]}`}
                  >
                    <option value="active">Активный</option>
                    <option value="completed">Завершен</option>
                    <option value="paused">Приостановлен</option>
                  </select>
                </td>
                <td className={styles.date}>{formatDate(project.created_at)}</td>
                <td className={styles.date}>{formatDate(project.updated_at)}</td>
                <td>
                  <Link href={`/projects/${project.id}`} className={styles.viewButton}>
                    Открыть
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
