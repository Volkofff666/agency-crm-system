'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import { getProposals, deleteProposal } from '@/lib/api'
import type { Proposal } from '@/types/proposals'
import styles from './page.module.scss'

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProposals()
  }, [])

  const loadProposals = async () => {
    try {
      setLoading(true)
      const data = await getProposals()
      setProposals(data)
    } catch (error) {
      console.error('Ошибка загрузки КП:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить коммерческое предложение?')) return

    try {
      await deleteProposal(String(id))
      loadProposals()
    } catch (error) {
      console.error('Ошибка удаления:', error)
    }
  }

  const statusLabels: Record<string, string> = {
    draft: 'Черновик',
    sent: 'Отправлено',
    accepted: 'Принято',
    rejected: 'Отклонено',
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU')
  }

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Коммерческие предложения</h1>
              <p className={styles.subtitle}>Генерация КП для клиентов</p>
            </div>
            <Link href="/proposals/new" className={styles.addButton}>
              + Создать КП
            </Link>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : proposals.length === 0 ? (
            <div className={styles.empty}>
              <p>Коммерческих предложений пока нет</p>
              <Link href="/proposals/new" className={styles.emptyButton}>
                Создать первое КП
              </Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {proposals.map((proposal) => (
                <div key={proposal.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <div className={styles.cardTitle}>{proposal.title}</div>
                      {proposal.number && (
                        <div className={styles.cardNumber}>№ {proposal.number}</div>
                      )}
                    </div>
                    <div className={`${styles.cardStatus} ${styles[proposal.status]}`}>
                      {statusLabels[proposal.status]}
                    </div>
                  </div>

                  <div className={styles.cardClient}>
                    <span className={styles.label}>Клиент:</span> {proposal.client_name}
                  </div>

                  <div className={styles.cardAmount}>
                    <div className={styles.amountLabel}>Итоговая сумма:</div>
                    <div className={styles.amountValue}>
                      {proposal.total.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.cardDate}>
                      Создано: {formatDate(proposal.created_at)}
                    </div>
                    <div className={styles.cardActions}>
                      <Link href={`/proposals/${proposal.id}`} className={styles.actionButton}>
                        Просмотр
                      </Link>
                      <button
                        onClick={() => handleDelete(proposal.id)}
                        className={`${styles.actionButton} ${styles.danger}`}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
