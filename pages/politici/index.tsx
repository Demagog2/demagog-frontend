import type { NextPage } from 'next'
import PackmanIcon from "@/assets/icons/packman.svg";
import { GetSpeakers } from '@/libs/queries';
import client from '@/libs/apollo-client';
import SpeakerItem from '@/components/speaker/Item';

// TODO - Filters, paginations

export async function getStaticProps() {
    const { data:speakers } = await client.query({
        query: GetSpeakers,
        variables: { offset: 0, limit: 48 },
    })
  

    return {
        props : {
          speakers: speakers.speakers
        },
    }
}

const Politici: NextPage = ({speakers} : any) => {
    return (
        <div className='container'>
            <div className='row g-10'>
                <div className='col col-12'>
                    <div className='d-flex align-items-center'>
                        <div className='h-35px me-2'>
                            <PackmanIcon className='h-35px'/>
                        </div>
                        <h1 className='display-4 fw-bold m-0 p-0'>
                            Přehled politiků a političek
                        </h1>
                    </div>
                </div>
                <div className='col col-12'>
                    <div className='row row-cols-2 row-cols-md-4 row-cols-lg-6 g-10'>
                        {speakers.map((speaker: any) => (
                            <SpeakerItem key={speaker.id} speaker={speaker}/>         
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Politici