'use client'

import { useState } from 'react'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import ClientsTable from '@/components/Clients/ClientsTable'
import styles from './page.module.scss'

// Моковые данные клиентов
const MOCK_CLIENTS = [
  {
    id: '1',
    name: 'ООО "Торговый Дом Альфа"',
    contactPerson: 'Иванов Иван Иванович',
    email: 'ivanov@alpha-td.ru',
    phone: '+7 (495) 123-45-67',
    status: 'active',
    projectsCount: 3,
    revenue: 450000,
    lastContact: '2025-12-05',
  },
  {
    id: '2',
    name: 'ИП Петров Петр Петрович',
    contactPerson: 'Петров Петр Петрович',
    email: 'petrov@example.com',
    phone: '+7 (903) 234-56-78',
    status: 'active',
    projectsCount: 1,
    revenue: 120000,
    lastContact: '2025-12-07',
  },
  {
    id: '3',
    name: 'ООО "БизнесСтрой"',
    contactPerson: 'Сидорова Анна Владимировна',
    email: 'sidorova@biznesstroy.ru',
    phone: '+7 (812) 345-67-89',
    status: 'lead',
    projectsCount: 0,
    revenue: 0,
    lastContact: '2025-12-03',
  },
  {
    id: '4',
    name: 'ООО "ТехноПро"',
    contactPerson: 'Козлов Сергей Александрович',
    email: 'kozlov@technopro.com',
    phone: '+7 (495) 456-78-90',
    status: 'active',
    projectsCount: 5,
    revenue: 890000,
    lastContact: '2025-12-08',
  },
  {
    id: '5',
    name: 'ИП Смирнов',
    contactPerson: 'Смирнов Дмитрий Игоревич',
    email: 'smirnov@mail.ru',
    phone: '+7 (926) 567-89-01',
    status: 'archive',
    projectsCount: 2,
    revenue: 180000,
    lastContact: '2025-11-15',
  },
]

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredClients = MOCK_CLIENTS.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Клиенты</h1>
              <p className={styles.subtitle}>База клиентов и контактов агентства</p>
            </div>
            <button className={styles.addButton}>Добавить клиента</button>
          </div>

          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Поиск по названию или контактному лицу..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="lead">Лид</option>
              <option value="active">Активный</option>
              <option value="archive">Архив</option>
            </select>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Всего клиентов</div>
              <div className={styles.statValue}>{MOCK_CLIENTS.length}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Активных</div>
              <div className={styles.statValue}>
                {MOCK_CLIENTS.filter((c) => c.status === 'active').length}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Лидов</div>
              <div className={styles.statValue}>
                {MOCK_CLIENTS.filter((c) => c.status === 'lead').length}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Общая выручка</div>
              <div className={styles.statValue}>
                {(MOCK_CLIENTS.reduce((acc, c) => acc + c.revenue, 0) / 1000).toFixed(0)}k ₽
              </div>
            </div>
          </div>

          <ClientsTable clients={filteredClients} />
        </main>
      </div>
    </div>
  )
}
