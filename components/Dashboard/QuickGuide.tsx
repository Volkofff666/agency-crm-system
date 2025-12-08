import styles from './QuickGuide.module.scss'

export default function QuickGuide() {
  return (
    <div className={styles.guide}>
      <div className={styles.header}>
        <h2 className={styles.title}>Краткое руководство</h2>
        <p className={styles.subtitle}>Основные возможности системы</p>
      </div>

      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h3>Клиенты</h3>
            <p>Добавляйте клиентов, сохраняйте контакты, ведите историю общения и храните все документы в одном месте.</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h3>Проекты и задачи</h3>
            <p>Создавайте проекты для клиентов, ставьте задачи команде, отслеживайте прогресс и контролируйте сроки.</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h3>Финансовый учет</h3>
            <p>Формируйте счета, отслеживайте оплаты, генерируйте договора и акты, контролируйте финансовые потоки.</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>4</div>
          <div className={styles.stepContent}>
            <h3>Аналитика и отчеты</h3>
            <p>Анализируйте эффективность работы, отслеживайте KPI, формируйте отчеты для принятия решений.</p>
          </div>
        </div>
      </div>

      <div className={styles.tips}>
        <div className={styles.tip}>
          <strong>Совет:</strong> Используйте поиск в верхней панели для быстрого доступа к любым данным
        </div>
        <div className={styles.tip}>
          <strong>Совет:</strong> Все изменения автоматически сохраняются, не беспокойтесь о потере данных
        </div>
      </div>
    </div>
  )
}
