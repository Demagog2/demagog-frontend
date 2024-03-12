import style from '@/assets/styles/campaign/styles.module.css';
import { PropsWithChildren } from 'react';

export function ArrowsWrapper(props: PropsWithChildren) {
    return (
        <div className={style.arrowsContainer1}>
            <div className={style.arrowsContainer2}>{props.children}</div>
        </div>
    );
}
