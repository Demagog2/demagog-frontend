import TrueIcon from "@/assets/icons/true.svg";
import UntrueIcon from "@/assets/icons/untrue.svg";
import UnverifiableIcon from "@/assets/icons/unverifiable.svg";
import MisleadingIcon from "@/assets/icons/misleading.svg";

interface HomeProps {
    assessment: any;
    type: string;
    name?: string;
    size: any;
}

export default function StatementAssessment({ type , name, size }: any) {
    const iconSize = size ? size : '30'
    const colors: Record<string, string> = {
        'true': 'primary',
        'untrue': 'red',
        'unverifiable': 'gray',
        'misleading': 'secondary',
    }
    const currentColor = colors[type];
    return (
        <div className='d-flex align-items-center mb-2'>
            <span
                className={'bg-' + currentColor + ' d-flex align-items-center justify-content-center rounded-circle me-2 p-2'}
            >
                {type === 'true' && (
                  <TrueIcon className={'h-' + iconSize + 'px w-' + iconSize + 'px '} />  
                )}
                {type === 'untrue' && (
                  <UntrueIcon className={'h-' + iconSize + 'px w-' + iconSize + 'px '} />  
                )}
                {type === 'unverifiable' && (
                  <UnverifiableIcon className={'h-' + iconSize + 'px w-' + iconSize + 'px '} />  
                )}
                {type === 'misleading' && (
                  <MisleadingIcon className={'h-' + iconSize + 'px w-' + iconSize + 'px '} />  
                )}
            </span>
            {name && (
            <span  className={'text-' + currentColor + ' fs-5 text-uppercase fs-600'}>
                { name } 
            </span>
            )}
        </div>
    )
}