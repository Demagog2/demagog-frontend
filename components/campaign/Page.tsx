import style from '@/assets/styles/campaign/styles.module.css';
import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export function Page(
    props: PropsWithChildren<{ className: string; isActive: boolean; }>
) {
    return (
        <div
            className={classNames(style.page, props.className, {
                [style.hidden]: !props.isActive,
            })}
        >
            {props.children}
        </div>
    );
}
