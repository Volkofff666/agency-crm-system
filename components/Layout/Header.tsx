import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>NOCTO</span>
          <span className={styles.logoBadge}>CRM</span>
        </div>
        <nav className={styles.nav}>
          <div className={styles.user}>
            <span className={styles.userName}>Администратор</span>
          </div>
        </nav>
      </div>
    </header>
  )
}
