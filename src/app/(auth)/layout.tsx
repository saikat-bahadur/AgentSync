interface props{
    children: React.ReactNode;
};


const Layout = ({ children }: props) => {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    )
}

export default Layout;