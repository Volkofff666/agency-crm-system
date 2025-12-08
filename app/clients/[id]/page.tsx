'use client'

import { use } from 'react'
import Link from 'next/link'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import ClientCard from '@/components/Clients/ClientCard'
import styles from './page.module.scss'

// Моковые данные клиента
const getClientById = (id: string) => {
  const clients: Record<string, any> = {
    '1': {
      id: '1',
      name: 'ООО "Торговый Дом Альфа"',
      contactPerson: 'Иванов Иван Иванович',
      email: 'ivanov@alpha-td.ru',
      phone: '+7 (495) 123-45-67',
      status: 'active',
      projectsCount: 3,
      revenue: 450000,
      lastContact: '2025-12-05',
      inn: '7701234567',
      address: 'г. Москва, ул. Ленина, д. 10',
      website: 'https://alpha-td.ru',
      projects: [
        { id: '1', name: 'Контекстная реклама', status: 'active', budget: 150000 },
        { id: '2', name: 'SEO продвижение', status: 'active', budget: 200000 },
        { id: '3', name: 'SMM', status: 'completed', budget: 100000 },
      ],
      contacts: [
        { name: 'Иванов Иван Иванович', position: 'Директор', phone: '+7 (495) 123-45-67', email: 'ivanov@alpha-td.ru' },
        { name: 'Петрова Мария', position: 'Маркетолог', phone: '+7 (495) 123-45-68', email: 'petrova@alpha-td.ru' },
      ],
      notes: 'Крупный клиент, работаем с 2023 года. Основной фокус на контекстной рекламе.',
    },
  }
  return clients[id]
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const client = getClientById(id)

  if (!client) {
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
