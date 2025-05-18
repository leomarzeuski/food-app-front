import { MiddlewareConfig, NextRequest, NextResponse } from "next/server"

const publicRoutes = [
    {path: '/login', whenAuthenticated: 'redirect'},
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login' 

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const publicRoute = publicRoutes.find(route => route.path === path)
    const authToken = request.cookies.get('token')

    if (publicRoute && !authToken) {
        return NextResponse.next()
    }
    
    if (!publicRoute && !authToken) {
        const redirectUrl = request.nextUrl.clone()

        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

        return NextResponse.redirect(redirectUrl)
    }


if(authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect'){
    const redirectUrl = request.nextUrl.clone()

    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
}

if( authToken && !publicRoute){
// chegar se jwt esta expirado se sim redirecionar o usuario pro login

    return NextResponse.next()
}

    return NextResponse.next()
}

export const config: MiddlewareConfig = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
      ],
}