'use client'

import { useState, FormEvent } from 'react'
import Modal from '@/components/common/Modal'
import { createClient } from '@/lib/api'
import styles from './ClientModal.module.scss'

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ClientModal({ isOpen, onClose, onSuccess }: ClientModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    status: 'lead',
    inn: '',
    address: '',
    website: '',
    notes: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await createClient(formData)
      onSuccess()
      onClose()
      // Сброс формы
      setFormData({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        status: 'lead',
        inn: '',
        address: '',
        website: '',
        notes: '',
      })
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании клиента')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить клиента">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Основная информация</h3>

          <div className={styles.field}>
            <label className={styles.label}>
              Название организации <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="ООО &quot;Название&quot;"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Контактное лицо <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Иванов Иван Иванович"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="email@example.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Телефон <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Статус</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="lead">Лид</option>
              <option value="active">Активный</option>
              <option value="archive">Архив</option>
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Дополнительно</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>ИНН</label>
              <input
                type="text"
                name="inn"
                value={formData.inn}
                onChange={handleChange}
                className={styles.input}
                placeholder="1234567890"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Сайт</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={styles.input}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Адрес</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
              placeholder="г. Екатеринбург, ул. Ленина, д. 1"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Заметки</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className={styles.textarea}
              rows={4}
              placeholder="Дополнительная информация о клиенте"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton} disabled={loading}>
            Отмена
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Создание...' : 'Создать клиента'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
