import { Link } from "react-router-dom"

interface Props {
    to: string,
    children: React.ReactNode,
    className?: string
}

export default function ResponsiveLink({ to, children, className }: Props) {
    // Evil switch to ensure that valid links don't take you to 404 page and instead the WIP page
    switch (to) {
        case "/about":
        case "/events":
        case "/contact":
        case "/admin":
            to = "/wip";
            break;
        
        default:
            break;
    }
    
    return <Link to={to} className={"hover:text-blue-600 transition text-blue-800 font-medium " + (className || "")}>{children}</Link>
}