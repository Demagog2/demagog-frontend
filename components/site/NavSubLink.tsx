import Link from "next/link"
interface LinkProps {
    title: string ,
    url: string,
}

export default function NavSubLink(props: LinkProps) {
    return (
        <li className="menu-item me-10">
            <Link
                className="submenu-link min-h-40px d-flex align-items-center text-white text-none state-hover-color-secondary mx-0 mx-xl-4"
                href={props.url}
            >
                <span>{props.title}</span>
            </Link>
        </li>
    )
}