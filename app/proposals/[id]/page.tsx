'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import ProposalPreview from '@/components/Proposals/ProposalPreview'
import { getProposal } from '@/lib/api'
import type { Proposal } from '@/types/proposals'
import styles from './page.module.scss'

export default function ProposalDetailPage() {
  const params = useParams()
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadProposal()
    }
  }, [params.id])

  const loadProposal = async () => {
    try {
      setLoading(true)
      const data = await getProposal(params.id as string)
      setProposal(data)
    } catch (error) {
      console.error('Ошибка загрузки КП:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>Коммерческое предложение</h1>
            <button onClick={handlePrint} className={styles.printButton}>
              🖨️ Печать / PDF
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : proposal ? (
            <ProposalPreview proposal={proposal} />
          ) : (
            <div className={styles.error}>КП не найдено</div>
          )}
        </main>
      </div>
    </div>
  )
}
