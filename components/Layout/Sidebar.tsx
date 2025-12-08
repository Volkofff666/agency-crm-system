'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.scss'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/', label: 'Главная' },
    { href: '/clients', label: 'Клиенты' },
    { href: '/projects', label: 'Проекты' },
    { href: '/tasks', label: 'Задачи' },
    { href: '/calendar', label: 'Календарь' },
    { href: '/proposals', label: 'Комм. предложения' },
    { href: '/finance', label: 'Финансы' },
    { href: '/analytics', label: 'Аналитика' },
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
            className={`${styles.navItem} ${pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? styles.active : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
