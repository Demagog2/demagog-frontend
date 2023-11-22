import { GetArticle } from '@/libs/queries';
import client from '@/libs/apollo-client';
import formatDate from '@/libs/format-date';
import ArticleStatements from '@/components/article/Statements'
import { ArticleDetail as ArticleDetailType} from '@/libs/results-type'

// TODO - Html elements rerender in content

interface DiskuzeProps {
    article: ArticleDetailType;
    slug: string;
}

export async function getServerSideProps({ params }: any) {
    const { slug } = params;

    const { data:article } = await client.query({
        query: GetArticle,
        variables: {
          slug: slug,
        },
    })
  
    return {
        props : {
          article: article.article,
          slug: slug
        },
    }
}

const Diskuze: React.FC<DiskuzeProps> = ({article, slug}) => {
    return (
        <div className='container'>
            <div className='row g-10'>
                <div className='col col-12 col-lg-8'>
                    <div className='mb-5 mb-lg-10'>
                        <h1 className='display-4 fw-bold mb-5'>
                            { article.title }
                        </h1>
                        <div>
                            <span className='fs-5'>
                                { article.perex }
                            </span>
                        </div>
                    </div>
                    {article.articleType === 'default' && article.source && (
                        <div className='mb-5 mb-lg-10'>
                            <h2 className='"fs-2 text-uppercase text-primary'>
                                Ověřili jsme
                            </h2>
                            <div className='row g-1 mt-2'>
                                <span className='col col-auto fs-5'>
                                    {article.source.medium.name}  
                                </span>
                                <span className='col col-auto fs-5'>
                                    ze dne
                                </span>
                                <span className='col col-auto fs-5'>
                                    {formatDate(article.source.releasedAt)}
                                </span>
                                {article.source.mediaPersonalities.length > 0 && (
                                    <span className='col col-auto fs-5'>
                                        {article.source.mediaPersonalities.length > 1 ? (
                                            <>moderátoři</>
                                        ) : (
                                            <>moderátor</>
                                        )}
                                    </span> 
                                    
                                )}
                                {article.source.mediaPersonalities.map((mediaPersonality: any) => (
                                    <span key={mediaPersonality.id} className='col col-auto fs-5'>
                                        { mediaPersonality.name }
                                     </span>
                                ))}
                                <span className='col col-auto fs-5'>,</span>
                                {article.source.mediaPersonalities.length > 0 && (
                                    <span className='col col-auto fs-5'>
                                        <a href={article.source.sourceUrl} className='ext'>
                                            záznam
                                        </a>
                                    </span>  
                                )}
                            </div>
                            {article.articleType === 'static' && (
                                <div>
                                    <span className='fs-5 text-primary'>Komentář</span> 
                                    <i className='fs-5'>{formatDate(article.publishedAt)}</i>
                                </div>
                            )}
                            {article.articleType === 'facebook_factcheck' && (
                                <div>
                                    <span className='fs-5 text-primary'>Meta fact-check</span> 
                                    <i className='fs-5'>{formatDate(article.publishedAt)}</i>
                                </div>
                            )}
                            
                        </div>
                    )}
                </div>
                <div className='col col-12'>
                    {article.segments.map((segment: any) => (
                        <div key={segment.id}>
                            {segment.segmentType === 'text' && (
                                <div className='row justify-content-center'>
                                    <div className='col col-12 col-lg-8 content fs-6'>
                                        <div dangerouslySetInnerHTML={{ __html: segment.textHtml }}></div>
                                    </div>
                                </div>
                            )}
                            {segment.segmentType === 'source_statements' && (
                                <ArticleStatements key={segment.id} statements={segment.statements}/>
                            )}
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
    )
}

export default Diskuze