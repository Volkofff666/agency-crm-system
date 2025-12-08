'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'
import { Invoice, InvoiceStatus } from '@/types/invoice'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all')

  useEffect(() => {
    fetchInvoices()
  }, [filter])

  const fetchInvoices = async () => {
    try {
      const url = filter === 'all' 
        ? 'http://localhost:8000/invoices/'
        : `http://localhost:8000/invoices/?status=${filter}`
      
      const response = await fetch(url)
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: InvoiceStatus) => {
    const badges: Record<InvoiceStatus, { label: string; className: string }> = {
      [InvoiceStatus.DRAFT]: { label: 'Черновик', className: styles.draft },
      [InvoiceStatus.SENT]: { label: 'Отправлен', className: styles.sent },
      [InvoiceStatus.PAID]: { label: 'Оплачен', className: styles.paid },
      [InvoiceStatus.OVERDUE]: { label: 'Просрочен', className: styles.overdue },
      [InvoiceStatus.CANCELLED]: { label: 'Отменен', className: styles.cancelled },
    }
    const badge = badges[status]
    return <span className={`${styles.badge} ${badge.className}`}>{badge.label}</span>
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount)
  }

  const getTotalStats = () => {
    return {
      total: invoices.reduce((sum, inv) => sum + inv.total, 0),
      paid: invoices.filter(inv => inv.status === InvoiceStatus.PAID).reduce((sum, inv) => sum + inv.total, 0),
      pending: invoices.filter(inv => inv.status === InvoiceStatus.SENT).reduce((sum, inv) => sum + inv.total, 0),
      overdue: invoices.filter(inv => inv.status === InvoiceStatus.OVERDUE).reduce((sum, inv) => sum + inv.total, 0),
    }
  }

  const stats = getTotalStats()

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Счета</h1>
          <p className={styles.subtitle}>Управление счетами и платежами</p>
        </div>
        <Link href="/invoices/new" className={styles.createButton}>
          + Создать счет
        </Link>
      </div>

      {/* Статистика */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Общая сумма</div>
          <div className={styles.statValue}>{formatCurrency(stats.total)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Оплачено</div>
          <div className={`${styles.statValue} ${styles.green}`}>{formatCurrency(stats.paid)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Ожидается</div>
          <div className={`${styles.statValue} ${styles.blue}`}>{formatCurrency(stats.pending)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Просрочено</div>
          <div className={`${styles.statValue} ${styles.red}`}>{formatCurrency(stats.overdue)}</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className={styles.filters}>
        <button 
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          Все ({invoices.length})
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === InvoiceStatus.DRAFT ? styles.active : ''}`}
          onClick={() => setFilter(InvoiceStatus.DRAFT)}
        >
          Черновики
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === InvoiceStatus.SENT ? styles.active : ''}`}
          onClick={() => setFilter(InvoiceStatus.SENT)}
        >
          Отправленные
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === InvoiceStatus.PAID ? styles.active : ''}`}
          onClick={() => setFilter(InvoiceStatus.PAID)}
        >
          Оплаченные
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === InvoiceStatus.OVERDUE ? styles.active : ''}`}
          onClick={() => setFilter(InvoiceStatus.OVERDUE)}
        >
          Просроченные
        </button>
      </div>

      {/* Список счетов */}
      {invoices.length === 0 ? (
        <div className={styles.empty}>
          <p>Счетов пока нет</p>
          <Link href="/invoices/new">Создать первый счет</Link>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>№ Счета</div>
            <div>Клиент</div>
            <div>Дата выставления</div>
            <div>Срок оплаты</div>
            <div>Сумма</div>
            <div>Статус</div>
            <div>Действия</div>
          </div>
          {invoices.map((invoice) => (
            <div key={invoice.id} className={styles.tableRow}>
              <div className={styles.invoiceNumber}>{invoice.invoice_number}</div>
              <div>{invoice.client?.name || `Client #${invoice.client_id}`}</div>
              <div>{formatDate(invoice.issue_date)}</div>
              <div>{formatDate(invoice.due_date)}</div>
              <div className={styles.amount}>{formatCurrency(invoice.total)}</div>
              <div>{getStatusBadge(invoice.status)}</div>
              <div className={styles.actions}>
                <Link href={`/invoices/${invoice.id}`} className={styles.actionBtn}>
                  Просмотр
                </Link>
                <Link href={`/invoices/${invoice.id}/edit`} className={styles.actionBtn}>
                  Редактировать
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
