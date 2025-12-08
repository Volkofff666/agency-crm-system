'use client'

import { useState, useEffect, FormEvent } from 'react'
import Modal from '@/components/common/Modal'
import { createTask, getClients, getProjects } from '@/lib/api'
import styles from './TaskModal.module.scss'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId?: string | number
  clientId?: string | number
}

export default function TaskModal({ isOpen, onClose, onSuccess, projectId, clientId }: TaskModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: projectId?.toString() || '',
    client_id: clientId?.toString() || '',
    status: 'new',
    priority: 'medium',
    due_date: '',
    assignee: '',
  })

  useEffect(() => {
    if (isOpen) {
      loadClients()
      loadProjects()
    }
  }, [isOpen])

  const loadClients = async () => {
    try {
      const data = await getClients()
      setClients(data)
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error)
    }
  }

  const loadProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const taskData = {
        ...formData,
        project_id: formData.project_id ? parseInt(formData.project_id) : null,
        client_id: formData.client_id ? parseInt(formData.client_id) : null,
        due_date: formData.due_date || null,
      }
      
      await createTask(taskData)
      onSuccess()
      onClose()
      // Сброс формы
      setFormData({
        title: '',
        description: '',
        project_id: '',
        client_id: '',
        status: 'new',
        priority: 'medium',
        due_date: '',
        assignee: '',
      })
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании задачи')
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Создать задачу">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.section}>
          <div className={styles.field}>
            <label className={styles.label}>
              Название задачи <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Настроить рекламную кампанию"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              rows={3}
              placeholder="Подробное описание задачи"
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Проект</label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                className={styles.select}
                disabled={!!projectId}
              >
                <option value="">Не выбран</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Клиент</label>
              <select
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                className={styles.select}
                disabled={!!clientId}
              >
                <option value="">Не выбран</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Приоритет</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="critical">Критический</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Статус</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="new">Новая</option>
                <option value="in_progress">В работе</option>
                <option value="completed">Завершена</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Дедлайн</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Ответственный</label>
              <input
                type="text"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className={styles.input}
                placeholder="Имя сотрудника"
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton} disabled={loading}>
            Отмена
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Создание...' : 'Создать задачу'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
