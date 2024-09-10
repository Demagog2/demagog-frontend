import React from 'react'
import TrueIcon from '@/assets/icons/true.svg'
import UntrueIcon from '@/assets/icons/untrue.svg'
import UnverifiableIcon from '@/assets/icons/unverifiable.svg'
import MisleadingIcon from '@/assets/icons/misleading.svg'

type VeracityIconProps = {
  type: 'true' | 'untrue' | 'unverifiable' | 'misleading'
  iconSize?: number
}

export function VeracityIcon(props: VeracityIconProps) {
  const { iconSize = 30 } = props

  const iconProps = {
    style: { width: iconSize, height: iconSize },
  }
  switch (props.type) {
    case 'true':
      return <TrueIcon {...iconProps} />
    case 'untrue':
      return <UntrueIcon {...iconProps} />
    case 'unverifiable':
      return <UnverifiableIcon {...iconProps} />
    case 'misleading':
      return <MisleadingIcon {...iconProps} />
  }
}
