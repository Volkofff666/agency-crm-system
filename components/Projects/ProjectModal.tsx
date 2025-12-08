'use client'

import { useState, FormEvent } from 'react'
import Modal from '@/components/common/Modal'
import { addProject } from '@/lib/api'
import styles from './ProjectModal.module.scss'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  clientId: string | number
  clientName: string
}

export default function ProjectModal({ isOpen, onClose, onSuccess, clientId, clientName }: ProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    our_budget: '',
    ad_budget: '',
    budget_currency: 'RUB',
    description: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Конвертируем строки в числа для бюджетов
      const projectData = {
        ...formData,
        our_budget: formData.our_budget ? parseFloat(formData.our_budget) : null,
        ad_budget: formData.ad_budget ? parseFloat(formData.ad_budget) : null,
      }
      
      await addProject(String(clientId), projectData)
      onSuccess()
      onClose()
      // Сброс формы
      setFormData({
        name: '',
        status: 'active',
        our_budget: '',
        ad_budget: '',
        budget_currency: 'RUB',
        description: '',
      })
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании проекта')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Расчет прибыли
  const ourBudget = parseFloat(formData.our_budget) || 0
  const adBudget = parseFloat(formData.ad_budget) || 0
  const profit = ourBudget > 0 && adBudget > 0 ? ourBudget - adBudget : null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Создать проект">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.section}>
          <div className={styles.field}>
            <label className={styles.label}>Клиент</label>
            <div className={styles.clientName}>{clientName}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Название проекта <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Контекстная реклама"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Описание проекта</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              rows={3}
              placeholder="Описание услуг, задач, особенностей проекта"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>💰 Финансы</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Наш бюджет (в месяц)</label>
              <input
                type="number"
                name="our_budget"
                value={formData.our_budget}
                onChange={handleChange}
                className={styles.input}
                placeholder="150000"
                step="0.01"
              />
              <div className={styles.hint}>Сколько клиент платит нам</div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Рекламный бюджет</label>
              <input
                type="number"
                name="ad_budget"
                value={formData.ad_budget}
                onChange={handleChange}
                className={styles.input}
                placeholder="500000"
                step="0.01"
              />
              <div className={styles.hint}>Бюджет на рекламу клиента</div>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Валюта</label>
            <select
              name="budget_currency"
              value={formData.budget_currency}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="RUB">₽ Рубль</option>
              <option value="USD">$ Доллар</option>
              <option value="EUR">€ Евро</option>
            </select>
          </div>

          {profit !== null && (
            <div className={styles.profitCard}>
              <div className={styles.profitLabel}>Прибыль агентства:</div>
              <div className={styles.profitValue}>
                {profit.toLocaleString('ru-RU')} {formData.budget_currency === 'RUB' ? '₽' : formData.budget_currency}
              </div>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.field}>
            <label className={styles.label}>Статус</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="active">Активный</option>
              <option value="paused">Приостановлен</option>
              <option value="completed">Завершен</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton} disabled={loading}>
            Отмена
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Создание...' : 'Создать проект'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
