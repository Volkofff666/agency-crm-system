import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import QuickGuide from '@/components/Dashboard/QuickGuide'
import styles from './page.module.scss'

export default function Dashboard() {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Главная панель</h1>
              <p className={styles.subtitle}>Добро пожаловать в корпоративную CRM систему NOCTO</p>
            </div>
          </div>

          <QuickGuide />

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Быстрая статистика</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Активных клиентов</div>
                <div className={styles.statValue}>—</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Проектов в работе</div>
                <div className={styles.statValue}>—</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Задач на сегодня</div>
                <div className={styles.statValue}>—</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Выручка за месяц</div>
                <div className={styles.statValue}>—</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Последние события</h2>
            <div className={styles.card}>
              <div className={styles.empty}>
                <p>События будут отображаться здесь после начала работы в системе</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
