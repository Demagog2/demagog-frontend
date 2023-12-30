import TitleIcon from '@/assets/icons/demagog.svg'
import client from '@/libs/apollo-client'
import gql from 'graphql-tag'
import Image from 'next/image'

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query aboutUsMembers {
        members {
          id
          fullName
          positionDescription
          bio
          avatar
        }
      }
    `,
  })

  return {
    props: {
      members: data.members,
    },
  }
}

type AboutUsProps = {
  members: {
    id: number
    fullName: string
    positionDescription: string
    bio: string
    avatar
  }[]
}

export default function AboutUs(props: AboutUsProps) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  return (
    <div className="container">
      <div className="row g-10">
        <div className="col col-12">
          <div className="d-flex">
            <span className="d-flex align-items-center me-2">
              <TitleIcon />
            </span>
            <h1 className="display-4 fw-bold m-0 p-0">O nás</h1>
          </div>
        </div>

        <div className="col col-12 col-lg-4 position-relative"></div>

        <div
          className="col col-12 col-lg-8"
          data-target="components--sticky.content"
        >
          <div className="row g-5">
            <div className="col col-12">
              <h3 className="display-5 fw-bold mb-5">
                Kdo připravuje Demagog.cz?
              </h3>
            </div>
            {props.members.map((member) => (
              <div className="col col-12" key={member.id}>
                <div className="row g-5 g-lg-10">
                  <div className="col col-2">
                    <span className="symbol symbol-square symbol-circle">
                      <Image
                        src={mediaUrl + member.avatar}
                        alt={member.fullName}
                        width={144}
                        height={144}
                      />
                    </span>
                  </div>
                  <div className="col col-10">
                    <h4 className="fs-2">{member.fullName}</h4>
                    <p className="fs-6">
                      <b>{member.positionDescription}</b> — {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
