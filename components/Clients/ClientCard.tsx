import type { ClientDetail } from '@/types/clients'
import styles from './ClientCard.module.scss'

interface ClientCardProps {
  client: ClientDetail
}

const statusLabels: Record<string, string> = {
  lead: 'Лид',
  active: 'Активный',
  archive: 'Архив',
}

const projectStatusLabels: Record<string, string> = {
  active: 'Активный',
  completed: 'Завершен',
  paused: 'Приостановлен',
}

export default function ClientCard({ client }: ClientCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{client.name}</h1>
          <span className={`${styles.status} ${styles[client.status]}`}>
            {statusLabels[client.status]}
          </span>
        </div>
        <div className={styles.actions}>
          <button className={styles.editButton}>Редактировать</button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Основная информация</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>ИНН</div>
              <div className={styles.infoValue}>{client.inn}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Адрес</div>
              <div className={styles.infoValue}>{client.address}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Сайт</div>
              <div className={styles.infoValue}>
                <a href={client.website} target="_blank" rel="noopener noreferrer">
                  {client.website}
                </a>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Проектов</div>
              <div className={styles.infoValue}>{client.projectsCount}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Общая выручка</div>
              <div className={styles.infoValue}>{formatCurrency(client.revenue)}</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Контакты</h2>
          <div className={styles.contacts}>
            {client.contacts.map((contact, idx) => (
              <div key={idx} className={styles.contact}>
                <div className={styles.contactName}>{contact.name}</div>
                <div className={styles.contactPosition}>{contact.position}</div>
                <div className={styles.contactDetails}>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Проекты</h2>
        <div className={styles.projects}>
          {client.projects.map((project) => (
            <div key={project.id} className={styles.project}>
              <div className={styles.projectHeader}>
                <div className={styles.projectName}>{project.name}</div>
                <span className={`${styles.projectStatus} ${styles[project.status]}`}>
                  {projectStatusLabels[project.status]}
                </span>
              </div>
              <div className={styles.projectBudget}>
                Бюджет: {formatCurrency(project.budget)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Заметки</h2>
        <div className={styles.notes}>
          <p>{client.notes}</p>
        </div>
      </div>
    </div>
  )
}
