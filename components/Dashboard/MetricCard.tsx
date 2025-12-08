import Link from 'next/link'
import styles from './MetricCard.module.scss'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  total?: number
  alert?: number
  link: string
}

export default function MetricCard({ title, value, subtitle, total, alert, link }: MetricCardProps) {
  return (
    <Link href={link} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {alert && alert > 0 && (
          <div className={styles.alert}>{alert}</div>
        )}
      </div>
      
      <div className={styles.value}>{value}</div>
      
      {subtitle && (
        <div className={styles.subtitle}>{subtitle}</div>
      )}
      
      {total !== undefined && (
        <div className={styles.progress}>
          <div 
            className={styles.progressBar}
            style={{ width: `${(Number(value) / total) * 100}%` }}
          />
        </div>
      )}
    </Link>
  )
}
