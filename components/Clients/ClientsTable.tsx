import Link from 'next/link'
import type { Client } from '@/types/clients'
import styles from './ClientsTable.module.scss'

interface ClientsTableProps {
  clients: Client[]
}

const statusLabels: Record<string, string> = {
  lead: 'Лид',
  active: 'Активный',
  archive: 'Архив',
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Контактное лицо</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Статус</th>
            <th>Проектов</th>
            <th>Последний контакт</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.empty}>
                Клиенты не найдены
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id}>
                <td>
                  <Link href={`/clients/${client.id}`} className={styles.clientName}>
                    {client.name}
                  </Link>
                </td>
                <td>{client.contact_person}</td>
                <td>{client.phone}</td>
                <td>
                  <a href={`mailto:${client.email}`} className={styles.email}>
                    {client.email}
                  </a>
                </td>
                <td>
                  <span className={`${styles.status} ${styles[client.status]}`}>
                    {statusLabels[client.status]}
                  </span>
                </td>
                <td>{client.projectsCount || 0}</td>
                <td className={styles.date}>{formatDate(client.last_contact)}</td>
                <td>
                  <Link href={`/clients/${client.id}`} className={styles.viewButton}>
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
