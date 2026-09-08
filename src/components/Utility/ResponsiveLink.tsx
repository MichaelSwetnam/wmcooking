import { Link } from "react-router-dom"

interface Props {
    to: string,
    children: React.ReactNode,
    className?: string
}

export default function ResponsiveLink({ to, children, className }: Props) {
    return <Link to={to} className={"hover:text-blue-600 transition text-blue-800 font-medium " + (className || "")}>{children}</Link>
}