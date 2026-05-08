interface HeaderInfoPorps {
    title: string
    subTitle: string
    children: React.ReactNode;
}

export default function HeaderInfo({ title, subTitle, children }: HeaderInfoPorps) {
    return (
        <header className="flex justify-between w-full">
            <div>
                <h2 className="text-text text-2xl">{title}</h2>
                <p className="text-text-muted">{subTitle}</p>
            </div>
            <div className="flex items-center">
                {children}
            </div>
        </header>
    )
}