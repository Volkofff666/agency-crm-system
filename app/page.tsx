import Link from 'next/link'
import styles from './page.module.scss'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.badge}>CRM System</div>
          <h1 className={styles.title}>
            Управление клиентами<br />и проектами агентства
          </h1>
          <p className={styles.description}>
            Профессиональная CRM система для комплексного управления<br />
            клиентскими отношениями, проектами и финансами
          </p>
          <div className={styles.actions}>
            <Link href="/dashboard" className={styles.buttonPrimary}>
              Перейти в систему
            </Link>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>Все-в-одном</div>
            <div className={styles.statLabel}>Клиенты, проекты, финансы</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>Автоматизация</div>
            <div className={styles.statLabel}>Процессов и отчетности</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>Контроль</div>
            <div className={styles.statLabel}>Полная прозрачность</div>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Клиенты и контакты</h3>
            <p>Централизованная база клиентов с полной историей взаимодействия, контактными данными и документами.</p>
          </div>
          <div className={styles.feature}>
            <h3>Проекты и задачи</h3>
            <p>Управление проектами с постановкой задач, отслеживанием статусов и контролем сроков выполнения.</p>
          </div>
          <div className={styles.feature}>
            <h3>Финансовый учет</h3>
            <p>Полный контроль финансовых потоков: счета, платежи, договора, акты и автоматическая отчетность.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
