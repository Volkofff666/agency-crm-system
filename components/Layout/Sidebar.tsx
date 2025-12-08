'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.scss'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/', label: 'Главная', icon: '🏠' },
    { href: '/clients', label: 'Клиенты', icon: '👥' },
    { href: '/projects', label: 'Проекты', icon: '📁' },
    { href: '/tasks', label: 'Задачи', icon: '✓' },
    { href: '/calendar', label: 'Календарь', icon: '📅' },
    { href: '/finance', label: 'Финансы', icon: '💰' },
    { href: '/analytics', label: 'Аналитика', icon: '📊' },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>N</span>
        <span className={styles.brandName}>NOCTO CRM</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
