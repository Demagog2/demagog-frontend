import React from 'react'
import TrueIcon from '@/assets/icons/true.svg'
import UntrueIcon from '@/assets/icons/untrue.svg'
import UnverifiableIcon from '@/assets/icons/unverifiable.svg'
import MisleadingIcon from '@/assets/icons/misleading.svg'
import classNames from 'classnames'

type VeracityIconProps = {
  type: 'true' | 'untrue' | 'unverifiable' | 'misleading'
  iconSize?: number
}

export function VeracityIcon(props: VeracityIconProps) {
  const { iconSize = 30 } = props

  const iconStyles = classNames(`h-${iconSize}px`, `w-${iconSize}px`)

  switch (props.type) {
    case 'true':
      return <TrueIcon classNames={iconStyles} />
    case 'untrue':
      return <UntrueIcon className={iconStyles} />
    case 'unverifiable':
      return <UnverifiableIcon className={iconStyles} />
    case 'misleading':
      return <MisleadingIcon className={iconStyles} />
  }
}
