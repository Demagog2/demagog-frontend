import StatementItem from "../statement/Item"

export default function ArticleStatements({ statements }: any) {
    return (
        <div>
            <div className="row g-5 g-lg-10">
                <div className="col col-12">
                    <h2 className="fs-2 text-bold">Řečníci s&nbsp;počty výroků dle hodnocení</h2>
                </div>
                <div></div>
                <div>
                    
                </div>
            </div>
            <div className="mt-5 mt-lg-10">
                {statements.map((statement: any) => (
                    <StatementItem key={statement.id} statement={statement}/>         
                ))}
            </div>
        </div>
        
    )
}