import { GetSpeaker } from '@/libs/queries';
import client from '@/libs/apollo-client';
import StatementItem from '@/components/statement/Item';

// TODO - Filters, paginations

interface PoliticiDetailProps {
    speaker: any;
}

export async function getServerSideProps({ params }: any) {
    const { id} = params;

    const { data:speaker } = await client.query({
        query: GetSpeaker,
        variables: {
          id: parseInt(id, 10),
        },
    })
  
    return {
        props : {
            speaker: speaker.speaker,
        },
    }
}

const PoliticiDetail: React.FC<PoliticiDetailProps> = ({speaker}) => {
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;
    return (
        <div className='container'>
            <div className='row g-5 justify-content-between mb-10'>
                <div className='col col-12 col-md-6 col-lg-8'>
                    <div className='d-flex flex-wrap'>
                        <div className='w-125px position-relative me-md-5 me-lg-10 mb-5 mb-md-0'>
                            <span className='symbol symbol-square symbol-circle'>
                                <img
                                    src={mediaUrl + speaker.avatar}
                                    alt={speaker.firstName + ' ' + speaker.lastName}
                                />
                            </span>
                            {speaker.body && (
                            <div
                                className="symbol-label d-flex align-items-center justify-content-center w-45px h-45px rounded-circle bg-dark"
                            >
                                <span
                                    className="smallest text-white lh-1 text-center p-2"
                                >
                                    {speaker.body.shortName}
                                </span>
                            </div>
                        )}
                        </div>
                        <div>
                            <h1 className='display-5 fw-600 mb-1'>
                                {speaker.firstName + ' ' + speaker.lastName}
                            </h1>
                            <div className='mb-1'>
                                <span className='fs-4 fw-500'>
                                    { speaker.role }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=''>
                {speaker.statements.map((statement: any) => (
                    <StatementItem key={statement.id} statement={statement}/>         
                ))}
            </div>
        </div>
    )
}

export default PoliticiDetail