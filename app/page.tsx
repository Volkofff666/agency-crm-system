import Link from 'next/link'
import styles from './page.module.scss'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>NOCTO</div>
            <div className={styles.logoBadge}>Corporate CRM</div>
          </div>
          <h1 className={styles.title}>
            Корпоративная система<br />управления бизнесом
          </h1>
          <p className={styles.description}>
            Единая платформа для управления клиентами, проектами и финансами<br />
            рекламного агентства NOCTO
          </p>
          <div className={styles.actions}>
            <Link href="/dashboard" className={styles.buttonPrimary}>
              Войти в систему
            </Link>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.modules}>
          <h2 className={styles.modulesTitle}>Основные модули системы</h2>
          <div className={styles.moduleGrid}>
            <div className={styles.module}>
              <div className={styles.moduleIcon}>👥</div>
              <h3>Клиенты</h3>
              <p>База клиентов с полной историей взаимодействия, контактами и документами</p>
            </div>
            <div className={styles.module}>
              <div className={styles.moduleIcon}>📊</div>
              <h3>Проекты</h3>
              <p>Управление проектами, задачами, сроками и распределение ресурсов</p>
            </div>
            <div className={styles.module}>
              <div className={styles.moduleIcon}>💰</div>
              <h3>Финансы</h3>
              <p>Счета, платежи, договора, акты и автоматическая финансовая отчетность</p>
            </div>
            <div className={styles.module}>
              <div className={styles.moduleIcon}>📈</div>
              <h3>Аналитика</h3>
              <p>Детальные отчеты по эффективности работы и ключевым показателям</p>
            </div>
            <div className={styles.module}>
              <div className={styles.moduleIcon}>👨‍💼</div>
              <h3>Сотрудники</h3>
              <p>Учет команды, роли, доступы и мониторинг загрузки специалистов</p>
            </div>
            <div className={styles.module}>
              <div className={styles.moduleIcon}>📄</div>
              <h3>Документы</h3>
              <p>Централизованное хранилище всех документов и шаблонов компании</p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <p>© 2025 NOCTO Agency. Все права защищены.</p>
        </div>
      </div>
    </main>
  )
}
