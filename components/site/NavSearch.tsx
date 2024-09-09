// 'use client'
import SearchIcon from '@/assets/icons/search.svg'
import { ReactNode } from 'react'
// import { ReactNode, useRef } from 'react'

interface LinkProps {
  title: string
  children?: ReactNode
}

export default function NavSearch(props: LinkProps) {
  // const [isOpen, setIsOpen] = useState<Boolean | false>(false)
  // const WrapRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   window.addEventListener('click', handleClick)
  //   return () => window.removeEventListener('click', handleClick)
  // })

  // const handleClick = (event: any) => {
  //   if (WrapRef && WrapRef.current) {
  //     if (!WrapRef.current.contains(event.target) && isOpen) {
  //       setIsOpen(false)
  //     }
  //   }
  // }

  return (
    <div className="menu-item d-none d-xl-flex">
      {/* <a
        className="menu-link d-flex align-items-center text-white text-white text-none state-hover-color-secondary min-h-40px"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="me-2">{props.title}</span>
        <SearchIcon />
      </a>
      <div className={`dropmenu ${isOpen ? 'open' : ''}`}>{props.children}</div> */}
    </div>
  )
}
