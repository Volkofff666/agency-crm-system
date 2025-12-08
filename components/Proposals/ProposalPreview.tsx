import styles from './ProposalPreview.module.scss'

interface ProposalPreviewProps {
  proposal: any
}

export default function ProposalPreview({ proposal }: ProposalPreviewProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className={styles.proposal}>
      {/* Обложка */}
      <div className={styles.cover}>
        <div className={styles.coverContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>N</span>
            <span className={styles.logoText}>NOCTO</span>
          </div>
          <h1 className={styles.coverTitle}>{proposal.title}</h1>
          <p className={styles.coverSubtitle}>Коммерческое предложение</p>
          {proposal.number && (
            <div className={styles.coverNumber}>№ {proposal.number}</div>
          )}
          <div className={styles.coverDate}>{formatDate(proposal.created_at)}</div>
        </div>
      </div>

      {/* Информация о клиенте */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Для кого</h2>
        <div className={styles.clientInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Компания:</span>
            <span className={styles.infoValue}>{proposal.client.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Контактное лицо:</span>
            <span className={styles.infoValue}>{proposal.client.contact_person}</span>
          </div>
          {proposal.client.phone && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Телефон:</span>
              <span className={styles.infoValue}>{proposal.client.phone}</span>
            </div>
          )}
          {proposal.client.email && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{proposal.client.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* О нас */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>О нас</h2>
        <div className={styles.about}>
          <p className={styles.aboutText}>
            <strong>NOCTO</strong> — агентство интернет-маркетинга с фокусом на результат.
            Мы специализируемся на комплексном продвижении бизнеса в digital-среде.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>Контекстная реклама</div>
                <div className={styles.featureDesc}>Яндекс.Директ, Google Ads с максимальной конверсией</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>SEO-продвижение</div>
                <div className={styles.featureDesc}>Вывод сайта в топ поисковых систем</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💻</div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>Веб-разработка</div>
                <div className={styles.featureDesc}>Создание сайтов, лендингов, корпоративных порталов</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📱</div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>SMM и таргетированная реклама</div>
                <div className={styles.featureDesc}>Продвижение в социальных сетях</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Наши кейсы */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Наши результаты</h2>
        <div className={styles.cases}>
          <div className={styles.case}>
            <div className={styles.caseTitle}>Интернет-магазин электроники</div>
            <div className={styles.caseMetrics}>
              <div className={styles.metric}>
                <div className={styles.metricValue}>+340%</div>
                <div className={styles.metricLabel}>рост трафика</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricValue}>2.8x</div>
                <div className={styles.metricLabel}>рост продаж</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricValue}>-45%</div>
                <div className={styles.metricLabel}>снижение CPA</div>
              </div>
            </div>
            <p className={styles.caseDesc}>
              Комплексная работа: контекстная реклама + SEO + редизайн сайта
            </p>
          </div>

          <div className={styles.case}>
            <div className={styles.caseTitle}>B2B услуги для бизнеса</div>
            <div className={styles.caseMetrics}>
              <div className={styles.metric}>
                <div className={styles.metricValue}>120+</div>
                <div className={styles.metricLabel}>заявок в месяц</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricValue}>15%</div>
                <div className={styles.metricLabel}>конверсия в продажу</div>
              </div>
            </div>
            <p className={styles.caseDesc}>
              Настройка контекстной рекламы и лендинга с высокой конверсией
            </p>
          </div>
        </div>
      </div>

      {/* Описание предложения */}
      {proposal.description && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Описание проекта</h2>
          <p className={styles.description}>{proposal.description}</p>
        </div>
      )}

      {/* Услуги и стоимость */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Что входит в работу</h2>
        <div className={styles.services}>
          {proposal.items.map((item: any, index: number) => (
            <div key={index} className={styles.service}>
              <div className={styles.serviceHeader}>
                <div className={styles.serviceNumber}>{index + 1}</div>
                <div className={styles.serviceInfo}>
                  <div className={styles.serviceName}>{item.name}</div>
                  {item.description && (
                    <div className={styles.serviceDesc}>{item.description}</div>
                  )}
                </div>
              </div>
              <div className={styles.serviceFooter}>
                <div className={styles.serviceQuantity}>
                  {item.quantity} {item.unit}
                </div>
                <div className={styles.servicePrice}>
                  {item.price.toLocaleString('ru-RU')} ₽/{item.unit}
                </div>
                <div className={styles.serviceTotal}>
                  {(item.quantity * item.price).toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Итоговая стоимость */}
        <div className={styles.pricing}>
          <div className={styles.pricingRow}>
            <span>Промежуточная сумма:</span>
            <span>{proposal.subtotal.toLocaleString('ru-RU')} ₽</span>
          </div>
          {proposal.discount > 0 && (
            <div className={styles.pricingRow}>
              <span>Скидка ({proposal.discount}%):</span>
              <span className={styles.discount}>
                -{(proposal.subtotal * (proposal.discount / 100)).toLocaleString('ru-RU')} ₽
              </span>
            </div>
          )}
          <div className={`${styles.pricingRow} ${styles.total}`}>
            <span>ИТОГО:</span>
            <span>{proposal.total.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>

      {/* Условия работы */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Условия сотрудничества</h2>
        <div className={styles.terms}>
          {proposal.terms ? (
            <p>{proposal.terms}</p>
          ) : (
            <>
              <p>✓ Оплата: 50% предоплата, 50% по завершению работ</p>
              <p>✓ Срок выполнения работ: от 2 недель</p>
              <p>✓ Гарантия: 3 месяца технической поддержки</p>
              <p>✓ Отчетность: еженедельные отчеты по проделанной работе</p>
            </>
          )}
        </div>
        {proposal.valid_until && (
          <div className={styles.validity}>
            Предложение действительно до {formatDate(proposal.valid_until)}
          </div>
        )}
      </div>

      {/* Контакты */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Контакты</h2>
        <div className={styles.contacts}>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Агентство:</span>
            <span className={styles.contactValue}>NOCTO Digital Agency</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Телефон:</span>
            <span className={styles.contactValue}>+7 (XXX) XXX-XX-XX</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Email:</span>
            <span className={styles.contactValue}>info@nocto.agency</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Сайт:</span>
            <span className={styles.contactValue}>nocto.agency</span>
          </div>
        </div>
      </div>

      {proposal.notes && (
        <div className={styles.notes}>
          <strong>Примечание:</strong> {proposal.notes}
        </div>
      )}

      {/* Футер */}
      <div className={styles.footer}>
        <p>Благодарим за внимание к нашему предложению!</p>
        <p>Готовы ответить на любые вопросы и начать работу в ближайшее время.</p>
      </div>
    </div>
  )
}
