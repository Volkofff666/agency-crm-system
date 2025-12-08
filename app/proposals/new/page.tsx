'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import ProposalForm from '@/components/Proposals/ProposalForm'
import { createProposal } from '@/lib/api'
import styles from './page.module.scss'

export default function NewProposalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    setError(null)
    setLoading(true)

    try {
      await createProposal(data)
      router.push('/proposals')
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании КП')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>Создать коммерческое предложение</h1>
            <p className={styles.subtitle}>Заполните данные для генерации КП</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <ProposalForm onSubmit={handleSubmit} loading={loading} />
        </main>
      </div>
    </div>
  )
}
