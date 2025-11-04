interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
    children: React.ReactNode
}

export default function Button({ onClick, children }: Props ) {
    return <button className="pt-3 bg-blue-300 rounded-2xl shadow-md p-3 font-semibold hover:shadow-xl transition-shadow cursor-pointer" onClick={onClick}>{children}</button>

}