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
    budget: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await addProject(String(clientId), formData)
      onSuccess()
      onClose()
      // Сброс формы
      setFormData({
        name: '',
        status: 'active',
        budget: '',
      })
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании проекта')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
            <label className={styles.label}>Бюджет</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className={styles.input}
              placeholder="от 100 000 ₽ / мес"
            />
            <div className={styles.hint}>Укажите бюджет в свободной форме</div>
          </div>

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
