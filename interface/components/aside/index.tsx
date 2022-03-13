import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'
import Link from 'next/link'
import styles from './index.module.scss'
import MaviLogo from '../../public/mavi.svg'

import IconSettings from '../../assets/icons/settings.svg'
import IconLayers from '../../assets/icons/layers.svg'
import IconDatabase from '../../assets/icons/database.svg'

// Mavi version
import { version } from '../../../package.json'

const ListItems = [
  {
    title: 'Settings',
    href: '/',
    icon: <IconSettings />,
  },
  {
    title: 'Database',
    href: '/database',
    icon: <IconDatabase />,
  },
  {
    title: 'Routes',
    href: '/routes',
    icon: <IconLayers />,
  },
]

type Aside = {
  onNavigationChange: (nav: any) => void
}

const AppAside = ({ onNavigationChange }: Aside) => {
  const { route } = useRouter()

  return (
    <aside className={styles.aside}>
      <div className={styles.head}>
        <MaviLogo />
      </div>

      <ul className={styles.body}>
        {ListItems.map((item) => {
          return (
            <li key={item.title}>
              <Button
                onClick={() => onNavigationChange(item)}
                className={`${styles.MuiButton} ${item.href === route ? styles.active : ''}`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Button>
            </li>
          )
        })}
      </ul>

      <div className={styles.foot}>
        <div className={styles.VersionText}>
          <span style={{ marginRight: 2 }}>Mavi</span>
          <b> v{version}</b>
        </div>
      </div>
    </aside>
  )
}

export default AppAside
