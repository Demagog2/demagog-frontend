import Link from "next/link"
interface LinkProps {
    title: string ,
    url: string,
}

export default function NavLink(props: LinkProps) {
    return (
        <li className="menu-item me-10">
            <Link
                className="menu-link d-flex align-items-center text-white text-white text-none state-hover-color-secondary min-h-40px"
                href={props.url}
            >
                <span>{props.title}</span>
            </Link>
        </li>
    )
}