'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import ClientsTable from '@/components/Clients/ClientsTable'
import { getClients } from '@/lib/api'
import type { Client } from '@/types/clients'
import styles from './page.module.scss'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadClients()
  }, [searchQuery, statusFilter])

  const loadClients = async () => {
    try {
      setLoading(true)
      const data = await getClients({
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      })
      setClients(data)
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error)
    } finally {
      setLoading(false)
    }
  }

  const activeClients = clients.filter((c) => c.status === 'active').length
  const leadClients = clients.filter((c) => c.status === 'lead').length

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
              <div className={styles.statValue}>{clients.length}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Активных</div>
              <div className={styles.statValue}>{activeClients}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Лидов</div>
              <div className={styles.statValue}>{leadClients}</div>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <ClientsTable clients={clients} />
          )}
        </main>
      </div>
    </div>
  )
}
