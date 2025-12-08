'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.scss'

const navigation = [
  { name: 'Главная', href: '/dashboard' },
  { name: 'Клиенты', href: '/clients' },
  { name: 'Проекты', href: '/projects' },
  { name: 'Финансы', href: '/finance' },
  { name: 'Сотрудники', href: '/employees' },
  { name: 'Документы', href: '/documents' },
  { name: 'Аналитика', href: '/analytics' },
  { name: 'Настройки', href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
