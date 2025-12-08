'use client'

import { useState, useEffect, FormEvent } from 'react'
import { getClients } from '@/lib/api'
import type { ProposalItem } from '@/types/proposals'
import styles from './ProposalForm.module.scss'

interface ProposalFormProps {
  onSubmit: (data: any) => void
  loading: boolean
}

export default function ProposalForm({ onSubmit, loading }: ProposalFormProps) {
  const [clients, setClients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    number: '',
    valid_until: '',
    description: '',
    terms: '',
    notes: '',
    discount: 0,
  })

  const [items, setItems] = useState<ProposalItem[]>([
    { name: '', description: '', quantity: 1, unit: 'шт', price: 0 },
  ])

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const data = await getClients()
      setClients(data)
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleItemChange = (index: number, field: keyof ProposalItem, value: any) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { name: '', description: '', quantity: 1, unit: 'шт', price: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length === 1) return
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  // Подсчет сумм
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const discountAmount = subtotal * (formData.discount / 100)
  const total = subtotal - discountAmount

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Валидация
    if (!formData.client_id) {
      alert('Выберите клиента')
      return
    }

    if (!formData.title) {
      alert('Укажите название')
      return
    }

    if (items.some(item => !item.name || item.price <= 0)) {
      alert('Заполните все позиции услуг')
      return
    }

    const data = {
      ...formData,
      client_id: parseInt(formData.client_id),
      discount: parseFloat(String(formData.discount)),
      items: items.map(item => ({
        name: item.name,
        description: item.description || null,
        quantity: parseFloat(String(item.quantity)),
        unit: item.unit,
        price: parseFloat(String(item.price)),
      })),
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Основная информация */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Основная информация</h2>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              Клиент <span className={styles.required}>*</span>
            </label>
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className={styles.select}
              required
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
            <label className={styles.label}>Номер КП</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className={styles.input}
              placeholder="например: KP-2025-001"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              Название <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Комплексное продвижение в интернете"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Действительно до</label>
            <input
              type="date"
              name="valid_until"
              value={formData.valid_until}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            rows={3}
            placeholder="Краткое описание предложения"
          />
        </div>
      </div>

      {/* Услуги */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Услуги и работы</h2>
          <button type="button" onClick={addItem} className={styles.addItemButton}>
            + Добавить позицию
          </button>
        </div>

        <div className={styles.items}>
          {items.map((item, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemNumber}>№{index + 1}</span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className={styles.removeButton}
                  >
                    ×
                  </button>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Название услуги <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className={styles.input}
                  placeholder="Настройка контекстной рекламы"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Описание</label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className={styles.textarea}
                  rows={2}
                  placeholder="Подробное описание услуги"
                />
              </div>

              <div className={styles.itemRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Количество</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    className={styles.input}
                    min="0.01"
                    step="0.01"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Ед.изм.</label>
                  <select
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                    className={styles.select}
                  >
                    <option value="шт">шт</option>
                    <option value="усл">усл</option>
                    <option value="час">час</option>
                    <option value="мес">мес</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Цена <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                    className={styles.input}
                    min="0"
                    step="100"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Итого</label>
                  <div className={styles.itemTotal}>
                    {(item.quantity * item.price).toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Итого */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Итоговая сумма</h2>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Промежуточная сумма:</span>
            <span className={styles.summaryValue}>{subtotal.toLocaleString('ru-RU')} ₽</span>
          </div>

          <div className={styles.summaryRow}>
            <div className={styles.discountField}>
              <span>Скидка:</span>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className={styles.discountInput}
                min="0"
                max="100"
                step="0.1"
              />
              <span>%</span>
            </div>
            <span className={styles.summaryValue}>-{discountAmount.toLocaleString('ru-RU')} ₽</span>
          </div>

          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>ИТОГО:</span>
            <span className={styles.summaryValue}>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Дополнительно</h2>

        <div className={styles.field}>
          <label className={styles.label}>Условия работы</label>
          <textarea
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            className={styles.textarea}
            rows={4}
            placeholder="Оплата, сроки, условия сотрудничества"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Примечания</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={styles.textarea}
            rows={2}
            placeholder="Дополнительные примечания"
          />
        </div>
      </div>

      {/* Кнопки */}
      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} disabled={loading}>
          Отмена
        </button>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Создание...' : 'Создать КП'}
        </button>
      </div>
    </form>
  )
}
