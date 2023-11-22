import TitleIcon from '@/assets/icons/statements.svg'
import { GetStatements } from '@/libs/queries';
import client from '@/libs/apollo-client';
import StatementItem from '@/components/statement/Item';

// TODO - Filters, search, paginations

interface VyrokyProps {
    statements: any;
}

export async function getStaticProps() {
    const { data:statements } = await client.query({
        query: GetStatements,
        variables: {
          offset: 0,
          limit: 10,
        },
    })
  

    return {
        props : {
          statements: statements.statements,
        },
    }
  }

const Vyroky: React.FC<VyrokyProps> = ({statements}) => {
    return (
        <div className='container'>
            <div className='row g-10'>
                <div className='col col-12'>
                    <div className='d-flex align-items-center'>
                        <div className='me-2'>
                            <TitleIcon className='h-35px'/>
                        </div>
                        <h1 className="display-4 fw-bold m-0 p-0">Přehled ověřených výroků</h1>
                    </div>
                </div>
                <div className='col col-12'>
                    <div>
                        {statements.map((statement: any) => (
                            <StatementItem key={statement.id} statement={statement}/>         
                        ))}
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vyroky