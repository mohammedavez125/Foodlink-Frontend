import {Link, Outlet} from "@tanstack/react-router";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";

export const RootLayout = () => (
    <>
        <div className="">
            <Link to="/home"/>{' '}
            <Link to="/login"/>{' '}
            <Link to="/signup"/>{' '}
            <Link to="/about"/>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
    </>
)