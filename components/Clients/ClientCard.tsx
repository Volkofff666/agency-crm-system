import Link from 'next/link'
import type { ClientDetail } from '@/types/clients'
import styles from './ClientCard.module.scss'

interface ClientCardProps {
  client: ClientDetail
  onEdit: () => void
  onAddProject?: () => void
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

export default function ClientCard({ client, onEdit, onAddProject }: ClientCardProps) {
  // Функция для открытия Telegram
  const openTelegram = (username: string) => {
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username
    window.open(`https://t.me/${cleanUsername}`, '_blank')
  }

  // Функция для открытия WhatsApp
  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '')
    window.open(`https://wa.me/${cleanPhone}`, '_blank')
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
          <button className={styles.editButton} onClick={onEdit}>Редактировать</button>
        </div>
      </div>

      {/* Быстрые кнопки связи */}
      <div className={styles.messengers}>
        {client.telegram && (
          <button
            className={`${styles.messengerButton} ${styles.telegram}`}
            onClick={() => openTelegram(client.telegram!)}
          >
            📱 Telegram
          </button>
        )}
        {client.whatsapp && (
          <button
            className={`${styles.messengerButton} ${styles.whatsapp}`}
            onClick={() => openWhatsApp(client.whatsapp!)}
          >
            💬 WhatsApp
          </button>
        )}
        {client.email && (
          <a href={`mailto:${client.email}`} className={`${styles.messengerButton} ${styles.email}`}>
            ✉️ Email
          </a>
        )}
        {client.phone && (
          <a href={`tel:${client.phone}`} className={`${styles.messengerButton} ${styles.phone}`}>
            📞 Позвонить
          </a>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Основная информация</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>ИНН</div>
              <div className={styles.infoValue}>{client.inn || '—'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Адрес</div>
              <div className={styles.infoValue}>{client.address || '—'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Сайт</div>
              <div className={styles.infoValue}>
                {client.website ? (
                  <a href={client.website} target="_blank" rel="noopener noreferrer">
                    {client.website}
                  </a>
                ) : (
                  '—'
                )}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Проектов</div>
              <div className={styles.infoValue}>{client.projects_count || 0}</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Контакты</h2>
          <div className={styles.contacts}>
            {client.contacts && client.contacts.length > 0 ? (
              client.contacts.map((contact, idx) => (
                <div key={idx} className={styles.contact}>
                  <div className={styles.contactName}>{contact.name}</div>
                  <div className={styles.contactPosition}>{contact.position || '—'}</div>
                  <div className={styles.contactDetails}>
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                    {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                    {contact.telegram && (
                      <button
                        onClick={() => openTelegram(contact.telegram!)}
                        className={styles.contactMessenger}
                      >
                        Telegram: {contact.telegram}
                      </button>
                    )}
                    {contact.whatsapp && (
                      <button
                        onClick={() => openWhatsApp(contact.whatsapp!)}
                        className={styles.contactMessenger}
                      >
                        WhatsApp: {contact.whatsapp}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.empty}>Контакты не добавлены</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Проекты</h2>
          {onAddProject && (
            <button className={styles.addButton} onClick={onAddProject}>
              + Добавить проект
            </button>
          )}
        </div>
        <div className={styles.projects}>
          {client.projects && client.projects.length > 0 ? (
            client.projects.map((project) => (
              <div key={project.id} className={styles.project}>
                <div className={styles.projectHeader}>
                  <Link href={`/projects/${project.id}`} className={styles.projectName}>
                    {project.name}
                  </Link>
                  <span className={`${styles.projectStatus} ${styles[project.status]}`}>
                    {projectStatusLabels[project.status]}
                  </span>
                </div>
                {project.budget && (
                  <div className={styles.projectBudget}>Бюджет: {project.budget}</div>
                )}
              </div>
            ))
          ) : (
            <p className={styles.empty}>Проекты не добавлены</p>
          )}
        </div>
      </div>

      {client.notes && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Заметки</h2>
          <div className={styles.notes}>
            <p>{client.notes}</p>
          </div>
        </div>
      )}
    </div>
  )
}
