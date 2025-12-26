import "./LoadingComponent.css";

export default function LoadingComponent() {
    return <div className="flex-1 flex flex-col justify-center items-center bg-white p-3">
        <span className="loader"></span>
    </div>
}