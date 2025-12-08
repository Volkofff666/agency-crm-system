'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.scss'
import { InvoiceFormData, InvoiceItem } from '@/types/invoice'

interface Client {
  id: number
  name: string
  email?: string
}

interface Project {
  id: number
  name: string
  client_id: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<InvoiceFormData>({
    title: '',
    description: '',
    client_id: 0,
    project_id: undefined,
    due_date: '',
    tax_rate: 0,
    discount: 0,
    notes: '',
    terms: 'Оплата: 50% предоплата, 50% по завершению работ.\nСрок оплаты: в течение 7 дней.\nГарантия: 3 месяца технической поддержки.',
    items: [{
      name: '',
      description: '',
      quantity: 1,
      unit: 'шт',
      price: 0,
    }],
  })

  useEffect(() => {
    fetchClients()
    fetchProjects()
  }, [])

  useEffect(() => {
    if (formData.client_id) {
      const filtered = projects.filter(p => p.client_id === formData.client_id)
      setFilteredProjects(filtered)
    } else {
      setFilteredProjects([])
    }
  }, [formData.client_id, projects])

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/clients/')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/projects/')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/invoices/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/invoices')
      } else {
        alert('Ошибка при создании счета')
      }
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('Ошибка при создании счета')
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { name: '', description: '', quantity: 1, unit: 'шт', price: 0 },
      ],
    })
  }

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountAmount = subtotal * (formData.discount / 100)
    const afterDiscount = subtotal - discountAmount
    const taxAmount = afterDiscount * (formData.tax_rate / 100)
    return afterDiscount + taxAmount
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Новый счет</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Основная информация</h2>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Название счета *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Разработка веб-сайта"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Краткое описание работ по счету"
              rows={3}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Клиент *</label>
              <select
                required
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: Number(e.target.value), project_id: undefined })}
              >
                <option value="">Выберите клиента</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Проект (опционально)</label>
              <select
                value={formData.project_id || ''}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value ? Number(e.target.value) : undefined })}
                disabled={!formData.client_id}
              >
                <option value="">Без проекта</option>
                {filteredProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Срок оплаты *</label>
              <input
                type="date"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label>НДС (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.tax_rate}
                onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
              />
            </div>

            <div className={styles.field}>
              <label>Скидка (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Позиции счета */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Позиции счета</h2>
            <button type="button" onClick={addItem} className={styles.addButton}>
              + Добавить позицию
            </button>
          </div>

          <div className={styles.items}>
            {formData.items.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemNumber}>#{index + 1}</span>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className={styles.removeButton}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className={styles.field}>
                  <label>Название *</label>
                  <input
                    type="text"
                    required
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    placeholder="Разработка дизайна"
                  />
                </div>

                <div className={styles.field}>
                  <label>Описание</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Детальное описание позиции"
                    rows={2}
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Количество *</label>
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Единица</label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(index, 'unit', e.target.value)}
                      placeholder="шт, час, мес"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Цена *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Сумма</label>
                    <div className={styles.total}>
                      {(item.quantity * item.price).toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Итоговые суммы */}
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Промежуточная сумма:</span>
              <span>{calculateSubtotal().toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span>
            </div>
            {formData.discount > 0 && (
              <div className={styles.summaryRow}>
                <span>Скидка ({formData.discount}%):</span>
                <span className={styles.discount}>
                  -{(calculateSubtotal() * (formData.discount / 100)).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                </span>
              </div>
            )}
            {formData.tax_rate > 0 && (
              <div className={styles.summaryRow}>
                <span>НДС ({formData.tax_rate}%):</span>
                <span>
                  {((calculateSubtotal() * (1 - formData.discount / 100)) * (formData.tax_rate / 100)).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                </span>
              </div>
            )}
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>ИТОГО:</span>
              <span>{calculateTotal().toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Дополнительная информация</h2>

          <div className={styles.field}>
            <label>Условия оплаты</label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              rows={4}
            />
          </div>

          <div className={styles.field}>
            <label>Примечания</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Дополнительные примечания для клиента"
              rows={3}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.push('/invoices')}
            className={styles.cancelButton}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Создание...' : 'Создать счет'}
          </button>
        </div>
      </form>
    </div>
  )
}
