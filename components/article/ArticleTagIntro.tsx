'use client'

import { Expander } from '../util/Expander'

type TagIntroProps = {
  title: string
  description: JSX.Element
}

export function TagIntro(props: TagIntroProps) {
  return (
    <Expander className="bg-dark-light text-white p-5 p-lg-8 rounded-l mb-10">
      <div>
        <h1 className="display-2 fw-bold m-0 p-0">{props.title}</h1>
        <div className="fs-5 mt-5 dark-content">{props.description}</div>
      </div>
    </Expander>
  )
}
