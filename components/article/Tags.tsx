import Link from "next/link"
import PackmanIcon from "../../assets/icons/packman.svg";
import UkrajineIcon from "../../assets/icons/ukrajine.svg";
import SlovakiaIcon from "../../assets/icons/slovakia.svg";
import PresidentalIcon from "../../assets/icons/presidental.svg";

export default function ArticleTags({ tags }: any) {

    return (
        <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-wrap align-items-center">
                {tags.map((tag: any) =>(
                    <div key={tag.id}>
                        <Link
                            className="btn outline mb-2 h-44px me-2 fs-6 px-4 lh-1"
                            href={'/tag/' + tag.slug}
                        >
                            <span className="d-flex me-1">
                                {
                                    tag.icon == 1 && 
                                    <PackmanIcon className='h-20px' />
                                    
                                }
                                 {
                                    tag.icon == 2 && 
                                    <PresidentalIcon className='h-20px'/>
                                }
                                {
                                    tag.icon == 3 && 
                                    <SlovakiaIcon className='h-20px'/>
                                    
                                }
                                {
                                    tag.icon == 4 && 
                                    <UkrajineIcon className='h-20px'/>
                                    
                                }
                            </span>
                            <span className="lh-1 m-0 p-0">
                                {tag.title}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}