'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import ClientCard from '@/components/Clients/ClientCard'
import { getClient } from '@/lib/api'
import type { ClientDetail } from '@/types/clients'
import styles from './page.module.scss'

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    loadClient()
  }, [id])

  const loadClient = async () => {
    try {
      setLoading(true)
      const data = await getClient(id)
      setClient(data)
    } catch (error) {
      console.error('Ошибка загрузки клиента:', error)
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

  if (error || !client) {
    return (
      <div className={styles.layout}>
        <Header />
        <div className={styles.container}>
          <Sidebar />
          <main className={styles.main}>
            <div className={styles.notFound}>
              <h1>Клиент не найден</h1>
              <Link href="/clients" className={styles.backButton}>
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
            <Link href="/clients">Клиенты</Link>
            <span>/</span>
            <span>{client.name}</span>
          </div>

          <ClientCard client={client} />
        </main>
      </div>
    </div>
  )
}
